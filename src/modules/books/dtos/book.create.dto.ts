import mongoose from 'mongoose';
import { z } from 'zod';

/**
 * @openapi
 * components:
 *   dtos:
 *     BookCreateDto:
 *       type: object
 *       required:
 *        - title
 *        - authorId
 *        - price
 *        - ISBN
 *        - numberOfPages
 *       properties:
 *         title:
 *           type: string
 *           default: "Titans"
 *         authorId:
 *           type: string
 *         price:
 *           type: number
 *           default: 1
 *         ISBN:
 *           type: string
 *           default: "1"
 *         language:
 *           type: string
 *           default: "TR"
 *         numberOfPages:
 *           type: number
 *           default: 12
 *         publisher:
 *           type: string
 *
 */

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
