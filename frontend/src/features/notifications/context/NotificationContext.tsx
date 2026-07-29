import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi, NotificationDto } from '../api/notificationApi';

interface NotificationContextType {
  notifications: NotificationDto[];
  unreadCount: number;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery<NotificationDto[]>({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getRecent(10),
    refetchInterval: 5000,
  });

  const unreadCount = notifications.filter((n: NotificationDto) => !n.isRead).length;

  const markAllReadMutation = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  const markReadMutation = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  const value = {
    notifications,
    unreadCount,
    markAllAsRead: () => markAllReadMutation.mutate(),
    markAsRead: (id: string) => markReadMutation.mutate(id),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
