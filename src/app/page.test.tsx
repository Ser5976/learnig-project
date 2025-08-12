import { render, screen } from '@testing-library/react';
import Home from './page';

// 1. Мокируем дочерние компоненты.
// Мы заменяем их на простые заглушки, чтобы изолировать тест Home.
// Нам важно не то, *что* они делают, а то, что Home их *вызывает*.

// Обрати внимание на путь, он должен точно соответствовать импорту в page.tsx
jest.mock('@/features/home/components/test-component-server', () => {
  // Мок должен быть дефолтным экспортом, если в оригинале `export default`
  return {
    __esModule: true, // Это нужно для работы с ES-модулями в Jest
    default: jest.fn(() => <div>Mocked Server Component</div>),
  };
});

jest.mock('@/features/home/components/test-component-client', () => {
  return {
    __esModule: true,
    default: jest.fn(() => <div>Mocked Client Component</div>),
  };
});

describe('Home Page Integration Test', () => {
  it('should render the main heading and its child components', () => {
    // 2. Рендерим компонент Home.
    // React Testing Library автоматически отрендерит "заглушки" вместо реальных компонентов.
    render(<Home />);

    // 3. Проверяем, что собственный контент Home на месте.
    expect(
      screen.getByRole('heading', { name: /home page/i })
    ).toBeInTheDocument();

    // 4. Проверяем, что на странице появились наши заглушки.
    // Это доказывает, что Home правильно интегрирует своих детей.
    expect(screen.getByText('Mocked Server Component')).toBeInTheDocument();
    expect(screen.getByText('Mocked Client Component')).toBeInTheDocument();
  });
});
