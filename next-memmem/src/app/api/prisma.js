import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const closePrismaConnection = async () => {
    await prisma.$disconnect();
};

export default prisma;
