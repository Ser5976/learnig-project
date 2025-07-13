import axios from 'axios';
import { getSections } from './get-sections';
import { Section } from '@prisma/client';

// Мокаем axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getSection', () => {
  // Очищаем моки после каждого теста
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('We return an array of section when the response in successful', async () => {
    // Мокаем ответ сервера
    const mockSections: Section[] = [
      { id: '1', name: 'секция 1' },
      { id: '2', name: 'секция 2' },
    ];
    // Мокаем успешный ответ axios
    mockedAxios.get.mockResolvedValue({
      data: mockSections,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });
    // Вызываем тестируемую функцию
    const result = await getSections();
    // Проверяем результаты
    expect(result).toEqual(mockSections);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/sections');
  });

  // тест на ошибку
  it('should handle API errors', async () => {
    mockedAxios.get.mockResolvedValue(new Error());
    const result = await getSections();
    expect(result).toBeUndefined();
  });

  // тест на получение пустого массива
  it('should return empty array when API', async () => {
    mockedAxios.get.mockResolvedValue({
      data: [],
      status: '200',
      statusText: 'OK',
      headers: {},
      config: {},
    });

    const result = await getSections();
    expect(result).toEqual([]);
  });
});
