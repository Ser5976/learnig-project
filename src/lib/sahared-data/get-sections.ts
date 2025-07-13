import { Section } from '@prisma/client';
import axios from 'axios';

export async function getSections(): Promise<Section[]> {
  const { data } = await axios.get<Section[]>('/api/sections');
  return data;
}
