import { prismabd } from '../../../prisma/prismadb';

export async function getTypes() {
  return await prismabd.type.findMany();
}
