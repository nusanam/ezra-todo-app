import { fetchAllTodos, fetchOne, Todo } from '@/api';
import { useQuery } from '@tanstack/react-query';

/**
 * Query hook for fetching all todos
 *
 * @returns Query result with todos array, loading, and error states
 */
export const useTodosQuery = () => {
  return useQuery<Todo[], Error>({
    queryKey: ['todos'],
    queryFn: fetchAllTodos,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60, // consider data stale after 1 minute
  });
};

// for a single todo (not currently used but added for future use cases)
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
