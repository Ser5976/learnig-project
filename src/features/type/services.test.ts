import { prismabd } from '../../../prisma/prismadb';
import {
  createTypeService,
  deleteTypeService,
  updateTypeService,
} from './services';

// мокаем Prisma client для изоляции тестов от реальной БД
jest.mock('../../../prisma/prismadb', () => ({
  prismabd: {
    type: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));
// Получаем мок prismabd.type
const mockedPrisma = prismabd.type as jest.Mocked<typeof prismabd.type>;

describe('Type Services', () => {
  // Очищаем все моки перед каждым тестом
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTypeServices', () => {
    // Создаём валидные данные
    const validData = { name: 'New Type' };

    it('успешно создает тип ', async () => {
      // Создаём успешный ответ Prisma
      const mockResponse = { id: '1', name: 'New Type' };

      // Мокируем успешный ответ Prisma по умолчанию
      mockedPrisma.create.mockResolvedValue(mockResponse);

      //  Вызываем тестируемую функцию с валидными данными, проверяем, что функция не выбрасывает исключений
      await expect(createTypeService(validData)).resolves.not.toThrow();

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
      await expect(createTypeService(validData)).rejects.toThrow(
        'DB Connection Error'
      );
    });
  });
  describe('updateCategoryServices', () => {
    const validData = {
      typeId: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Update Type',
    };
    it('успешно обновляет категорию', async () => {
      const mockResponse = {
        id: validData.typeId,
        name: 'Update Type',
      };

      mockedPrisma.update.mockResolvedValue(mockResponse);

      await expect(updateTypeService(validData)).resolves.not.toThrow();

      expect(mockedPrisma.update).toHaveBeenCalledTimes(1);

      expect(mockedPrisma.update).toHaveBeenCalledWith({
        where: { id: validData.typeId },
        data: { name: validData.name },
      });
    });
    it('обрабатывает ошибки базы данных', async () => {
      mockedPrisma.update.mockRejectedValue(new Error('DB Connection Error'));

      await expect(updateTypeService(validData)).rejects.toThrow(
        'DB Connection Error'
      );
    });
  });
  describe('deleteCategoryServices', () => {
    const validData = {
      typeId: '123e4567-e89b-12d3-a456-426614174000',
    };
    it('успешно удаляет тип', async () => {
      mockedPrisma.delete.mockResolvedValue({
        id: validData.typeId,
        name: 'Deleted',
      });

      await expect(deleteTypeService(validData)).resolves.not.toThrow();

      expect(mockedPrisma.delete).toHaveBeenCalledWith({
        where: { id: validData.typeId },
      });
    });
    it('выбрасывает ошибку при несуществующем ID', async () => {
      mockedPrisma.delete.mockRejectedValue(new Error('Record not found'));

      await expect(deleteTypeService(validData)).rejects.toThrow(
        'Record not found'
      );
    });
  });
});
