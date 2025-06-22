import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });
  it('calls onClick when clicked', () => {
    // 1. Создаём мок-функцию для отслеживания кликов
    const handleClick = jest.fn();

    // 2. Рендерим компонент Button, передавая ему handleClick как onClick
    render(<Button onClick={handleClick}>Click me</Button>);

    // 3. Находим кнопку по роли и тексту
    const button = screen.getByRole('button', { name: /click me/i });

    // 4. Симулируем клик по кнопке
    fireEvent.click(button);

    // 5. Проверяем, что handleClick был вызван ровно один раз
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  it('is disabled and has correct class when disabled', () => {
    // 1. Рендерим компонент Button с пропом disabled
    render(<Button disabled>Disabled</Button>);

    // 2. Находим кнопку по роли и тексту
    const button = screen.getByRole('button', { name: /disabled/i });

    // 3. Проверяем, что кнопка действительно отключена
    expect(button).toBeDisabled();

    // 4. Проверяем, что у кнопки есть класс для disabled-состояния
    expect(button).toHaveClass('disabled:opacity-50');
  });
  it('applies additional className', () => {
    // 1. Рендерим компонент Button с дополнительным классом
    render(<Button className="my-custom-class">Test</Button>);

    // 2. Находим кнопку по роли и тексту
    const button = screen.getByRole('button', { name: /test/i });

    // 3. Проверяем, что у кнопки есть наш дополнительный класс
    expect(button).toHaveClass('my-custom-class');
  });
  it('applies the correct class for destructive variant', () => {
    // 1. Рендерим компонент Button с пропом variant="destructive"
    render(<Button variant="destructive">Удалить</Button>);

    // 2. Находим кнопку по роли и тексту
    const button = screen.getByRole('button', { name: /удалить/i });

    // 3. Проверяем, что у кнопки есть класс для destructive-варианта
    expect(button).toHaveClass('bg-destructive');
  });
  it('applies the correct class for small size', () => {
    // 1. Рендерим компонент Button с пропом size="sm"
    render(<Button size="sm">Small</Button>);

    // 2. Находим кнопку по роли и тексту
    const button = screen.getByRole('button', { name: /small/i });

    // 3. Проверяем, что у кнопки есть класс для маленького размера
    expect(button).toHaveClass('h-9');
  });
});
