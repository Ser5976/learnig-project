import { getSections } from '@/lib/sahared-data/get-sections';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import TestComponentClient from './test-component-client';

// 1.Мокируем функцию получения данных, чтобы избежать проблем с кешем react-query.
jest.mock('@/lib/sahared-data/get-sections');
// 2. Создаем типизированную версию мока для удобства работы в тестах.
const mockedGetSections = getSections as jest.Mock;
// 3. Функция-обертка для рендера компонента с QueryClient.
// Это необходимо, так как компонент использует хуки из react-query.
const renderWithClient = (ui: React.ReactElement) => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Отключаем повторные попытки для тестов
        gcTime: 0, // Убираем кеширование
      },
    },
  });
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
};

// 4. Подготовка тестовых данных.
const mockData = [
  { id: '1', name: 'Секция из мока 1' },
  { id: '2', name: 'Секция из мока 2' },
];

describe('TestComponentClient', () => {
  // Очищаем все моки перед каждым тестом и устанавливаем базовый успешный ответ для getSections.
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('должен отображать список секций при успешной загрузке', async () => {
    mockedGetSections.mockResolvedValue(mockData);
    // ARRANGE (Подготовка): Рендерим компонент. `getSections` уже замокан в `beforeEach`.
    renderWithClient(<TestComponentClient />);

    // ASSERT (Проверка): Убеждаемся, что оба элемента из моковых данных отображаются на странице.
    expect(await screen.findByText('Секция из мока 1')).toBeInTheDocument();
    expect(await screen.findByText('Секция из мока 2')).toBeInTheDocument();
  });
  it('должен отображать "Данных нет", если список пуст', async () => {
    // ARRANGE (Подготовка): Переопределяем мок `getSections`, чтобы он возвращал пустой массив.
    mockedGetSections.mockResolvedValue([]);

    // ACT (Действие): Рендерим компонент.
    renderWithClient(<TestComponentClient />);

    // ASSERT (Проверка): Ожидаем увидеть сообщение о том, что данных нет.
    expect(await screen.findByText('Данных нет')).toBeInTheDocument();
  });
  it('должен отображать ошибку, если загрузка секций не удалась', async () => {
    // ARRANGE (Подготовка): Мокируем `getSections` так, чтобы он возвращал ошибку.
    mockedGetSections.mockRejectedValue(new Error('Async error'));

    // ACT (Действие): Рендерим компонент.
    renderWithClient(<TestComponentClient />);

    // ASSERT (Проверка): Ожидаем увидеть сообщение об ошибке.
    expect(await screen.findByText(/Что пошло не так/i)).toBeInTheDocument();
  });
});
