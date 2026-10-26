import mongoose, { Schema } from 'mongoose';
const noteSchema = new Schema({ ownerId: { type: String, required: true, index: true }, caseId: { type: Schema.Types.ObjectId, required: true, index: true }, title: { type: String, required: true, maxlength: 120 }, content: { type: String, required: true, maxlength: 2000 }, linkedSuspectIds: { type: [String], default: [] }, linkedEvidenceIds: { type: [String], default: [] } }, { timestamps: true });
noteSchema.index({ ownerId: 1, caseId: 1, updatedAt: -1 });
export const InvestigationNote = mongoose.model('InvestigationNote', noteSchema);
