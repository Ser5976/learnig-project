'use server';

import { revalidateTag } from 'next/cache';
import { prismabd } from '../../../prisma/prismadb';
import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  type CreateCategoryInput,
  type UpdateCategoryInput,
  type DeleteCategoryInput,
} from './validation';

export const createCategoryAction = async (data: CreateCategoryInput) => {
  try {
    // Валидация входных данных
    const validatedData = createCategorySchema.parse(data);

    await prismabd.category.create({
      data: { name: validatedData.name },
    });

    revalidateTag('category');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Ошибка при создании категории: ${error.message}`);
    }
    throw new Error('Неизвестная ошибка при создании категории');
  }
};

export const updateCategoryAction = async (data: UpdateCategoryInput) => {
  try {
    // Валидация входных данных
    const validatedData = updateCategorySchema.parse(data);

    await prismabd.category.update({
      where: { id: validatedData.categoryId },
      data: { name: validatedData.name },
    });

    revalidateTag('category');

    //revalidatePath('/category');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Ошибка при обновлении категории: ${error.message}`);
    }
    throw new Error('Неизвестная ошибка при обновлении категории');
  }
};

export const deleteCategoryAction = async (data: DeleteCategoryInput) => {
  try {
    // Валидация входных данных
    const validatedData = deleteCategorySchema.parse(data);

    await prismabd.category.delete({
      where: { id: validatedData.categoryId },
    });

    revalidateTag('category');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Ошибка при удалении категории: ${error.message}`);
    }
    throw new Error('Неизвестная ошибка при удалении категории');
  }
};
