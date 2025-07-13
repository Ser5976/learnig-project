import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { deleteSection } from '../api/mutations';
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { useDeleteSection } from './useDeleteSection';
import { toast } from 'react-toastify';
import { AxiosError, InternalAxiosRequestConfig } from 'axios';
// Определяем типы  данных для тестов (должны соответствовать реальным типам приложения)

/**
 * Мокируем внешние зависимости:
 * 1. API функции - чтобы не делать реальные запросы
 * 2. Toast - чтобы проверять вызовы уведомлений
 */
jest.mock('../api/mutations'); // Мокаем API функцию
jest.mock('react-toastify'); // Мокаем toast-уведомления

//Основной блок тестов
describe('UseDeleteSection', () => {
  // Создаем QueryClient для тестов
  let queryClient: QueryClient;

  // Подготавливаем тестовые данные

  const sectionTestId = '123e4567-e89b-12d3-a456-426614174000';

  // Мокаем функцию deleteSection
  const mockDeleteSection = deleteSection as jest.MockedFunction<
    typeof deleteSection
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
   * При успешном удалении секции должно:
   * 1. Инвалидировать кэш с ключом 'sections'
   * 2. Показать успешное уведомление
   */
  it('обрабатывает успешное удаление секции', async () => {
    // Настраиваем мок API функции для успешного ответа
    mockDeleteSection.mockResolvedValue();
    // Рендерим хук в провайдере
    const { result } = renderHook(() => useDeleteSection(), {
      wrapper,
    });
    // Вызываем мутацию
    result.current.mutate(sectionTestId);
    // Ожидаем завершения мутации
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    // Проверяем что API функция была вызвана с правильными параметрами
    expect(mockDeleteSection).toHaveBeenCalledWith(sectionTestId);

    // Проверяем уведомление об успехе
    expect(toast.success).toHaveBeenCalledWith('Секция успешно удалена');
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
    mockDeleteSection.mockRejectedValue(mockError);

    // Рендерим хук в провайдере
    const { result } = renderHook(() => useDeleteSection(), {
      wrapper,
    });

    // Вызываем мутацию
    result.current.mutate(sectionTestId);

    // Ожидаем завершения мутации с ошибкой
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    // Проверяем что показано сообщение об ошибке
    expect(toast.error).toHaveBeenCalledWith(testMessage);
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
    mockDeleteSection.mockRejectedValue(mockError);

    // Рендерим хук в провайдере
    const { result } = renderHook(() => useDeleteSection(), {
      wrapper,
    });

    // Вызываем мутацию
    result.current.mutate(sectionTestId);

    // Ожидаем завершения мутации с ошибкой
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Проверяем стандартное сообщение об ошибке
    expect(toast.error).toHaveBeenCalledWith('Произошла ошибка');
  });

  /**
   * Тест 4: Проверка состояния загрузки
   * Проверяем что хук корректно управляет состоянием загрузки
   */
  it('корректно управляет состоянием загрузки', async () => {
    // Создаем промис, который не разрешается сразу
    let resolvePromise: () => void;
    const pendingPromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });

    // Настраиваем мок API функции для ожидания
    mockDeleteSection.mockReturnValue(pendingPromise);

    // Рендерим хук в провайдере
    const { result } = renderHook(() => useDeleteSection(), {
      wrapper,
    });

    // Вызываем мутацию
    result.current.mutate(sectionTestId);

    // Ожидаем что состояние загрузки стало активным
    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    // Разрешаем промис
    resolvePromise!();

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
    const { result } = renderHook(() => useDeleteSection(), {
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
