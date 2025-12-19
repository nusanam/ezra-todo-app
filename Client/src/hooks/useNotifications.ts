// Custom hook to handle toast notifications for various todo actions

import { notify } from '@/stores/notificationStore';
import { useCallback } from 'react';

export const useNotifications = () => {
  const notifyTodoCreated = useCallback((title: string) => {
    notify.success('Todo created', `"${title}" has been added to your list.`);
  }, []);

  const notifyTodoUpdated = useCallback((title: string) => {
    notify.success('Todo updated', `"${title}" has been updated.`);
  }, []);

  const notifyTodoDeleted = useCallback(() => {
    notify.info('Todo deleted', 'The item has been removed from your list.');
  }, []);

  const notifyTodoCompleted = useCallback((title: string) => {
    notify.success(
      "IT'S TIME TO PARTY! Task completed!",
      `"${title}" marked as done`
    );
  }, []);

  const notifyError = useCallback((error: unknown) => {
    let message = 'Something went wrong';

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      message = String(error.message);
    }

    notify.error('Error', message);
  }, []);

  const notifyValidationError = useCallback(
    (field: string, message: string) => {
      notify.warning('Validation Error', `${field}: ${message}`);
    },
    []
  );

  return {
    notifyTodoCreated,
    notifyTodoUpdated,
    notifyTodoDeleted,
    notifyTodoCompleted,
    notifyError,
    notifyValidationError,
  };
};
