import { type Todo } from '@/api';
import { Edit2 } from 'lucide-react';
import { KeyboardEvent, MouseEvent } from 'react';

interface TitleDisplayProps {
  todo: Todo;
  onStartEdit: (e?: MouseEvent | KeyboardEvent) => void;
  onKeyDown: (e: KeyboardEvent<HTMLSpanElement>) => void;
}

export const TitleDisplay = ({
  todo,
  onStartEdit,
  onKeyDown,
}: TitleDisplayProps) => {
  return (
    <div className="flex items-center gap-2 flex-1 relative">
      <span
        className={`
          flex-1 cursor-pointer
          ${todo.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}
          ${todo.isArchived ? 'italic opacity-60' : ''}
        `}
        onClick={!todo.isArchived ? onStartEdit : undefined}
        onDoubleClick={!todo.isArchived ? onStartEdit : undefined}
        onKeyDown={!todo.isArchived ? onKeyDown : undefined}
        tabIndex={!todo.isArchived ? 0 : -1}
      >
        {todo.title}
      </span>
      {!todo.isArchived && (
        <button
          onClick={onStartEdit}
          className="
            absolute right-10 top-1/2 -translate-y-1/2
            opacity-0 group-hover:opacity-100
            text-gray-400 hover:text-blue-500
            transition-all p-1
          "
          aria-label="Edit todo"
          title="Edit title"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
