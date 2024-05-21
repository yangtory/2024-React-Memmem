"use server";

import { PrismaClient } from "@prisma/client";

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
      i_title: formData.i_title,
      i_price: formData.i_price,
      i_count: formData.i_count,
      i_ccode: formData.ccode,
    },
  });
};
