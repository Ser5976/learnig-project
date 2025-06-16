import { NextResponse } from 'next/server';
import { prismabd } from '../../../../../prisma/prismadb';
import { updateSectionSchema } from '@/validation/section-validation';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body = await request.json();

    // Валидация входных данных
    const validationResult = updateSectionSchema.safeParse({ id, ...body });
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const section = await prismabd.section.update({
      where: { id },
      data: {
        name: validationResult.data.name,
      },
    });
    return NextResponse.json(section);
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    await prismabd.section.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting section:', error);
    return NextResponse.json(
      { error: 'Failed to delete section' },
      { status: 500 }
    );
  }
}
