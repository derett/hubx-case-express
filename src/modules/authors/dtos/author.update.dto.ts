import { z } from 'zod';

export const authorUpdateDtoSchema = z.object({
  name: z.string().optional(),
  country: z.string().optional(),
  birthDate: z.string().optional(),
});

export type AuthorUpdateDto = z.infer<typeof authorUpdateDtoSchema>;
