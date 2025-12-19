/** Presentational component that renders todo list.
 * Receives filtered data from TodoListContainer.
 *
 * Sections:
 * - Header with keyboard shortcuts help
 * - Add todo form
 * - Search and filter controls
 * - Todo items or empty state (for no non-archived todos)

 * Note: archived todos do not show up when the filter view is set to 'All' todos
*/

import { Todo } from '@/api';
import { EmptyState } from '@/components';
import { useTodoStore } from '@/stores/todoStore';
import {
  AddTodo,
  FilterTabs,
  KeyboardShortcutsDropdown,
  SearchBar,
  ShortcutHints,
  TodoItem,
} from '.';

interface TodoListProps {
  todos: Todo[];
  filteredTodos: Todo[];
  hasSearchTerm: boolean;
}

export const TodoList = ({
  todos,
  filteredTodos,
  hasSearchTerm,
}: TodoListProps) => {
  const filterStatus = useTodoStore((state) => state.filterStatus);
  const searchTerm = useTodoStore((state) => state.searchTerm);

  return (
    <div
      role="main"
      id="main-content"
      aria-label="Todo list"
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-3xl mx-auto p-6">
        {/* Header with keyboard shortcuts help */}
        <section
          aria-label="Keyboard shortcuts help"
          className="flex justify-between items-start mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>

          <ShortcutHints />
          <KeyboardShortcutsDropdown />
        </section>

        {/* Add todo form */}
        <section aria-label="Add todo">
          <AddTodo />
        </section>

        {/* Search and Filters */}
        <section aria-label="Task list" className="mb-6 space-y-4">
          <SearchBar />
          <FilterTabs todos={todos} />
          <br />
          <span className="text-xs text-gray-400 mt-1">Press / to search</span>
        </section>
        {/* Search Results Count */}
        {searchTerm && (
          <section
            aria-label="Search results count"
            className="mb-4 text-sm text-gray-600"
          >
            Showing <strong>{filteredTodos.length}</strong> result
            {filteredTodos.length !== 1 ? 's' : ''} for "{searchTerm}"
          </section>
        )}

        {/* Todo List or Empty State */}
        {filteredTodos.length === 0 ? (
          <EmptyState
            filterStatus={filterStatus}
            hasSearchTerm={hasSearchTerm}
          />
        ) : (
          <div aria-label="Todo item" className="space-y-2">
            {filteredTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
