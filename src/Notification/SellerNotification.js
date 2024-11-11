import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, Circle } from 'lucide-react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { onMessageListener } from '~/ultis/firebase';
import { useNavigate } from 'react-router-dom';

const SellerNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const dropdownRef = useRef(null);
    const pageRef = useRef(currentPage);
    const navigate = useNavigate();
    const fetchNotifications = async (page = 1) => {
        if (isFetching || !hasMore) return;

        try {
            setIsFetching(true);
            const response = await AxiosInterceptor.get(`/api/notifications?page=${page}&pageSize=10`);
            const newNotifications = response.data.items;

            setNotifications(prev => {
                if (page === 1) return newNotifications;
                return [...prev, ...newNotifications];
            });

            const unreadNotifications = page === 1
                ? newNotifications.filter(notification => !notification.isRead).length
                : notifications.concat(newNotifications).filter(notification => !notification.isRead).length;
            setUnreadCount(unreadNotifications);

            setHasMore(response.data.hasNextPage);
            pageRef.current = page;
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        fetchNotifications();

        onMessageListener()
            .then((payload) => {
                console.log("Foreground notification received: ", payload);
                const newNotification = {
                    id: payload.notification.id,
                    title: payload.notification.title,
                    content: payload.notification.body,
                    isRead: false,
                    type: payload.notification.type,
                    sellerOrderId: payload.notification.sellerOrderId,
                    createdAt: new Date().toISOString(),
                    customer: payload.notification.customer,
                    seller: payload.notification.seller,
                };

                setNotifications(prev => [newNotification, ...prev]);
                setUnreadCount(prev => prev + 1);
            })
            .catch((err) => console.log("Failed to receive message: ", err));
    }, []);

    const toggleDropdown = () => {
        // Reset unreadCount về 0 khi click vào chuông
        setUnreadCount(0);
        setShowDropdown(!showDropdown);
    };

    const markAsRead = async (notificationId) => {
        try {
            await AxiosInterceptor.put(`/api/notification/${notificationId}`);
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await AxiosInterceptor.put(`/api/notification/all`);
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, isRead: true }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const handleScroll = useCallback((e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const threshold = 50;

        if (scrollHeight - scrollTop - threshold <= clientHeight && !isFetching && hasMore) {
            const nextPage = pageRef.current + 1;
            setCurrentPage(nextPage);
            fetchNotifications(nextPage);
        }
    }, [hasMore, isFetching]);

    const handleNotificationClick = (notification) => {
        markAsRead(notification.id);
        if (notification.type === 'SellerOrder' && notification.sellerOrderId) {
            navigate(`/order/detail-seller/${notification.sellerOrderId}`);
        } else if (notification.type === 'WalletTracking') {
            navigate('/seller/transaction-history');
        }
    };
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
                <Bell className="text-gray-700 hover:text-indigo-900" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div
                    className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[80vh] flex flex-col"
                >
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Thông báo</h3>
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Đánh dấu tất cả
                        </button>
                    </div>

                    <div
                        className="overflow-y-auto flex-1 scroll-smooth"
                        onScroll={handleScroll}
                    >
                        {isFetching && currentPage === 1 ? (
                            <div className="flex justify-center p-4">
                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <p className="p-4 text-center text-gray-500">Không có thông báo</p>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}

                                    className={`p-4 border-b hover:bg-gray-100 cursor-pointer transition-colors
                    ${notification.isRead ? 'bg-white' : 'bg-gray-200'}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex items-center">
                                        <div className="flex-grow">
                                            <p className="text-sm font-semibold">{notification.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">{notification.content}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(notification.createdAt).toLocaleString('vi-VN')}
                                            </p>
                                        </div>
                                        {!notification.isRead && (
                                            <span className="text-blue-500">
                                                <Circle fill="currentColor" className="w-4 h-4" />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                        {isFetching && currentPage > 1 && (
                            <div className="flex justify-center p-4">
                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerNotification;