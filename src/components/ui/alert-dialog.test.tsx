import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
} from './alert-dialog';
import { Button } from './button';

describe('AlertDialog', () => {
  // 1. Объявляем переменные, которые будут доступны во всех тестах
  let handleAction: jest.Mock;
  let handleCancel: jest.Mock;
  let handleTriggerClick: jest.Mock;

  // 2. beforeEach выполняется перед каждым тестом
  beforeEach(() => {
    // Создаём новые мок-функции для каждого теста
    handleAction = jest.fn();
    handleCancel = jest.fn();
    handleTriggerClick = jest.fn();

    // Рендерим компонент один раз для всех тестов
    render(
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button onClick={handleTriggerClick}>Открыть диалог</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Заголовок диалога</AlertDialogTitle>
            <AlertDialogDescription>Описание диалога</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>
              Подтвердить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  });

  // 3. Вспомогательная функция для открытия диалога
  const openDialog = () => {
    const triggerButton = screen.getByRole('button', {
      name: /открыть диалог/i,
    });
    fireEvent.click(triggerButton);
  };

  it('renders without crashing', () => {
    // Просто проверяем, что компонент отрендерился
    expect(
      screen.getByRole('button', { name: /открыть диалог/i })
    ).toBeInTheDocument();
  });

  it('opens dialog when trigger is clicked', () => {
    // Открываем диалог
    openDialog();

    // Проверяем, что обработчик был вызван
    expect(handleTriggerClick).toHaveBeenCalledTimes(1);

    // Проверяем, что диалог открылся
    expect(screen.getByText('Заголовок диалога')).toBeInTheDocument();
    expect(screen.getByText('Описание диалога')).toBeInTheDocument();
  });

  it('closes dialog when cancel button is clicked', () => {
    // Открываем диалог
    openDialog();

    // Проверяем, что диалог открылся
    expect(screen.getByText('Заголовок диалога')).toBeInTheDocument();

    // Кликаем по кнопке отмены
    const cancelButton = screen.getByRole('button', { name: /отмена/i });
    fireEvent.click(cancelButton);

    // Проверяем, что обработчик был вызван
    expect(handleCancel).toHaveBeenCalledTimes(1);

    // Проверяем, что диалог закрылся
    expect(screen.queryByText('Заголовок диалога')).not.toBeInTheDocument();
  });

  it('closes dialog and calls action when action button is clicked', () => {
    // Открываем диалог
    openDialog();

    // Проверяем, что диалог открылся
    expect(screen.getByText('Заголовок диалога')).toBeInTheDocument();

    // Кликаем по кнопке подтверждения
    const actionButton = screen.getByRole('button', { name: /подтвердить/i });
    fireEvent.click(actionButton);

    // Проверяем, что обработчик был вызван
    expect(handleAction).toHaveBeenCalledTimes(1);

    // Проверяем, что диалог закрылся
    expect(screen.queryByText('Заголовок диалога')).not.toBeInTheDocument();
  });
});
