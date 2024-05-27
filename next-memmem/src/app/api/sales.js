"use server";
import prisma from "./prisma";

const SALES = prisma.tbl_user_minfo;

export const searchSalesList = async (
  r_sdate,
  r_edate,
  r_uid,
  r_ititle,
  ccode
) => {
  // 조건
  const where = {
    i_ccode: ccode,
    AND: [
      r_sdate && r_edate
        ? {
            r_sdate: {
              gte: new Date(r_sdate),
              lte: new Date(r_edate),
            },
          }
        : undefined,
      r_uid ? { r_uid: { contains: r_uid } } : undefined,
      r_ititle
        ? { tbl_minfo: { i_title: { contains: r_ititle } } }
        : undefined,
    ].filter(Boolean),
  };

  const salesList = await SALES.findMany({
    select: {
      r_sdate: true,
      r_uid: true,
      tbl_minfo: {
        select: {
          i_seq: true,
          i_title: true,
          i_price: true,
          i_ccode: true,
        },
      },
    },
    where,
    orderBy: {
      r_sdate: "asc",
    },
  });

  // 결과를 평탄화하여 반환
  return salesList.map((sales) => ({
    r_sdate: sales.r_sdate,
    r_uid: sales.r_uid,
    i_seq: sales.tbl_minfo.i_seq,
    i_title: sales.tbl_minfo.i_title,
    i_price: sales.tbl_minfo.i_price,
    i_ccode: sales.tbl_minfo.i_ccode,
  }));
};
