import { z } from 'zod';

export const createSectionSchema = z.object({
  name: z
    .string()
    .min(2, 'Имя должно быть минимум 2 символа')
    .max(50, 'Имя слишком длинное')
    .trim(),
});

export const updateSectionSchema = z.object({
  id: z.string().uuid('Неверный формат ID'),
  name: z
    .string()
    .min(2, 'Имя должно быть минимум 2 символа')
    .max(50, 'Имя слишком длинное')
    .trim(),
});

export const deleteSectionSchema = z.object({
  id: z.string().uuid('Неверный формат ID'),
});

export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;
export type DeleteSectionInput = z.infer<typeof deleteSectionSchema>;
