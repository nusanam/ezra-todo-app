/** Container that orchestrates active toast notifications

  * Fixed position at top right of viewport
  * Maps through notification array from Notifcation Store
  * Wraps toasts with animation logic via useNotificationAnimation hook
*/
import { useNotificationStore } from '@/stores/notificationStore';
import { Notification } from './Notification';
import { useNotificationAnimation } from './useNotificationAnimation';

// inner component that uses a custom animation hook for each notification
const NotificationWithAnimation = ({
  id,
  type,
  title,
  message,
  duration = 5000,
}: {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}) => {
  const { isVisible, isExiting, progress, handleDismiss } =
    useNotificationAnimation(id, duration);

  return (
    <Notification
      type={type}
      title={title}
      message={message}
      duration={duration}
      isVisible={isVisible}
      isExiting={isExiting}
      progress={progress}
      onDismiss={handleDismiss}
    />
  );
};

export const NotificationContainer = () => {
  const notifications = useNotificationStore((state) => state.notifications);

  if (notifications.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none"
      aria-live="assertive"
      aria-atomic="true"
    >
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <NotificationWithAnimation {...notification} />
        </div>
      ))}
    </div>
  );
};
