import { getSections } from '@/lib/sahared-data/get-sections';
import { useQuery } from '@tanstack/react-query';

export const useSectionQuery = () => {
  return useQuery({
    queryKey: ['sections'],
    queryFn: () => getSections(),
    staleTime: 1000 * 60 * 5, // Данные считаются свежими 5 минут
    gcTime: 1000 * 60 * 30, // Время хранения в кэше 30 минут
    refetchOnMount: false, // Не обновлять при монтировании
    refetchOnReconnect: false, // Не обновлять при переподключении
  });
};
