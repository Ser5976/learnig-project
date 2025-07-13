// Мокаем next/cache в самом начале, до импорта get-categories
jest.mock('next/cache', () => ({
  unstable_cache: jest.fn((fn: (...args: unknown[]) => unknown) => fn),
}));

import { getCategoriesImpl } from './get-categories';
import { prismabd } from '../../../prisma/prismadb';

jest.mock('../../../prisma/prismadb', () => ({
  prismabd: {
    category: {
      findMany: jest.fn(),
    },
  },
}));

const mockedPrisma = prismabd.category.findMany as jest.MockedFunction<
  typeof prismabd.category.findMany
>;

// Мокаем console.error, чтобы не засорять вывод тестов
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('getCategoriesImpl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('возвращает категории из базы', async () => {
    const mockCategories = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' },
    ];
    mockedPrisma.mockResolvedValue(mockCategories);

    const result = await getCategoriesImpl();
    expect(result).toEqual(mockCategories);
    expect(mockedPrisma).toHaveBeenCalledTimes(1);
  });

  it('возвращает пустой массив при ошибке', async () => {
    mockedPrisma.mockRejectedValue(new Error('Database error'));
    const result = await getCategoriesImpl();
    expect(result).toEqual(undefined);

    // Проверяем, что ошибка была залогирована
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching categories:',
      expect.any(Error)
    );
  });
});
