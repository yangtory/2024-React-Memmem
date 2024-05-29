"use server";
import prisma from "./prisma";

const SALES = prisma.tbl_user_minfo;

export const searchSalesList = async (
  r_sdate,
  r_edate,
  r_uid,
  i_title,
  setCode
) => {
  try {
    const whereClause = {
      tbl_minfo: {
        i_ccode: setCode,
      },
      AND: [
        ...(r_sdate && r_edate
          ? [{ r_sdate: { gte: r_sdate, lte: r_edate } }]
          : []),
        ...(r_uid ? [{ r_uid: { contains: r_uid } }] : []),
        ...(i_title
          ? [
              {
                tbl_minfo: {
                  i_title: { contains: i_title },
                },
              },
            ]
          : []),
      ],
    };

    const result = await SALES.findMany({
      where: whereClause,
      include: { tbl_minfo: true },
      orderBy: {
        r_sdate: "asc",
      },
    });

    await prisma.$disconnect(); // 비동기 방식으로 변경
    return result;
  } catch (error) {
    console.error(error);
    await prisma.$disconnect(); // 비동기 방식으로 변경
  }
};
