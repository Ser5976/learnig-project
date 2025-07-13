import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Мокаем серверный компонент
jest.mock('@/features/home/components/test-component-server', () => {
  return function TestComponentServer() {
    return <div>Mocked Server Component</div>;
  };
});

describe('Page', () => {
  it('renders a heading', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );
    screen.debug();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    // Проверяем, что серверный компонент замокан
    expect(screen.getByText('Mocked Server Component')).toBeInTheDocument();
  });
});
