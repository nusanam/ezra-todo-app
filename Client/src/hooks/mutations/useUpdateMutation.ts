import { type Todo, updateTodo } from '@/api';
import { notify } from '@/stores/notificationStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateTodoParams {
  id: string;
  data: Partial<Todo>;
}

/**
 * Mutation for updating todos (title, completion status, archive state)
 *
 * @returns Mutation object for PATCH operations
 */
export const useUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateTodoParams) => updateTodo(id, data),

    onMutate: async ({ id, data }) => {
      // cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // snapshot previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      // optimistically update
      queryClient.setQueryData<Todo[]>(
        ['todos'],
        (old) =>
          old?.map((todo) => (todo.id === id ? { ...todo, ...data } : todo)) ||
          []
      );

      // return context with snapshot
      return { previousTodos };
    },

    onSuccess: (updatedTodo, variables) => {
      // determine update type for notification
      if (variables.data.isCompleted !== undefined) {
        if (variables.data.isCompleted) {
          notify.success(
            "IT'S PARTY TIME! Task completed!",
            `"${updatedTodo.title}" marked as done.`
          );
        } else {
          notify.info(
            'Task reopened',
            `"${updatedTodo.title}" marked as incomplete.`
          );
        }
      } else if (variables.data.isArchived !== undefined) {
        const action = variables.data.isArchived ? 'archived' : 'unarchived';
        notify.info(
          `Task ${action}`,
          `"${updatedTodo.title}" has been ${action}.`
        );
      } else if (variables.data.title !== undefined) {
        notify.success('Task updated', 'Title updated successfully.');
      }
    },

    onError: (error, _, context) => {
      // rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }

      console.error('Failed to update todo:', error);
      notify.error(
        'Failed to update todo',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    },

    onSettled: () => {
      // always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};
