// src/app/section/section.test.tsx
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SectionsPage from './page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getSections } from '@/lib/sahared-data/get-sections';
import '@testing-library/jest-dom';
import { toast } from 'react-toastify';

import {
  createSection,
  deleteSection,
  updateSection,
} from '@/features/section/api/mutations';

// 1. Мокируем зависимости

// Мокируем напрямую модуль с API-функциями.
// Это позволяет изолировать тесты от реальных сетевых запросов и делает их стабильнее.
jest.mock('@/features/section/api/mutations');
// Мокируем функцию получения данных, чтобы избежать проблем с кешем react-query.
jest.mock('@/lib/sahared-data/get-sections');
// Мокируем `react-toastify` для проверки вывода уведомлений.
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// 2. Создаем типизированные версии моков для удобства работы в тестах.
const mockedGetSections = getSections as jest.Mock;
const mockedCreateSection = createSection as jest.Mock;
const mockedUpdateSection = updateSection as jest.Mock;
const mockedDeleteSection = deleteSection as jest.Mock;
const mockedToast = toast as jest.Mocked<typeof toast>;

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
  return {
    user: userEvent.setup(),
    ...render(
      <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
    ),
  };
};

// 4. Подготовка тестовых данных.
const mockData = [
  { id: '1', name: 'Секция из мока 1' },
  { id: '2', name: 'Секция из мока 2' },
];

const apiError = {
  response: { data: { message: 'Ошибка от API' } },
};

