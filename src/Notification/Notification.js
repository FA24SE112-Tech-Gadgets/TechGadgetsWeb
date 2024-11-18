import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, Circle, ShoppingCart, Wallet, BellRing, Clock, MessageSquare, Info } from 'lucide-react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { onMessageListener } from '~/ultis/firebase';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
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

            setNotifications((prev) => (page === 1 ? newNotifications : [...prev, ...newNotifications]));
            const unreadNotifications = page === 1
                ? newNotifications.filter((notification) => !notification.isRead).length
                : notifications.concat(newNotifications).filter((notification) => !notification.isRead).length;
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
                console.log('Foreground notification received:', payload);
                const newNotification = {
                    id: payload.notification.id,
                    title: payload.notification.title,
                    content: payload.notification.body,
                    isRead: false,
                    type: payload.notification.type,
                    sellerOrderId: payload.notification.sellerOrderId,
                    createdAt: new Date().toISOString(),
                };

                setNotifications((prev) => [newNotification, ...prev]);
                setUnreadCount((prev) => prev + 1);
            })
            .catch((err) => console.log('Failed to receive message:', err));
    }, []);

    const toggleDropdown = () => {
        setUnreadCount(0);
        setShowDropdown(!showDropdown);
    };

    const markAsRead = async (notificationId) => {
        try {
            await AxiosInterceptor.put(`/api/notification/${notificationId}`);
            setNotifications((prev) =>
                prev.map((notification) =>
                    notification.id === notificationId ? { ...notification, isRead: true } : notification
                )
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
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
            navigate(`/order/detail/${notification.sellerOrderId}`);
        } else if (notification.type === 'WalletTracking') {
            navigate('/deposit-history');
        }
    };

    const getNotificationIcon = (type) => {
        const iconClass = "w-10 h-10 p-2.5"; // Chuẩn hóa kích thước icon
        switch (type) {
            case 'SellerOrder':
                return <ShoppingCart className={`${iconClass} bg-blue-100 text-blue-600 rounded-full flex-shrink-0`} />;
            case 'WalletTracking':
                return <Wallet className={`${iconClass} bg-green-100 text-green-600 rounded-full flex-shrink-0`} />;
            default:
                return <BellRing className={`${iconClass} bg-gray-100 text-gray-600 rounded-full flex-shrink-0`} />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative p-2 rounded-full hover:bg-gray-200 transition-all"
            >
                <Bell className="w-6 h-6 text-gray-700 hover:text-indigo-900" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-[380px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-[85vh] flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                        <h3 className="text-xl font-bold text-gray-800">Thông báo</h3>
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Đánh dấu tất cả đã đọc
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
                            <p className="p-4 text-center text-gray-500">No notifications</p>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-3 cursor-pointer hover:bg-gray-50 transition-all 
                                    ${notification.isRead ? 'bg-white' : 'bg-blue-50'}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex items-start space-x-3">
                                        {getNotificationIcon(notification.type)}
                                        <div className="flex-grow">
                                            <div className="flex items-center space-x-2">
                                                <p className={`text-xs ${notification.isRead ? 'text-gray-800' : 'text-gray-900 font-semibold'}`}>
                                                    {notification.title}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2 mt-1">
                                            <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <p className="text-xs text-gray-500">{notification.content}</p>
                                            </div>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <p className="text-xs text-gray-400">
                                                    {new Date(notification.createdAt).toLocaleString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                        {!notification.isRead && (
                                            <Circle fill="currentColor" className="w-3 h-3 text-blue-600 flex-shrink-0" />
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

export default Notification;
