"use server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const USER = prisma.tbl_user;
export const findUnique = async ({ u_id }) => {
  const result = await USER.findUnique({
    where: { u_id: u_id },
    include: { tbl_company: true },
  });
  return result;
};

export const createUser = async ({ formData }) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(
    formData.u_password,
    saltRounds
  );

  let newUser;
  try {
    // tbl_user 테이블에 데이터 추가
    if (formData.u_comp && formData.c_tel && formData.c_addr) {
      newUser = await USER.create({
        data: {
          u_id: formData.u_id,
          u_password: hashedPassword,
          u_name: formData.u_name,
          u_tel: formData.u_tel,
          u_comp: formData.u_comp,
        },
      });
    } else {
      newUser = await USER.create({
        data: {
          u_id: formData.u_id,
          u_password: hashedPassword,
          u_name: formData.u_name,
          u_tel: formData.u_tel,
        },
      });
    }

    let role = "ROLE_USER";

    // 회사 정보가 입력된 경우 tbl_company 테이블에 데이터 추가 및 역할 설정
    if (formData.u_comp && formData.c_tel && formData.c_addr) {
      await prisma.tbl_company.create({
        data: {
          c_code: "C0001", // c_code 대체
          c_name: formData.u_comp,
          c_tel: formData.c_tel,
          c_addr: formData.c_addr,
          c_uid: formData.u_id,
        },
      });
      role = "ROLE_ADMIN";
    }

    // tbl_role 테이블에 역할 추가
    await prisma.tbl_role.create({
      data: {
        r_uid: formData.u_id,
        r_role: role,
      },
    });

    return { user: newUser };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};
