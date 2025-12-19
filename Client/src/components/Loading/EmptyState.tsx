// Context aware empty state displays for different todo list scenarios (ie: active vs. archived) with CTAs
import { useTodoStore } from '@/stores/todoStore';
import { Archive, CheckCircle, Inbox, Search } from 'lucide-react';

interface EmptyStateProps {
  filterStatus: 'all' | 'active' | 'completed' | 'archived';
  hasSearchTerm: boolean;
}

export const EmptyState = ({
  filterStatus,
  hasSearchTerm,
}: EmptyStateProps) => {
  const clearSearch = useTodoStore((state) => state.clearSearch);
  const resetFilters = useTodoStore((state) => state.resetFilters);

  if (hasSearchTerm) {
    return (
      <div className="text-center py-12">
        <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">No tasks match your search</p>
        <button
          onClick={clearSearch}
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          Clear search
        </button>
      </div>
    );
  }

  const emptyStates = {
    all: {
      icon: <Inbox className="h-12 w-12 text-gray-300" />,
      title: 'No tasks yet',
      subtitle: 'Add your first task above to get started with your todo list!',
    },
    active: {
      icon: <CheckCircle className="h-12 w-12 text-green-300" />,
      title: 'No active tasks',
      subtitle: 'Hurrah, you completed all your tasks! TIME TO PARTY 🎉',
    },
    completed: {
      icon: <CheckCircle className="h-12 w-12 text-gray-300" />,
      title: 'No completed tasks yet',
      subtitle: 'Mark tasks as complete using the checkbox to see them here.',
    },
    archived: {
      icon: <Archive className="h-12 w-12 text-purple-300" />,
      title: 'No archived tasks',
      subtitle: 'Archived tasks will appear here.',
    },
  };

  const state = emptyStates[filterStatus];

  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">{state.icon}</div>
      <p className="text-gray-500 font-medium text-lg">{state.title}</p>
      <p className="text-sm text-gray-400 mt-2">{state.subtitle}</p>
      {filterStatus !== 'all' && (
        <button
          onClick={resetFilters}
          className="mt-4 text-blue-500 hover:text-blue-600 font-medium text-sm"
        >
          View all tasks
        </button>
      )}
    </div>
  );
};
