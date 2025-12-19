/** Custom hook managing notification lifecycle (ie: enter/exit animations, auto-dismiss):
 *
 * Handles progress bar (shrinking line) countdown timer
 * Controls fade transitions
 * Auto-removes toast after duration ends
 */
import { useNotificationStore } from '@/stores/notificationStore';
import { useEffect, useState } from 'react';

export const useNotificationAnimation = (
  id: string,
  duration: number = 5000
) => {
  const removeNotification = useNotificationStore(
    (state) => state.removeNotification
  );
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  useEffect(() => {
    if (duration <= 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [duration]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeNotification(id);
    }, 200); // match animation duration
  };

  return {
    isVisible,
    isExiting,
    progress,
    handleDismiss,
  };
};
