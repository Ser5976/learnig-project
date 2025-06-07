import { unstable_cache } from 'next/cache';
import { prismabd } from '../../../prisma/prismadb';

export const getCategories = unstable_cache(
  async () => {
    console.log('Выполняется запрос к БД');
    try {
      const categories = await prismabd.category.findMany();
      return categories;
    } catch (error) {
      console.log(error);
    }
  },
  ['categories'],
  {
    tags: ['categories'],
    revalidate: 60,
  }
);
