import mongoose, { Schema } from 'mongoose';

const suspectSchema = new Schema({ id: { type: String, required: true }, name: { type: String, required: true }, bio: { type: String, required: true }, relationship: { type: String, required: true }, publicAlibi: { type: String, required: true }, facts: { type: [String], default: [] } }, { _id: false });
const evidenceSchema = new Schema({ id: { type: String, required: true }, type: { type: String, required: true }, title: { type: String, required: true }, description: { type: String, required: true }, content: { type: Schema.Types.Mixed, default: {} }, associatedSuspectIds: { type: [String], default: [] }, relatedEvidenceIds: { type: [String], default: [] }, significance: String, truthStatus: String, supportsCulprit: Boolean }, { _id: false });
const timelineSchema = new Schema({ time: String, event: String }, { _id: false });
const caseSchema = new Schema({
  ownerId: { type: String, required: true, index: true }, caseNumber: { type: String, required: true, unique: true }, title: { type: String, required: true }, scenario: { type: String, required: true }, category: { type: String, required: true }, difficulty: { type: String, required: true }, tone: String,
  status: { type: String, enum: ['open', 'completed'], default: 'open', index: true }, description: { type: String, required: true }, setting: { location: String, incidentTime: String }, suspects: { type: [suspectSchema], required: true }, evidence: { type: [evidenceSchema], required: true }, solution: { culpritId: String, motive: String, explanation: String, actualTimeline: { type: [timelineSchema], default: [] }, decisiveEvidenceIds: { type: [String], default: [] } }, reviewedEvidenceIds: { type: [String], default: [] }, accusation: { suspectId: String, correct: Boolean, score: Number, completedAt: Date },
}, { timestamps: true, minimize: false });
caseSchema.index({ ownerId: 1, createdAt: -1 });
export const MysteryCase = mongoose.model('MysteryCase', caseSchema);
