"use server";
import prisma from "./prisma";
const SCHEDULE = prisma.tbl_schedule;

export const scheduleAll = async (ccode, selectedDate) => {
  const result = await SCHEDULE.findMany({
    where: {
      s_ccode: ccode,
      AND: [{ s_sdate: { lte: selectedDate } }, { s_edate: { gte: selectedDate } }],
    },

    orderBy: [{ s_sdate: "asc" }, { s_edate: "desc" }], // c_sdate를 기준으로 오름차순 정렬
  });
  return result;
};

export const createSchedule = async ({ formData }) => {
  await SCHEDULE.create({
    data: {
      s_title: formData.s_title,
      s_content: formData.s_content,
      s_sdate: formData.s_sdate,
      s_edate: formData.s_edate,
      s_ccode: formData.ccode,
      s_color: formData.s_color,
    },
  });
};

export const scheduleUnique = async (seq) => {
  const result = await SCHEDULE.findUnique({
    where: { s_seq: seq },
  });
  return result;
};

export const scheduleUpdate = async (s_seq, data) => {
  try {
    const updatedSchedule = await SCHEDULE.update({
      where: { s_seq },
      data,
    });
    console.log("업데이트된 스케줄:", updatedSchedule);
    return updatedSchedule;
  } catch (error) {
    console.error("스케줄 업데이트 실패:", error);
    throw error;
  }
};

export const scheduleDelete = async (s_seq) => {
  await SCHEDULE.delete({
    where: {
      s_seq,
    },
  });
};
