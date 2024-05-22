"use client";
import { useEffect, useState } from "react";
import "../../../../css/table.css";

import { useSession } from "next-auth/react";
import { classAll } from "../../../api/class";
import { findUnique } from "../../../api/user";
import { useRouter } from "next/navigation";

const ClassDetail = ({ showInputPage, date, selectedDate, setSeq }) => {
  const router = useRouter();
  const inputButton = () => {
    showInputPage(true); // 입력 페이지 표시
  };

  const { data: session } = useSession();
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    if (session && selectedDate) {
      const classFetch = async () => {
        try {
          const u_id = session.user.id;
          const ccode = (await findUnique({ u_id })).tbl_company[0].c_code;
          const result = await classAll(ccode, selectedDate);

          setClassList([...result]);
        } catch (error) {
          console.log(error);
        }
      };
      classFetch();
    }
  }, [session, selectedDate]);

  const clickHandler = (seq) => {
    setSeq(seq);
  };

  return (
    <>
      <h1>{date}</h1>
      <h1 className="list_title">수업 관리</h1>

      <div className="list_home">
        <div className="insert_btn_box">
          <a className="insert button-32" onClick={inputButton} date={date}>
            수업 추가
          </a>
        </div>

        <table className="schedule list">
          <thead>
            <tr>
              <th>SEQ</th>
              <th>수업명</th>
              <th>강사명</th>
              <th>개강일자</th>
              <th>종강일자</th>
              <th>시작시간</th>
              <th>종료시간</th>
            </tr>
          </thead>

          <tbody className="body">
            {classList.map((CLASS, index) => (
              <tr
                key={CLASS.c_seq}
                onClick={() => clickHandler(CLASS.c_seq)}
                data-seq={CLASS.c_seq}
              >
                <td>{index + 1}</td>
                <td>{CLASS.c_name}</td>
                <td>{CLASS.tbl_teacher.t_name}</td>
                <td>{CLASS.c_sdate}</td>
                <td>{CLASS.c_edate}</td>
                <td>{CLASS.c_stime}</td>
                <td>{CLASS.c_etime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ClassDetail;
