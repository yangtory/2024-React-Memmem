"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TICKET = prisma.tbl_minfo;
export const ticketAll = async () => {
  const result = await TICKET.findMany();
  return result;
};
