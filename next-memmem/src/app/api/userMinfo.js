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

export const userMinfoList = async (id) => {
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

export const findDetail = async (ticketSeq, id) => {
  try {
    const result = await USER_MINFO.findUnique({
      where: {
        r_iseq_r_uid: {
          r_uid: id,
          r_iseq: ticketSeq,
        },
      },
      include: { tbl_minfo: true },
    });
    prisma.$disconnect();
    return result;
  } catch (error) {
    prisma.$disconnect();
    console.log(error);
  }
};

export const updateUserTicket = async (formData, id) => {
  try {
    const result = await USER_MINFO.update({
      where: {
        r_iseq_r_uid: {
          r_uid: id,
          r_iseq: formData.r_iseq,
        },
      },
      data: {
        r_icount: parseInt(formData.r_icount),
        r_sdate: formData.r_sdate,
        r_edate: formData.r_edate,
      },
    });
    prisma.$disconnect();
    return result;
  } catch (error) {
    prisma.$disconnect();
    console.log(error);
  }
};

export const deleteUserTicket = async (ticketSeq, id) => {
  const result = await USER_MINFO.delete({
    where: {
      r_iseq_r_uid: {
        r_uid: id,
        r_iseq: ticketSeq,
      },
    },
  });
  prisma.$disconnect();
  return result;
};

export const salesDataAll = async () => {
  const result = await USER_MINFO.findMany({
    include: {
      tbl_minfo: true,
    },
    orderBy: {
      r_sdate: "asc",
    },
  });
  prisma.$disconnect();
  return result;
};
