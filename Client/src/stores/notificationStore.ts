// Notification store to manage app wide toast notifications with factory methods for different notification types. Maintains notification queue with unique IDs and auto dismiss
import { create } from 'zustand';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationStore {
  notifications: Notification[];

  // base actions
  addNotification: (
    type: NotificationType,
    title: string,
    message?: string,
    duration?: number
  ) => void;

  removeNotification: (id: string) => void;
  clearAll: () => void;

  // helper actions
  notifySuccess: (title: string, message?: string, duration?: number) => void;
  notifyError: (title: string, message?: string, duration?: number) => void;
  notifyWarning: (title: string, message?: string, duration?: number) => void;
  notifyInfo: (title: string, message?: string, duration?: number) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],

  addNotification: (type, title, message, duration = 5000) => {
    const id = `${Date.now()}-${Math.random()}`;
    const notification: Notification = { id, type, title, message, duration };

    set((state) => ({
      notifications: [...state.notifications, notification],
    }));

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, duration);
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },

  // helpers to wrap around the base action
  notifySuccess: (title, message, duration) =>
    get().addNotification('success', title, message, duration),

  notifyError: (title, message, duration) =>
    get().addNotification('error', title, message, duration),

  notifyWarning: (title, message, duration) =>
    get().addNotification('warning', title, message, duration),

  notifyInfo: (title, message, duration) =>
    get().addNotification('info', title, message, duration),
}));

export const notify = {
  success: useNotificationStore.getState().notifySuccess,
  error: useNotificationStore.getState().notifyError,
  warning: useNotificationStore.getState().notifyWarning,
  info: useNotificationStore.getState().notifyInfo,
};
