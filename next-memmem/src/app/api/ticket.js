"use server";

import prisma from "./prisma";

const TICKET = prisma.tbl_minfo;
const USER_TICKET = prisma.tbl_user_minfo;
export const ticketAll = async (ccode) => {
  const result = await TICKET.findMany({
    where: { i_ccode: ccode },
  });
  prisma.$disconnect();
  return result;
};

export const createTicket = async ({ formData }) => {
  const result = await TICKET.create({
    data: {
      i_title: decodeURIComponent(formData.i_title),
      i_price: parseInt(formData.i_price),
      i_count: parseInt(formData.i_count),
      i_ccode: formData.i_ccode,
    },
  });
  prisma.$disconnect();
  return result;
};

export const getTicketInfo = async (i_seq) => {
  const result = await TICKET.findMany({
    where: {
      i_seq: i_seq,
    },
  });
  prisma.$disconnect();
  return result;
};

export const getUserCount = async (r_iseq) => {
  const result = await USER_TICKET.findMany({
    where: {
      r_iseq: r_iseq,
    },
  });
  prisma.$disconnect();
  return result.length;
};

export const updateTicket = async ({ seq, price, count }) => {
  try {
    await TICKET.update({
      where: { i_seq: parseInt(seq) },
      data: {
        i_price: parseInt(price),
        i_count: parseInt(count),
      },
    });
    prisma.$disconnect();
  } catch (error) {
    console.log(error);
  }
};

export const deleteTicket = async (seq) => {
  await TICKET.delete({
    where: { i_seq: parseInt(seq) },
  });
  prisma.$disconnect();
};
