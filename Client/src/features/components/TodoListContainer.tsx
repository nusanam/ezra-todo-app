/**
 * Main container component to manage todo data fetching and filtering.
 *
 * Responsibilities:
 * - Fetches todos via React Query
 * - Filters by status (all/active/completed/archived) and search term
 * - Handles loading, error, and empty states
 * - Initializes keyboard shortcuts
 *
 * Future considerations:
 * - Need to have: auth (JWT), password hashing, protected routes
 * - Nice to have: multiple views (timeline, calendar, kanban), user management, sharing tasks, drag & drop
 */

import { ErrorState, LoadingState } from '@/components';
import { useTodosQuery } from '@/hooks';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useTodoStore } from '@/stores/todoStore';
import { useMemo } from 'react';
import { TodoList } from './TodoList';

export const TodoListContainer = () => {
  const { data: todos = [], isLoading, error, refetch } = useTodosQuery();

  // zustand state
  const searchTerm = useTodoStore((state) => state.searchTerm);
  const filterStatus = useTodoStore((state) => state.filterStatus);

  // keyboard shortcuts for power users and accessibility
  useKeyboardShortcuts();

  const filteredTodos = useMemo(() => {
    let result = [...todos];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      result = result.filter((todo) =>
        todo.title.toLowerCase().includes(search)
      );
    }

    // apply todo status filters
    switch (filterStatus) {
      case 'active':
        result = result.filter((todo) => !todo.isCompleted && !todo.isArchived);
        break;
      case 'completed':
        result = result.filter((todo) => todo.isCompleted && !todo.isArchived);
        break;
      case 'archived':
        result = result.filter((todo) => todo.isArchived);
        break;
      case 'all':
        result = result.filter((todo) => !todo.isArchived);
        break;
    }

    return result;
  }, [todos, searchTerm, filterStatus]);

  if (isLoading) {
    return <LoadingState variant="skeleton" />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} variant="detailed" />;
  }

  // main todo list
  return (
    <TodoList
      todos={todos}
      filteredTodos={filteredTodos}
      hasSearchTerm={!!searchTerm.trim()}
    />
  );
};
