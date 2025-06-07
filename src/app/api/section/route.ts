import { NextResponse } from 'next/server';
import { prismabd } from '../../../../prisma/prismadb';

export async function GET() {
  try {
    const sections = await prismabd.section.findMany();
    return NextResponse.json(sections);
  } catch (error) {
    console.log(error);
  }
}
