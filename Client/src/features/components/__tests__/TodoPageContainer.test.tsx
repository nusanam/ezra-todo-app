// BDD user-focused tests
// Note: The auto-mock zustand setup is in vitest.setup.ts

import { type Todo } from '@/api';
import { TodoPageContainer } from '@/features/components';
import { useTodosQuery } from '@/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock setup
vi.mock('@/hooks', () => ({
  useTodosQuery: vi.fn(),
  useTodoCountsQuery: vi.fn(() => ({
    data: { all: 0, active: 0, completed: 0, archived: 0 },
    isLoading: false,
  })),
  useKeyboardShortcuts: vi.fn(),
  useEditTodo: vi.fn(() => ({ isEditing: false })),
  useTodoItem: vi.fn(() => ({
    isBeingEdited: false,
    isUpdating: false,
    isDeleting: false,
    handleToggleComplete: vi.fn(),
    handleArchive: vi.fn(),
    handleDelete: vi.fn(),
  })),

  useDebounce: vi.fn((value) => value),
  useCreateMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useDeleteMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useUpdateMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

const mockTodoStoreState = {
  searchTerm: '',
  filterStatus: 'all' as 'active' | 'completed' | 'archived' | 'all',
  setSearchTerm: vi.fn(),
  setFilterStatus: vi.fn(),
  clearSearch: vi.fn(),
  editingTodoId: null,
  setEditingTodoId: vi.fn(),
  resetFilters: vi.fn(),
  currentPage: 1,
  pageSize: 10,
  setCurrentPage: vi.fn(),
  setPageSize: vi.fn(),
};

vi.mock('@/stores/todoStore', () => ({
  useTodoStore: vi.fn((selector) => selector(mockTodoStoreState)),
}));

vi.mock('@/stores/notificationStore', () => ({
  useNotificationStore: vi.fn(() => ({})),
  notify: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

// Helpers
const createTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: crypto.randomUUID(),
  title: 'Task',
  isCompleted: false,
  isArchived: false,
  createdAt: new Date().toISOString(),
  updatedAt: undefined,
  ...overrides,
});

const createPaginatedResponse = (todos: Todo[]) => ({
  items: todos,
  totalCount: todos.length,
  totalPages: Math.ceil(todos.length / 10) || 1,
  page: 1,
  pageSize: 10,
});

const renderApp = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <TodoPageContainer />
    </QueryClientProvider>
  );
};

const mockUseTodosQuery = vi.mocked(useTodosQuery);

describe('TodoPageContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTodoStoreState.searchTerm = '';
    mockTodoStoreState.filterStatus = 'all';
    mockTodoStoreState.currentPage = 1;
  });

  describe('Core States', () => {
    it('displays loading state while fetching todos', () => {
      // Arrange
      mockUseTodosQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isFetching: true,
        error: null,
        refetch: vi.fn(),
      } as any);
      // Act
      renderApp();
      // LoadingState.tsx with variant="skeleton" renders skeleton elements with animate-pulse
      const skeletons = document.querySelectorAll('.animate-pulse');
      // Assert
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('displays error state with retry option', async () => {
      // Arrange
      const mockRefetch = vi.fn();
      mockUseTodosQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        error: new Error('Network error'),
        refetch: mockRefetch,
      } as any);
      // Act
      renderApp();
      expect(screen.getByText('Connection Problem')).toBeInTheDocument();
      expect(
        screen.getByText(/Unable to connect to the server/i)
      ).toBeInTheDocument();

      const retryButton = screen.getByRole('button', {
        name: /retry|try again/i,
      });
      retryButton.click();
      // Assert
      expect(mockRefetch).toHaveBeenCalledOnce();
    });

    it('displays empty state when no todos exist', () => {
      // Arrange
      mockUseTodosQuery.mockReturnValue({
        data: createPaginatedResponse([]),
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      } as any);
      // Act
      renderApp();
      // Assert
      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    });
  });

  describe('Search', () => {
    const todos = [
      createTodo({ id: '1', title: 'Deploy to production' }),
      createTodo({ id: '2', title: 'Deploy to staging' }),
      createTodo({ id: '3', title: 'Review code changes' }),
    ];

    beforeEach(() => {
      mockUseTodosQuery.mockReturnValue({
        data: createPaginatedResponse(todos),
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      } as any);
    });

    it('filters todos by search term (case insensitive)', () => {
      // Arrange & Act
      mockTodoStoreState.searchTerm = 'DEPLOY';
      renderApp();
      // Assert
      expect(screen.getByText('Deploy to production')).toBeInTheDocument();
      expect(screen.getByText('Deploy to staging')).toBeInTheDocument();
      expect(screen.queryByText('Review code changes')).not.toBeInTheDocument();
    });

    it('shows no results message when search has no matches', () => {
      // Arrange & Act
      mockTodoStoreState.searchTerm = 'nonexistent';
      renderApp();
      // Assert
      expect(
        screen.getByText(/No tasks match your search/i)
      ).toBeInTheDocument();
    });

    it('ignores whitespace-only searches', () => {
      // Arrange & Act
      mockTodoStoreState.searchTerm = '   ';
      renderApp();
      // Assert
      expect(screen.queryByText(/Showing.*results/)).not.toBeInTheDocument();
      expect(screen.getByText('Deploy to production')).toBeInTheDocument();
    });

    it('handles special characters in search', () => {
      const specialTodos = [
        createTodo({ title: 'Fix [BUG] in production' }),
        createTodo({ title: 'Normal task' }),
      ];

      mockUseTodosQuery.mockReturnValue({
        data: createPaginatedResponse(specialTodos),
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      mockTodoStoreState.searchTerm = '[BUG]';
      renderApp();

      expect(screen.getByText('Fix [BUG] in production')).toBeInTheDocument();
      expect(screen.queryByText('Normal task')).not.toBeInTheDocument();
    });
  });
});
