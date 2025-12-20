// Archived todos do not show up in filter views outside of 'Archived'

import { IconButton } from '@/components';
import { Archive, ArchiveRestore } from 'lucide-react';

interface ArchiveButtonProps {
  isArchived: boolean;
  onArchive: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  isUpdating?: boolean;
}

export const ArchiveButton = ({
  isArchived,
  onArchive,
  isLoading = false,
  disabled = false,
}: ArchiveButtonProps) => {
  return (
    <IconButton
      icon={
        isArchived ? (
          <ArchiveRestore className="h-5 w-5" />
        ) : (
          <Archive className="h-5 w-5" />
        )
      }
      onClick={onArchive}
      variant="ghost"
      size="sm"
      disabled={disabled}
      isLoading={isLoading}
      aria-label={isArchived ? 'Unarchive todo' : 'Archive todo'}
      title={isArchived ? 'Unarchive' : 'Archive'}
      className="text-gray-400 hover:text-blue-500"
    />
  );
};
