"use client";
import { useState, useEffect } from "react";
import { searchSalesList } from "../api/sales";
import { getSession } from "next-auth/react";
import { salesDataAll } from "../api/userMinfo";
import { findComp } from "../api/company";
import "../../css/sales_detail.css";
import "../../css/table.css";
import "../../css/search.css";

const SalesPage = () => {
  const [salesList, setSalesList] = useState([]);
  const [searchData, setSearchData] = useState({
    r_sdate: "",
    r_edate: "",
    r_uid: "",
    i_title: "",
    ccode: "",
  });
  const [detail, setDetail] = useState(null);
  const [sum, setSum] = useState(0);
  const [comp, setComp] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    const session = await getSession();
    const setCode = session?.user.id.tbl_company[0].c_code;
    const { r_sdate, r_edate, r_uid, i_title } = searchData;

    const result = await searchSalesList(
      r_sdate,
      r_edate,
      r_uid,
      i_title,
      setCode
    );

    if (result) {
      setSalesList([...result]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await salesDataAll();
      setSalesList(result);
    };
    fetchData();
  }, []);

  useEffect(() => {
    // reduce 를 이용해 배열의 값 합산
    const totalSum = salesList.reduce(
      // 0 부터 시작
      (acc, list) => acc + parseInt(list.tbl_minfo.i_price),
      0
    );
    setSum(totalSum);
  }, [salesList]);

  useEffect(() => {
    const getCompInfo = async () => {
      const session = await getSession();
      const code = session?.user.id.tbl_company[0].c_code;
      const result = await findComp(code);
      setComp(result);
    };
    getCompInfo();
  }, []);

  const closeDetail = () => {
    setDetail(null);
  };

  return (
    <>
      <h1 className="list_title">매출 내역</h1>
      <div>
        <div className="list_home">
          <div className="sales btn_box search">
            <form className="search_form">
              <div>
                <div>
                  <label className="sdate">시작일</label>
                  <input
                    className="search_input sdate"
                    placeholder="시작일"
                    name="r_sdate"
                    type="date"
                    value={searchData.r_sdate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="sdate">종료일</label>
                  <input
                    className="search_input edate"
                    placeholder="종료일"
                    name="r_edate"
                    type="date"
                    value={searchData.r_edate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <input
                  className="search_input"
                  placeholder="회원ID"
                  name="r_uid"
                  value={searchData.r_uid}
                  onChange={handleChange}
                />
                <input
                  className="search_input"
                  placeholder="회원권이름"
                  name="i_title"
                  value={searchData.i_title}
                  onChange={handleChange}
                />
              </div>
              <button
                className="button-32"
                type="button"
                onClick={handleSearch}
              >
                검색
              </button>
            </form>
          </div>
          <div className="table_div">
            <table className="sales list">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>매출 날짜</th>
                  <th>회원 아이디</th>
                  <th>회원권 이름</th>
                  <th>회원권 가격</th>
                </tr>
              </thead>
              <tbody>
                {salesList.map((sales, index) => (
                  <tr
                    key={sales.r_sdate + sales.r_uid}
                    className="sales_list"
                    onClick={() => setDetail(sales)}
                  >
                    <td>{index + 1}</td>
                    <td className="sdate">{sales.r_sdate}</td>
                    <td className="id">{sales.r_uid}</td>
                    <td className="title">
                      {sales.tbl_minfo.i_title}
                    </td>
                    <td className="price">
                      {sales.tbl_minfo.i_price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <table className="total_list list">
            <tbody>
              <tr>
                <td>총 매출</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{sum}</td>
              </tr>
            </tbody>
          </table>
          {detail && (
            <div
              className={
                detail ? "modal-backdrop show" : "modal-backdrop"
              }
            >
              <div className={detail ? "detail show" : "detail"}>
                <div className="sales recipe">
                  <h1>매출 영수증</h1>
                  <div>
                    <label>업체코드</label>
                    <input
                      value={detail.tbl_minfo.i_ccode}
                      readOnly
                    />
                  </div>
                  <div>
                    <label>업체 명</label>
                    <input value={comp.c_name} readOnly />
                  </div>
                  <div>
                    <label>전화번호</label>
                    <input value={comp.c_tel} readOnly />
                  </div>
                  <div>
                    <label>주소</label>
                    <input value={comp.c_addr} readOnly />
                  </div>
                  <div>
                    <label>영수증번호</label>
                    <input value="202441-256871" readOnly />
                  </div>
                  <div>
                    <label>매출 날짜</label>
                    <input value={detail.r_sdate} readOnly />
                  </div>
                  <div>
                    <label>회원아이디</label>
                    <input value={detail.r_uid} readOnly />
                  </div>
                  <div>
                    <label>회원권이름</label>
                    <input
                      value={detail.tbl_minfo.i_title}
                      readOnly
                    />
                  </div>
                  <div>
                    <label>회원권가격</label>
                    <input
                      value={detail.tbl_minfo.i_price}
                      readOnly
                    />
                  </div>
                  <div>
                    <button
                      className="button-32"
                      onClick={closeDetail}
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SalesPage;
