import mongoose from 'mongoose';

export const AUDIT_ACTIONS = ['event.created', 'event.updated', 'event.deleted'];

const auditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true, enum: AUDIT_ACTIONS, immutable: true },
    resourceType: { type: String, required: true, enum: ['event'], immutable: true },
    resourceId: { type: String, required: true, immutable: true },
    description: { type: String, required: true, maxlength: 240, immutable: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, immutable: true },
    actorSnapshot: {
      name: { type: String, required: true, immutable: true },
      email: { type: String, required: true, immutable: true },
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {}, immutable: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
    toJSON: {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
      },
    },
  },
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ resourceId: 1, createdAt: -1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
