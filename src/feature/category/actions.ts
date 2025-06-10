'use server';

import { revalidateTag } from 'next/cache';
import { prismabd } from '../../../prisma/prismadb';

export const createCategoryAction = async (data: { name: string }) => {
  try {
    await prismabd.category.create({
      data: { name: data.name },
    });

    revalidateTag('category');
  } catch (error) {
    console.error('Error creating category:', error);
    throw new Error('Failed to create category');
  }
};

export const updateCategoryAction = async (updateData: {
  categoryId: string;
  name: string;
}) => {
  try {
    await prismabd.category.update({
      where: { id: updateData.categoryId },
      data: { name: updateData.name },
    });

    revalidateTag('category');

    //revalidatePath('/category');
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }
};

export const deleteCategoryAction = async (categoryId: string) => {
  try {
    await prismabd.category.delete({
      where: { id: categoryId },
    });

    revalidateTag('category');
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
};
