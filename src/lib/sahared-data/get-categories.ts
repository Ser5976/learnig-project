import { prismabd } from '@/prisma/prismadb';
import { unstable_cache } from 'next/cache';

export const getCategories = unstable_cache(
  async () => {
    return prismabd.category.findMany();
  },
  ['categories'],
  {
    tags: ['categories'],
  }
);
