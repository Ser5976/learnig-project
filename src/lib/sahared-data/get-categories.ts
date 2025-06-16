import { unstable_cache } from 'next/cache';
import { prismabd } from '../../../prisma/prismadb';

export const getCategories = unstable_cache(
  async () => {
    console.log('Выполняется запрос к БД, getCategories');
    try {
      const categories = await prismabd.category.findMany();
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },
  ['category'],
  {
    tags: ['category'],
    revalidate: 3600,
  }
);
