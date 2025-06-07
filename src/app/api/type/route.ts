import { NextResponse } from 'next/server';
import { prismabd } from '../../../../prisma/prismadb';

export async function GET() {
  try {
    const types = await prismabd.type.findMany();
    return NextResponse.json(types);
  } catch (error) {
    console.log(error);
  }
}
