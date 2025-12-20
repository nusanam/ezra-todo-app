// Pagination controls with previous/next navigation and page count display
// No page selection since it seems unnecessary with search

import { IconButton } from '@/components';
import {
  ChevronLeft as LeftIcon,
  ChevronRight as RightIcon,
} from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className="flex items-center justify-center gap-4 mt-6 pb-6"
    >
      <IconButton
        icon={<LeftIcon className="h-5 w-5" />}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="ghost"
        size="md"
        aria-label="Go to previous page"
        title="Previous page"
        className="px-4 py-2 rounded-lg border border-gray-300
          disabled:opacity-50 disabled:cursor-not-allowed
          hover:bg-gray-100 transition-colors"
      />

      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      <IconButton
        icon={<RightIcon className="h-5 w-5" />}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="ghost"
        size="sm"
        aria-label="Go to next page"
        title="Next page"
      />
    </nav>
  );
};
