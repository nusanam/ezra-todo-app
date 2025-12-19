// Uses cva (class-variance-authority) for managing type safe toast variants, which also allows for better tailwind class organization
// Exports reusable style functions for consistent theming

import { cva } from 'class-variance-authority';

export const NotificationVariants = cva(
  'relative overflow-hidden rounded-lg border shadow-lg',
  {
    variants: {
      type: {
        success: 'bg-green-50 text-green-800 border-green-200',
        error: 'bg-red-50 text-red-800 border-red-200',
        warning: 'bg-amber-50 text-amber-800 border-amber-200',
        info: 'bg-blue-50 text-blue-800 border-blue-200',
      },
    },
  }
);

export const iconVariants = cva('h-5 w-5', {
  variants: {
    type: {
      success: 'text-green-400',
      error: 'text-red-400',
      warning: 'text-amber-400',
      info: 'text-blue-400',
    },
  },
});

export const containerClasses = (isVisible: boolean, isExiting: boolean) =>
  `w-full max-w-sm transform transition-all duration-200 ease-out ${
    isVisible && !isExiting
      ? 'translate-x-0 opacity-100'
      : 'translate-x-full opacity-0'
  }`;
