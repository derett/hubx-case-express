import mongoose from 'mongoose';
import { z } from 'zod';

/**
 * @openapi
 * components:
 *   dtos:
 *     BookUpdateDto:
 *       type: object
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
