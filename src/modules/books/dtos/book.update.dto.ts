import mongoose from 'mongoose';
import { z } from 'zod';

export const bookUpdateDtoSchema = z.object({
  title: z.string().optional(),
  price: z.number().optional(),
  ISBN: z.string().optional(),
  language: z.string().optional(),
  numberOfPages: z.number().optional(),
  publisher: z.string().optional(),
  authorId: z
    .string()
    .refine((val) => {
      return mongoose.Types.ObjectId.isValid(val);
    }, 'Invalid ID')
    .optional(),
});

export type BookUpdateDto = z.infer<typeof bookUpdateDtoSchema>;
