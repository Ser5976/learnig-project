import { axiosInstance } from '@/lib/axios';
import {
  CreateSectionInput,
  UpdateSectionInput,
} from '@/validation/section-validation';
import { Section } from '@prisma/client';

export async function createSection(
  input: CreateSectionInput
): Promise<Section> {
  const { data } = await axiosInstance.post<Section>('/sections', input);
  return data;
}

export async function updateSection(
  input: UpdateSectionInput
): Promise<Section> {
  const { data } = await axiosInstance.put<Section>(
    `/sections/${input.id}`,
    input
  );
  return data;
}

export async function deleteSection(id: string): Promise<void> {
  await axiosInstance.delete(`/sections/${id}`);
}
