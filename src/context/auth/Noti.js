import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { requestForToken, clearDeviceToken, getCurrentToken, onMessageListener } from '~/ultis/firebase';
import useAuth from './useAuth';


const NotiContext = createContext();

export function NotiProvider({ children }) {
  const [deviceToken, setDeviceToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { isAuthenticated, user } = useAuth(); // Add this line

  // Add logging here
  console.log('Current user object:', user);

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
    // Check authentication
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping notification fetch');
      return;
    }

    // Only allow Customer and Seller to receive notifications
    if (user?.role !== 'Customer' && user?.role !== 'Seller') {
      console.log('Only Customer and Seller can receive notifications');
      return;
    }

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

  // Add messageHandlerRef to track active handlers
  const messageHandlerRef = useRef(null);

  const setupMessageListener = useCallback((onShowNotification) => {
    if (!isAuthenticated) return;

    // If we already have a handler, don't create a new one
    if (messageHandlerRef.current) {
      return () => {};
    }

    const messageHandler = (payload) => {
      console.log("Received message in context:", payload);
      setHasNewNotification(true);
      setNotificationCount(prev => prev + 1);
      
      setTimeout(() => {
        fetchNotifications(1).then(() => {
          if (onShowNotification) {
            onShowNotification(payload);
          }
          setHasNewNotification(false);
        });
      }, 3000);
    };

    messageHandlerRef.current = messageHandler;
    const unsubscribe = onMessageListener(messageHandler);
    
    return () => {
      messageHandlerRef.current = null;
      unsubscribe();
    };
  }, [isAuthenticated, fetchNotifications]);

  // Chỉ giữ lại useEffect để handle message
  useEffect(() => {
    let unsubscribe = null;
    
    if (isAuthenticated) {
      const messageHandler = (payload) => {
        console.log("Received message in context:", payload);
        setHasNewNotification(true);
        setNotificationCount(prev => prev + 1);
        
        setTimeout(() => {
          fetchNotifications(1).then(() => {
            setHasNewNotification(false);
          });
        }, 3000);
      };
  
      unsubscribe = onMessageListener(messageHandler);
    }
  
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isAuthenticated]);

  useEffect(() => {
    // Only fetch notifications if user is authenticated
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]); // Add isAuthenticated as dependency

  useEffect(() => {
    // Tính toán lại tổng số thông báo chưa đọc mỗi khi notifications thay đổi
    const unreadTotal = notifications.filter(n => !n.isRead).length;
    if (unreadTotal !== unreadCount) {
      setUnreadCount(unreadTotal);
    }
  }, [notifications]);

  // Broadcast channel effect
  useEffect(() => {
    if (!isAuthenticated) return;

    const channel = new BroadcastChannel('notification-channel');
    
    const handleNotification = (event) => {
      if (event.data?.type === 'BACKGROUND_NOTIFICATION') {
        setHasNewNotification(true);
        setNotificationCount(prev => prev + 1);
        
        setTimeout(() => {
          fetchNotifications(1)
            .then(() => setHasNewNotification(false))
            .catch(error => {
              console.error('❌ Fetch failed:', error);
              setHasNewNotification(false);
            });
        }, 3000);
      }
    };

    channel.addEventListener('message', handleNotification);

    return () => {
      channel.removeEventListener('message', handleNotification);
      channel.close();
    };
  }, [isAuthenticated]);

  // Gộp các useEffect liên quan đến service worker
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('📥 Service Worker registered with scope:', registration.scope);
        
        await navigator.serviceWorker.ready;
        console.log('🚀 Service Worker ready');

        if (isAuthenticated) {
          const permission = await Notification.requestPermission();
          console.log('📢 Notification permission:', permission);
          
          if (permission === 'granted') {
            requestAndUpdateToken();
          }
        }
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    };

    registerServiceWorker();
  }, [isAuthenticated]);

  useEffect(() => {
    let unsubscribe = null;
    
    if (isAuthenticated) {
      const messageHandler = (payload) => {
        console.log("Received message in context:", payload);
        setHasNewNotification(true);
        setNotificationCount(prev => prev + 1);
        
        setTimeout(() => {
          fetchNotifications(1).then(() => {
            setHasNewNotification(false);
          });
        }, 3000);
      };
  
      unsubscribe = onMessageListener(messageHandler);
    }
  
    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isAuthenticated]); // Chỉ re-run khi auth state thay đổi

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
      setupMessageListener, // Add this back
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