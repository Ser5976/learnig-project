import {
  createTypeSchema,
  deleteTypeSchema,
  updateTypeSchema,
} from './validation';

describe('Type Schemas', () => {
  describe('createTypeSchema', () => {
    it('валидирует корректные данные', () => {
      const validData = { name: 'Valid name' };
      expect(() => createTypeSchema.parse(validData)).not.toThrow();
    });
    it('отклоняет короткие имена', () => {
      const invalidData = { name: 'a' };
      expect(() => createTypeSchema.parse(invalidData)).toThrow(
        'Имя должно быть минимум 2 символа'
      );
    });

    it('отклоняет длинные имена', () => {
      const invalidData = { name: 'a'.repeat(51) };
      expect(() => createTypeSchema.parse(invalidData)).toThrow(
        'Имя слишком длинное'
      );
    });

    it('автоматически триммирует пробелы', () => {
      const data = { name: '  test  ' };
      expect(createTypeSchema.parse(data)).toEqual({ name: 'test' });
    });
  });
  describe('updateTypeSchema', () => {
    it('валидирует корректные данные', () => {
      const validData = {
        typeId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'New Name',
      };
      expect(() => updateTypeSchema.parse(validData)).not.toThrow();
    });

    it('требует валидный UUID', () => {
      const invalidData = { typeId: 'invalid', name: 'Valid Name' };
      expect(() => updateTypeSchema.parse(invalidData)).toThrow(
        'Неверный формат ID'
      );
    });
  });
  describe('deleteTypeSchema', () => {
    it('валидирует корректный UUID', () => {
      const validData = { typeId: '123e4567-e89b-12d3-a456-426614174000' };
      expect(() => deleteTypeSchema.parse(validData)).not.toThrow();
    });

    it('отклоняет невалидные UUID', () => {
      const invalidData = { typeId: 'not-a-uuid' };
      expect(() => deleteTypeSchema.parse(invalidData)).toThrow(
        'Неверный формат ID'
      );
    });
  });
});
