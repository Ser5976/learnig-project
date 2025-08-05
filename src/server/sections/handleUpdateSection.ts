import { updateSectionSchema } from '@/validation/section-validation';
import { ValidationError, DbError } from '../errors';
import { updateSection } from './updateSection';

export async function handleUpdateSection(body: { id: string; name: string }) {
  const validationResult = updateSectionSchema.safeParse(body);
  if (!validationResult.success) {
    throw new ValidationError(
      'Validation error',
      validationResult.error.format()
    );
  }
  try {
    const section = await updateSection(validationResult.data);
    return section;
  } catch {
    throw new DbError('Failed to create section');
  }
}
