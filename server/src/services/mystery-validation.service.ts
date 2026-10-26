import type { GeneratedMystery } from '../schemas/mystery.js';

export function validateMysteryConsistency(mystery: GeneratedMystery, expectedSuspects: number) {
  const suspectIds = new Set(mystery.suspects.map(s => s.id));
  const evidenceIds = new Set(mystery.evidence.map(e => e.id));
  if (mystery.suspects.length !== expectedSuspects) throw new Error('The generated case did not contain the requested number of suspects.');
  if (suspectIds.size !== mystery.suspects.length || !suspectIds.has(mystery.culpritId)) throw new Error('Generated culprit must match exactly one listed suspect.');
  if (evidenceIds.size !== mystery.evidence.length) throw new Error('Generated evidence identifiers must be unique.');
  if (mystery.evidence.some(e => e.associatedSuspectIds.some(id => !suspectIds.has(id)))) throw new Error('Evidence refers to an unknown suspect.');
  if (mystery.evidence.some(e => e.relatedEvidenceIds.some(id => !evidenceIds.has(id)))) throw new Error('Evidence refers to an unknown evidence item.');
  if (mystery.decisiveEvidenceIds.some(id => !evidenceIds.has(id))) throw new Error('Solution refers to an unknown evidence item.');
  if (!mystery.decisiveEvidenceIds.some(id => mystery.evidence.find(e => e.id === id)?.supportsCulprit)) throw new Error('The solution must be supported by evidence.');
}
