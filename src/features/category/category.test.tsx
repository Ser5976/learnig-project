import { getCategories } from '@/lib/sahared-data/get-categories';
import { toast } from 'react-toastify';
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from './actions';
import CategoryComponent from './components/category-component';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement } from 'react';

// --- Мокирование зависимостей ---
// Мокируем модуль get-categories, чтобы контролировать данные, получаемые компонентом
jest.mock('@/lib/sahared-data/get-categories');
// Мокируем серверные действия (создание, обновление, удаление)
jest.mock('./actions');
// Мокируем react-toastify для проверки вызова уведомлений без их реального отображения
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(), // Мокируем функцию success
    error: jest.fn(), // Мокируем функцию error
  },
}));

// --- Приведение типов для моков ---
// Приводим замокированные функции к типам jest.Mock для удобства работы и автодополнения
const mockedGetCategories = getCategories as jest.Mock;
const mockedCreateCategory = createCategoryAction as jest.Mock;
const mockedUpdateCategory = updateCategoryAction as jest.Mock;
const mockedDeleteCategory = deleteCategoryAction as jest.Mock;
const mockedToast = toast as jest.Mocked<typeof toast>;

// --- Тестовые данные ---
// Создаем набор данных, который будет использоваться в тестах
const mockData = [
  { id: '1', name: 'Категория A' },
  { id: '2', name: 'Категория  B' },
];

const apiError = new Error('Что-то пошло не так');

