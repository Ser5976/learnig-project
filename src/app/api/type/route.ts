import { getTypes } from '@/server/types/getTypes';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const types = await getTypes();
    return NextResponse.json(types);
  } catch (error) {
    console.log(error);
  }
}
