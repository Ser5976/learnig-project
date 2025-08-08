// Импортируем необходимые утилиты из @testing-library для рендеринга и взаимодействия с DOM
import { render, screen, waitFor, within } from '@testing-library/react';
// Импортируем userEvent для симуляции действий пользователя
import userEvent from '@testing-library/user-event';
// Импортируем тестируемый компонент
import TypeComponent from './components/type-component';
// Импортируем функцию для получения данных, которую будем мокировать
import { getTypes } from '@/lib/sahared-data/get_types';
// Импортируем серверные действия, которые также будем мокировать
import {
  createTypeAction,
  deleteTypeAction,
  updateTypeAction,
} from './actions';
// Импортируем toast для проверки уведомлений
import { toast } from 'react-toastify';
// Импортируем ReactElement для корректной типизации при перерисовке
import { ReactElement } from 'react';

// --- Мокирование зависимостей ---
// Мокируем модуль get_types, чтобы контролировать данные, получаемые компонентом
jest.mock('@/lib/sahared-data/get_types');
// Мокируем серверные действия (создание, обновление, удаление)
jest.mock('@/features/type/actions');
// Мокируем react-toastify для проверки вызова уведомлений без их реального отображения
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(), // Мокируем функцию success
    error: jest.fn(), // Мокируем функцию error
  },
}));

// --- Приведение типов для моков ---
// Приводим замокированные функции к типам jest.Mock для удобства работы и автодополнения
const mockedGetTypes = getTypes as jest.Mock;
const mockedCreateType = createTypeAction as jest.Mock;
const mockedUpdateType = updateTypeAction as jest.Mock;
const mockedDeleteType = deleteTypeAction as jest.Mock;
const mockedToast = toast as jest.Mocked<typeof toast>;

// --- Тестовые данные ---
// Создаем набор данных, который будет использоваться в тестах
const mockData = [
  { id: '1', name: 'Тип A' },
  { id: '2', name: 'Тип B' },
];
const apiError = new Error('Что-то пошло не так');

