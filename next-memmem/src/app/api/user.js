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

export const createUser = async ({ formData }) => {
  try {
    let newUser;
    // tbl_user 테이블에 데이터 추가
    if (formData.u_comp && formData.c_tel && formData.c_addr) {
      newUser = await prisma.tbl_user.create({
        data: {
          u_id: formData.u_id,
          u_password: formData.u_password,
          u_name: formData.u_name,
          u_tel: formData.u_tel,
          u_comp: formData.u_comp,
        },
      });
    } else {
      newUser = await prisma.tbl_user.create({
        data: {
          u_id: formData.u_id,
          u_password: formData.u_password,
          u_name: formData.u_name,
          u_tel: formData.u_tel,
        },
      });
    }

    let newCompany = null;
    let role = "ROLE_USER";

    // 회사 정보가 입력된 경우 tbl_company 테이블에 데이터 추가 및 역할 설정
    if (formData.u_comp && formData.c_tel && formData.c_addr) {
      newCompany = await prisma.tbl_company.create({
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
    const newRole = await prisma.tbl_role.create({
      data: {
        r_uid: formData.u_id,
        r_role: role,
      },
    });

    return { user: newUser, company: newCompany, role: newRole };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};
