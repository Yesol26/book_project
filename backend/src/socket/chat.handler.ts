import { Server, Socket } from 'socket.io';

// Socket.IO 채팅 핸들러
export const setupChatHandlers = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('User connected:', socket.id);

        // 모임 채팅방 입장
        socket.on('join-club', (clubId: string) => {
            socket.join(`club-${clubId}`);
            console.log(`User ${socket.id} joined club ${clubId}`);
        });

        // 채팅 메시지 전송
        socket.on('send-message', (data: { clubId: string; message: string }) => {
            // TODO: DB에 메시지 저장
            // TODO: 같은 방의 모든 사용자에게 메시지 전송
            io.to(`club-${data.clubId}`).emit('new-message', data);
        });

        // 모임 채팅방 퇴장
        socket.on('leave-club', (clubId: string) => {
            socket.leave(`club-${clubId}`);
            console.log(`User ${socket.id} left club ${clubId}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
