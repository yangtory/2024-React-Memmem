'use server';
import prisma from './prisma';

const NOTICE = prisma.tbl_notice;

export const selectAll = async ({ ccode }) => {
    const result = await NOTICE.findMany({
        where: { n_ccode: ccode },
    });
};

export const createNotice = async ({ formData }) => {
    const result = await NOTICE.create({
        data: {
            n_title: formData.n_title,
            n_content: formData.n_content,
            n_ccode: formData.n_ccode,
            n_uid: formData.n_uid,
            n_date: formData.n_date,
            n_time: formData.n_time,
        },
    });
    return result;
};

export const findNotice = async ({ title, date, ccode }) => {
    return NOTICE.findMany({
        where: {
            n_ccode: ccode, // 필터링할 조건
            n_title: {
                contains: title || '',
            },
            n_date: {
                contains: date || '',
            },
        },
    });
};
