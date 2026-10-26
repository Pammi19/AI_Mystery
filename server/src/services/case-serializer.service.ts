function pick(source: any, keys: string[]) {
  return Object.fromEntries(keys.filter(key => source && typeof source[key] === 'string').map(key => [key, source[key]]));
}

function sanitizeEvidenceContent(type: string, raw: any) {
  const content = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  if (type === 'chat') return {
    participants: Array.isArray(content.participants) ? content.participants.filter((item: unknown) => typeof item === 'string') : [],
    messages: Array.isArray(content.messages) ? content.messages.slice(0, 100).map((message: any) => pick(message, ['senderId', 'senderName', 'timestamp', 'text', 'attachment'])) : []
  };
  if (type === 'cctv') return { camera: pick(content, ['camera']).camera, observations: Array.isArray(content.observations) ? content.observations.slice(0, 100).map((item: any) => pick(item, ['time', 'description'])) : [] };
  if (type === 'witness') return pick(content, ['witnessName', 'statement', 'statementTime']);
  if (type === 'document') return pick(content, ['text', 'documentType', 'date', 'author']);
  if (type === 'physical') return pick(content, ['text', 'condition', 'location', 'collectedAt']);
  if (type === 'image') return pick(content, ['description', 'altText', 'caption']);
  return {};
}

export function serializeCase(doc: any, includeVerdict = false) {
  const data = doc.toObject ? doc.toObject() : doc;
  const suspectById = new Map(data.suspects.map((s: any) => [s.id, s]));
  const result: Record<string, unknown> = {
    id: String(data._id), caseNumber: data.caseNumber, title: data.title, category: data.category, difficulty: data.difficulty, tone: data.tone,
    status: data.status, description: data.description, setting: data.setting, suspects: data.suspects,
    evidence: data.evidence.map((e: any) => ({ id: e.id, type: e.type, title: e.title, description: e.description, content: sanitizeEvidenceContent(e.type, e.content), associatedSuspectIds: e.associatedSuspectIds, relatedEvidenceIds: e.relatedEvidenceIds, reviewed: (data.reviewedEvidenceIds ?? []).includes(e.id) })),
    progress: { reviewedEvidenceIds: data.reviewedEvidenceIds ?? [] }, createdAt: data.createdAt, updatedAt: data.updatedAt
  };
  if (includeVerdict && data.status === 'completed' && data.solution && data.accusation) {
    result.accusation = { suspectId: data.accusation.suspectId, correct: data.accusation.correct, score: data.accusation.score, accused: suspectById.get(data.accusation.suspectId), culprit: suspectById.get(data.solution.culpritId), motive: data.solution.motive, explanation: data.solution.explanation, actualTimeline: data.solution.actualTimeline, decisiveEvidenceIds: data.solution.decisiveEvidenceIds };
  }
  return result;
}
