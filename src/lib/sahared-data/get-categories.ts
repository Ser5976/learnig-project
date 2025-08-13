import { unstable_cache } from 'next/cache';
import { prismabd } from '../../../prisma/prismadb';
import { Category } from '@prisma/client';

export async function getCategoriesImpl(): Promise<Category[] | undefined> {
  try {
    const categories = await prismabd.category.findMany();
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return undefined;
  }
}

export const getCategories = unstable_cache(getCategoriesImpl, ['category'], {
  tags: ['category'],
  revalidate: 3600,
});
