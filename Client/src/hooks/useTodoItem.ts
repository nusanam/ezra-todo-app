// Handler functions that manage todo item actions like toggling complete, archive, and delete. Can scale to use timed undo actions for deleted tasks
import { type Todo } from '@/api';
import { useDeleteMutation, useUpdateMutation } from '@/hooks';
import { useTodoStore } from '@/stores/todoStore';
import { useCallback } from 'react';

export const useTodoItem = (todo: Todo) => {
  const editingTodoId = useTodoStore((state) => state.editingTodoId);
  const updateMutation = useUpdateMutation();
  const deleteMutation = useDeleteMutation();

  const isBeingEdited = editingTodoId === todo.id;

  const handleToggleComplete = useCallback(() => {
    updateMutation.mutate({
      id: todo.id,
      data: { isCompleted: !todo.isCompleted },
    });
  }, [todo.id, todo.isCompleted, updateMutation]);

  const handleArchive = useCallback(() => {
    updateMutation.mutate({
      id: todo.id,
      data: { isArchived: !todo.isArchived },
    });
  }, [todo.id, todo.isArchived, updateMutation]);

  const handleDelete = useCallback(() => {
    // an example of a simple delete confirmation dialog is below
    // for production, consider adding a timed undo button in toasts for delete
    // if (window.confirm(`Delete "${todo.title}"?`))
    deleteMutation.mutate(todo.id);
  }, [todo.id, todo.title, deleteMutation]);

  return {
    isBeingEdited,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    handleToggleComplete,
    handleArchive,
    handleDelete,
  };
};
