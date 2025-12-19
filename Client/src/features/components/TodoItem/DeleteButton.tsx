import { IconButton } from '@/components';
import { Trash2 as DeleteIcon } from 'lucide-react';

interface DeleteButtonProps {
  onDelete: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const DeleteButton = ({
  onDelete,
  isLoading = false,
  disabled = false,
}: DeleteButtonProps) => {
  return (
    <IconButton
      icon={<DeleteIcon className="h-5 w-5" />}
      onClick={onDelete}
      variant="ghost"
      size="sm"
      disabled={disabled}
      isLoading={isLoading}
      aria-label="Delete todo"
      title="Delete"
      className="text-gray-400 hover:text-red-500"
    />
  );
};
