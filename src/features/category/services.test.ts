import { prismabd } from '../../../prisma/prismadb';
import {
  createCategoryService,
  deleteCategoryService,
  updateCategoryService,
} from './services';

// мокаем Prisma client для изоляции тестов от реальной БД
jest.mock('../../../prisma/prismadb', () => ({
  prismabd: {
    category: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));
// Получаем мок prismabd.category
const mockedPrisma = prismabd.category as jest.Mocked<typeof prismabd.category>;

describe('Category Services', () => {
  // Очищаем все моки перед каждым тестом
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCategoryServices', () => {
    // создаём валидные данные
    const validData = { name: 'New Category' };

    it('успешно создает категорию ', async () => {
      // успешный ответ Prisma
      const mockResponse = { id: '1', name: 'New Category' };

      // Мокируем успешный ответ Prisma по умолчанию
      mockedPrisma.create.mockResolvedValue(mockResponse);

      //  Вызываем тестируемую функцию с валидными данными, проверяем, что функция не выбрасывает исключений
      await expect(createCategoryService(validData)).resolves.not.toThrow();

      //  Проверяем, что mockedPrisma.craete был вызван ровно 1 раз
      expect(mockedPrisma.create).toHaveBeenCalledTimes(1);

      //  Проверяем, что mockedPrisma.create вызван с правильными аргументами
      expect(mockedPrisma.create).toHaveBeenCalledWith({
        data: validData,
      });
    });
    it('обрабатывает ошибки базы данных', async () => {
      // Мокаем ошибку при вызове Prisma
      mockedPrisma.create.mockRejectedValue(new Error('DB Connection Error'));

      //  Вызываем функцию с валидными данными и проверяем, что ошибка преобразована правильно
      await expect(createCategoryService(validData)).rejects.toThrow(
        'DB Connection Error'
      );
    });
  });
  describe('updateCategoryServices', () => {
    const validData = {
      categoryId: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Update Category',
    };
    it('успешно обновляет категорию', async () => {
      const mockResponse = {
        id: validData.categoryId,
        name: 'Update Category',
      };

      mockedPrisma.update.mockResolvedValue(mockResponse);

      await expect(updateCategoryService(validData)).resolves.not.toThrow();

      expect(mockedPrisma.update).toHaveBeenCalledTimes(1);

      expect(mockedPrisma.update).toHaveBeenCalledWith({
        where: { id: validData.categoryId },
        data: { name: validData.name },
      });
    });
    it('обрабатывает ошибки базы данных', async () => {
      mockedPrisma.update.mockRejectedValue(new Error('DB Connection Error'));

      await expect(updateCategoryService(validData)).rejects.toThrow(
        'DB Connection Error'
      );
    });
  });
  describe('deleteCategoryServices', () => {
    const validData = {
      categoryId: '123e4567-e89b-12d3-a456-426614174000',
    };
    it('успешно удаляет категорию', async () => {
      mockedPrisma.delete.mockResolvedValue({
        id: validData.categoryId,
        name: 'Deleted',
      });

      await expect(deleteCategoryService(validData)).resolves.not.toThrow();

      expect(mockedPrisma.delete).toHaveBeenCalledWith({
        where: { id: validData.categoryId },
      });
    });
    it('выбрасывает ошибку при несуществующем ID', async () => {
      mockedPrisma.delete.mockRejectedValue(new Error('Record not found'));

      await expect(deleteCategoryService(validData)).rejects.toThrow(
        'Record not found'
      );
    });
  });
});
