'use server';

import { revalidateTag } from 'next/cache';
import { prismabd } from '../../../prisma/prismadb';
import {
  createTypeSchema,
  updateTypeSchema,
  deleteTypeSchema,
  type CreateTypeInput,
  type UpdateTypeInput,
  type DeleteTypeInput,
} from './validation';

export const createTypeAction = async (data: CreateTypeInput) => {
  try {
    // Валидация входных данных
    const validatedData = createTypeSchema.parse(data);

    await prismabd.type.create({
      data: { name: validatedData.name },
    });

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
    // Валидация входных данных
    const validatedData = updateTypeSchema.parse(data);

    await prismabd.type.update({
      where: { id: validatedData.typeId },
      data: { name: validatedData.name },
    });

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
    // Валидация входных данных
    const validatedData = deleteTypeSchema.parse(data);

    await prismabd.type.delete({
      where: { id: validatedData.typeId },
    });

    revalidateTag('type');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Ошибка при удалении типа: ${error.message}`);
    }
    throw new Error('Неизвестная ошибка при удалении типа');
  }
};
