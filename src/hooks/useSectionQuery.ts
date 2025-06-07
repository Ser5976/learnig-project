import { getSection } from '@/lib/client/get_.section';
import { useQuery } from '@tanstack/react-query';

export const useSectionQuery = () => {
  return useQuery({
    queryKey: ['section'],
    queryFn: () => getSection(),
    //initialData: [],
  });
};
