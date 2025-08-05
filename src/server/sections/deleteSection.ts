import { prismabd } from '../../../prisma/prismadb';

export async function deleteSection(data: { id: string }) {
  return await prismabd.section.delete({
    where: { id: data.id },
  });
}
