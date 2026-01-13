import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupChatHandlers } from './socket/chat.handler';
import { errorHandler } from './middlewares/error.middleware';

// Routes
import authRoutes from './routes/auth.routes';
import bookRoutes from './routes/book.routes';
import readingRoutes from './routes/reading.routes';
import clubRoutes from './routes/club.routes';

dotenv.config();

const app: Application = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    },
});

const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.get('/api', (req, res) => {
    res.json({ message: 'Reading Club API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reading', readingRoutes);
app.use('/api/clubs', clubRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Socket.IO setup
setupChatHandlers(io);

// Start server
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Socket.IO ready for connections`);
});

export { io };
