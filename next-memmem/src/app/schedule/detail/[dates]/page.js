"use client";

import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { scheduleAll } from "../../../api/schedule";

const ScheduleDetail = ({ selectedDate, showInputPage, date, setSeq }) => {
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
  };
  return (
    <>
      <div className="list_home">
        <div className="insert_btn_box btn_box">
          <a className="insert button-32" onClick={inputButton} date={date}>
            수업 추가
          </a>
        </div>

        <table className="schedule list">
          <thead>
            <tr>
              <th>SEQ</th>
              <th>수업명</th>

              <th>개강일자</th>
              <th>종강일자</th>
              <th>시작시간</th>
              <th>종료시간</th>
            </tr>
          </thead>

          <tbody className="body">
            {scheduleList.map((SCHEDULE, index) => (
              <tr
                key={SCHEDULE.c_seq}
                onClick={() => clickHandler(SCHEDULE.c_seq)}
                data-seq={SCHEDULE.c_seq}
              >
                <td>{index + 1}</td>
                <td>{SCHEDULE.s_title}</td>

                <td>{SCHEDULE.s_sdate}</td>
                <td>{SCHEDULE.s_edate}</td>
                <td>{SCHEDULE.s_stime}</td>
                <td>{SCHEDULE.s_etime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ScheduleDetail;
