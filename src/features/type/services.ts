import { prismabd } from '../../../prisma/prismadb';
import {
  CreateTypeInput,
  createTypeSchema,
  DeleteTypeInput,
  deleteTypeSchema,
  UpdateTypeInput,
  updateTypeSchema,
} from './validation';

export const createTypeService = async (data: CreateTypeInput) => {
  // Валидация входных данных
  const validatedData = createTypeSchema.parse(data);

  return prismabd.type.create({
    data: { name: validatedData.name },
  });
};

export const updateTypeService = async (data: UpdateTypeInput) => {
  // Валидация входных данных
  const validatedData = updateTypeSchema.parse(data);

  return prismabd.type.update({
    where: { id: validatedData.typeId },
    data: { name: validatedData.name },
  });
};

export const deleteTypeService = async (data: DeleteTypeInput) => {
  // Валидация входных данных
  const validatedData = deleteTypeSchema.parse(data);

  return prismabd.type.delete({
    where: { id: validatedData.typeId },
  });
};
