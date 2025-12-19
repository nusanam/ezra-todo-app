/**  Filters todos by status (ie: active, complete etc.) into tab lists with display counts

* Note: archived tasks do not appear in any of the tabs except 'Archived')
*/

import { type Todo } from '@/api';
import { useTodoStore } from '@/stores/todoStore';
import { Archive } from 'lucide-react';
import { useMemo } from 'react';

interface FilterTabsProps {
  todos: Todo[];
}

export const FilterTabs = ({ todos }: FilterTabsProps) => {
  const filterStatus = useTodoStore((state) => state.filterStatus);
  const setFilterStatus = useTodoStore((state) => state.setFilterStatus);

  const counts = useMemo(
    () => ({
      all: todos.filter((t) => !t.isArchived).length,
      active: todos.filter((t) => !t.isCompleted && !t.isArchived).length,
      completed: todos.filter((t) => t.isCompleted && !t.isArchived).length,
      archived: todos.filter((t) => t.isArchived).length,
    }),
    [todos]
  );

  const tabs = [
    { id: 'all' as const, label: 'All', count: counts.all },
    { id: 'active' as const, label: 'Active', count: counts.active },
    { id: 'completed' as const, label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setFilterStatus(tab.id)}
          className={`
            px-4 py-2 rounded-lg font-medium transition-colors
            ${
              filterStatus === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {tab.label} ({tab.count})
        </button>
      ))}

      <button
        onClick={() => setFilterStatus('archived')}
        className={`
          px-4 py-2 rounded-lg font-medium transition-colors
          flex items-center gap-2
          ${
            filterStatus === 'archived'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
        `}
      >
        <Archive className="h-4 w-4" />
        Archived ({counts.archived})
      </button>
    </div>
  );
};
