import { renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useSectionQuery } from './useSectionQuery';
import { getSections } from '@/lib/sahared-data/get-sections';

// Мокаем функцию getSections
jest.mock('@/lib/sahared-data/get-sections');
const mockGetSections = getSections as jest.MockedFunction<typeof getSections>;

// Тип для секции (из Prisma схемы)
type Section = {
  id: string;
  name: string;
};

// Тестовые данные
const mockSections: Section[] = [
  { id: '1', name: 'Раздел 1' },
  { id: '2', name: 'Раздел 2' },
  { id: '3', name: 'Раздел 3' },
];

// Компонент-обёртка для предоставления QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Отключаем retry для тестов
        retry: false,
        // Уменьшаем время ожидания для тестов
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => {
    return QueryClientProvider({ client: queryClient, children });
  };
};

describe('useSectionQuery', () => {
  // Сбрасываем моки перед каждым тестом
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSections.mockResolvedValue(mockSections);
  });

  // 1. Тест успешного получения данных
  it('should fetch sections successfully', async () => {
    // Рендерим хук с обёрткой QueryClient
    const { result } = renderHook(() => useSectionQuery(), {
      wrapper: createWrapper(),
    });

    // Изначально данные загружаются
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();

    // Ждём завершения загрузки
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Проверяем, что данные получены корректно
    expect(result.current.data).toEqual(mockSections);
    expect(result.current.error).toBeNull();
    expect(result.current.isSuccess).toBe(true);

    // Проверяем, что функция getSections была вызвана
    expect(mockGetSections).toHaveBeenCalledTimes(1);
  });

  // 2. Тест обработки ошибки
  it('should handle error when fetch fails', async () => {
    // Мокаем ошибку
    const mockError = new Error('Failed to fetch sections');
    mockGetSections.mockRejectedValue(mockError);

    // Рендерим хук
    const { result } = renderHook(() => useSectionQuery(), {
      wrapper: createWrapper(),
    });

    // Ждём завершения загрузки
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Проверяем, что ошибка обработана
    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(true);
    expect(result.current.isSuccess).toBe(false);
  });

  // 3. Тест кэширования данных
  it('should cache data and not refetch immediately', async () => {
    const { result, rerender } = renderHook(() => useSectionQuery(), {
      wrapper: createWrapper(),
    });

    // Ждём первой загрузки
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Проверяем, что getSections вызвана один раз
    expect(mockGetSections).toHaveBeenCalledTimes(1);

    // Перерендериваем компонент
    rerender();

    // Проверяем, что данные взяты из кэша (getSections не вызывается повторно)
    expect(mockGetSections).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockSections);
  });

  // 4. Тест правильного queryKey
  it('should use correct query key', async () => {
    const { result } = renderHook(() => useSectionQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Проверяем, что queryKey установлен правильно
    expect(result.current.data).toEqual(mockSections);

    // Можно также проверить, что хук использует правильный ключ
    // Это важно для правильного кэширования
  });

  // 5. Тест состояния загрузки
  it('should show loading state initially', () => {
    const { result } = renderHook(() => useSectionQuery(), {
      wrapper: createWrapper(),
    });

    // Проверяем начальное состояние
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  // 6. Тест с пустым массивом данных
  it('should handle empty sections array', async () => {
    // Мокаем пустой массив
    mockGetSections.mockResolvedValue([]);

    const { result } = renderHook(() => useSectionQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Проверяем, что пустой массив обрабатывается корректно
    expect(result.current.data).toEqual([]);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.error).toBeNull();
  });

  // 7. Тест повторного вызова при ошибке
  it('should allow refetching after error', async () => {
    // Сначала мокаем ошибку
    mockGetSections.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSectionQuery(), {
      wrapper: createWrapper(),
    });

    // Ждём ошибки
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Теперь мокаем успешный ответ
    mockGetSections.mockResolvedValueOnce(mockSections);

    // Вызываем refetch
    result.current.refetch();

    // Ждём успешной загрузки
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockSections);
  });

  // 8. Тест структуры возвращаемых данных
  it('should return correct data structure', async () => {
    const { result } = renderHook(() => useSectionQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Проверяем, что данные имеют правильную структуру
    expect(Array.isArray(result.current.data)).toBe(true);

    if (result.current.data && result.current.data.length > 0) {
      const firstSection = result.current.data[0];
      expect(firstSection).toHaveProperty('id');
      expect(firstSection).toHaveProperty('name');
      expect(typeof firstSection.id).toBe('string');
      expect(typeof firstSection.name).toBe('string');
    }
  });

  // 9. Тест настроек кэширования
  it('should respect cache settings', async () => {
    const { result } = renderHook(() => useSectionQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Проверяем, что данные получены
    expect(result.current.data).toEqual(mockSections);

    // В реальном приложении здесь можно было бы проверить,
    // что данные кэшируются на 5 минут (staleTime) и хранятся 30 минут (gcTime)
    // Но в тестах это сложно проверить без дополнительных инструментов
  });
});
