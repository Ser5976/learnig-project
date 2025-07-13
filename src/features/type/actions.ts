'use server';

import { revalidateTag } from 'next/cache';
import {
  type CreateTypeInput,
  type UpdateTypeInput,
  type DeleteTypeInput,
} from './validation';
import { revalidatePath } from 'next/cache';
import {
  createTypeService,
  deleteTypeService,
  updateTypeService,
} from './services';

export const createTypeAction = async (data: CreateTypeInput) => {
  try {
    await createTypeService(data);
    revalidatePath('/');
    revalidateTag('type');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Ошибка при создании типа: ${error.message}`);
    }
    throw new Error('Неизвестная ошибка при создании типа');
  }
};

export const updateTypeAction = async (data: UpdateTypeInput) => {
  try {
    await updateTypeService(data);
    revalidatePath('/');
    revalidateTag('type');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Ошибка при обновлении типа: ${error.message}`);
    }
    throw new Error('Неизвестная ошибка при обновлении типа');
  }
};

export const deleteTypeAction = async (data: DeleteTypeInput) => {
  try {
    await deleteTypeService(data);
    revalidatePath('/');
    revalidateTag('type');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Ошибка при удалении типа: ${error.message}`);
    }
    throw new Error('Неизвестная ошибка при удалении типа');
  }
};
