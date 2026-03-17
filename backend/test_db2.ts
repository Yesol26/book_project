import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const clubs = await prisma.club.findMany({ include: { books: true } });
    console.log(JSON.stringify(clubs, null, 2));
}
main().finally(() => prisma.$disconnect());