// --- Основной блок тестов для CategoryComponent ---
describe('CategoryComponent', () => {
  // Хук, который выполняется перед каждым тестом в этом блоке
  beforeEach(() => {
    // Очищаем все моки от предыдущих вызовов, чтобы тесты были изолированы
    jest.clearAllMocks();
    // Устанавливаем базовый успешный ответ для getCategories, который будет использоваться по умолчанию
    mockedGetCategories.mockResolvedValue(mockData);
  });
  // --- Хелпер для рендеринга асинхронного компонента ---
  // Так как TypeComponent - это асинхронный серверный компонент, его нужно сначала "дождаться"
  const renderComponent = async () => {
    const jsx = await CategoryComponent(); // Получаем JSX от асинхронного компонента
    return render(jsx); // Рендерим полученный JSX в тестовый DOM
  };
  // --- Тесты на отображение компонента ---
  it('должен отображать список категорий при успешной загрузке', async () => {
    // Шаг 1: Рендерим компонент
    await renderComponent();
    // Шаг 2: Проверяем, что элементы с текстом 'Категория A' и 'Категория B' присутствуют в документе
    expect(screen.getByText('Категория A')).toBeInTheDocument();
    expect(screen.getByText('Категория B')).toBeInTheDocument();
  });
  it('должен показывать сообщение "Данных нет", если список пуст', async () => {
    // Шаг 1: Мокируем ответ от getCategory, чтобы он возвращал пустой массив
    mockedGetCategories.mockResolvedValue([]);
    // Шаг 2: Рендерим компонент
    await renderComponent();
    // Шаг 3: Проверяем, что на экране появилось сообщение "Данных нет"
    expect(screen.getByText(/Данных нет/i)).toBeInTheDocument();
  });
  it('должен показывать сообщение об ошибке при сбое загрузки', async () => {
    // Шаг 1: Мокируем ответ от getTypes, чтобы он возвращал null (имитация ошибки)
    mockedGetCategories.mockResolvedValue(undefined);
    // Шаг 2: Рендерим компонент
    await renderComponent();
    // Шаг 3: Проверяем, что на экране появилось сообщение об ошибке
    expect(screen.getByText(/Что пошло не так/i)).toBeInTheDocument();
  });
  // --- Блок тестов для CRUD-операций ---
  describe('CRUD операции', () => {
    // --- Успешные сценарии ---
    it('должен создавать новую категорию и отображать его в списке', async () => {
      const { rerender } = await renderComponent();
      const user = userEvent.setup();
      //находим кнопку создать категорию и кликаем по ней
      await user.click(
        screen.getByRole('button', { name: /Создать категорию/i })
      );

      // проверяем,что открылось модальное окно
      const createModal = await screen.getByRole('heading', {
        name: 'Создать новую категорию',
      });
      expect(createModal).toBeVisible();
      // находим инпут и вводим название категории
      const input = await screen.findByLabelText(/Название категории/i);
      await user.type(input, 'Новая категория');
      //Мокируем успешный ответ от `createCategory` и обновленный список от `getCategories`.
      mockedCreateCategory.mockResolvedValue({});
      mockedGetCategories.mockResolvedValueOnce([
        ...mockData,
        { id: '3', name: 'Новая категория' },
      ]);
      // находим кнопку создать и кликаем
      await user.click(screen.getByRole('button', { name: 'Создать' }));
      // проверяем закрылось ли модальное окно
      expect(createModal).not.toBeVisible();
      // проверяем сработал ли toast
      await waitFor(() => {
        expect(mockedToast.success).toHaveBeenCalledWith(
          'Категория успешно создана'
        );
      });
      // рендерим повторно компонент
      const updatedJsx = await CategoryComponent();
      rerender(updatedJsx as ReactElement);
      // проверяем появилась ли новая категория
      expect(screen.getByText('Новая категория')).toBeInTheDocument();
    });
    it('должен обновлять существующую категорию', async () => {
      const { rerender } = await renderComponent();
      const user = userEvent.setup();

      const CategoryCards = screen.getAllByTestId('category-card');
      const firstCategoryCard = CategoryCards[0];

      const editButton = within(firstCategoryCard).getByRole('button', {
        name: /Редактировать категорию/i,
      });
      await user.click(editButton);
      const createModal = await screen.getByRole('heading', {
        name: 'Updating the category',
      });
      expect(createModal).toBeVisible();

      const input = await screen.findByLabelText(/Название категории/i);
      await user.clear(input);
      await user.type(input, 'Обновлённая категория');

      mockedUpdateCategory.mockResolvedValue({});
      mockedGetCategories.mockResolvedValueOnce([
        { id: '1', name: 'Обновлённая категория' },
        mockData[1],
      ]);

      await user.click(screen.getByRole('button', { name: 'Обновить' }));

      expect(createModal).not.toBeVisible();

      await waitFor(() => {
        expect(mockedToast.success).toHaveBeenCalledWith(
          'Категория успешно обновлена'
        );
      });

      const updatedJsx = await CategoryComponent();
      rerender(updatedJsx as ReactElement);

      expect(screen.getByText('Обновлённая категория')).toBeInTheDocument();
    });
    it('должен удалять категорию и убирать её из списка', async () => {
      const { rerender } = await renderComponent();
      const user = userEvent.setup();

      const CategoryCards = screen.getAllByTestId('category-card');
      const deletedCategoryCard = CategoryCards[1];

      const deleteButton = within(deletedCategoryCard).getByRole('button', {
        name: /Удалить категорию/i,
      });

      mockedDeleteCategory.mockResolvedValue({});
      mockedGetCategories.mockResolvedValueOnce([mockData[0]]);

      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockedToast.success).toHaveBeenCalledWith(
          'Категория успешно удалена'
        );
      });

      const updatedJsx = await CategoryComponent();
      rerender(updatedJsx as ReactElement);

      expect(screen.queryByText('Категория B')).not.toBeInTheDocument();
    });
    // --- Сценарии с ошибками ---
    it('должен показывать ошибку, если создание категории не удалось', async () => {
      await renderComponent();
      const user = userEvent.setup();

      await user.click(
        screen.getByRole('button', { name: /Создать категорию/i })
      );
      const input = await screen.findByLabelText(/Название категории/i);
      await user.type(input, 'Новая категория');

      // Мокируем ошибку от серверного действия
      mockedCreateCategory.mockRejectedValue(apiError);

      await user.click(screen.getByRole('button', { name: 'Создать' }));

      // Проверяем, что было вызвано уведомление об ошибке
      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith(apiError.message);
      });
    });
    it('должен показывать ошибку, если обновление категории не удалось', async () => {
      await renderComponent();
      const user = userEvent.setup();

      const categoryCards = screen.getAllByTestId('category-card');
      const firstCategoryCard = categoryCards[0];

      const editButton = within(firstCategoryCard).getByRole('button', {
        name: /Редактировать категорию/i,
      });
      await user.click(editButton);

      const input = await screen.findByLabelText(/Название категории/i);
      await user.clear(input);
      await user.type(input, 'Обновлённая категория');

      // Мокируем ошибку от серверного действия
      mockedUpdateCategory.mockRejectedValue(apiError);

      await user.click(screen.getByRole('button', { name: 'Обновить' }));

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith(apiError.message);
      });
    });
    it('должен показывать ошибку, если удаление категории не удалось', async () => {
      await renderComponent();
      const user = userEvent.setup();

      const categoryCards = screen.getAllByTestId('category-card');
      const deleteCategoryCard = categoryCards[1];

      const deleteButton = within(deleteCategoryCard).getByRole('button', {
        name: /Удалить категорию/i,
      });

      // Мокируем ошибку от серверного действия
      mockedDeleteCategory.mockRejectedValue(apiError);

      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith(apiError.message);
      });
    });
  });
});
