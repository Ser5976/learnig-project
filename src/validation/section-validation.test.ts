import {
  deleteSectionSchema,
  updateSectionSchema,
} from '@/validation/section-validation';
import { createSectionSchema } from './section-validation';

describe('Section Schemas', () => {
  describe('createSectionSchema', () => {
    it('валидирует корректные данные', () => {
      const validData = { name: 'Valid name' };
      expect(() => createSectionSchema.parse(validData)).not.toThrow();
    });
    it('отклоняет короткие имена', () => {
      const invalidData = { name: 'a' };
      expect(() => createSectionSchema.parse(invalidData)).toThrow(
        'Имя должно быть минимум 2 символа'
      );
    });

    it('отклоняет длинные имена', () => {
      const invalidData = { name: 'a'.repeat(51) };
      expect(() => createSectionSchema.parse(invalidData)).toThrow(
        'Имя слишком длинное'
      );
    });

    it('автоматически триммирует пробелы', () => {
      const data = { name: '  test  ' };
      expect(createSectionSchema.parse(data)).toEqual({ name: 'test' });
    });
  });
  describe('updateSectionSchema', () => {
    it('валидирует корректные данные', () => {
      const validData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'New Name',
      };
      expect(() => updateSectionSchema.parse(validData)).not.toThrow();
    });

    it('требует валидный UUID', () => {
      const invalidData = { id: 'invalid', name: 'Valid Name' };
      expect(() => updateSectionSchema.parse(invalidData)).toThrow(
        'Неверный формат ID'
      );
    });
  });
  describe('deleteSectionSchema', () => {
    it('валидирует корректный UUID', () => {
      const validData = { id: '123e4567-e89b-12d3-a456-426614174000' };
      expect(() => deleteSectionSchema.parse(validData)).not.toThrow();
    });

    it('отклоняет невалидные UUID', () => {
      const invalidData = { id: 'not-a-uuid' };
      expect(() => deleteSectionSchema.parse(invalidData)).toThrow(
        'Неверный формат ID'
      );
    });
  });
});
