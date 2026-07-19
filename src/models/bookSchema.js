import mongoose from 'mongoose';
import { allowedStatuses } from '../validators/bookValidator.js';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    genre: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: allowedStatuses(),
      default: 'want'
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer from 0 to 5.'
      }
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_document, returnedObject) => {
        delete returnedObject._id;
        return returnedObject;
      }
    },
    toObject: {
      virtuals: true
    }
  }
);

export default bookSchema;
