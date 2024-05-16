// import axios from "axios";
import "../css/dash.css";
import { useEffect, useState } from "react";

const Dash = () => {
  // 이건 proxy 설정 안했을때 적어주는거, 설정해줘서 안해도 됨
  // const baseUrl = "http://localhost:8080";

  const [data, setData] = useState("");

  useEffect(() => {
    // 컴포넌트가 마운트 될 때 실행
    // springDataSet();
    springData();
  }, []);

  //   // Axios 방식 사용
  // function springDataSet() {
  //   axios
  //     .get("/test/get") // 해당 URL에 HTTP GET 요청
  //     .then((res) => {
  //       console.log(res);
  //       setData(res.data); // GET 요청하여 응답받은 data
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  // fetch 사용
  const springData = async () => {
    try {
      const res = await fetch("/test/get", {
        method: "GET",
      });
      const json = await res.text();
      setData(res.data);
      console.log(json);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section className="page">
        <div className="top">
          <div className="month">
            <div className="total">월 매출</div>
            <div className="error">
              <div className="total error_left">
                <div>{data}</div>
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
          </div>
        </div>

        <div className="bottom">
          <div className="total notice_list">공지사항</div>
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
                <tbody></tbody>
              </table>
              <div className="noList_wrapper">
                <div className="noList">
                  등록된 공지사항이 없습니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dash;
