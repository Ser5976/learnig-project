import { Type } from '@prisma/client';

export const getTypes = async (): Promise<Type[] | undefined> => {
  console.log('Выполняется запрос к БД, getTypes');
  const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/type`, {
    cache: 'force-cache',
    next: {
      revalidate: 3600,
      tags: ['type'],
    },
  });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    //throw new Error('Failed to fetch data');
    return undefined;
  }
  const types = res.json();

  return types;
};
