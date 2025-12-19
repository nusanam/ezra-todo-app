/** Allows in-place editing of todo title's with proper accessibility and error handling

 * Editing is disabled for archived todos
 * Can edit using keyboard shortcuts (tab to navigate, enter to save, esc to cancel editing)

 * Note: Searching for todos cancels editing to prevent user confusion. From a user standpoint, search while editing would be a very nice UX improvement but after long consideration and several refactors, decided against the complexity.
 */

import { type Todo } from '@/api';
import { useEditTodo } from '@/hooks';
import { Check, Edit2, X } from 'lucide-react';

interface EditTodoProps {
  todo: Todo;
}

export const EditTodo = ({ todo }: EditTodoProps) => {
  const {
    isEditing,
    editedTitle,
    error,
    inputRef,
    isPending,
    handleStartEdit,
    handleCancel,
    handleSave,
    handleInputKeyDown,
    handleTitleKeyDown,
    setEditedTitle,
    setError,
  } = useEditTodo(todo);

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2 flex-1">
        <span
          className={`
            flex-1 cursor-pointer
            ${todo.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}
            ${todo.isArchived ? 'italic opacity-60' : ''}
          `}
          onClick={!todo.isArchived ? handleStartEdit : undefined}
          onDoubleClick={!todo.isArchived ? handleStartEdit : undefined}
          onKeyDown={!todo.isArchived ? handleTitleKeyDown : undefined}
          tabIndex={!todo.isArchived ? 0 : -1}
        >
          {todo.title}
        </span>
        {!todo.isArchived && (
          <button
            onClick={handleStartEdit}
            className="
              opacity-0 group-hover:opacity-100
              text-gray-400 hover:text-blue-500
              transition-all
            "
            aria-label="Edit todo"
            title="Edit title"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={editedTitle}
          onChange={(e) => {
            setEditedTitle(e.target.value);
            setError('');
          }}
          onKeyDown={handleInputKeyDown}
          disabled={isPending}
          className={`
            flex-1 px-2 py-1 border rounded
            ${error ? 'border-red-500' : 'border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:opacity-50
          `}
        />
        <button
          onClick={handleSave}
          disabled={isPending}
          className="text-green-600 hover:text-green-700 disabled:opacity-50"
          aria-label="Save"
          title="Save (Enter)"
        >
          <Check className="h-5 w-5" />
        </button>

        <button
          onClick={handleCancel}
          disabled={isPending}
          className="text-gray-400 hover:text-red-500 disabled:opacity-50"
          aria-label="Cancel"
          title="Cancel (Esc)"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
