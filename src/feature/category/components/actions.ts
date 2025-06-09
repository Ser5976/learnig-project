'use server';

import { revalidateTag } from 'next/cache';
import { prismabd } from '../../../../prisma/prismadb';

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
    console.log(error);
    throw new Error('Something went wrong');
  }
};
