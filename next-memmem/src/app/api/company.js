"use server";
import prisma from "./prisma";

const COMP = prisma.tbl_company;
export const selectAll = async () => {
  const result = await COMP.findMany();
  await prisma.$disconnect();
  return result;
};

export const findComp = async (code) => {
  const result = await COMP.findUnique({
    where: { c_code: code },
  });
  prisma.$disconnect();
  return result;
};
