'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TICKET = prisma.tbl_minfo;
export const ticketAll = async (ccode) => {
    const result = await TICKET.findMany({
        where: { i_ccode: ccode },
    });
    return result;
};

export const createTicket = async ({ formData }) => {
    await TICKET.create({
        data: {
            i_title: decodeURIComponent(formData.i_title),
            i_price: parseInt(formData.i_price),
            i_count: parseInt(formData.i_count),
            i_ccode: formData.ccode,
        },
    });
};

export const getTicketInfo = async (i_seq) => {
    const result = await TICKET.findMany({
        where: {
            i_seq: i_seq,
        },
    });
    return result;
};
