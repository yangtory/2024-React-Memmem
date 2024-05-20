'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TICKET = prisma.tbl_minfo;
export const ticketAll = async (i_ccode) => {
    const result = await TICKET.findMany({
        where: { i_ccode },
    });
    return result;
};
