import { type Todo } from '@/api';
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
          flex-1 cursor-pointer break-words
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
    </div>
  );
};
