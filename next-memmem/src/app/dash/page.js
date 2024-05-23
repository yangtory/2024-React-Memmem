"use client";
import "../../css/dash.css";

import { useSession } from "next-auth/react";

const DashPage = () => {
  const { data: session } = useSession();
  console.log("Session", session);
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
                <p>여러명</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom">
        <div className="total notice_list">공지사항</div>

        <div className="noList_wrapper">
          <div className="noList">등록된 공지사항이 없습니다.</div>
        </div>

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
              <tbody>
                <h2>공지사항 리스트</h2>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashPage;
