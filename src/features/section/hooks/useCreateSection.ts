import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { createSection } from '../api/mutations';

export function useCreateSection(
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      toast.success('Секция успешно создана');
      setIsOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Произошла ошибка');
    },
  });
}
