import { prismabd } from '../../../prisma/prismadb';
import {
  CreateCategoryInput,
  createCategorySchema,
  DeleteCategoryInput,
  deleteCategorySchema,
  UpdateCategoryInput,
  updateCategorySchema,
} from './validation';

export const createCategoryService = async (data: CreateCategoryInput) => {
  // Валидация входных данных
  const validatedData = createCategorySchema.parse(data);

  return prismabd.category.create({
    data: { name: validatedData.name },
  });
};

export const updateCategoryService = async (data: UpdateCategoryInput) => {
  // Валидация входных данных
  const validatedData = updateCategorySchema.parse(data);

  return prismabd.category.update({
    where: { id: validatedData.categoryId },
    data: { name: validatedData.name },
  });
};

export const deleteCategoryService = async (data: DeleteCategoryInput) => {
  // Валидация входных данных
  const validatedData = deleteCategorySchema.parse(data);

  return prismabd.category.delete({
    where: { id: validatedData.categoryId },
  });
};
