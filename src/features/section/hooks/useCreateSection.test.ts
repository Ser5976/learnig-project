import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createSection } from '../api/mutations';
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { useCreateSection } from './useCreateSection';
import { toast } from 'react-toastify';
import { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Определяем типы  данных для тестов (должны соответствовать реальным типам приложения)
type SectionMockResponseType = {
  id: string;
  name: string;
};

type SectionTestInputType = {
  name: string;
};

/**
 * Мокируем внешние зависимости:
 * 1. API функции - чтобы не делать реальные запросы
 * 2. Toast - чтобы проверять вызовы уведомлений
 */
jest.mock('../api/mutations'); // Мокаем API функцию
jest.mock('react-toastify'); // Мокаем toast-уведомления

//Основной блок тестов
describe('UseCraeteSection', () => {
  // Создаем QueryClient для тестов
  let queryClient: QueryClient;

  // Мок функции для закрытия модального окна
  const mockSetIsOpen = jest.fn();

  // Мокаем функцию updateSection
  const mockCreateSection = createSection as jest.MockedFunction<
    typeof createSection
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
   * При успешном создании секции должно:
   * 1. Инвалидировать кэш с ключом 'sections'
   * 2. Показать успешное уведомление
   * 3. Закрыть модальное окно (setIsOpen(false))
   */
  it('обрабатывает успешное обновление секции', async () => {
    // Подготавливаем тестовые данные
    const sectionMockResponse: SectionMockResponseType = {
      id: '1',
      name: 'Created Section',
    };
    const sectionTestInput: SectionTestInputType = {
      name: 'Craeted Section',
    };

    // Настраиваем мок API функции для успешного ответа
    mockCreateSection.mockResolvedValue(sectionMockResponse);

    // Рендерим хук в провайдере
    const { result } = renderHook(() => useCreateSection(mockSetIsOpen), {
      wrapper,
    });

    // Вызываем мутацию
    result.current.mutate(sectionTestInput);

    // Ожидаем завершения мутации
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Проверяем что API функция была вызвана с правильными параметрами
    expect(mockCreateSection).toHaveBeenCalledWith(sectionTestInput);

    // Проверяем уведомление об успехе
    expect(toast.success).toHaveBeenCalledWith('Секция успешно создана');

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
    mockCreateSection.mockRejectedValue(mockError);

    // Рендерим хук в провайдере
    const { result } = renderHook(() => useCreateSection(mockSetIsOpen), {
      wrapper,
    });

    // Вызываем мутацию
    result.current.mutate({ name: 'Craeted Section' });
    // Ожидаем завершения мутации с ошибкой
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Проверяем что показано сообщение об ошибке
    expect(toast.error).toHaveBeenCalledWith(testMessage);

    // Проверяем что модалка не закрылась при ошибке
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
    mockCreateSection.mockRejectedValue(mockError);

    // Рендерим хук в провайдере
    const { result } = renderHook(() => useCreateSection(mockSetIsOpen), {
      wrapper,
    });

    // Вызываем мутацию
    result.current.mutate({ name: 'Craeted Section' });

    // Ожидаем завершения мутации с ошибкой
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Проверяем стандартное сообщение об ошибке
    expect(toast.error).toHaveBeenCalledWith('Произошла ошибка');

    // Проверяем что модалка не закрылась при ошибке
    expect(mockSetIsOpen).not.toHaveBeenCalled();
  });

  /**
   * Тест 4: Проверка состояния загрузки
   * Проверяем что хук корректно управляет состоянием загрузки
   */

  it('корректно управляет состоянием загрузки', async () => {
    // Создаем промис, который не разрешается сразу
    let resolvePromise: (value: SectionMockResponseType) => void;
    const pendingPromise = new Promise<SectionMockResponseType>((resolve) => {
      resolvePromise = resolve;
    });
    // Настраиваем мок API функции для ожидания
    mockCreateSection.mockReturnValue(pendingPromise);

    // Рендерим хук в провайдере
    const { result } = renderHook(() => useCreateSection(mockSetIsOpen), {
      wrapper,
    });

    // Вызываем мутацию
    result.current.mutate({ name: 'Craeted Section' });

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
    const { result } = renderHook(() => useCreateSection(mockSetIsOpen), {
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
