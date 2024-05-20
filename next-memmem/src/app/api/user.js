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
