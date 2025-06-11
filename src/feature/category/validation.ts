import { z } from 'zod';

// Схема для создания категории
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Имя должно быть минимум 2 символа')
    .max(50, 'Имя слишком длинное')
    .trim(),
});

// Схема для обновления категории
export const updateCategorySchema = z.object({
  categoryId: z.string().uuid('Неверный формат ID'),
  name: z
    .string()
    .min(2, 'Имя должно быть минимум 2 символа')
    .max(50, 'Имя слишком длинное')
    .trim(),
});

// Схема для удаления категории
export const deleteCategorySchema = z.object({
  categoryId: z.string().uuid('Неверный формат ID'),
});

// Типы для TypeScript
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;