// --- Основной блок тестов для TypeComponent ---
describe('TypeComponent', () => {
  // Хук, который выполняется перед каждым тестом в этом блоке
  beforeEach(() => {
    // Очищаем все моки от предыдущих вызовов, чтобы тесты были изолированы
    jest.clearAllMocks();
    // Устанавливаем базовый успешный ответ для getTypes, который будет использоваться по умолчанию
    mockedGetTypes.mockResolvedValue([...mockData]);
  });

  // --- Хелпер для рендеринга асинхронного компонента ---
  // Так как TypeComponent - это асинхронный серверный компонент, его нужно сначала "дождаться"
  const renderComponent = async () => {
    const jsx = await TypeComponent(); // Получаем JSX от асинхронного компонента
    return render(jsx); // Рендерим полученный JSX в тестовый DOM
  };

  // --- Тесты на отображение компонента ---
  it('должен отображать список типов при успешной загрузке', async () => {
    // Шаг 1: Рендерим компонент
    await renderComponent();
    // Шаг 2: Проверяем, что элементы с текстом 'Тип A' и 'Тип B' присутствуют в документе
    expect(screen.getByText('Тип A')).toBeInTheDocument();
    expect(screen.getByText('Тип B')).toBeInTheDocument();
  });

  it('должен показывать сообщение "Данных нет", если список пуст', async () => {
    // Шаг 1: Мокируем ответ от getTypes, чтобы он возвращал пустой массив
    mockedGetTypes.mockResolvedValue([]);
    // Шаг 2: Рендерим компонент
    await renderComponent();
    // Шаг 3: Проверяем, что на экране появилось сообщение "Данных нет"
    expect(screen.getByText(/Данных нет/i)).toBeInTheDocument();
  });

  it('должен показывать сообщение об ошибке при сбое загрузки', async () => {
    // Шаг 1: Мокируем ответ от getTypes, чтобы он возвращал null (имитация ошибки)
    mockedGetTypes.mockResolvedValue(null);
    // Шаг 2: Рендерим компонент
    await renderComponent();
    // Шаг 3: Проверяем, что на экране появилось сообщение об ошибке
    expect(screen.getByText(/Что пошло не так/i)).toBeInTheDocument();
  });

  // --- Блок тестов для CRUD-операций ---
  describe('CRUD операции', () => {
    // --- Успешные сценарии ---
    it('должен создавать новый тип и отображать его в списке', async () => {
      const { rerender } = await renderComponent();
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /Создать тип/i }));

      const input = await screen.findByLabelText(/Название типа/i);
      await user.type(input, 'Новый тип');

      mockedCreateType.mockResolvedValue({});
      mockedGetTypes.mockResolvedValueOnce([
        ...mockData,
        { id: '3', name: 'Новый тип' },
      ]);

      await user.click(screen.getByRole('button', { name: 'Создать' }));

      await waitFor(() => {
        expect(mockedToast.success).toHaveBeenCalledWith('Тип успешно создан');
      });

      const updatedJsx = await TypeComponent();
      rerender(updatedJsx as ReactElement);

      expect(screen.getByText('Новый тип')).toBeInTheDocument();
    });

    it('должен обновлять существующий тип', async () => {
      const { rerender } = await renderComponent();
      const user = userEvent.setup();

      const typeCards = screen.getAllByTestId('type-card');
      const firstTypeCard = typeCards[0];

      const editButton = within(firstTypeCard).getByRole('button', {
        name: /Редактировать тип/i,
      });
      await user.click(editButton);

      const input = await screen.findByLabelText(/Название типа/i);
      await user.clear(input);
      await user.type(input, 'Обновлённый тип');

      mockedUpdateType.mockResolvedValue({});
      mockedGetTypes.mockResolvedValueOnce([
        { id: '1', name: 'Обновлённый тип' },
        mockData[1],
      ]);

      await user.click(screen.getByRole('button', { name: 'Обновить' }));

      await waitFor(() => {
        expect(mockedToast.success).toHaveBeenCalledWith(
          'Тип успешно обновлен'
        );
      });

      const updatedJsx = await TypeComponent();
      rerender(updatedJsx as ReactElement);

      expect(screen.getByText('Обновлённый тип')).toBeInTheDocument();
    });

    it('должен удалять тип и убирать его из списка', async () => {
      const { rerender } = await renderComponent();
      const user = userEvent.setup();

      const typeCards = screen.getAllByTestId('type-card');
      const lastTypeCard = typeCards[1];

      const deleteButton = within(lastTypeCard).getByRole('button', {
        name: /Удалить тип/i,
      });

      mockedDeleteType.mockResolvedValue({});
      mockedGetTypes.mockResolvedValueOnce([mockData[0]]);

      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockedToast.success).toHaveBeenCalledWith('Тип успешно удален');
      });

      const updatedJsx = await TypeComponent();
      rerender(updatedJsx as ReactElement);

      expect(screen.queryByText('Тип B')).not.toBeInTheDocument();
    });

    // --- Сценарии с ошибками ---
    it('должен показывать ошибку, если создание типа не удалось', async () => {
      await renderComponent();
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /Создать тип/i }));
      const input = await screen.findByLabelText(/Название типа/i);
      await user.type(input, 'Новый тип');

      // Мокируем ошибку от серверного действия
      mockedCreateType.mockRejectedValue(apiError);

      await user.click(screen.getByRole('button', { name: 'Создать' }));

      // Проверяем, что было вызвано уведомление об ошибке
      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith(apiError.message);
      });
    });

    it('должен показывать ошибку, если обновление типа не удалось', async () => {
      await renderComponent();
      const user = userEvent.setup();

      const typeCards = screen.getAllByTestId('type-card');
      const firstTypeCard = typeCards[0];

      const editButton = within(firstTypeCard).getByRole('button', {
        name: /Редактировать тип/i,
      });
      await user.click(editButton);

      const input = await screen.findByLabelText(/Название типа/i);
      await user.clear(input);
      await user.type(input, 'Обновлённый тип');

      // Мокируем ошибку от серверного действия
      mockedUpdateType.mockRejectedValue(apiError);

      await user.click(screen.getByRole('button', { name: 'Обновить' }));

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith(apiError.message);
      });
    });

    it('должен показывать ошибку, если удаление типа не удалось', async () => {
      await renderComponent();
      const user = userEvent.setup();

      const typeCards = screen.getAllByTestId('type-card');
      const lastTypeCard = typeCards[1];

      const deleteButton = within(lastTypeCard).getByRole('button', {
        name: /Удалить тип/i,
      });

      // Мокируем ошибку от серверного действия
      mockedDeleteType.mockRejectedValue(apiError);

      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith(apiError.message);
      });
    });
  });
});
