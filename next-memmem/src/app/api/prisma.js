import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client 인스턴스가 중복으로 생성되지 않도록
 * 파일 분리
 */

const prisma = new PrismaClient();

export const closePrismaConnection = async () => {
    await prisma.$disconnect();
};

export default prisma;
