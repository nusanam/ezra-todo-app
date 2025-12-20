// User input for searching todo items with basic debouncing (for scaling performance)
import { useDebounce } from '@/hooks';
import { useTodoStore } from '@/stores/todoStore';
import { X as DeleteIcon, Search as SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export const SearchBar = () => {
  const setSearchTerm = useTodoStore((state) => state.setSearchTerm);
  const clearSearch = useTodoStore((state) => state.clearSearch);

  // local state for immediate input feedback (offers better UX)
  const [localSearchValue, setLocalSearchValue] = useState('');

  // filter tasks using debounced value
  const debouncedSearchValue = useDebounce(localSearchValue, 50);

  // update client state (zustand) when debounced value changes
  useEffect(() => {
    setSearchTerm(debouncedSearchValue);
  }, [debouncedSearchValue, setSearchTerm]);

  const handleClear = () => {
    setLocalSearchValue('');
    clearSearch();
  };

  return (
    <div className="relative flex-1">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={localSearchValue}
          onChange={(e) => setLocalSearchValue(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search tasks"
        />
        {localSearchValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <DeleteIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* added for better user feedback to improve performance when scaling up */}
      {localSearchValue !== debouncedSearchValue && (
        <div className="absolute top-full mt-1 text-xs text-gray-400">
          Searching...
        </div>
      )}
    </div>
  );
};
