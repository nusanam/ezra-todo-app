/** Filter tabs for todo status (All, Active, Completed, Archived).
 * Fetches counts from API to display accurate totals across all pages.
 *
 * Note: Archived tasks only appear in the 'Archived' tab.
 */
import { useTodoCountsQuery } from '@/hooks/queries/useCountsQuery';
import { useTodoStore } from '@/stores/todoStore';
import { Archive } from 'lucide-react';

export const FilterTabs = () => {
  const filterStatus = useTodoStore((state) => state.filterStatus);
  const setFilterStatus = useTodoStore((state) => state.setFilterStatus);

  const { data } = useTodoCountsQuery();
  const { all = 0, active = 0, completed = 0, archived = 0 } = data ?? {};

  const tabs = [
    { id: 'all' as const, label: 'All', count: all },
    { id: 'active' as const, label: 'Active', count: active },
    { id: 'completed' as const, label: 'Completed', count: completed },
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
        Archived ({archived})
      </button>
    </div>
  );
};
