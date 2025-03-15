import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// Create a context
const SocketContext = createContext(null);

// Export the hook to use context in other components
export const useSocket = () => {
  return useContext(SocketContext);
};

// Socket provider component (wrap your App or dashboard in this)
export const SocketProvider = ({ children }) => {
  const socketRef = useRef();

  useEffect(() => {
    // Initialize connection (replace with your server URL)
    socketRef.current = io('http://localhost:5000', {
      transports: ['websocket'], // Optional: optimize connection type
      reconnectionAttempts: 5,   // Optional: retry count
      timeout: 10000             // Optional: timeout in ms
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Connected to Socket.IO server');
    });

    socketRef.current.on('disconnect', () => {
      console.warn('⚠️ Disconnected from Socket.IO server');
    });

    // Clean up socket on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
