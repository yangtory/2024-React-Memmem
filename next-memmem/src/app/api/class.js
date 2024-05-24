"use server";
import prisma from "./prisma";
const CLASS = prisma.tbl_class;
const TEACHER = prisma.tbl_teacher;

export const classAll = async (ccode, selectedDate) => {
  const result = await CLASS.findMany({
    where: { c_ccode: ccode, c_sdate: selectedDate },
    include: { tbl_teacher: true },
    orderBy: { c_sdate: "asc" },
  });
  return result;
};

export const createClass = async ({ formData }) => {
  await CLASS.create({
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

export const classUnique = async (seq) => {
  const result = await CLASS.findUnique({
    where: { c_seq: seq },
    include: { tbl_teacher: true },
  });
  return result;
};

export const Classupdate = async (classData, seq) => {
  // 업데이트하지 않을 목록
  const { c_seq, c_tcode, c_ccode, tbl_teacher, ...updateData } = classData;

  const result = await CLASS.update({
    where: { c_seq: seq },
    data: {
      ...updateData,
      tbl_teacher: {
        update: tbl_teacher,
      },
    },
  });
  return result;
};
