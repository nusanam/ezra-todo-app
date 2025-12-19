/**
 * Hook managing inline todo editing state and operations.
 *
 * Features:
 * - Keyboard support: Enter to save, Escape to cancel
 * - Validation: Non-empty, max 100 characters
 * - Focus management for accessibility
 * - Optimistic updates via useUpdateMutation
 */
/**
 * Manages todo item edit state and operations.
 * Handles inline editing with keyboard support (Enter to save, Escape to cancel).
 * Manages focus states for accessibility and validates input before saving.
 *
 * @param todo - The todo item being edited
 * @returns Edit state, handlers, and validation errors
 */
import { Todo } from '@/api';
import { useUpdateMutation } from '@/hooks';
import { useTodoStore } from '@/stores/todoStore';
import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export const useEditTodo = (todo: Todo) => {
  const updateMutation = useUpdateMutation();
  const editingTodoId = useTodoStore((state) => state.editingTodoId);
  const setEditingTodoId = useTodoStore((state) => state.setEditingTodoId);

  const isEditing = editingTodoId === todo.id;
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [error, setError] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const isUserEdit = useRef(false); // track if editing was user initiated

  useEffect(() => {
    // only focus if user triggered the edit, not on remount
    if (isEditing && inputRef.current && isUserEdit.current) {
      inputRef.current.focus();
      inputRef.current.select();
      isUserEdit.current = false; // reset flag after focusing
    }
  }, [isEditing]);

  // cleanup on unmount to clear editing state
  useEffect(() => {
    return () => {
      if (isEditing) {
        setEditingTodoId(null); // clear editing state when component unmounts
      }
    };
  }, [isEditing, setEditingTodoId]);

  const handleStartEdit = useCallback(
    (e?: MouseEvent | KeyboardEvent) => {
      // track how edit was triggered (for keyboard vs. mouse focus handling)
      const triggeredByKeyboard = e && 'detail' in e && e.detail === 0; // 0 = keyboard, 1+ = mouse

      isUserEdit.current = true; // marks as user initiated
      setEditingTodoId(todo.id);
      setEditedTitle(todo.title);
      setError('');

      if (triggeredByKeyboard) {
        // provides immediate focus for keyboard users
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    },
    [todo.id, todo.title, setEditingTodoId]
  );

  const handleCancel = useCallback(() => {
    setEditingTodoId(null);
    setEditedTitle(todo.title);
    setError('');
  }, [todo.title, setEditingTodoId]);

  const handleSave = useCallback(() => {
    const trimmedTitle = editedTitle.trim();

    // validation
    if (!trimmedTitle) {
      setError('Title cannot be empty');
      return;
    }

    if (trimmedTitle.length > 100) {
      setError('Title must be less than 100 characters');
      return;
    }

    // only update if title actually changed
    if (trimmedTitle !== todo.title) {
      updateMutation.mutate({
        id: todo.id,
        data: { title: trimmedTitle },
      });
    }

    setEditingTodoId(null);
    setError('');
  }, [editedTitle, todo.id, todo.title, updateMutation, setEditingTodoId]);

  const handleInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation(); // prevent bubbling to avoid conflicts with escaping edit mode clearing search results unintentionally
        handleSave();
      } else if (e.key === 'Enter') {
        e.preventDefault;
        handleCancel();
      }
    },
    [handleSave, handleCancel]
  );

  const handleTitleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLSpanElement>) => {
      if ((e.key === 'Enter' || e.key === 'e') && !todo.isArchived) {
        e.preventDefault();
        handleStartEdit(e);
      }
    },
    [handleStartEdit, todo.isArchived]
  );

  return {
    isEditing,
    editedTitle,
    error,
    inputRef,
    isPending: updateMutation.isPending,
    handleStartEdit,
    handleCancel,
    handleSave,
    handleInputKeyDown,
    handleTitleKeyDown,
    setEditedTitle,
    setError,
  };
};
