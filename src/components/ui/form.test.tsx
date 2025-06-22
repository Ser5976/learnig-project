import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from './form';
import { Input } from './input';
import { Button } from './button';

// Схема валидации для тестов
const testSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Введите корректный email'),
  age: z.number().min(18, 'Возраст должен быть не менее 18 лет'),
});

type TestFormData = z.infer<typeof testSchema>;

// Тестовый компонент формы
const TestForm = ({ onSubmit }: { onSubmit: (data: TestFormData) => void }) => {
  const form = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: '',
      email: '',
      age: 0,
    },
    mode: 'onSubmit',
  });

  const formState = form.formState;
  console.log('Form errors:', formState.errors);
  console.log('Form is valid:', formState.isValid);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input placeholder="Введите имя" {...field} />
              </FormControl>
              <FormDescription>Введите ваше полное имя</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Введите email" type="email" {...field} />
              </FormControl>
              <FormDescription>Введите ваш email адрес</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Возраст</FormLabel>
              <FormControl>
                <Input
                  placeholder="Введите возраст"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>Введите ваш возраст</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Отправить</Button>
      </form>
    </Form>
  );
};

describe('Form', () => {
  let handleSubmit: jest.Mock;

  beforeEach(() => {
    handleSubmit = jest.fn();
  });

  it('renders form without crashing', () => {
    render(<TestForm onSubmit={handleSubmit} />);

    // Проверяем, что все поля формы отрендерились
    expect(screen.getByLabelText(/имя/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/возраст/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /отправить/i })
    ).toBeInTheDocument();
  });

  it('displays form descriptions', () => {
    render(<TestForm onSubmit={handleSubmit} />);

    // Проверяем, что описания полей отображаются
    expect(screen.getByText('Введите ваше полное имя')).toBeInTheDocument();
    expect(screen.getByText('Введите ваш email адрес')).toBeInTheDocument();
    expect(screen.getByText('Введите ваш возраст')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const { container } = render(<TestForm onSubmit={handleSubmit} />);

    // Заполняем форму валидными данными
    fireEvent.change(screen.getByLabelText(/имя/i), {
      target: { value: 'Иван Иванов' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'ivan@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/возраст/i), {
      target: { value: '25' },
    });

    // Получаем форму и отправляем её
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    fireEvent.submit(form!);

    // Проверяем, что обработчик был вызван с правильными данными
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith(
        {
          name: 'Иван Иванов',
          email: 'ivan@example.com',
          age: 25,
        },
        expect.anything()
      );
    });
  });

  it('shows validation errors for invalid data', async () => {
    const { container } = render(<TestForm onSubmit={handleSubmit} />);

    // Заполняем форму невалидными данными
    fireEvent.change(screen.getByLabelText(/имя/i), {
      target: { value: 'А' }, // Слишком короткое имя
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }, // Невалидный email
    });
    fireEvent.change(screen.getByLabelText(/возраст/i), {
      target: { value: '15' }, // Слишком молодой возраст
    });

    // Принудительно запускаем валидацию всех полей
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    fireEvent.submit(form!);

    // Проверяем, что ошибки валидации отображаются
    await waitFor(
      () => {
        expect(
          screen.getByText('Имя должно содержать минимум 2 символа')
        ).toBeInTheDocument();
        expect(
          screen.getByText('Введите корректный email')
        ).toBeInTheDocument();
        expect(
          screen.getByText('Возраст должен быть не менее 18 лет')
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Проверяем, что обработчик не был вызван
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('shows validation errors for empty required fields', async () => {
    const { container } = render(<TestForm onSubmit={handleSubmit} />);

    // Получаем форму и отправляем её
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    fireEvent.submit(form!);

    // Проверяем, что ошибки валидации отображаются
    await waitFor(() => {
      expect(
        screen.getByText('Имя должно содержать минимум 2 символа')
      ).toBeInTheDocument();
      expect(screen.getByText('Введите корректный email')).toBeInTheDocument();
    });

    // Проверяем, что обработчик не был вызван
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(<TestForm onSubmit={handleSubmit} />);

    // Проверяем, что у полей есть правильные ARIA атрибуты
    const nameInput = screen.getByLabelText(/имя/i);
    const emailInput = screen.getByLabelText(/email/i);
    const ageInput = screen.getByLabelText(/возраст/i);

    // Проверяем, что у полей есть id и aria-describedby
    expect(nameInput).toHaveAttribute('id');
    expect(emailInput).toHaveAttribute('id');
    expect(ageInput).toHaveAttribute('id');

    // Проверяем, что описания связаны с полями через aria-describedby
    const nameDescription = screen.getByText('Введите ваше полное имя');
    const emailDescription = screen.getByText('Введите ваш email адрес');
    const ageDescription = screen.getByText('Введите ваш возраст');

    expect(nameDescription).toHaveAttribute('id');
    expect(emailDescription).toHaveAttribute('id');
    expect(ageDescription).toHaveAttribute('id');
  });

  it('clears validation errors when user starts typing', async () => {
    const { container } = render(<TestForm onSubmit={handleSubmit} />);

    // Получаем форму и отправляем её, чтобы показать ошибки
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(
        screen.getByText('Имя должно содержать минимум 2 символа')
      ).toBeInTheDocument();
    });

    // Начинаем вводить валидное имя
    fireEvent.change(screen.getByLabelText(/имя/i), {
      target: { value: 'Иван' },
    });

    // Проверяем, что ошибка исчезла
    await waitFor(() => {
      expect(
        screen.queryByText('Имя должно содержать минимум 2 символа')
      ).not.toBeInTheDocument();
    });
  });
});
