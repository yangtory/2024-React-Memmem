'use server';

import prisma from './prisma';

const TEACHER = prisma.tbl_teacher;

export const selectAll = async (ccode) => {
    const result = await TEACHER.findMany({
        where: { t_ccode: ccode },
    });
    return result;
};

export const findTeacher = async ({ tname, tcode, ttel, ccode }) => {
    return TEACHER.findMany({
        where: {
            t_ccode: ccode, // 필터링할 조건
            t_name: {
                contains: tname || '',
            },
            t_code: {
                contains: tcode || '',
            },
            t_tel: {
                contains: ttel || '',
            },
        },
    });
};

export const createTeacher = async ({ formData }) => {
    const result = await TEACHER.create({
        data: {
            t_ccode: formData.t_ccode,
            t_code: formData.t_code,
            t_name: formData.t_name,
            t_tel: formData.t_tel,
        },
    });
    return result;
};

export const getTeacherInfo = async (tcode) => {
    console.log(tcode);
    const result = await TEACHER.findMany({
        where: {
            t_code: tcode,
        },
    });
    return result;
};
