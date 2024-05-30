"use client";
import { useEffect, useState } from "react";
import "../../css/dash.css";
import "../../css/table.css";
import { findNoticeList, selectAll } from "../api/notice";
import { getSession, useSession } from "next-auth/react";
import { getTotal, getMonthTotal, totalPrice, getMonthTotalSales } from "../api/userComp";
import { Chart, scales } from "chart.js/auto";
import { useRouter } from "next/navigation";

const DashPage = () => {
  const { data: session } = useSession();
  const [noticeList, setNoticeList] = useState([]);
  const [userTotal, setUserTotal] = useState([]);
  const [monthlyUsers, setMonthlyUsers] = useState(new Array(12).fill(0));
  const [totalSum, setTotalSum] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (session) {
      const fetchTotalUsers = async () => {
        const session = await getSession();
        const ccode = session?.user.id.tbl_company[0].c_code;
        const result = await getTotal(ccode);
        setUserTotal(result);
        const sumResult = await totalPrice(ccode);
        setTotalSum(sumResult);
      };
      const dashFetch = async () => {
        try {
          const session = await getSession();
          const ccode = session?.user.id.tbl_company[0].c_code;
          console.log(ccode);
          const result = await findNoticeList(ccode);
          setNoticeList([...result]);
        } catch (error) {
          console.log(error);
        }
      };
      const fetchMonthlyUsers = async () => {
        const session = await getSession();
        const ccode = session?.user.id.tbl_company[0].c_code;
        const promises = Array.from({ length: 12 }, (_, i) => {
          const month = String(i + 1).padStart(2, "0");
          const date = `${new Date().getFullYear()}-${month}-01`;
          return getMonthTotal(ccode, date);
        });
        const results = await Promise.all(promises);
        setMonthlyUsers(results.map((result) => result.length));
      };

      fetchTotalUsers();
      dashFetch();
      fetchMonthlyUsers();
    }
  }, [session]);

  useEffect(() => {
    const canvas = document.getElementById("myUserChart");
    if (canvas && userTotal !== null) {
      const ctx = canvas.getContext("2d");
      // 이제 ctx를 사용하여 차트를 그릴 수 있습니다.
      const data = {
        labels: [
          "1월",
          "2월",
          "3월",
          "4월",
          "5월",
          "6월",
          "7월",
          "8월",
          "9월",
          "10월",
          "11월",
          "12월",
        ],
        datasets: [
          {
            label: "월별 유저가입수",
            data: monthlyUsers,
            backgroundColor: "#6acd95",
          },
        ],
      };

      const options = {
        scales: {
          y: {
            ticks: {
              stepSize: 1,
              callback: (value) => `${value.toLocaleString()}명`,
            },
          },
        },
      };

      const myUserChart = new Chart(ctx, {
        type: "bar",
        data: data,
        options: options,
      });

      return () => {
        myUserChart.destroy();
      };
    }
  }, [monthlyUsers]);

  useEffect(() => {
    const fetchMonthlySales = async () => {
      try {
        const session = await getSession();
        const ccode = session?.user.id.tbl_company[0].c_code;
        const monthlyTotalSales = await getMonthTotalSales(ccode);
        setMonthlyTotal(monthlyTotalSales);
        console.log(monthlyTotalSales);
      } catch (error) {
        console.error("Error fetching monthly sales:", error);
      }
    };
    fetchMonthlySales();
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("myPieChart");
    if (canvas && monthlyTotal.length > 0) {
      const ctx = canvas.getContext("2d");
      const data = {
        labels: [
          "1월",
          "2월",
          "3월",
          "4월",
          "5월",
          "6월",
          "7월",
          "8월",
          "9월",
          "10월",
          "11월",
          "12월",
        ],
        datasets: [
          {
            label: "월별 매출액",
            data: monthlyTotal,
            backgroundColor: "#6acd95",
          },
        ],
      };

      const options = {
        scales: {
          y: {
            ticks: {
              stepSize: 50000, // 5만원 단위로 설정
              callback: (value) => `${(value / 10000).toLocaleString()}만원`, // 매출액 포맷 지정
            },
          },
        },
      };

      const myTotalChart = new Chart(ctx, {
        type: "bar",
        data: data,
        options: options,
      });

      return () => {
        myTotalChart.destroy();
      };
    }
  }, [monthlyTotal]);

  const onNoticeClickHandler = () => {
    router.push("/notice");
  };

  return (
    <section className="page">
      <div className="top">
        <div className="month">
          <div className="total">월 매출</div>
          {totalSum !== 0 ? (
            <div className="chart">
              <canvas id="myPieChart"></canvas>
              <div className="total_box">
                <div className="total">
                  <span>총매출</span>
                  <p>{totalSum.toLocaleString()} 만원</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="dash_error">
              <div className="total error_left">
                <div>아직 매출이 없습니다</div>
              </div>
            </div>
          )}
        </div>

        <div className="month">
          <div className="total">월 가입수</div>

          {userTotal !== 0 ? (
            <div className="chart">
              <canvas id="myUserChart"></canvas>
              <div className="total_box">
                <div className="total">
                  <span>이용중인 유저수 : {userTotal}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="dash_error">
              <div className="total error_right">
                <div>이용중인 회원이 없습니다</div>
              </div>
            </div>
          )}
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
                    <tr
                      key={NOTICE.n_seq}
                      onClick={() => {
                        onNoticeClickHandler();
                      }}
                    >
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
