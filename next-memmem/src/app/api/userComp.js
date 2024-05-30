"use server";
import prisma from "./prisma";

const USERCOMP = prisma.tbl_user_comp;

export const findUsers = async ({ uname, uid, utel, ccode }) => {
  try {
    const users = await USERCOMP.findMany({
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
    return users;
  } catch (error) {
    console.error("Error finding users:", error);
    throw error;
  } finally {
    prisma.$disconnect();
  }
};

export const AddUserComp = async ({ formData, ccode, formattedDate }) => {
  try {
    const newUserComp = await USERCOMP?.create({
      data: {
        us_uid: formData.us_uid,
        us_ccode: ccode,
        us_uname: formData.us_uname,
        us_utel: formData.us_utel,
        us_cname: formData.us_cname,
        us_date: formattedDate,
      },
    });
    return newUserComp;
  } catch (error) {
    console.error("Error adding user company:", error);
    throw error;
  } finally {
    prisma.$disconnect();
  }
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
  } catch (error) {
    console.error("Error fetching user detail:", error);
    throw error;
  } finally {
    prisma.$disconnect();
  }
};

export const userUpdate = async ({ us_uid, us_uname, us_utel, us_ccode }) => {
  try {
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
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  } finally {
    prisma.$disconnect();
  }
};

export const deleteUser = async (us_uid, us_ccode) => {
  try {
    await USERCOMP.delete({
      where: {
        us_uid_us_ccode: {
          us_uid,
          us_ccode,
        },
      },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  } finally {
    prisma.$disconnect();
  }
};

export const getTotal = async (us_ccode) => {
  try {
    const result = await USERCOMP.count({
      where: {
        us_ccode,
      },
    });
    return result;
  } catch (error) {
    console.error("Error getting total users:", error);
    throw error;
  } finally {
    prisma.$disconnect();
  }
};

export const getMonthTotal = async (us_ccode, startDate) => {
  try {
    const formattedDate = new Date(startDate);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const datePattern = `${year}-${month}`;
    const startDateISO = new Date(`${datePattern}-01`).toISOString();
    const endDate = new Date(`${datePattern}-01`);
    endDate.setMonth(formattedDate.getMonth() + 1);
    const endDateISO = endDate.toISOString();

    const result = await USERCOMP.findMany({
      where: {
        us_ccode,
        AND: [
          {
            us_date: {
              gte: startDateISO,
            },
          },
          {
            us_date: {
              lt: endDateISO,
            },
          },
        ],
      },
    });
    return result;
  } catch (error) {
    console.error("Error getting monthly total:", error);
    throw error;
  } finally {
    prisma.$disconnect();
  }
};

export const totalPrice = async (us_ccode) => {
  try {
    const result = await prisma.tbl_user_minfo.findMany({
      where: {
        tbl_minfo: {
          i_ccode: us_ccode,
        },
      },
      select: {
        tbl_minfo: true,
      },
    });

    const totalPrice = result.reduce((acc, item) => acc + item.tbl_minfo.i_price, 0);
    return totalPrice;
  } catch (error) {
    console.error("Error getting total price:", error);
    throw error;
  } finally {
    prisma.$disconnect();
  }
};

export const getMonthTotalSales = async (ccode) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const promises = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const startDate = `${currentYear}-${String(month).padStart(2, "0")}-01`;
      const endDate = `${currentYear}-${String(month + 1).padStart(2, "0")}-01`;
      return prisma.tbl_user_minfo.findMany({
        where: {
          r_sdate: {
            gte: startDate,
            lt: endDate,
          },
        },
        select: {
          tbl_minfo: {
            select: {
              i_price: true,
            },
          },
        },
      });
    });
    const results = await Promise.all(promises);
    const monthlyTotalSales = results.map((result) => {
      // 각 월별로 판매된 수강권의 가격을 합산하여 매출을 계산합니다.
      const totalSales = result.reduce((acc, cur) => acc + cur.tbl_minfo.i_price, 0);
      return totalSales; // 판매 금액을 반환합니다.
    });
    return monthlyTotalSales;
  } catch (error) {
    console.error("Error in getMonthTotalSales:", error);
    throw error;
  } finally {
    prisma.$disconnect();
  }
};
