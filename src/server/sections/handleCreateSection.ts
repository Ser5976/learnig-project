import { createSectionSchema } from '@/validation/section-validation';
import { createSection } from './createSection';
import { ValidationError, DbError } from '../errors';

export async function handleCreateSection(body: { name: string }) {
  const validationResult = createSectionSchema.safeParse(body);
  if (!validationResult.success) {
    throw new ValidationError(
      'Validation error',
      validationResult.error.format()
    );
  }
  try {
    const section = await createSection(validationResult.data);
    return section;
  } catch {
    throw new DbError('Failed to create section');
  }
}
