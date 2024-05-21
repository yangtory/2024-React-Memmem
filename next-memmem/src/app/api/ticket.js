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
