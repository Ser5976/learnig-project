import { z } from 'zod';

export const createSectionSchema = z.object({
  name: z
    .string()
    .min(1, 'Название обязательно')
    .max(50, 'Название не должно превышать 50 символов')
    .trim(),
});

export const updateSectionSchema = z.object({
  id: z.string().uuid('Неверный формат ID'),
  name: z
    .string()
    .min(1, 'Название обязательно')
    .max(50, 'Название не должно превышать 50 символов')
    .trim(),
});

export const deleteSectionSchema = z.object({
  id: z.string().uuid('Неверный формат ID'),
});

export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;
export type DeleteSectionInput = z.infer<typeof deleteSectionSchema>;
