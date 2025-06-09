import { useQuery } from '@tanstack/react-query';
import { getSection } from '../api/get_section';

export const useSectionQuery = () => {
  return useQuery({
    queryKey: ['section'],
    queryFn: () => getSection(),
    //initialData: [],
  });
};
