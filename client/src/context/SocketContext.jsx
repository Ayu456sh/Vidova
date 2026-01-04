import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Connect to backend
        // Connect to backend
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const newSocket = io(API_URL);
        setSocket(newSocket);

        // Clean up
        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (!socket) return;

        // Listen for video processed event
        socket.on('video_processed', (video) => {
            if (video.status === 'Error') {
                toast.error(`Analysis Failed: Video "${video.title}" could not be analyzed.`);
            } else if (video.sensitivity === 'Flagged') {
                toast.warn(`Analysis Complete: Video "${video.title}" was FLAGGED.`);
            } else {
                toast.success(`Analysis Complete: Video "${video.title}" is SAFE.`);
            }
        });

        return () => {
            socket.off('video_processed');
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
            <ToastContainer position="bottom-right" theme="dark" />
        </SocketContext.Provider>
    );
};
