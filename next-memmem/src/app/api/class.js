"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CLASS = prisma.tbl_class;

export const classAll = async (ccode, formattedDate) => {
  const result = await CLASS.findMany({
    where: { c_ccode: ccode, c_sdate: formattedDate },
  });
  return result;
};

export const createClass = async ({ formData }) => {
  await prisma.CLASS.create({
    data: {
      c_name: formData.c_name,
      c_sdate: formData.c_sdate,
      c_edate: formData.c_edate,
      c_stime: formData.c_stime,
      c_etime: formData.c_etime,
      c_tcode: formData.c_tcode,
      c_ccode: formData.ccode,
      c_color: formData.c_color,
    },
  });
};
