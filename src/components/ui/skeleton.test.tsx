import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Skeleton } from './skeleton';

describe('Skeleton Component', () => {
  // 1. Базовый рендеринг
  it('renders without crashing', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toBeInTheDocument();
  });

  // 2. Применение классов по умолчанию
  it('applies default classes', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toHaveClass('bg-accent');
    expect(skeleton).toHaveClass('animate-pulse');
    expect(skeleton).toHaveClass('rounded-md');
  });

  // 3. Передача кастомных классов
  it('merges custom className correctly', () => {
    const { container } = render(<Skeleton className="w-10 h-10" />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toHaveClass('w-10');
    expect(skeleton).toHaveClass('h-10');
    expect(skeleton).toHaveClass('bg-accent'); // Стандартные классы остаются
  });

  // 4. Передача дополнительных пропсов
  it('accepts additional props', () => {
    const { container } = render(
      <Skeleton aria-label="Loading" style={{ width: '100px' }} />
    );
    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toHaveStyle('width: 100px');
  });

  // 5. Snapshot тест
  it('matches snapshot', () => {
    const { asFragment } = render(<Skeleton />);
    expect(asFragment()).toMatchSnapshot();
  });
});
