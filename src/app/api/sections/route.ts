import { NextResponse } from 'next/server';
import { getSections } from '@/server/sections/getSections';
import { handleCreateSection } from '@/server/sections/handleCreateSection';
import { ValidationError, DbError } from '@/server/errors';

export async function GET() {
  try {
    const sections = await getSections();
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
    const section = await handleCreateSection(body);
    return NextResponse.json(section);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: 400 }
      );
    }
    if (error instanceof DbError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
