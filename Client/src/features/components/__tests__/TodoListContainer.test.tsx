// BDD user-focused tests
// Note: The auto-mock zustand setup is in vitest.setup.ts
import type { Todo } from '@/api';
import { TodoListContainer } from '@/features/components';
import { useTodosQuery } from '@/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock setup
vi.mock('@/hooks', () => ({
  useTodosQuery: vi.fn(),
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

vi.mock('@/hooks/useKeyboardShortcuts', () => ({
  useKeyboardShortcuts: vi.fn(),
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

// helpers
const createTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: crypto.randomUUID(),
  title: 'Task',
  isCompleted: false,
  isArchived: false,
  createdAt: new Date().toISOString(),
  updatedAt: undefined,
  ...overrides,
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
      <TodoListContainer />
    </QueryClientProvider>
  );
};

const mockUseTodosQuery = useTodosQuery as ReturnType<typeof vi.fn>;

describe('TodoListContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTodoStoreState.searchTerm = '';
    mockTodoStoreState.filterStatus = 'all';
  });

  describe('Core States', () => {
    it('displays loading state while fetching todos', () => {
      // Arrange
      mockUseTodosQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      });
      // Act
      renderApp();
      // LoadingState.tsx with variant="skeleton" renders skeleton elements with animate-pulse
      // should have one for filter tabs and 3 todo item skeletons
      const skeletons = document.querySelectorAll('.animate-pulse');
      // Assert
      expect(skeletons.length).toBeGreaterThan(0);
      expect(skeletons.length).toBeGreaterThanOrEqual(4);
    });

    it('displays error state with retry option', async () => {
      // Arrange
      const mockRefetch = vi.fn();
      mockUseTodosQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network error'),
        refetch: mockRefetch,
      });
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
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });
      // Act
      renderApp();
      // Assert
      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    const todos = [
      createTodo({ id: '1', title: 'Active task' }),
      createTodo({ id: '2', title: 'Completed task', isCompleted: true }),
      createTodo({ id: '3', title: 'Archived task', isArchived: true }),
      createTodo({
        id: '4',
        title: 'Completed archived',
        isCompleted: true,
        isArchived: true,
      }),
    ];

    beforeEach(() => {
      mockUseTodosQuery.mockReturnValue({
        data: todos,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('shows only non-archived todos in "all" filter', () => {
      // Arrange
      // Act
      mockTodoStoreState.filterStatus = 'all';
      renderApp();
      // Assert
      expect(screen.getByText('Active task')).toBeInTheDocument();
      expect(screen.getByText('Completed task')).toBeInTheDocument();
      expect(screen.queryByText('Archived task')).not.toBeInTheDocument();
      expect(screen.queryByText('Completed archived')).not.toBeInTheDocument();
    });

    it('shows only incomplete non-archived todos in "active" filter', () => {
      // Arrange
      // Act
      mockTodoStoreState.filterStatus = 'active';
      renderApp();
      // Assert
      expect(screen.getByText('Active task')).toBeInTheDocument();
      expect(screen.queryByText('Completed task')).not.toBeInTheDocument();
    });

    it('shows only completed non-archived todos in "completed" filter', () => {
      // Arrange
      // Act
      mockTodoStoreState.filterStatus = 'completed';
      renderApp();
      // Assert
      expect(screen.getByText('Completed task')).toBeInTheDocument();
      expect(screen.queryByText('Active task')).not.toBeInTheDocument();
    });

    it('shows all archived todos in "archived" filter', () => {
      // Arrange
      // Act
      mockTodoStoreState.filterStatus = 'archived';
      renderApp();
      // Assert
      expect(screen.getByText('Archived task')).toBeInTheDocument();
      expect(screen.getByText('Completed archived')).toBeInTheDocument();
      expect(screen.queryByText('Active task')).not.toBeInTheDocument();
    });
  });

  describe('Search', () => {
    const todos = [
      createTodo({ id: '1', title: 'Deploy to production' }),
      createTodo({ id: '2', title: 'Deploy to staging' }),
      createTodo({ id: '3', title: 'Review code changes' }),
      createTodo({ id: '4', title: 'Archived deploy', isArchived: true }),
    ];

    beforeEach(() => {
      mockUseTodosQuery.mockReturnValue({
        data: todos,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('shows filtered todos by search term without case sensitivity', () => {
      // Arrange
      // Act
      mockTodoStoreState.searchTerm = 'DEPLOY';
      mockTodoStoreState.filterStatus = 'all';
      renderApp();
      // Assert
      expect(screen.getByText('Deploy to production')).toBeInTheDocument();
      expect(screen.getByText('Deploy to staging')).toBeInTheDocument();
      expect(screen.queryByText('Review code changes')).not.toBeInTheDocument();
      const searchResultsSection = screen.queryByLabelText(
        'Search results count'
      );
      if (searchResultsSection) {
        expect(searchResultsSection).toHaveTextContent(/2.*results.*DEPLOY/);
      }
    });

    it('combines search with filter constraints', () => {
      // Arrange
      // Act
      mockTodoStoreState.searchTerm = 'deploy';
      mockTodoStoreState.filterStatus = 'archived';
      renderApp();
      // Assert
      expect(screen.getByText('Archived deploy')).toBeInTheDocument();
      expect(
        screen.queryByText('Deploy to production')
      ).not.toBeInTheDocument();
      const searchResultsSection = screen.queryByLabelText(
        'Search results count'
      );
      if (searchResultsSection) {
        expect(searchResultsSection).toHaveTextContent(/1.*result.*deploy/);
      }
    });

    it('shows no results message when search has no matches', () => {
      // Arrange
      // Act
      mockTodoStoreState.searchTerm = 'nonexistent';
      renderApp();
      // Assert
      expect(
        screen.getByText(/No tasks match your search/i)
      ).toBeInTheDocument();
      const searchResultsSection = screen.queryByLabelText(
        'Search results count'
      );
      if (searchResultsSection) {
        expect(searchResultsSection).toHaveTextContent(
          /0.*results.*nonexistent/
        );
      }
    });
  });

  describe('Edge Cases', () => {
    it('handles special characters in search', () => {
      const todos = [
        createTodo({ title: 'Fix [BUG] in production' }),
        createTodo({ title: 'Normal task' }),
      ];

      mockUseTodosQuery.mockReturnValue({
        data: todos,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      mockTodoStoreState.searchTerm = '[BUG]';
      renderApp();

      expect(screen.getByText('Fix [BUG] in production')).toBeInTheDocument();
      expect(screen.queryByText('Normal task')).not.toBeInTheDocument();
    });

    it('ignores whitespace-only searches', () => {
      mockUseTodosQuery.mockReturnValue({
        data: [createTodo({ title: 'Task' })],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      mockTodoStoreState.searchTerm = '   ';
      renderApp();

      expect(screen.queryByText(/Showing.*results/)).not.toBeInTheDocument();
      expect(screen.getByText('Task')).toBeInTheDocument();
    });
  });
});
