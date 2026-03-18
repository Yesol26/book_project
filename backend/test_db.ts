import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    console.log(JSON.stringify(await prisma.clubBook.findMany({ include: { book: true, club: true } }), null, 2));
}
main().finally(() => prisma.$disconnect());
