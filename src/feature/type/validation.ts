import { z } from 'zod';

// Схема для создания типа
export const createTypeSchema = z.object({
  name: z
    .string()
    .min(2, 'Имя должно быть минимум 2 символа')
    .max(50, 'Имя слишком длинное')
    .trim(),
});

// Схема для обновления типа
export const updateTypeSchema = z.object({
  typeId: z.string().uuid('Неверный формат ID'),
  name: z
    .string()
    .min(2, 'Имя должно быть минимум 2 символа')
    .max(50, 'Имя слишком длинное')
    .trim(),
});

// Схема для удаления типа
export const deleteTypeSchema = z.object({
  typeId: z.string().uuid('Неверный формат ID'),
});

// Типы для TypeScript
export type CreateTypeInput = z.infer<typeof createTypeSchema>;
export type UpdateTypeInput = z.infer<typeof updateTypeSchema>;
export type DeleteTypeInput = z.infer<typeof deleteTypeSchema>;
