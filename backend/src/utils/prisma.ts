// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient({
//     log: ['query', 'error', 'warn'],
// });

// export default prisma;

import { PrismaClient } from '@prisma/client';

// 전역 변수에 prisma 인스턴스를 저장할 수 있도록 타입을 정의합니다.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

// 운영 환경이 아닐 때만 전역 변수에 저장해서 재사용합니다.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;