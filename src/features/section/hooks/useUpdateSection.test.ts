/**
 * Тестирование хука useUpdateSection
 *
 * Этот тест проверяет:
 * 1. Корректность работы с React Query
 * 2. Обработку успешных и неудачных запросов
 * 3. Побочные эффекты (уведомления, инвалидация кэша)
 * 4. Состояние модального окна
 */

// Базовые импорты для тестирования React-хуков
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';

// Импорт React Query провайдеров
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Импорт тестируемого хука
import { useUpdateSection } from './useUpdateSection';

// Импорт API функции, которую будем мокать
import { updateSection } from '../api/mutations';

// Импорт типа ошибки Axios
import { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Импорт библиотеки для toast-уведомлений
import { toast } from 'react-toastify';

// Определяем типы для тестов (должны соответствовать реальным типам приложения)
type Section = {
  id: string;
  name: string;
};

type UpdateSectionInput = {
  id: string;
  name: string;
};

/**
 * Мокируем внешние зависимости:
 * 1. API функции - чтобы не делать реальные запросы
 * 2. Toast - чтобы проверять вызовы уведомлений
 */
jest.mock('../api/mutations'); // Мокаем API функцию
jest.mock('react-toastify'); // Мокаем toast-уведомления

// Основной блок тестов
describe('useUpdateSection', () => {
  // Создаем QueryClient для тестов
  let queryClient: QueryClient;

  // Мок функции для закрытия модального окна
  const mockSetIsOpen = jest.fn();

  // Мокаем функцию updateSection
  const mockUpdateSection = updateSection as jest.MockedFunction<
    typeof updateSection
  >;

  // Компонент-обертка для провайдера
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };

  // Действия перед каждым тестом
  beforeEach(() => {
    // Очищаем все моки перед каждым тестом
    jest.clearAllMocks();

    // Создаем новый QueryClient для каждого теста
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Отключаем повторные попытки для тестов
        },
        mutations: {
          retry: false, // Отключаем повторные попытки для тестов
        },
      },
    });
  });

  /**
   * Тест 1: Проверка успешного сценария
   * При успешном обновлении секции должно:
   * 1. Инвалидировать кэш с ключом 'sections'
   * 2. Показать успешное уведомление
   * 3. Закрыть модальное окно (setIsOpen(false))
   */
  it('обрабатывает успешное обновление секции', async () => {
    // Подготавливаем тестовые данные
    const mockData: Section = { id: '1', name: 'Updated Section' };
    const mockVariables: UpdateSectionInput = {
      id: '1',
      name: 'Updated Section',
    };

    // Настраиваем мок API функции для успешного ответа
    mockUpdateSection.mockResolvedValue(mockData);

    // Рендерим хук в провайдере
    const { result } = renderHook(() => useUpdateSection(mockSetIsOpen), {
      wrapper,
    });

    // Вызываем мутацию
    result.current.mutate(mockVariables);

    // Ожидаем завершения мутации
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Проверяем что API функция была вызвана с правильными параметрами
    expect(mockUpdateSection).toHaveBeenCalledWith(mockVariables);

    // Проверяем уведомление об успехе
    expect(toast.success).toHaveBeenCalledWith('Секция успешно обновлена');

    // Проверяем закрытие модалки
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);

    // Проверяем что кэш был инвалидирован
    const queries = queryClient.getQueryCache().getAll();
    expect(queries).toHaveLength(0); // Кэш должен быть очищен
  });

  /**
   * Тест 2: Обработка ошибки с сообщением
   * При ошибке с сообщением должно:
   * 1. Показать уведомление с текстом ошибки
   */
  it('обрабатывает ошибку с сообщением от сервера', async () => {
    // Подготавливаем тестовую ошибку
    const testMessage = 'Ошибка валидации';
    const mockError = new AxiosError(testMessage, '400', undefined, undefined, {
      status: 400,
      statusText: 'Bad Request',
      data: { message: testMessage },
      headers: {},
      config: { headers: {} } as InternalAxiosRequestConfig,
    });

    // Настраиваем мок API функции для ошибки
    mockUpdateSection.mockRejectedValue(mockError);

    // Рендерим хук в провайдере
    const { result } = renderHook(() => useUpdateSection(mockSetIsOpen), {
      wrapper,
    });

    // Вызываем мутацию
    result.current.mutate({ id: '1', name: 'Test' });

    // Ожидаем завершения мутации с ошибкой
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Проверяем что показано сообщение об ошибке
    expect(toast.error).toHaveBeenCalledWith(testMessage);

    // Проверяем что модалка НЕ закрылась при ошибке
    expect(mockSetIsOpen).not.toHaveBeenCalled();
  });

  /**
   * Тест 3: Обработка ошибки без сообщения
   * При неизвестной ошибке должно:
   * 1. Показать стандартное сообщение об ошибке
   */
  it('обрабатывает неизвестную ошибку', async () => {
    // Создаем ошибку без специфического сообщения
    const mockError = new Error('Network error');

    // Настраиваем мок API функции для ошибки
    mockUpdateSection.mockRejectedValue(mockError);

    // Рендерим хук в провайдере
    const { result } = renderHook(() => useUpdateSection(mockSetIsOpen), {
      wrapper,
    });

    // Вызываем мутацию
    result.current.mutate({ id: '1', name: 'Test' });

    // Ожидаем завершения мутации с ошибкой
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Проверяем стандартное сообщение об ошибке
    expect(toast.error).toHaveBeenCalledWith('Произошла ошибка');

    // Проверяем что модалка НЕ закрылась при ошибке
    expect(mockSetIsOpen).not.toHaveBeenCalled();
  });

  /**
   * Тест 4: Проверка состояния загрузки
   * Проверяем что хук корректно управляет состоянием загрузки
   */
  it('корректно управляет состоянием загрузки', async () => {
    // Создаем промис, который не разрешается сразу
    let resolvePromise: (value: Section) => void;
    const pendingPromise = new Promise<Section>((resolve) => {
      resolvePromise = resolve;
    });

    // Настраиваем мок API функции для ожидания
    mockUpdateSection.mockReturnValue(pendingPromise);

    // Рендерим хук в провайдере
    const { result } = renderHook(() => useUpdateSection(mockSetIsOpen), {
      wrapper,
    });

    // Вызываем мутацию
    result.current.mutate({ id: '1', name: 'Test' });

    // Ожидаем что состояние загрузки стало активным
    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    // Разрешаем промис
    resolvePromise!({ id: '1', name: 'Test' });

    // Ожидаем завершения мутации
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Проверяем что состояние загрузки завершилось
    expect(result.current.isPending).toBe(false);
  });

  /**
   * Тест 5: Проверка возвращаемых свойств
   * Хук должен вернуть объект с необходимыми свойствами
   */
  it('предоставляет необходимые свойства', () => {
    // Рендерим хук в провайдере
    const { result } = renderHook(() => useUpdateSection(mockSetIsOpen), {
      wrapper,
    });

    // Проверяем что функция mutate определена
    expect(result.current.mutate).toBeDefined();
    expect(typeof result.current.mutate).toBe('function');

    // Проверяем состояния
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);

    // Проверяем данные
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });
});
