// src/app/section/section.test.tsx
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SectionsPage from './page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getSections } from '@/lib/sahared-data/get-sections';
import '@testing-library/jest-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// 1. Мокируем зависимости
jest.mock('@/lib/sahared-data/get-sections');
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// 2. Создаем типизированные версии моков
const mockedGetSections = getSections as jest.Mock;
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedToast = toast as jest.Mocked<typeof toast>;

// Функция-обертка для рендера с QueryClient
const renderWithClient = (ui: React.ReactElement) => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  return {
    user: userEvent.setup(),
    ...render(
      <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
    ),
  };
};

const mockData = [
  { id: '1', name: 'Секция из мока 1' },
  { id: '2', name: 'Секция из мока 2' },
];

const apiError = {
  response: { data: { message: 'Ошибка от API' } },
};

describe('SectionsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetSections.mockResolvedValue([...mockData]);
  });

  it('должен отображать список секций при успешной загрузке', async () => {
    renderWithClient(<SectionsPage />);
    expect(await screen.findByText('Секция из мока 1')).toBeInTheDocument();
    expect(await screen.findByText('Секция из мока 2')).toBeInTheDocument();
  });

  it('должен отображать "Данных нет", если список пуст', async () => {
    mockedGetSections.mockResolvedValue([]);
    renderWithClient(<SectionsPage />);
    expect(await screen.findByText('Данных нет')).toBeInTheDocument();
  });

  it('должен отображать ошибку, если загрузка секций не удалась', async () => {
    mockedGetSections.mockRejectedValue(new Error('Async error'));
    renderWithClient(<SectionsPage />);
    expect(await screen.findByText(/Что пошло не так/i)).toBeInTheDocument();
  });

  describe('CRUD операции', () => {
    // HAPPY PATHS
    it('должен создавать секцию', async () => {
      const { user } = renderWithClient(<SectionsPage />);
      await user.click(screen.getByRole('button', { name: /Создать секцию/i }));

      const newSectionName = 'Новая секция';
      await user.type(await screen.findByLabelText(/Название/i), newSectionName);

      const createdSection = { id: '3', name: newSectionName };
      mockedAxios.post.mockResolvedValue({ data: createdSection });
      mockedGetSections.mockResolvedValue([...mockData, createdSection]);

      await user.click(screen.getByRole('button', { name: 'Создать' }));

      expect(await screen.findByText(newSectionName)).toBeInTheDocument();
      expect(mockedToast.success).toHaveBeenCalledWith('Секция успешно создана');
    });

    it('должен редактировать секцию', async () => {
      const { user } = renderWithClient(<SectionsPage />);
      const sectionToUpdate = mockData[0];
      const updatedName = 'Отредактированная секция';

      const li = (await screen.findByText(sectionToUpdate.name))
        .closest('li')!;
      await user.click(within(li).getByRole('button', { name: /Редактировать/i }));

      const input = await screen.findByLabelText(/Название/i);
      await user.clear(input);
      await user.type(input, updatedName);

      const updatedSection = { ...sectionToUpdate, name: updatedName };
      mockedAxios.put.mockResolvedValue({ data: updatedSection });
      mockedGetSections.mockResolvedValue([updatedSection, mockData[1]]);

      await user.click(screen.getByRole('button', { name: /Обновить/i }));

      expect(await screen.findByText(updatedName)).toBeInTheDocument();
      expect(mockedToast.success).toHaveBeenCalledWith(
        'Секция успешно обновлена'
      );
    });

    it('должен удалять секцию', async () => {
      const { user } = renderWithClient(<SectionsPage />);
      const sectionToDelete = mockData[1];

      const li = (await screen.findByText(sectionToDelete.name))
        .closest('li')!;
      await user.click(within(li).getByRole('button', { name: /Удалить/i }));

      const dialog = await screen.findByRole('alertdialog');
      
      // Мокируем до клика
      mockedAxios.delete.mockResolvedValue({});
      mockedGetSections.mockResolvedValue([mockData[0]]);

      await user.click(within(dialog).getByRole('button', { name: /Удалить/i }));

      await waitForElementToBeRemoved(() =>
        screen.queryByText(sectionToDelete.name)
      );
      expect(mockedToast.success).toHaveBeenCalledWith('Секция успешно удалена');
    });

    // ERROR PATHS
    it('должен показывать ошибку при сбое создания', async () => {
      const { user } = renderWithClient(<SectionsPage />);
      await user.click(screen.getByRole('button', { name: /Создать секцию/i }));
      await user.type(await screen.findByLabelText(/Название/i), 'test');

      mockedAxios.post.mockRejectedValue(apiError);

      await user.click(screen.getByRole('button', { name: 'Создать' }));

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith(apiError.response.data.message);
      });
    });

    it('должен показывать ошибку при сбое редактирования', async () => {
        const { user } = renderWithClient(<SectionsPage />);
        const li = (await screen.findByText(mockData[0].name)).closest('li')!;
        await user.click(within(li).getByRole('button', { name: /Редактировать/i }));

        const input = await screen.findByLabelText(/Название/i);
        await user.clear(input);
        await user.type(input, 'new name');

        mockedAxios.put.mockRejectedValue(apiError);

        await user.click(screen.getByRole('button', { name: /Обновить/i }));

        await waitFor(() => {
            expect(mockedToast.error).toHaveBeenCalledWith(apiError.response.data.message);
        });
    });

    it('должен показывать ошибку при сбое удаления', async () => {
        const { user } = renderWithClient(<SectionsPage />);
        const li = (await screen.findByText(mockData[1].name)).closest('li')!;
        await user.click(within(li).getByRole('button', { name: /Удалить/i }));

        const dialog = await screen.findByRole('alertdialog');
        
        mockedAxios.delete.mockRejectedValue(apiError);
        
        await user.click(within(dialog).getByRole('button', { name: /Удалить/i }));

        await waitFor(() => {
            expect(mockedToast.error).toHaveBeenCalledWith(apiError.response.data.message);
        });
    });
  });
});