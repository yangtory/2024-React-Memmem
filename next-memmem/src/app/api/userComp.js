"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const USERCOMP = prisma.tbl_user_comp;

export const findUsers = async ({ uname, uid, utel }) => {
  return USERCOMP.findMany({
    where: {
      us_ccode: "C0001", // 필터링할 조건
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
