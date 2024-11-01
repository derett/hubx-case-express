import { z } from 'zod';

export const authorCreateDtoSchema = z.object({
  name: z.string(),
  country: z.string().optional(),
  birthDate: z.string().optional(),
});

export type AuthorCreateDto = z.infer<typeof authorCreateDtoSchema>;
