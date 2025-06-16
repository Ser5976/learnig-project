import { NextResponse } from 'next/server';
import { prismabd } from '../../../../prisma/prismadb';
import { createSectionSchema } from '@/validation/section-validation';

export async function GET() {
  try {
    const sections = await prismabd.section.findMany();
    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Валидация входных данных
    const validationResult = createSectionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const section = await prismabd.section.create({
      data: validationResult.data,
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    );
  }
}
