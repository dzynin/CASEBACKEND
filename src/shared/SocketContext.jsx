// SocketContext.js
import React, { createContext, useContext, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { BASE_URL_DEV } from "../utils"; // Import the BASE_URL_DEV

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const socketRef = useRef();

    useEffect(() => {
        // const socket = io("http://localhost:8000");
        const socket = io(BASE_URL_DEV); // Use BASE_URL_DEV here
        socketRef.current = socket;
        console.log("Socket connection established");

        return () => {
            socket.disconnect();
            console.log("Socket disconnected");
        };
    }, []);

    return (
        <SocketContext.Provider value={socketRef.current}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};
