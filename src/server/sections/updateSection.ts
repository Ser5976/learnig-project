import { prismabd } from '../../../prisma/prismadb';

export async function updateSection(data: { name: string; id: string }) {
  return await prismabd.section.update({
    where: { id: data.id },
    data: { name: data.name },
  });
}
