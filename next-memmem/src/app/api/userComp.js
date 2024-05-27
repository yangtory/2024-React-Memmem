"use server";
import prisma from "./prisma";

const USERCOMP = prisma.tbl_user_comp;

export const findUsers = async ({ uname, uid, utel, ccode }) => {
  return USERCOMP.findMany({
    where: {
      us_ccode: ccode, // 필터링할 조건
      us_uname: {
        contains: uname || "",
      },
      us_uid: {
        contains: uid || "",
      },
      us_utel: {
        contains: utel || "",
      },
    },
    include: {
      tbl_user: true, // 필요한 경우 tbl_user도 include할 수 있습니다.
    },
  });
};

export const AddUserComp = async ({ formData, ccode, formattedDate }) => {
  return await USERCOMP.create({
    data: {
      us_uid: formData.us_uid,
      us_ccode: ccode,
      us_uname: formData.us_uname,
      us_utel: formData.us_utel,
      us_cname: formData.us_cname,
      us_date: formattedDate,
    },
  });
};
export const userDetail = async (us_uid, us_ccode) => {
  try {
    const result = await USERCOMP.findMany({
      where: {
        us_uid: us_uid,
        us_ccode: us_ccode,
      },
    });
    return result;
  } catch (error) {}
};

export const userUpdate = async ({ us_uid, us_uname, us_utel, us_ccode }) => {
  await USERCOMP.update({
    where: {
      us_uid_us_ccode: {
        us_uid,
        us_ccode,
      },
    },
    data: {
      us_uname,
      us_utel,
    },
  });
};

export const deleteUser = async (us_uid, us_ccode) => {
  await USERCOMP.delete({
    where: {
      us_uid_us_ccode: {
        us_uid,
        us_ccode,
      },
    },
  });
};
