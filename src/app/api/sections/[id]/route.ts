import { NextResponse } from 'next/server';
import { handleUpdateSection } from '@/server/sections/handleUpdateSection';
import { handleDeleteSection } from '@/server/sections/handleDeleteSection';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body = await request.json();

    const section = await handleUpdateSection({ id, ...body });
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
    const section = await handleDeleteSection({ id });
    return NextResponse.json(section);
  } catch (error) {
    console.error('Error deleting section:', error);
    return NextResponse.json(
      { error: 'Failed to delete section' },
      { status: 500 }
    );
  }
}
