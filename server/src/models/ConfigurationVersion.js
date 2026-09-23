import mongoose from 'mongoose';

const configurationVersionSchema = new mongoose.Schema(
  {
    configurationKey: { type: String, required: true, index: true },
    version: { type: Number, required: true, min: 1 },
    settings: { type: mongoose.Schema.Types.Mixed, required: true },
    action: { type: String, enum: ['created', 'updated', 'restored'], required: true },
    sourceVersion: { type: Number, min: 1 },
    changeReason: { type: String, required: true, trim: true, maxlength: 240 },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false },
);

configurationVersionSchema.index({ configurationKey: 1, version: -1 }, { unique: true });

configurationVersionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
  },
});

export const ConfigurationVersion = mongoose.model('ConfigurationVersion', configurationVersionSchema);
