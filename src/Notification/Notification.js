import React, { useEffect, useState } from 'react';
import * as signalR from "@microsoft/signalr";

const Notifications = () => {
    const [connection, setConnection] = useState(null);
    const [message, setMessage] = useState('');
    const [message2, setMessage2] = useState('');

    useEffect(() => {
        // Lấy accessToken từ localStorage
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            // Create the SignalR connection
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl(`https://tech-gadgets-dev.xyz/notification/hub?access_token=${accessToken}`, {
                    withCredentials: false
                })
                .withAutomaticReconnect()
                .build();

            // Start the connection
            newConnection.start()
                .then(() => {
                    console.log('SignalR Connected!');
                    // Call the restricted method "SendMessage"
                    newConnection.invoke("JoinGroup", "CustomerGroup")
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
    }, [connection]);

    return (
        <div>
            <h1>SignalR Messages</h1>
            <p>Group: {message}</p>
            <p>Personal: {message2}</p>
        </div>
    );
};

export default Notifications;
