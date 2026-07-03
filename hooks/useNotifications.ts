import { useCallback, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { supabase } from '@/lib/supabase';
import { useNotificationStore } from '@/stores/notificationStore';
import { Notification } from '@/types/database';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications(userId?: string) {
  const { notifications, unreadCount, setNotifications, addNotification, markAsRead, markAllAsRead } =
    useNotificationStore();

  const registerForPushNotifications = useCallback(async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return null;

    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  }, []);

  const savePushToken = useCallback(
    async (userId: string) => {
      const token = await registerForPushNotifications();
      if (token) {
        await supabase
          .from('users')
          .update({ push_token: token })
          .eq('id', userId);
      }
    },
    [registerForPushNotifications]
  );

  const fetchNotifications = useCallback(
    async (userId: string) => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications((data as Notification[]) || []);
    },
    [setNotifications]
  );

  const handleMarkAsRead = useCallback(
    async (id: string) => {
      markAsRead(id);
      await supabase.from('notifications').update({ read: true }).eq('id', id);
    },
    [markAsRead]
  );

  const handleMarkAllAsRead = useCallback(
    async (userId: string) => {
      markAllAsRead();
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);
    },
    [markAllAsRead]
  );

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          addNotification(payload.new as Notification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, addNotification]);

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    registerForPushNotifications,
    savePushToken,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
  };
}
