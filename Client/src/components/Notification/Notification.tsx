// Presentational component for rendering toast notifications with auto dismiss logic and a progress bar (a shrinking thin line) from the container component

import {
  AlertTriangle,
  CheckCircle,
  X as DeleteIcon,
  Info,
  XCircle,
} from 'lucide-react';
import {
  containerClasses,
  iconVariants,
  NotificationVariants,
} from './NotificationVariants';

interface NotificationProps {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration: number;
  isVisible: boolean;
  isExiting: boolean;
  progress: number;
  onDismiss: () => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export const Notification = ({
  type,
  title,
  message,
  duration,
  isVisible,
  isExiting,
  progress,
  onDismiss,
}: NotificationProps) => {
  const NotificationIcon = icons[type];

  return (
    <div role="alert" className={containerClasses(isVisible, isExiting)}>
      <div className={NotificationVariants({ type })}>
        <div className="p-4">
          <div className="flex items-start">
            {/* Icon */}
            <div className="flex-shrink-0">
              <NotificationIcon className={iconVariants({ type })} />
            </div>

            {/* Content */}
            <div className="ml-3 flex-1 pt-0.5">
              <p className="text-sm font-medium leading-none">{title}</p>
              {message && (
                <p className="mt-1.5 text-sm opacity-90 leading-normal">
                  {message}
                </p>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={onDismiss}
              className="ml-4 flex-shrink-0 inline-flex text-current opacity-60 hover:opacity-100 transition-opacity focus:outline-none focus:opacity-100"
              aria-label="Dismiss notification"
            >
              <DeleteIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-current opacity-10">
            <div
              className="h-full bg-current opacity-30 transition-all duration-100 ease-linear origin-left"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
