import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { SimpleCard } from './simple-card';

describe('SimpleCard component', () => {
  it('render component', () => {
    render(<SimpleCard title="Привет тест" />);
    const title = screen.getByText(/привет тест/i);
    const button = screen.getByRole('button');
    const input = screen.getByPlaceholderText(/поиск.../i);
    expect(title).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });
  it('render asyn', async () => {
    render(<SimpleCard title="Привет тест" />);
    expect(screen.queryByText(/Имя пользователя:/i)).toBeNull();
    expect(
      await screen.findByText(/Имя пользователя:/i, {}, { timeout: 4000 })
    ).toBeInTheDocument();
  });
  it('render input', () => {
    render(<SimpleCard title="Привет тест" />);
    expect(screen.queryByText(/Вывод текста: приём/i)).toBeNull();
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'приём' },
    });
    expect(screen.queryByText(/Вывод текста: приём/i)).toBeInTheDocument();
  });
  it('render checkbox', () => {
    render(<SimpleCard title="Привет тест" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
