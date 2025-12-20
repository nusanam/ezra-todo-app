/** Fetches paginated todos with server-side status filtering.

  * Keeps previous data during page transitions to prevent UI flickering.
 */

import {
  fetchAllTodos,
  fetchOne,
  fetchPaginatedTodos,
  type PaginatedResponse,
  type Todo,
} from '@/api';
import { useTodoStore } from '@/stores/todoStore';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

/**
 * Query hook for fetching paginated todos.
 * Automatically refetches when page or pageSize changes in store.
 *
 * @returns Query result with paginated & server-side filtered todos
 * and loading & error states
 */
export const useTodosQuery = () => {
  const currentPage = useTodoStore((state) => state.currentPage);
  const pageSize = useTodoStore((state) => state.pageSize);
  const filterStatus = useTodoStore((state) => state.filterStatus);

  return useQuery<PaginatedResponse<Todo>, Error>({
    queryKey: ['todos', currentPage, pageSize, filterStatus],
    queryFn: () => fetchPaginatedTodos(currentPage, pageSize, filterStatus),
    retry: 1,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData, // prevents flicker during page transitions
    staleTime: 1000 * 60,
  });
};

// For future considerations (i.e. exports and bulk operations), not utilized currently
export const useUnpaginatedTodos = () => {
  return useQuery<Todo[], Error>({
    queryKey: ['todos'],
    queryFn: fetchAllTodos,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60, // consider data stale after 1 minute
  });
};

// not utilized currently
export const useOneTodo = (id: string) => {
  return useQuery<Todo, Error>({
    queryKey: ['todos', id],
    queryFn: async () => {
      const todo = await fetchOne(id);
      if (!todo) throw new Error('Todo not found');
      return todo;
    },
    enabled: !!id, // only run if id is provided
  });
};
