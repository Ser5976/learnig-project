import { deleteSectionSchema } from '@/validation/section-validation';
import { ValidationError, DbError } from '../errors';
import { deleteSection } from './deleteSection';

export async function handleDeleteSection(body: { id: string }) {
  const validationResult = deleteSectionSchema.safeParse(body);
  if (!validationResult.success) {
    throw new ValidationError(
      'Validation error',
      validationResult.error.format()
    );
  }
  try {
    const section = await deleteSection(validationResult.data);
    return section;
  } catch {
    throw new DbError('Failed to create section');
  }
}
