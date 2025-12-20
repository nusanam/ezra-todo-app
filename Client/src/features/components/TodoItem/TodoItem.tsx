// Handles displays and user actions (ie: delete) for a single todo item

import { type Todo } from '@/api';
import { LoadingSpinner } from '@/components';
import { useTodoItem } from '@/hooks';
import { formatDate } from '@/utils/dateUtils';
import { TitleEditor } from '../TitleEditor';
import { ArchiveButton, CheckboxButton, DeleteButton } from '../TodoActions';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const {
    isBeingEdited,
    isUpdating,
    isDeleting,
    handleToggleComplete,
    handleArchive,
    handleDelete,
  } = useTodoItem(todo);

  const disable = isUpdating || isDeleting || isBeingEdited;
  const loading = isUpdating || isDeleting;

  return (
    <div
      tabIndex={0}
      role="article"
      aria-label={`Task: ${todo.title}. ${todo.isCompleted ? 'Completed' : 'Not completed'}`}
      className={`
        relative group flex items-center justify-between p-4
        bg-white rounded-lg shadow-sm border border-gray-200
        hover:shadow-md transition-shadow
        focus:ring-2 focus:ring-blue-500 focus:outline-none
        ${todo.isArchived ? 'opacity-75 bg-gray-50' : ''}
      `}
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg z-10">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Left Section: Checkbox and Content */}
      <div className="flex items-center space-x-3 flex-1">
        <CheckboxButton
          checked={todo.isCompleted}
          onChange={handleToggleComplete}
          disabled={disable || todo.isArchived}
          ariaLabel={
            todo.isCompleted ? 'Mark as incomplete' : 'Mark as complete'
          }
        />

        <div className="flex-1">
          <TitleEditor todo={todo} />
          <TodoMetadata todo={todo} />
        </div>
      </div>
      {/* Right Section: Actions */}
      <div className="flex items-center gap-2">
        <ArchiveButton
          isArchived={todo.isArchived}
          onArchive={handleArchive}
          disabled={disable}
        />
        <DeleteButton onDelete={handleDelete} disabled={disable} />
      </div>
    </div>
  );
};

// separate component for metadata (for clarity)
const TodoMetadata = ({ todo }: { todo: Todo }) => (
  <div className="text-xs text-gray-400 mt-1">
    Created: {formatDate(todo.createdAt)}
    {todo.updatedAt && ` • Updated: ${formatDate(todo.updatedAt)}`}
    {todo.isArchived && ' • Archived'}
  </div>
);
