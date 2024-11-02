// Title
// Author
// Price
// ISBN
// Language
// Number of Pages
// Publisher

import mongoose, { Schema } from 'mongoose';

/**
 * @openapi
 * components:
 *   schemas:
 *     BookResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         price:
 *           type: number
 *         ISBN:
 *           type: string
 *         language:
 *           type: string
 *         numberOfPages:
 *           type: number
 *         publisher:
 *           type: string
 *         __v:
 *           type: number
 *
 */

export const bookSchema = new Schema({
  title: { type: String, unique: true, required: true },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
  },
  price: { type: Number, required: true },
  ISBN: { type: String, required: true },
  language: { type: String },
  numberOfPages: { type: Number, required: true },
  publisher: { type: String },
});

export const Book = mongoose.model('Book', bookSchema);
