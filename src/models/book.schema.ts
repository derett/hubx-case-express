// Title
// Author
// Price
// ISBN
// Language
// Number of Pages
// Publisher

import mongoose, { Schema } from 'mongoose';

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
