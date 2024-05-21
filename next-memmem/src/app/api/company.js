"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COMP = prisma.tbl_company;
export const selectAll = async () => {
  const result = await COMP.findMany();
  return result;
};
