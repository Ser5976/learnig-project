import { prismabd } from '../../../prisma/prismadb';

export async function createSection(data: { name: string }) {
  return await prismabd.section.create({ data });
}
