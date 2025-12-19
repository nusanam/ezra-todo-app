import { deleteTodo, Todo } from '@/api';
import { notify } from '@/stores/notificationStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Mutation for deleting todos with confirmation dialog before deletion
 * Handles optimistic removal with error rollback.
 *
 * @returns Mutation object for DELETE operations
 */
export const useDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,

    onMutate: async (id: string) => {
      // cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // snapshot the previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      // optimistically remove from cache
      queryClient.setQueryData<Todo[]>(
        ['todos'],
        (old) => old?.filter((todo) => todo.id !== id) || []
      );

      // return context with snapshot
      return { previousTodos };
    },

    onSuccess: () => {
      notify.info('Todo deleted', 'The task has been removed from your list.');
    },

    onError: (error, _, context) => {
      // rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }

      console.error('Failed to delete todo:', error);
      notify.error(
        'Failed to delete todo :(',
        error instanceof Error ? error.message : 'An unexpected error occurred.'
      );
    },

    onSettled: () => {
      // always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};
