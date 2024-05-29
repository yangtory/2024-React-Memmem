"use client";

import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { scheduleAll } from "../../../api/schedule";
import "../../../../css/table.css";
const ScheduleDetail = ({ selectedDate, showInputPage, date, setSeq, setShowUpdatePage }) => {
  const inputButton = () => {
    showInputPage(true);
  };
  const { data: session } = useSession();
  const [scheduleList, setScheduleList] = useState([]);
  useEffect(() => {
    if (session && selectedDate) {
      const scheduleFetch = async () => {
        try {
          const session = await getSession();
          const ccode = session?.user.id.tbl_company[0].c_code;
          const result = await scheduleAll(ccode, selectedDate);

          setScheduleList([...result]);
        } catch (error) {
          console.log(error);
        }
      };
      scheduleFetch();
    }
  }, [session, selectedDate]);

  const clickHandler = (seq) => {
    setSeq(seq);
    setShowUpdatePage(true);
  };
  return (
    <>
      <div className="list_home">
        <div className="btn_box">
          <a className="insert button-32 addClass" onClick={inputButton} date={date}>
            일정 추가
          </a>
        </div>

        <table className="schedule list">
          <thead>
            <tr>
              <th>제목</th>
              <th>내용</th>
              <th>시작일자</th>
              <th>종료일자</th>
            </tr>
          </thead>

          <tbody className="body">
            {scheduleList.map((SCHEDULE, index) => (
              <tr key={SCHEDULE.s_seq} onClick={() => clickHandler(SCHEDULE.s_seq)} data-seq={SCHEDULE.s_seq}>
                <td>{index + 1}</td>
                <td>{SCHEDULE.s_title}</td>
                <td>{SCHEDULE.s_sdate}</td>
                <td>{SCHEDULE.s_edate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ScheduleDetail;
