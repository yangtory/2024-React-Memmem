"use server";

import bcrypt from "bcrypt";
import { selectAll } from "./company";
import prisma from "./prisma";

const USER = prisma.tbl_user;

export const findUnique = async ({ u_id }) => {
  const result = await USER.findUnique({
    where: { u_id: u_id },
    include: { tbl_company: true },
  });
  return result;
};

// ccode 만들기
export const createCCode = async () => {
  let ccode = "C0001";
  const result = await selectAll();
  if (result.length > 0) {
    const lastNum = Number(result.length - 1);
    const currentNum = result[lastNum].c_code;
    const subNum = currentNum.substring(1, 5);
    const strNum = String(Number(subNum) + 1);
    ccode = "C" + strNum.padStart(4, "0");
    console.log(ccode);
    return ccode;
  }
  console.log(ccode);
  return ccode;
};

// user insert, 회원가입
export const createUser = async ({ formData }) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(formData.u_password, saltRounds);

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
      const ccode = await createCCode();
      await prisma.tbl_company.create({
        data: {
          c_code: ccode, // c_code 대체
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

export const AllUser = async () => {
  try {
    const users = await prisma.tbl_user.findMany({
      where: {
        tbl_role: {
          some: {
            r_role: "ROLE_USER",
          },
        },
      },
      include: {
        tbl_role: true,
      },
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
