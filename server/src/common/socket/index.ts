import { Server } from 'socket.io';
import { createServer } from 'http';

let io: Server;

export const initSocket = (server: ReturnType<typeof createServer>): Server => {
    io = new Server(server);
    return io;
};

export const getSocket = (): Server => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};
