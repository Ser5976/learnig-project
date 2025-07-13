import {
  createCategorySchema,
  deleteCategorySchema,
  updateCategorySchema,
} from './validation';

describe('Category Schemas', () => {
  describe('createCategorySchema ', () => {
    it('валидирует корректные данные', () => {
      const validData = { name: 'Valid Name' };
      expect(() => createCategorySchema.parse(validData)).not.toThrow();
    });
    it('отклоняет короткие имена', () => {
      const invalidData = { name: 'a' };
      expect(() => createCategorySchema.parse(invalidData)).toThrow(
        'Имя должно быть минимум 2 символа'
      );
    });

    it('отклоняет длинные имена', () => {
      const invalidData = { name: 'a'.repeat(51) };
      expect(() => createCategorySchema.parse(invalidData)).toThrow(
        'Имя слишком длинное'
      );
    });

    it('автоматически триммирует пробелы', () => {
      const data = { name: '  test  ' };
      expect(createCategorySchema.parse(data)).toEqual({ name: 'test' });
    });
  });

  describe('updateCategorySchema', () => {
    it('валидирует корректные данные', () => {
      const validData = {
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'New Name',
      };
      expect(() => updateCategorySchema.parse(validData)).not.toThrow();
    });

    it('требует валидный UUID', () => {
      const invalidData = { categoryId: 'invalid', name: 'Valid Name' };
      expect(() => updateCategorySchema.parse(invalidData)).toThrow(
        'Неверный формат ID'
      );
    });
  });
  describe('deleteCategorySchema', () => {
    it('валидирует корректный UUID', () => {
      const validData = { categoryId: '123e4567-e89b-12d3-a456-426614174000' };
      expect(() => deleteCategorySchema.parse(validData)).not.toThrow();
    });

    it('отклоняет невалидные UUID', () => {
      const invalidData = { categoryId: 'not-a-uuid' };
      expect(() => deleteCategorySchema.parse(invalidData)).toThrow(
        'Неверный формат ID'
      );
    });
  });
});
