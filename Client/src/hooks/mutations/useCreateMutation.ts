import { createTodo } from '@/api';
import { notify } from '@/stores/notificationStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Mutation for creating todos (needs title)
 *
 * @returns Mutation object with mutate, isPending, isError states
 * for POST operations
 */
export const useCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,

    onSuccess: (data) => {
      // invalidate and refetch todos
      queryClient.invalidateQueries({ queryKey: ['todos'] });

      // show success notification
      notify.success(
        'Todo created',
        `"${data.title}" has been added to your list.`
      );
    },

    onError: (error) => {
      console.error('Failed to create todo:', error);
      notify.error(
        'Failed to create todo :(',
        error instanceof Error ? error.message : 'An unexpected error occurred.'
      );
    },
  });
};
