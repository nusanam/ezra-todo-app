/** Todo store manges:
 * Pagination (set todo items per page here using pageSize)
 * Search terms
 * Todo filter status
 * Editing - doesn't manage todo data but uses set() and get() methods for state management
 */

import { create } from 'zustand';

type FilterStatus = 'all' | 'active' | 'completed' | 'archived';

interface TodoStore {
  // search
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;

  // edit
  editingTodoId: string | null;
  setEditingTodoId: (id: string | null) => void;

  // filter
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;

  // pagination
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  resetFilters: () => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  clearSearch: () => set({ searchTerm: '' }),

  editingTodoId: null,
  setEditingTodoId: (id) => set({ editingTodoId: id }),

  filterStatus: 'all',
  setFilterStatus: (status) => set({ filterStatus: status }),

  currentPage: 1,
  pageSize: 10, // not too few to avoid clicking multiple pages) but not excessive, which would defeat the purpose of pagination
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),

  resetFilters: () =>
    set({
      searchTerm: '',
      filterStatus: 'all',
      currentPage: 1,
    }),
}));
