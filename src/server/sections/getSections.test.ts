import { getSections } from './getSections';
import { prismabd } from '../../../prisma/prismadb';

// Мокаем prismabd, чтобы не трогать реальную БД в тестах
jest.mock('../../../prisma/prismadb', () => ({
  prismabd: {
    section: {
      findMany: jest.fn(),
    },
  },
}));

describe('getSections (server)', () => {
  // Очищаем моки после каждого теста, чтобы тесты не влияли друг на друга
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('возвращает массив секций из БД', async () => {
    // Подготатавливаем тестовые данные - массив секций, которые должны вернуться из БД
    const mockSections = [
      { id: '1', name: 'Section 1' },
      { id: '2', name: 'Section 2' },
    ];

    // Мокаем метод findMany у prismabd.section, чтобы он возвращал наши тестовые данные
    // mockResolvedValueOnce означает, что функция вернёт Promise, который резолвится в mockSections
    (prismabd.section.findMany as jest.Mock).mockResolvedValueOnce(
      mockSections
    );

    // Вызываем тестируемую функцию
    const result = await getSections();

    // Проверяем, что функция вернула именно те данные, которые мы ожидали
    expect(result).toEqual(mockSections);
  });

  it('возвращает пустой массив, если секций нет', async () => {
    // Мокаем findMany, чтобы он вернул пустой массив (ситуация, когда в БД нет секций)
    (prismabd.section.findMany as jest.Mock).mockResolvedValueOnce([]);

    // Вызываем тестируемую функцию
    const result = await getSections();

    // Проверяем, что функция корректно обрабатывает случай с пустой БД
    expect(result).toEqual([]);
  });

  it('бросает ошибку при проблеме с БД', async () => {
    // Мокаем findMany, чтобы он выбросил ошибку (симулируем проблему с БД)
    // mockRejectedValueOnce означает, что функция вернёт Promise, который реджектится с ошибкой
    (prismabd.section.findMany as jest.Mock).mockRejectedValueOnce(
      new Error('DB error')
    );

    // Проверяем, что функция правильно пробрасывает ошибку БД наверх
    // expect().rejects.toThrow() проверяет, что функция выбросила ошибку с нужным сообщением
    await expect(getSections()).rejects.toThrow('DB error');
  });
});
