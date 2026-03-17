import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const CLUB_COLORS = [
    '#8B5CF6', // 보라
    '#3B82F6', // 파랑
    '#10B981', // 초록
    '#F59E0B', // 노랑/주황
    '#EF4444', // 빨강
    '#0EA5E9', // 하늘
    '#EC4899', // 분홍
    '#6366F1'  // 남색
];

async function main() {
    const clubs = await prisma.club.findMany({
        orderBy: { createdAt: 'asc' }
    });

    for (let i = 0; i < clubs.length; i++) {
        const color = CLUB_COLORS[i % CLUB_COLORS.length];
        await prisma.club.update({
            where: { id: clubs[i].id },
            data: { color }
        });
        console.log(`Updated club ${clubs[i].name} with color ${color}`);
    }

    console.log('Migration completed!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
