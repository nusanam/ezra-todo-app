/**
 * Container for paginated todo items. Handles page navigation
 * and auto-corrects when current page becomes empty after deletion.
 */

import { type Todo } from '@/api';
import { Pagination } from '@/components';
import { useTodoStore } from '@/stores/todoStore';
import { useEffect } from 'react';
import { TodoItem } from './TodoItem';

interface TodoItemContainerProps {
  todos: Todo[];
  totalPages: number;
}

export const TodoItemContainer = ({
  todos,
  totalPages,
}: TodoItemContainerProps) => {
  const currentPage = useTodoStore((state) => state.currentPage);
  const setCurrentPage = useTodoStore((state) => state.setCurrentPage);

  // goes back a page if the current page shows no todos
  useEffect(() => {
    if (todos.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [todos.length, currentPage, setCurrentPage]);

  return (
    <section aria-label="Todo items">
      <div className="space-y-2">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};
