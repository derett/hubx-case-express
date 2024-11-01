// Name
// Country
// Birth Date

import mongoose, { Schema } from 'mongoose';

export const authorSchema = new Schema({
  name: { type: String, unique: true, required: true },
  country: { type: String, required: false },
  birthDate: { type: String, required: false },
  books: { type: [{ type: mongoose.Schema.Types.ObjectId }], ref: 'Book' },
});

export const Author = mongoose.model('Author', authorSchema);
