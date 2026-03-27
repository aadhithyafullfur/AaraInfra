import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const useSocket = () => {
    return useContext(SocketContext) || { socket: null };
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token') || '');
    const socketRef = React.useRef(null);

    useEffect(() => {
        if (!token) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
            }
            return;
        }

        if (socketRef.current && socketRef.current.connected) {
            return;
        }

        const newSocket = io(SOCKET_URL, {
            auth: { token }
        });

        newSocket.on('connect', () => {
            console.log('Connected to socket server:', newSocket.id);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        return () => {
             newSocket.disconnect();
             socketRef.current = null;
             setSocket(null);
        };
    }, [token]);

    useEffect(() => {
        const syncToken = () => {
            const latestToken = localStorage.getItem('token') || '';
            setToken((prev) => (prev === latestToken ? prev : latestToken));
        };

        const intervalId = window.setInterval(syncToken, 1000);
        window.addEventListener('storage', syncToken);

        return () => {
            window.clearInterval(intervalId);
            window.removeEventListener('storage', syncToken);
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
