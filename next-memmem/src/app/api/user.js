"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const USER = prisma.tbl_user;
const USER_COMP = prisma.tbl_user_comp;
export const findUnique = async ({ u_id }) => {
  const result = await USER.findUnique({
    where: { u_id: u_id },
    include: { tbl_company: true },
  });
  return result;
};

export const findUserComp = async ({ us_uid }) => {
  const result = await USER_COMP.findMany({
    where: { us_uid: us_uid },
  });
  return result;
};
