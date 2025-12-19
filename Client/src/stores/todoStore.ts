// Todo store to manage search terms, todo filter status, and editing (doesn't manage todo data) with set() and get() methods for state management
import { create } from 'zustand';

type FilterStatus = 'all' | 'active' | 'completed' | 'archived';

interface TodoStore {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;

  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;

  editingTodoId: string | null;
  setEditingTodoId: (id: string | null) => void;

  resetFilters: () => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  clearSearch: () => set({ searchTerm: '' }),

  filterStatus: 'all',
  setFilterStatus: (status) => set({ filterStatus: status }),

  editingTodoId: null,
  setEditingTodoId: (id) => set({ editingTodoId: id }),

  resetFilters: () =>
    set({
      searchTerm: '',
      filterStatus: 'all',
    }),
}));
