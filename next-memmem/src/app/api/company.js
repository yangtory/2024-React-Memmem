"use server";
import prisma from "./prisma";

const COMP = prisma.tbl_company;
export const selectAll = async () => {
  const result = await COMP.findMany();
  await prisma.$disconnect();
  return result;
};
