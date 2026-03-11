import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
    console.log('🔗 Redis connected successfully.');
});

// 애플리케이션 시작 시 백그라운드로 연결 시도
redisClient.connect().catch(console.error);

export default redisClient;
