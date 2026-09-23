import mongoose from 'mongoose';

export const USER_ROLES = ['attendee', 'admin'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: USER_ROLES, default: 'attendee' },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.passwordHash;
      },
    },
  },
);

export const User = mongoose.model('User', userSchema);
