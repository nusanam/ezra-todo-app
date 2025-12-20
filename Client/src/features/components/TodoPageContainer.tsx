/**
 * Main container component for data fetching and state management.
 *
 * Responsibilities:
 * - Fetches paginated todos with server-side filtering by todo status (i.e. archived)
 * - Applies client-side search filtering on the current page's results
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
import { TodoPage } from './TodoPage';

export const TodoPageContainer = () => {
  // zustand state
  const searchTerm = useTodoStore((state) => state.searchTerm);
  const filterStatus = useTodoStore((state) => state.filterStatus);

  const {
    data: paginatedData,
    isFetching,
    isLoading,
    error,
    refetch,
  } = useTodosQuery();

  const {
    items: paginatedTodos = [],
    totalCount = 20,
    totalPages = 0,
  } = paginatedData ?? {};

  // keyboard shortcuts for power users and accessibility
  useKeyboardShortcuts();

  const filteredTodos = useMemo(() => {
    if (!searchTerm.trim()) return paginatedTodos; // skip logic if search is empty

    const search = searchTerm.toLowerCase().trim();
    const result = paginatedTodos.filter((todo) =>
      todo.title.toLowerCase().includes(search)
    );
    return result;
  }, [paginatedTodos, searchTerm, filterStatus]);

  if (isLoading) {
    return <LoadingState variant="skeleton" />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} variant="detailed" />;
  }

  // renders todo app view
  return (
    <TodoPage
      filteredTodos={filteredTodos} // search results
      hasSearchTerm={!!searchTerm.trim()}
      totalPages={totalPages}
      totalCount={totalCount}
      isFetching={isFetching ?? false}
    />
  );
};
