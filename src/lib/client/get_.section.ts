import { Section } from '@prisma/client';
import axios from 'axios';

export const getSection = async () => {
  const { data } = await axios.get<Section[]>(`/api/section`);
  return data;
};
