"use server";
import prisma from "./prisma";

const USER_MINFO = prisma.tbl_user_minfo;

// 유저-회원권 추가
export const addUserMinfo = async ({ ticketFormData, ruid }) => {
  const result = await USER_MINFO.create({
    data: {
      r_uid: ruid,
      r_iseq: parseInt(ticketFormData.r_iseq),
      r_icount: parseInt(ticketFormData.r_icount),
      r_sdate: ticketFormData.r_sdate,
      r_edate: ticketFormData.r_edate,
    },
  });
  prisma.$disconnect();
  return result;
};

export const userMinfoList = async ({ id }) => {
  const result = await USER_MINFO.findMany({
    where: { r_uid: id },
    include: { tbl_minfo: true },
  });
  prisma.$disconnect();
  return result;
};

export const createUserTicket = async ({ formData, id }) => {
  const result = await USER_MINFO.create({
    data: {
      r_uid: id,
      r_icount: parseInt(formData.r_icount),
      r_iseq: parseInt(formData.r_iseq),
      r_sdate: formData.r_sdate,
      r_edate: formData.r_edate,
    },
  });
  prisma.$disconnect();
  return result;
};

export const findDetail = async ({ ticket, id }) => {
  const result = await USER_MINFO.findUnique({
    where: {
      r_uid_r_iseq: {
        r_uid: id,
        r_iseq: ticket,
      },
    },
  });
  console.log("server", result);
  prisma.$disconnect();
  return result;
};
