import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        const token = localStorage.getItem('token');
        socket = io(SOCKET_URL, {
            auth: {
                token,
            },
            autoConnect: false,
        });
    }
    return socket;
};

export const connectSocket = () => {
    const socket = getSocket();
    if (!socket.connected) {
        socket.connect();
    }
};

export const disconnectSocket = () => {
    if (socket?.connected) {
        socket.disconnect();
    }
};
