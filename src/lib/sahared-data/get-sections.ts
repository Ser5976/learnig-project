import { Section } from '@prisma/client';
import axios from 'axios';

export async function getSections(): Promise<Section[]> {
  try {
    const { data } = await axios.get<Section[]>('/api/sections');
    return data;
  } catch (error) {
    console.error('getSections: error:', error);
    throw error;
  }
}
