import { z } from 'zod';

/**
 * @openapi
 * components:
 *   dtos:
 *     AuthorCreateDto:
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

export const authorCreateDtoSchema = z.object({
  name: z.string(),
  country: z.string().optional(),
  birthDate: z.string().optional(),
});

export type AuthorCreateDto = z.infer<typeof authorCreateDtoSchema>;
