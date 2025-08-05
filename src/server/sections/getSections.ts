import { prismabd } from '../../../prisma/prismadb';

export async function getSections() {
  return await prismabd.section.findMany();
}
