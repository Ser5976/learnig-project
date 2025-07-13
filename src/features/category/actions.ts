'use server';

import { revalidateTag } from 'next/cache';
import {
  type CreateCategoryInput,
  type UpdateCategoryInput,
  type DeleteCategoryInput,
} from './validation';
import { revalidatePath } from 'next/cache';
import {
  createCategoryService,
  deleteCategoryService,
  updateCategoryService,
} from './services';

export const createCategoryAction = async (data: CreateCategoryInput) => {
  try {
    await createCategoryService(data);
    revalidatePath('/');
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
    await updateCategoryService(data);
    revalidatePath('/');
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
    await deleteCategoryService(data);
    revalidatePath('/');
    revalidateTag('category');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Ошибка при удалении категории: ${error.message}`);
    }
    throw new Error('Неизвестная ошибка при удалении категории');
  }
};
