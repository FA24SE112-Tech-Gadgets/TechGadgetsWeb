import React, { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import 'text-encoding';
import { FaBell } from 'react-icons/fa';

const routingKey = "getAllNoti";
const exchangeName = "test-exchange";
const webSocketPort = "15674";
const domainName = "kietpt.online";

const Notifications = ({ onNewNotification }) => {
    const [notifications, setNotifications] = useState([]);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const clientRef = useRef(null);

    useEffect(() => {
        const headers = {
            login: 'myadmin', 
            passcode: 'mypassword'
        };

        const client = new Client({
            brokerURL: `ws://${domainName}:${webSocketPort}/ws`,
            connectHeaders: headers,
            onConnect: () => {
                console.log('Connected to RabbitMQ');
                client.subscribe(`/exchange/${exchangeName}/${routingKey}`, message => {
                    console.log(`Received: ${message.body}`);

                    // Update notifications and notify parent component
                    setNotifications(prevNotifications => {
                        const newNotifications = [...prevNotifications, message.body];
                        onNewNotification(newNotifications.length, newNotifications);
                        return newNotifications;
                    });
                });
            },
            onStompError: (frame) => {
                const readableString = new TextDecoder().decode(frame.binaryBody);
                console.log('STOMP error', readableString);
            },
            appendMissingNULLonIncoming: true,
            forceBinaryWSFrames: true
        });

        clientRef.current = client;
        client.activate();

        return () => {
            if (clientRef.current) {
                console.log("Disconnecting from RabbitMQ");
                clientRef.current.deactivate();
            }
        };
    }, [onNewNotification]);

    const toggleDropdown = () => {
        // Toggle the dropdown state
        setDropdownOpen(prev => {
            const newIsDropdownOpen = !prev;
            console.log(`Dropdown state: ${newIsDropdownOpen}`);
            // Reset notifications only if dropdown is opening
            if (newIsDropdownOpen) {
                console.log('Resetting notifications');
                onNewNotification(0, []);
            }
    
            return newIsDropdownOpen;
        });
    };
    

    const handleNotificationClick = (index) => {
        // Optionally handle specific notification click here
        // For example, you might want to log or process the notification
        console.log(`Notification ${index} clicked: ${notifications[index]}`);
        
        // Reset notification count to 0 after clicking any notification
        setNotifications([]);
        onNewNotification(0, []);
    };

    return (
        <div className="relative">
            {/* Notification bell icon */}
            <div onClick={toggleDropdown} className="cursor-pointer relative">
                <FaBell className="text-xl text-white" />
                {notifications.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                        {notifications.length}
                    </span>
                )}
            </div>

            {/* Notification Dropdown */}
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg rounded-lg z-50">
                    <ul className="py-2">
                        {notifications.length === 0 ? (
                            <li className="text-gray-500 text-center py-2">No notifications</li>
                        ) : (
                            notifications.map((notification, index) => (
                                <li
                                    key={index}
                                    className="p-3 border-b border-gray-300 dark:border-gray-600 text-sm dark:text-gray-200 cursor-pointer"
                                    onClick={() => handleNotificationClick(index)}
                                >
                                    {notification}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Notifications;
