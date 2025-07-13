import { getTypes } from './get_types';
import { Type } from '@prisma/client';

// Расширяем глобальный тип для мока fetch
declare const global: typeof globalThis & { fetch: jest.Mock };

describe('getTypes', () => {
  // Сбрасываем моки после каждого теста
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('возвращает массив типов при успешном ответе', async () => {
    // Мокаем ответ сервера
    const mockTypes: Type[] = [
      { id: '1', name: 'Тип 1' },
      { id: '2', name: 'Тип 2' },
    ];
    // Мокаем глобальный fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockTypes,
    });
    // Вызываем тестируемую функцию
    const result = await getTypes();
    // Проверяем результаты
    expect(result).toEqual(mockTypes);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('возвращает undefined при ошибке ответа', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => [],
    });

    const result = await getTypes();
    expect(result).toBeUndefined();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('корректно обрабатывает пустой массив', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const result = await getTypes();
    expect(result).toEqual([]);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
