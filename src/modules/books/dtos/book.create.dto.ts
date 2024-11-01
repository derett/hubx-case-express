import mongoose from 'mongoose';
import { z } from 'zod';

export const bookCreateDtoSchema = z.object({
  title: z.string(),
  price: z.number(),
  ISBN: z.string(),
  language: z.string().optional(),
  numberOfPages: z.number(),
  publisher: z.string().optional(),
  authorId: z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val);
  }, 'Invalid ID'),
});

export type BookCreateDto = z.infer<typeof bookCreateDtoSchema>;
