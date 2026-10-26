import { Router } from 'express';
import { randomBytes } from 'node:crypto';
import { rateLimit } from 'express-rate-limit';
import mongoose from 'mongoose';
import { z } from 'zod';
import { env } from '../config/env.js';
import { MysteryCase } from '../models/MysteryCase.js';
import { InvestigationNote } from '../models/InvestigationNote.js';
import { createMysterySchema } from '../schemas/mystery.js';
import { generateMystery } from '../services/gemini.service.js';
import { serializeCase } from '../services/case-serializer.service.js';
import { HttpError } from '../middleware/error.middleware.js';

export const apiRouter = Router();
const wrap = (fn: (req: any, res: any) => Promise<unknown>) => (req: any, res: any, next: any) => fn(req,res).catch(next);
const createLimiter = rateLimit({ windowMs: env.RATE_LIMIT_WINDOW_MS, limit: env.RATE_LIMIT_MAX, standardHeaders: 'draft-7', legacyHeaders: false, message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many cases started. Please wait a minute and try again.' } } });
const noteSchema = z.object({ title: z.string().trim().min(1).max(120).default('Investigation note'), content: z.string().trim().min(1).max(2000), linkedSuspectIds: z.array(z.string()).default([]), linkedEvidenceIds: z.array(z.string()).default([]) });
const idSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid case identifier.');
async function getOwnedCase(id: string, ownerId: string) {
  if (!idSchema.safeParse(id).success) throw new HttpError(404, 'Case file not found.', 'CASE_NOT_FOUND');
  const file = await MysteryCase.findOne({ _id: id, ownerId });
  if (!file) throw new HttpError(404, 'Case file not found.', 'CASE_NOT_FOUND');
  return file;
}

apiRouter.get('/health', (_req,res) => res.json({ success: true, data: { status: 'ok' } }));
apiRouter.post('/mysteries', createLimiter, wrap(async (req,res) => {
  const input = createMysterySchema.parse(req.body);
  let generated;
  try { generated = await generateMystery(input.scenario, input.settings); }
  catch (error) { if (error instanceof z.ZodError) throw new HttpError(502, 'The generated case did not meet quality checks. Please retry with a different premise.', 'GENERATION_INVALID'); throw error; }
  const caseNumber = `CF-${new Date().getFullYear()}-${randomBytes(3).toString('hex').toUpperCase()}`;
  const created = await MysteryCase.create({ ownerId: req.ownerId, caseNumber, title: generated.title, scenario: input.scenario, category: input.settings.category, difficulty: input.settings.difficulty, tone: input.settings.tone, status: 'open', description: generated.description, setting: generated.setting, suspects: generated.suspects, evidence: generated.evidence, solution: { culpritId: generated.culpritId, motive: generated.motive, explanation: generated.explanation, actualTimeline: generated.actualTimeline, decisiveEvidenceIds: generated.decisiveEvidenceIds } });
  res.status(201).json({ success: true, data: { id: String(created._id) } });
}));

apiRouter.get('/mysteries', wrap(async (req,res) => {
  const cases = await MysteryCase.find({ ownerId: req.ownerId }).sort({ createdAt: -1 }).limit(100).select('caseNumber title category difficulty status createdAt updatedAt suspects');
  res.json({ success: true, data: { cases: cases.map(c => ({ id: String(c._id), caseNumber: c.caseNumber, title: c.title, category: c.category, difficulty: c.difficulty, status: c.status, suspectCount: c.suspects.length, createdAt: c.createdAt, updatedAt: c.updatedAt })) } });
}));
apiRouter.get('/mysteries/:caseId', wrap(async(req,res) => { const file = await getOwnedCase(req.params.caseId, req.ownerId); res.json({ success:true, data:{ mystery: serializeCase(file, file.status === 'completed') } }); }));
apiRouter.get('/mysteries/:caseId/evidence', wrap(async(req,res) => { const file=await getOwnedCase(req.params.caseId,req.ownerId); const data=serializeCase(file) as any; res.json({success:true,data:{evidence:data.evidence}}); }));
apiRouter.post('/mysteries/:caseId/evidence/:evidenceId/review',wrap(async(req,res)=>{const file=await getOwnedCase(req.params.caseId,req.ownerId);if(file.status==='completed')throw new HttpError(409,'This case is already closed.','CASE_CLOSED');const evidence=file.evidence.find((e:any)=>e.id===req.params.evidenceId);if(!evidence)throw new HttpError(404,'Evidence item not found.','EVIDENCE_NOT_FOUND');await MysteryCase.updateOne({_id:file._id,ownerId:req.ownerId,status:'open'},{$addToSet:{reviewedEvidenceIds:req.params.evidenceId}});const updated=await MysteryCase.findById(file._id);res.json({success:true,data:{evidence:(serializeCase(updated) as any).evidence.find((e:any)=>e.id===req.params.evidenceId)}})}));

apiRouter.get('/mysteries/:caseId/notes', wrap(async (req, res) => {
  const file = await getOwnedCase(req.params.caseId, req.ownerId);
  const notes = await InvestigationNote.find({ ownerId: req.ownerId, caseId: file._id }).sort({ updatedAt: -1 });
  res.json({ success: true, data: { notes: notes.map(n => ({ id: String(n._id), title: n.title, content: n.content, linkedSuspectIds: n.linkedSuspectIds, linkedEvidenceIds: n.linkedEvidenceIds, updatedAt: n.updatedAt })) } });
}));

apiRouter.post('/mysteries/:caseId/notes', wrap(async (req, res) => {
  const file = await getOwnedCase(req.params.caseId, req.ownerId);
  if (file.status === 'completed') throw new HttpError(409, 'This case is already closed.', 'CASE_CLOSED');
  const data = noteSchema.parse(req.body);
  if (data.linkedSuspectIds.some(id => !file.suspects.some((s: any) => s.id === id)) || data.linkedEvidenceIds.some(id => !file.evidence.some((e: any) => e.id === id))) throw new HttpError(400, 'A linked suspect or evidence item does not belong to this case.', 'INVALID_LINK');
  const note = await InvestigationNote.create({ ...data, ownerId: req.ownerId, caseId: file._id });
  res.status(201).json({ success: true, data: { note: { id: String(note._id), title: note.title, content: note.content, linkedSuspectIds: note.linkedSuspectIds, linkedEvidenceIds: note.linkedEvidenceIds, updatedAt: note.updatedAt } } });
}));

apiRouter.patch('/mysteries/:caseId/notes/:noteId', wrap(async (req, res) => {
  const file = await getOwnedCase(req.params.caseId, req.ownerId);
  const data = noteSchema.partial().parse(req.body);
  if (data.linkedSuspectIds?.some(id => !file.suspects.some((s: any) => s.id === id)) || data.linkedEvidenceIds?.some(id => !file.evidence.some((e: any) => e.id === id))) throw new HttpError(400, 'A linked suspect or evidence item does not belong to this case.', 'INVALID_LINK');
  const note = await InvestigationNote.findOneAndUpdate({ _id: req.params.noteId, caseId: file._id, ownerId: req.ownerId }, { $set: data }, { new: true, runValidators: true });
  if (!note) throw new HttpError(404, 'Investigation note not found.', 'NOTE_NOT_FOUND');
  res.json({ success: true, data: { note: { id: String(note._id), title: note.title, content: note.content, linkedSuspectIds: note.linkedSuspectIds, linkedEvidenceIds: note.linkedEvidenceIds, updatedAt: note.updatedAt } } });
}));
apiRouter.delete('/mysteries/:caseId/notes/:noteId',wrap(async(req,res)=>{const file=await getOwnedCase(req.params.caseId,req.ownerId);const deleted=await InvestigationNote.deleteOne({_id:req.params.noteId,caseId:file._id,ownerId:req.ownerId});if(!deleted.deletedCount)throw new HttpError(404,'Investigation note not found.','NOTE_NOT_FOUND');res.status(204).end()}));

apiRouter.post('/mysteries/:caseId/accusation',wrap(async(req,res)=>{const file=await getOwnedCase(req.params.caseId,req.ownerId);const suspectId=z.object({suspectId:z.string().min(1)}).parse(req.body).suspectId;if(!file.suspects.some((s:any)=>s.id===suspectId))throw new HttpError(400,'Select a suspect from this case.','INVALID_SUSPECT');const correct=suspectId===file.solution?.culpritId;const multiplier={easy:1,medium:1.5,hard:2}[file.difficulty]??1;const score=correct?Math.round(100*multiplier):0;const updated=await MysteryCase.findOneAndUpdate({_id:file._id,ownerId:req.ownerId,status:'open','accusation.suspectId':{$exists:false}},{$set:{status:'completed',accusation:{suspectId,correct,score,completedAt:new Date()}}},{new:true});if(!updated)throw new HttpError(409,'An accusation has already been submitted for this case.','ACCUSATION_LOCKED');res.json({success:true,data:{mystery:serializeCase(updated,true)}})}));
apiRouter.get('/mysteries/:caseId/verdict',wrap(async(req,res)=>{const file=await getOwnedCase(req.params.caseId,req.ownerId);if(file.status!=='completed')throw new HttpError(409,'Submit an accusation to resolve this case.','CASE_NOT_COMPLETED');res.json({success:true,data:{mystery:serializeCase(file,true)}})}));