// 5. Описание тестового набора для страницы "Секции".
describe('SectionsPage', () => {
  // Очищаем все моки перед каждым тестом и устанавливаем базовый успешный ответ для getSections.
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetSections.mockResolvedValue([...mockData]);
  });

  it('должен отображать список секций при успешной загрузке', async () => {
    // ARRANGE (Подготовка): Рендерим компонент. `getSections` уже замокан в `beforeEach`.
    renderWithClient(<SectionsPage />);

    // ASSERT (Проверка): Убеждаемся, что оба элемента из моковых данных отображаются на странице.
    expect(await screen.findByText('Секция из мока 1')).toBeInTheDocument();
    expect(await screen.findByText('Секция из мока 2')).toBeInTheDocument();
  });

  it('должен отображать "Данных нет", если список пуст', async () => {
    // ARRANGE (Подготовка): Переопределяем мок `getSections`, чтобы он возвращал пустой массив.
    mockedGetSections.mockResolvedValue([]);

    // ACT (Действие): Рендерим компонент.
    renderWithClient(<SectionsPage />);

    // ASSERT (Проверка): Ожидаем увидеть сообщение о том, что данных нет.
    expect(await screen.findByText('Данных нет')).toBeInTheDocument();
  });

  it('должен отображать ошибку, если загрузка секций не удалась', async () => {
    // ARRANGE (Подготовка): Мокируем `getSections` так, чтобы он возвращал ошибку.
    mockedGetSections.mockRejectedValue(new Error('Async error'));

    // ACT (Действие): Рендерим компонент.
    renderWithClient(<SectionsPage />);

    // ASSERT (Проверка): Ожидаем увидеть сообщение об ошибке.
    expect(await screen.findByText(/Что пошло не так/i)).toBeInTheDocument();
  });

  describe('CRUD операции', () => {
    // HAPPY PATHS
    it('должен создавать секцию', async () => {
      // ARRANGE (Подготовка): Рендерим компонент.
      const { user } = renderWithClient(<SectionsPage />);

      // ACT (Действие): Пользователь нажимает кнопку "Создать секцию".
      await user.click(screen.getByRole('button', { name: /Создать секцию/i }));

      // ACT (Действие): Пользователь вводит название новой секции в поле ввода.
      const newSectionName = 'Новая секция';
      await user.type(
        await screen.findByLabelText(/Название/i),
        newSectionName
      );

      // ARRANGE (Подготовка): Мокируем успешный ответ от `createSection` и обновленный список от `getSections`.
      const createdSection = { id: '3', name: newSectionName };
      mockedCreateSection.mockResolvedValue(createdSection);
      mockedGetSections.mockResolvedValue([...mockData, createdSection]);

      // ACT (Действие): Пользователь нажимает кнопку "Создать" в модальном окне.
      await user.click(screen.getByRole('button', { name: 'Создать' }));

      // ASSERT (Проверка): Новая секция появляется в списке.
      expect(await screen.findByText(newSectionName)).toBeInTheDocument();
      // ASSERT (Проверка): Появляется уведомление об успешном создании.
      expect(mockedToast.success).toHaveBeenCalledWith(
        'Секция успешно создана'
      );
    });

    it('должен редактировать секцию', async () => {
      // ARRANGE (Подготовка): Рендерим компонент.
      const { user } = renderWithClient(<SectionsPage />);
      const sectionToUpdate = mockData[0];
      const updatedName = 'Отредактированная секция';

      // ACT (Действие): Находим нужный элемент списка и нажимаем кнопку "Редактировать".
      const li = (await screen.findByText(sectionToUpdate.name)).closest('li')!;
      await user.click(
        within(li).getByRole('button', { name: /Редактировать/i })
      );

      // ACT (Действие): Очищаем поле ввода и вводим новое название.
      const input = await screen.findByLabelText(/Название/i);
      await user.clear(input);
      await user.type(input, updatedName);

      // ARRANGE (Подготовка): Мокируем успешный ответ от `updateSection` и обновленный список.
      const updatedSection = { ...sectionToUpdate, name: updatedName };
      mockedUpdateSection.mockResolvedValue(updatedSection);
      mockedGetSections.mockResolvedValue([updatedSection, mockData[1]]);

      // ACT (Действие): Нажимаем кнопку "Обновить".
      await user.click(screen.getByRole('button', { name: /Обновить/i }));

      // ASSERT (Проверка): Название секции в списке обновилось.
      expect(await screen.findByText(updatedName)).toBeInTheDocument();
      // ASSERT (Проверка): Появляется уведомление об успешном обновлении.
      expect(mockedToast.success).toHaveBeenCalledWith(
        'Секция успешно обновлена'
      );
    });

    it('должен удалять секцию', async () => {
      // ARRANGE (Подготовка): Рендерим компонент.
      const { user } = renderWithClient(<SectionsPage />);
      const sectionToDelete = mockData[1];

      // ARRANGE (Подготовка): Мокируем `deleteSection`. Внутри мока сразу готовим `getSections`
      // к следующему вызову (refetch), который вернет список уже без удаленного элемента.
      mockedDeleteSection.mockImplementation(async () => {
        mockedGetSections.mockResolvedValue([mockData[0]]);
        return Promise.resolve({});
      });

      // ACT (Действие): Находим нужный элемент и нажимаем "Удалить".
      const li = (await screen.findByText(sectionToDelete.name)).closest('li')!;
      await user.click(within(li).getByRole('button', { name: /Удалить/i }));

      // ACT (Действие): В диалоговом окне подтверждаем удаление.
      const dialog = await screen.findByRole('alertdialog');
      await user.click(
        within(dialog).getByRole('button', { name: /Удалить/i })
      );

      // ASSERT (Проверка): Ждем, пока элемент не исчезнет из DOM.
      // Используем waitFor, так как он более устойчив к "гонкам состояний",
      // когда элемент может быть удален до того, как начнется ожидание.
      await waitFor(() => {
        expect(
          screen.queryByText(sectionToDelete.name)
        ).not.toBeInTheDocument();
      });

      // ASSERT (Проверка): Появляется уведомление об успешном удалении.
      expect(mockedToast.success).toHaveBeenCalledWith(
        'Секция успешно удалена'
      );
    });

    // ERROR PATHS
    it('должен показывать ошибку при сбое создания', async () => {
      // ARRANGE (Подготовка): Рендерим компонент.
      const { user } = renderWithClient(<SectionsPage />);
      
      // ACT (Действие): Открываем модальное окно и вводим данные.
      await user.click(screen.getByRole('button', { name: /Создать секцию/i }));
      await user.type(await screen.findByLabelText(/Название/i), 'test');

      // ARRANGE (Подготовка): Мокируем `createSection` так, чтобы он возвращал ошибку.
      mockedCreateSection.mockRejectedValue(apiError);

      // ACT (Действие): Нажимаем "Создать".
      await user.click(screen.getByRole('button', { name: 'Создать' }));

      // ASSERT (Проверка): Ожидаем появления уведомления об ошибке с текстом из API.
      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith(
          apiError.response.data.message
        );
      });
    });

    it('должен показывать ошибку при сбое редактирования', async () => {
      // ARRANGE (Подготовка): Рендерим компонент.
      const { user } = renderWithClient(<SectionsPage />);
      
      // ACT (Действие): Открываем модальное окно редактирования и вводим данные.
      const li = (await screen.findByText(mockData[0].name)).closest('li')!;
      await user.click(
        within(li).getByRole('button', { name: /Редактировать/i })
      );
      const input = await screen.findByLabelText(/Название/i);
      await user.clear(input);
      await user.type(input, 'new name');

      // ARRANGE (Подготовка): Мокируем `updateSection` так, чтобы он возвращал ошибку.
      mockedUpdateSection.mockRejectedValue(apiError);

      // ACT (Действие): Нажимаем "Обновить".
      await user.click(screen.getByRole('button', { name: /Обновить/i }));

      // ASSERT (Проверка): Ожидаем появления уведомления об ошибке.
      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith(
          apiError.response.data.message
        );
      });
    });

    it('должен показывать ошибку при сбое удаления', async () => {
      // ARRANGE (Подготовка): Рендерим компонент.
      const { user } = renderWithClient(<SectionsPage />);
      
      // ACT (Действие): Открываем диалоговое окно удаления.
      const li = (await screen.findByText(mockData[1].name)).closest('li')!;
      await user.click(within(li).getByRole('button', { name: /Удалить/i }));

      // ARRANGE (Подготовка): Мокируем `deleteSection` так, чтобы он возвращал ошибку.
      const dialog = await screen.findByRole('alertdialog');
      mockedDeleteSection.mockRejectedValue(apiError);

      // ACT (Действие): Подтверждаем удаление.
      await user.click(
        within(dialog).getByRole('button', { name: /Удалить/i })
      );

      // ASSERT (Проверка): Ожидаем появления уведомления об ошибке.
      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith(
          apiError.response.data.message
        );
      });
    });
  });
});