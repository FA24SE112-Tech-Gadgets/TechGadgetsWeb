import React, { useEffect, useState } from 'react';
import * as signalR from "@microsoft/signalr";
import useAuth from '~/context/auth/useAuth';

const apiBase = process.env.NODE_ENV === "development"
  ? process.env.REACT_APP_DEV_API + "/"
  : process.env.REACT_APP_PRO_API + "/";

const Notifications = () => {
    const { user, isAuthenticated } = useAuth();
    const [connection, setConnection] = useState(null);
    const [message, setMessage] = useState('');
    const [message2, setMessage2] = useState('');

    useEffect(() => {
        // Lấy accessToken từ localStorage
        const token = localStorage.getItem("token");

        if (token && isAuthenticated) {
            // Create the SignalR connection
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl(`${apiBase}notification/hub?access_token=${token}`, {
                    withCredentials: false
                })
                .withAutomaticReconnect()
                .build();

            // Start the connection
            newConnection.start()
                .then(() => {
                    console.log('SignalR Connected!');
                    // Call the restricted method "SendMessage"
                    newConnection.invoke("JoinGroup", user?.role == "Customer" ? "CustomerGroup" : "SellerGroup")
                        .then(() => console.log("JoinGroup method invoked successfully"))
                        .catch(err => console.error("Error invoking JoinGroup method:", err));
                    
                    // Group message listener
                    newConnection.on('GroupMethod', (user, receivedMessage) => {
                        setMessage(`${user}: ${receivedMessage}`);
                    });
                    
                    // Personal message listener
                    newConnection.on('PersonalMethod', (user, receivedMessage) => {
                        setMessage2(`${user}: ${receivedMessage}`);
                    });
                })
                .catch(err => console.log('SignalR Connection Error: ', err));

            setConnection(newConnection);
        } else {
            console.warn("Access token not found in localStorage.");
        }

        // Cleanup the connection when component unmounts
        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, []);

    return (
        <div>
            <h1>SignalR Messages</h1>
            <p>Group: {message}</p>
            <p>Personal: {message2}</p>
        </div>
    );
};

export default Notifications;
