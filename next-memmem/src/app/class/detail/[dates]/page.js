import { useEffect, useState } from "react";
import "../../../../css/table.css";
import InputPage from "../../insert/page";
import ClassPage from "../../page";
import { useSession } from "next-auth/react";
import { classAll } from "../../../api/class";
import { findUnique } from "../../../api/user";

const ClassDetail = ({ showInputPage, date }) => {
  const inputButton = () => {
    showInputPage(true); // 입력 페이지 표시
  };
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [dates, setDates] = useState([]);
  const { data: session } = useSession();
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    if (session) {
      const classFetch = async () => {
        try {
          const selectedDate = new Date(viewYear, viewMonth);
          const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(
            selectedDate.getDate()
          ).padStart(2, "0")}`;
          const u_id = session.user.id;
          const ccode = (await findUnique({ u_id })).tbl_company[0].c_code;
          const result = await classAll(ccode, formattedDate);
          setClassList([...result]);
          console.log(setClassList);
          console.log(viewYear);
        } catch (error) {
          console.log(error);
        }
      };
      classFetch();
    }
  }, [session]);

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
              <tr key={CLASS.i_seq} data-seq={CLASS.c_seq}>
                <td>{index + 1}</td>
                <td>{CLASS.c_name}</td>
                {/* <td>{CLASS.t_name}</td> */}
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
