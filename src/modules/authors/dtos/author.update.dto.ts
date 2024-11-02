import { z } from 'zod';

/**
 * @openapi
 * components:
 *   dtos:
 *     AuthorUpdateDto:
 *       type: object
 *       required:
 *        - name
 *       properties:
 *         name:
 *           type: string
 *           default: "Kaan"
 *         country:
 *           type: string
 *           default: "TR"
 *         birthDate:
 *           type: string
 *           default: "1996"
 *
 */

export const authorUpdateDtoSchema = z.object({
  name: z.string().optional(),
  country: z.string().optional(),
  birthDate: z.string().optional(),
});

export type AuthorUpdateDto = z.infer<typeof authorUpdateDtoSchema>;
