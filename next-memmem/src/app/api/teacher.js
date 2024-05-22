"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TEACHER = prisma.tbl_teacher;

export const selectAll = async (ccode) => {
  const result = await TEACHER.findMany({
    where: { t_ccode: ccode },
  });
  return result;
};
