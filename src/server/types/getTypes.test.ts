import { getTypes } from './getTypes';
import { prismabd } from '../../../prisma/prismadb';

// Мокаем prismabd, чтобы не трогать реальную БД в тестах
jest.mock('../../../prisma/prismadb', () => ({
  prismabd: {
    type: {
      findMany: jest.fn(),
    },
  },
}));
// Получаем мок prismabd.type
const mockedPrisma = prismabd.type as jest.Mocked<typeof prismabd.type>;

describe('getTypes (server)', () => {
  // Очищаем моки после каждого теста, чтобы тесты не влияли друг на друга
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('возвращает массив секций из БД', async () => {
    // Подготатавливаем тестовые данные - массив секций, которые должны вернуться из БД
    const mockTypes = [
      { id: '1', name: 'Type 1' },
      { id: '2', name: 'Type2' },
    ];

    // Мокаем метод findMany у prismabd.type, чтобы он возвращал наши тестовые данные
    // mockResolvedValueOnce означает, что функция вернёт Promise, который резолвится в mockSections
    mockedPrisma.findMany.mockResolvedValueOnce(mockTypes);

    // Вызываем тестируемую функцию
    const result = await getTypes();

    // Проверяем, что функция вернула именно те данные, которые мы ожидали
    expect(result).toEqual(mockTypes);
  });

  it('возвращает пустой массив, если секций нет', async () => {
    // Мокаем findMany, чтобы он вернул пустой массив (ситуация, когда в БД нет секций)
    mockedPrisma.findMany.mockResolvedValueOnce([]);

    // Вызываем тестируемую функцию
    const result = await getTypes();

    // Проверяем, что функция корректно обрабатывает случай с пустой БД
    expect(result).toEqual([]);
  });

  it('бросает ошибку при проблеме с БД', async () => {
    // Мокаем findMany, чтобы он выбросил ошибку (симулируем проблему с БД)
    // mockRejectedValueOnce означает, что функция вернёт Promise, который реджектится с ошибкой
    mockedPrisma.findMany.mockRejectedValueOnce(new Error('DB error'));

    // Проверяем, что функция правильно пробрасывает ошибку БД наверх
    // expect().rejects.toThrow() проверяет, что функция выбросила ошибку с нужным сообщением
    await expect(getTypes()).rejects.toThrow('DB error');
  });
});
