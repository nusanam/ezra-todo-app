// Wrapper for icon-only buttons (archive & delete actions) with enforced accessibility features

import { cn } from '@/utils/cn';
import { forwardRef } from 'react';
import { Button } from './Button';

type IconButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  'leftIcon' | 'rightIcon' | 'children' | 'fullWidth'
> & {
  icon: React.ReactNode;
  'aria-label': string; // required for accessibility
};

// for archive & delete icon buttons
// special button wrapper for displaying icon-only buttons
// forces aria-label props for accessibility standards
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'sm', variant = 'ghost', className, ...props }, ref) => {
    const iconSizeStyles = {
      xs: 'p-1',
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3',
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          iconSizeStyles[size],
          'aspect-square', // keep icon buttons square
          className
        )}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';
