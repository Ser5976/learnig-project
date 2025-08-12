// --- Мокирование зависимостей ---

import { getTypes } from '@/lib/sahared-data/get_types';
import TestComponentServer from './test-component-server';
import { render, screen } from '@testing-library/react';

// Мокируем модуль get_types, чтобы контролировать данные, получаемые компонентом
jest.mock('@/lib/sahared-data/get_types');
// --- Приведение типов для моков ---
// Приводим замокированную функцию к типам jest.Mock для удобства работы
const mockedGetTypes = getTypes as jest.Mock;
// --- Тестовые данные ---
// Создаем набор данных, который будет использоваться в тестах
const mockData = [
  { id: '1', name: 'Тип A' },
  { id: '2', name: 'Тип B' },
];

describe('TestComponentServe', () => {
  // Хук, который выполняется перед каждым тестом в этом блоке
  beforeEach(() => {
    // Очищаем все моки от предыдущих вызовов, чтобы тесты были изолированы
    jest.clearAllMocks();
  });
  // --- Хелпер для рендеринга асинхронного компонента ---
  // Так как TypeComponentServer - это асинхронный серверный компонент, его нужно сначала "дождаться"
  const renderComponent = async () => {
    const jsx = await TestComponentServer(); // Получаем JSX от асинхронного компонента
    return render(jsx); // Рендерим полученный JSX в тестовый DOM
  };
  // --- Тесты на отображение компонента ---
  it('должен отображать список типов при успешной загрузке', async () => {
    //Шаг 1 Устанавливаем базовый успешный ответ для getTypes, который будет использоваться по умолчанию
    mockedGetTypes.mockResolvedValue(mockData);
    // Шаг 2: Рендерим компонент
    await renderComponent();
    // Шаг 3: Проверяем, что элементы с текстом 'Тип A' и 'Тип B' присутствуют в документе
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
    mockedGetTypes.mockResolvedValue(undefined);
    // Шаг 2: Рендерим компонент
    await renderComponent();
    // Шаг 3: Проверяем, что на экране появилось сообщение об ошибке
    expect(screen.getByText(/Что пошло не так/i)).toBeInTheDocument();
  });
});
