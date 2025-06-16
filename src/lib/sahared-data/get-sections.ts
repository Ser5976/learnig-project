import { Section } from '@prisma/client';

import { axiosInstance } from '@/lib/axios';

export async function getSections(): Promise<Section[]> {
  const { data } = await axiosInstance.get<Section[]>('/sections');
  return data;
}
