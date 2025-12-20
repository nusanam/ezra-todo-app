/** Presentational component that renders todo list. Receives filtered data from TodoPageContainer.
 *
 * Uses transition and minimum heights to smooth UI pagination transitions
 *
 * Sections:
 * - Header with keyboard shortcuts help
 * - Add todo form
 * - Search and filter controls
 * - Paginated todo items or empty state (for no non-archived todos)

 * Note: archived todos do not show up when the filter view is set to 'All' todos
*/

import { type Todo } from '@/api';
import { EmptyState, LoadingSpinner } from '@/components';
import { useTodoStore } from '@/stores/todoStore';
import {
  AddTodo,
  FilterTabs,
  KeyboardShortcutsDropdown,
  SearchBar,
  ShortcutHints,
  TodoItemContainer,
} from '.';

interface TodoPageProps {
  filteredTodos: Todo[];
  hasSearchTerm: boolean;
  totalPages: number;
  totalCount: number;
  isFetching: boolean;
}

export const TodoPage = ({
  filteredTodos,
  hasSearchTerm,
  totalPages,
  isFetching,
}: TodoPageProps) => {
  const filterStatus = useTodoStore((state) => state.filterStatus);
  const searchTerm = useTodoStore((state) => state.searchTerm);

  return (
    <div
      role="main"
      id="main-content"
      aria-label="Todo Page"
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-3xl mx-auto p-6">
        {/* Header with keyboard shortcuts help */}
        <section
          aria-label="Keyboard shortcuts help"
          className="flex justify-between items-start mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">My Todos</h1>

          <ShortcutHints />
          <KeyboardShortcutsDropdown />
        </section>

        {/* Add todo form */}
        <section aria-label="Add todo">
          <AddTodo />
        </section>

        {/* Search and Filters */}
        <section aria-label="Todo Filters" className="mb-6 space-y-4">
          <SearchBar />
          <FilterTabs />
          <br />
          <span className="text-xs text-gray-400 mt-1">Press / to search</span>
        </section>
        {/* Search Results Count */}
        {searchTerm.trim() && (
          <section
            aria-label="Search results count"
            className="mb-4 text-sm text-gray-600"
          >
            Showing <strong>{filteredTodos.length}</strong> result
            {filteredTodos.length !== 1 ? 's' : ''} for "{searchTerm}"
          </section>
        )}

        {/* Paginated todos or Empty State */}
        {filteredTodos.length === 0 ? (
          <EmptyState
            filterStatus={filterStatus}
            hasSearchTerm={hasSearchTerm}
          />
        ) : (
          <div className="min-h-[700px] relative">
            {isFetching && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                <LoadingSpinner size="xl" />
              </div>
            )}
            <TodoItemContainer todos={filteredTodos} totalPages={totalPages} />
          </div>
        )}
      </div>
    </div>
  );
};
