'use server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const COMP = prisma.tbl_company;
export const findComp = async ({ c_uid }) => {
    const result = await COMP.findMany({
        where: { c_uid: c_uid },
    });
    return result;
};
