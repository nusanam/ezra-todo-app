// Fetches filter counts for All/Active/Completed/Archived tabs

import { fetchCounts, TodoCounts } from '@/api';
import { useQuery } from '@tanstack/react-query';

export const useTodoCountsQuery = () => {
  return useQuery<TodoCounts, Error>({
    queryKey: ['todos', 'counts'],
    queryFn: fetchCounts,
    staleTime: 1000 * 60,
  });
};
