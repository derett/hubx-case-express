// Name
// Country
// Birth Date

import mongoose, { Schema } from 'mongoose';
import { Book } from './book.schema';

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthorResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         country:
 *           type: string
 *         birthDate:
 *           type: number
 *         __v:
 *           type: number
 *
 */

export const authorSchema = new Schema({
  name: { type: String, unique: true, required: true },
  country: { type: String, required: false },
  birthDate: { type: String, required: false },
  books: { type: [{ type: mongoose.Schema.Types.ObjectId }], ref: 'Book' },
});

authorSchema.pre('deleteOne', async function (next) {
  const author = this.getQuery();
  try {
    // Delete all books associated with this author
    await Book.deleteMany({ author: author._id });
    next();
  } catch (error) {
    next(error);
  }
});

export const Author = mongoose.model('Author', authorSchema);
