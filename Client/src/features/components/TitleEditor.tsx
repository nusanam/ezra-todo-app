/** Allows in-place editing of todo title's with proper accessibility and error handling

 * Editing is disabled for archived todos
 * Can edit using keyboard shortcuts (tab to navigate, enter to save, esc to cancel editing)

 * Note: Searching for todos cancels editing to prevent user confusion. From a user standpoint, search while editing would be a very nice UX improvement but after long consideration and several refactors, decided against the complexity.
 */

import { type Todo } from '@/api';
import { useEditTodo } from '@/hooks';
import { X as CancelIcon, Check as CheckIcon } from 'lucide-react';
import { TitleDisplay } from './TitleDisplay';

interface TitleEditorProps {
  todo: Todo;
}

export const TitleEditor = ({ todo }: TitleEditorProps) => {
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
      <TitleDisplay
        todo={todo}
        onStartEdit={handleStartEdit}
        onKeyDown={handleTitleKeyDown}
      />
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
            w-64 max-w-md px-2 py-1 border rounded
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
          <CheckIcon className="h-5 w-5" />
        </button>
        <button
          onClick={handleCancel}
          disabled={isPending}
          className="text-gray-400 hover:text-red-500 disabled:opacity-50"
          aria-label="Cancel"
          title="Cancel (Esc)"
        >
          <CancelIcon className="h-5 w-5" />
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
