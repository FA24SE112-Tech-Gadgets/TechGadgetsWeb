import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { requestForToken, clearDeviceToken, getCurrentToken, onMessageListener } from '~/ultis/firebase';

const NotiContext = createContext();

export function NotiProvider({ children }) {
  const [deviceToken, setDeviceToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const requestAndUpdateToken = async () => {
    try {
      const token = await requestForToken();
      if (token) {
        setDeviceToken(token);
        return token;
      }
      return null;
    } catch (error) {
      console.error("Error requesting token:", error);
      return null;
    }
  };

  const deleteDeviceToken = async () => {
    try {
      const tokenToDelete = getCurrentToken() || deviceToken;
      if (tokenToDelete) {
        await AxiosInterceptor.delete("/api/device-tokens", {
          data: {
            token: tokenToDelete
          }
        });
        clearDeviceToken();
        setDeviceToken(null);
        console.log("deleted device token", tokenToDelete);
        
      }
    } catch (error) {
      console.error("Error deleting device token:", error);
    }
  };

  const fetchNotifications = async (page = 1) => {
    const now = Date.now();
    
    // If there's an ongoing fetch, wait for it to complete
    if (fetchPromiseRef.current) {
      await fetchPromiseRef.current;
    }
    
    // Check cooldown
    if (now - lastFetchTimeRef.current < FETCH_COOLDOWN) {
      return;
    }

    try {
      setIsFetching(true);
      lastFetchTimeRef.current = now;
      
      // Store the promise in ref so other calls can wait for it
      fetchPromiseRef.current = AxiosInterceptor.get(
        `/api/notifications?page=${page}&pageSize=10`
      );
      
      const response = await fetchPromiseRef.current;
      const newNotifications = response.data.items;
console.log('newNotifications', newNotifications);
      setNotifications((prev) => {
        if (page === 1) {
          return newNotifications;
        }
        const existingIds = new Set(prev.map(n => n.id));
        const uniqueNewNotifications = newNotifications.filter(
          n => !existingIds.has(n.id)
        );
        return [...prev, ...uniqueNewNotifications];
      });
      
      if (page === 1) {
        const unreadNotifications = newNotifications.filter(
          (notification) => !notification.isRead
        ).length;
        setUnreadCount(unreadNotifications);
      }

      setHasMore(response.data.hasNextPage);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw error;
    } finally {
      setIsFetching(false);
      fetchPromiseRef.current = null;
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await AxiosInterceptor.put(`/api/notification/${notificationId}`);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
      // Giảm số thông báo chưa đọc
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      await AxiosInterceptor.put(`/api/notification/all`);
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const addNewNotification = (newNotification) => {
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  // Thêm ref để track thời gian fetch cuối cùng
  const FETCH_COOLDOWN = 2000; // 2 giây cooldown giữa các lần fetch
  const fetchPromiseRef = useRef(null);
  const lastFetchTimeRef = useRef(0);
  
  const resetNotificationCount = () => {
    setNotificationCount(0);
  };

  const setupMessageListener = (onShowNotification) => {
    const messageHandler = (payload) => {
      console.log("Received message in context:", payload);
      setHasNewNotification(true);
      
      // Increment notification count
      setNotificationCount(prev => prev + 1);
      
      // Add 3 second delay before fetching
      setTimeout(() => {
        fetchNotifications(1).then(() => {
          if (onShowNotification) {
            onShowNotification(payload);
          }
          setHasNewNotification(false);
        });
      }, 3000);
    };

    return onMessageListener(messageHandler);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    // Tính toán lại tổng số thông báo chưa đọc mỗi khi notifications thay đổi
    const unreadTotal = notifications.filter(n => !n.isRead).length;
    if (unreadTotal !== unreadCount) {
      setUnreadCount(unreadTotal);
    }
  }, [notifications]);

  useEffect(() => {
    const channel = new BroadcastChannel('notification-channel');
    
    const handleNotification = (event) => {
      console.log('🔔 Broadcast received:', event.data);
      
      if (event.data?.type === 'BACKGROUND_NOTIFICATION') {
        console.log('🔔 Got background notification');
        // Đánh dấu có notification mới
        setHasNewNotification(true);
        setNotificationCount(prev => prev + 1); // Increment count for background notifications
        
        console.log('⏰ Waiting 3s before fetch...');
        setTimeout(() => {
          console.log('🔄 Fetching notifications...');
          fetchNotifications(1)
            .then(() => {
              console.log('✅ Fetch completed');
              setHasNewNotification(false);
            })
            .catch(error => {
              console.error('❌ Fetch failed:', error);
              setHasNewNotification(false);
            });
        }, 3000);
      }
    };

    // Đăng ký listener
    channel.addEventListener('message', handleNotification);
    console.log('📡 Broadcast channel listener registered');

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up broadcast channel');
      channel.removeEventListener('message', handleNotification);
      channel.close();
    };
  }, []); // Empty dependency array

  // Thêm useEffect để đăng ký và kiểm tra service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(registration => {
          console.log('📥 Service Worker registered with scope:', registration.scope);
          
          // Kiểm tra trạng thái
          if (registration.active) {
            console.log('✅ Service Worker active');
          }
        })
        .catch(error => {
          console.error('❌ Service Worker registration failed:', error);
        });

      // Kiểm tra service worker hiện tại
      navigator.serviceWorker.ready.then(registration => {
        console.log('🚀 Service Worker ready');
      });
    }
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Đăng ký service worker
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(async (registration) => {
          console.log('🔰 Service Worker registration successful');
          
          // Đợi service worker active
          await navigator.serviceWorker.ready;
          console.log('🚀 Service Worker is ready');

          // Yêu cầu permission
          const permission = await Notification.requestPermission();
          console.log('📢 Notification permission:', permission);
          
          if (permission === 'granted') {
            // Yêu cầu token
            requestAndUpdateToken();
          }
        })
        .catch(err => console.error('Service Worker registration failed:', err));
    }
  }, []);

  return (
    <NotiContext.Provider value={{ 
      deviceToken, 
      setDeviceToken, 
      deleteDeviceToken,
      requestAndUpdateToken,
      notifications,
      unreadCount,
      isFetching,
      hasMore,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      setUnreadCount,
      addNewNotification,
      hasNewNotification,
      setHasNewNotification,
      setupMessageListener, // Thêm lại setupMessageListener vào context
      notificationCount,
      resetNotificationCount
    }}>
      {children}
    </NotiContext.Provider>
  );
}

export function useDeviceToken() {
  return useContext(NotiContext);
}