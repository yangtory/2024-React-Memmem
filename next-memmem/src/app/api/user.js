"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const USER = prisma.tbl_user;
const USERCOMP = prisma.tbl_user_comp;
export const findUnique = async ({ u_id }) => {
  const result = await USER.findUnique({
    where: { u_id: u_id },
  });
  return result;
};

export const findUsers = async ({ uname, uid, utel }) => {
  return prisma.tbl_user.findMany({
    where: {
      tbl_user_comp: {
        // tbl_user_comp 필드로 필터링
        us_ccode: "C0001",
      },
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
      tbl_user_comp: true,
    },
  });
};
