import mongoose from 'mongoose';

export const EVENT_CATEGORIES = ['technical', 'cultural', 'sports', 'workshop', 'seminar', 'other'];
export const EVENT_STATUSES = ['draft', 'published', 'cancelled'];

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must contain at least 3 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must contain at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: EVENT_CATEGORIES,
        message: 'Category is not supported',
      },
      lowercase: true,
      trim: true,
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
      maxlength: [120, 'Organizer cannot exceed 120 characters'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
      maxlength: [160, 'Venue cannot exceed 160 characters'],
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    registrationUrl: {
      type: String,
      trim: true,
      maxlength: [500, 'Registration URL cannot exceed 500 characters'],
    },
    tags: {
      type: [String],
      default: [],
      set: (tags) => [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))],
      validate: {
        validator: (tags) => tags.length <= 10,
        message: 'An event can contain at most 10 tags',
      },
    },
    status: {
      type: String,
      enum: {
        values: EVENT_STATUSES,
        message: 'Status is not supported',
      },
      default: 'draft',
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
      },
    },
  },
);

eventSchema.index({ eventDate: 1 });
eventSchema.index({ category: 1, status: 1 });

export const Event = mongoose.model('Event', eventSchema);
