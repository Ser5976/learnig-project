import {
  CreateSectionInput,
  UpdateSectionInput,
} from '@/validation/section-validation';
import { Section } from '@prisma/client';
import axios from 'axios';

export async function createSection(
  input: CreateSectionInput
): Promise<Section> {
  const { data } = await axios.post<Section>('api/sections', input);
  return data;
}

export async function updateSection(
  input: UpdateSectionInput
): Promise<Section> {
  const { data } = await axios.put<Section>(`api/sections/${input.id}`, input);
  return data;
}

export async function deleteSection(id: string): Promise<void> {
  await axios.delete(`api/sections/${id}`);
}
