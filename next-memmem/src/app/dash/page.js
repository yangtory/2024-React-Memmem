"use client";
import { useEffect, useState } from "react";
import "../../css/dash.css";
import "../../css/table.css";
import { selectAll } from "../api/notice";
import { getSession, useSession } from "next-auth/react";

const DashPage = () => {
  const { data: session } = useSession();
  const [noticeList, setNoticeList] = useState([]);

  useEffect(() => {
    if (session) {
      const dashFetch = async () => {
        try {
          const session = await getSession();
          const ccode = session?.user.id.tbl_company[0].c_code;

          const result = await selectAll(ccode);
          setNoticeList([...result]);
        } catch (error) {
          console.log(error);
        }
      };
      dashFetch();
    }
  }, [session]);

  return (
    <section className="page">
      <div className="top">
        <div className="month">
          <div className="total">월 매출</div>

          <div className="error">
            <div className="total error_left">
              <div>아직 매출이 없습니다</div>
            </div>
          </div>
        </div>

        <div className="month">
          <div className="total">월 가입수</div>

          <div className="error">
            <div className="total error_right">
              <div>이용중인 회원이 없습니다</div>
            </div>
          </div>

          <div className="chart">
            <canvas id="myUserChart"></canvas>
            <div className="total_box">
              <div className="total">
                <span>이용중인 유저수</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom">
        <div className="total notice_list">공지사항</div>
        {noticeList.length > 0 ? (
          <div className="notice">
            <div className="table_wrapper">
              <table className="notice list">
                <thead>
                  <tr>
                    <th className="index" width="20px">
                      No.
                    </th>
                    <th className="date" width="80px">
                      작성일자
                    </th>
                    <th className="title" width="200px">
                      제목
                    </th>
                    <th className="id" width="100px">
                      작성자
                    </th>
                  </tr>
                </thead>
                <tbody className="tbody">
                  {noticeList.map((NOTICE, index) => (
                    <tr key={NOTICE.n_seq}>
                      <td className="index">{index + 1}</td>
                      <td className="date">{NOTICE.n_date}</td>
                      <td className="title">{NOTICE.n_title}</td>
                      <td className="id">{NOTICE.n_uid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <table className="notice list">
            <thead>
              <tr>
                <th className="index" width="20px">
                  No.
                </th>
                <th className="date" width="80px">
                  작성일자
                </th>
                <th className="title" width="200px">
                  제목
                </th>
                <th className="id" width="100px">
                  작성자
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="noList">
                <td className="noList">등록된 공지사항이 없습니다.</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default DashPage;
