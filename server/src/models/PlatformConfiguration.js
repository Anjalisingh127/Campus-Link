import mongoose from 'mongoose';

export const DEFAULT_PLATFORM_SETTINGS = Object.freeze({
  siteName: 'CampusConnect',
  eventSubmissionEnabled: true,
  registrationEnabled: true,
  defaultPageSize: 6,
  maintenanceMessage: '',
});

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    eventSubmissionEnabled: { type: Boolean, required: true },
    registrationEnabled: { type: Boolean, required: true },
    defaultPageSize: { type: Number, required: true, min: 1, max: 50 },
    maintenanceMessage: { type: String, trim: true, maxlength: 300, default: '' },
  },
  { _id: false },
);

const platformConfigurationSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'platform', immutable: true },
    version: { type: Number, required: true, min: 1, default: 1 },
    settings: { type: settingsSchema, required: true, default: () => ({ ...DEFAULT_PLATFORM_SETTINGS }) },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    changeReason: { type: String, required: true, trim: true, minlength: 5, maxlength: 240 },
  },
  { timestamps: true, versionKey: false },
);

platformConfigurationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
  },
});

export const PlatformConfiguration = mongoose.model('PlatformConfiguration', platformConfigurationSchema);
