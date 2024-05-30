"use server";
import prisma from "./prisma";

const NOTICE = prisma.tbl_notice;

export const selectAll = async ({ ccode }) => {
  const result = await NOTICE.findMany({
    where: { n_ccode: ccode },
    orderBy: [{ n_date: "desc" }, { n_time: "desc" }],
  });
  prisma.$disconnect();
  return result;
};

export const createNotice = async ({ formData }) => {
  const result = await NOTICE.create({
    data: {
      n_seq: formData.n_seq,
      n_title: formData.n_title,
      n_content: formData.n_content,
      n_ccode: formData.n_ccode,
      n_uid: formData.n_uid,
      n_date: formData.n_date,
      n_time: formData.n_time,
    },
  });
  prisma.$disconnect();
  return result;
};

export const findNotice = async (title, date, ccode) => {
  const result = NOTICE.findMany({
    where: {
      n_ccode: ccode, // 필터링할 조건
      n_title: {
        contains: title || "",
      },
      n_date: {
        contains: date || "",
      },
    },
    orderBy: [{ n_date: "desc" }, { n_time: "desc" }],
  });
  prisma.$disconnect();
  return result;
};

export const deleteNotice = async (seq) => {
  try {
    await NOTICE.delete({
      where: { n_seq: seq },
    });
    prisma.$disconnect();
  } catch (error) {
    console.log(error);
  }
};

export const updateNotice = async ({ seq, title, content }) => {
  try {
    const updateNotice = await NOTICE.update({
      where: { n_seq: seq },
      data: {
        n_title: title,
        n_content: content,
      },
    });
    console.log("update ", updateNotice);
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
};
