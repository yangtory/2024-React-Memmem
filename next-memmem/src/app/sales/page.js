"use client";
import { useState, useEffect } from "react";
import { searchSalesList } from "../api/sales";
import { getSession } from "next-auth/react";
// import html2canvas from "html2canvas";

const SalesPage = () => {
  const [salesList, setSalesList] = useState([]);
  const [searchData, setSearchData] = useState({
    r_sdate: "",
    r_edate: "",
    r_uid: "",
    r_ititle: "",
    ccode: "",
  });
  const [detail, setDetail] = useState(null);
  //   const [isEditMode, setIsEditMode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //   const debounce = (callback, delay = 200) => {
  //     let debounceTimer;
  //     return (...args) => {
  //       clearTimeout(debounceTimer);

  //       debounceTimer = setTimeout(
  //         () => callback.apply(this, args),
  //         delay
  //       );
  //     };
  //   };
  //   const onSearchHandler = debounce(handleChange, 300);

  const handleSearch = async () => {
    const session = await getSession();
    const setCode = session?.user.id.tbl_company[0].c_code;
    const result = await searchSalesList({
      ...searchData,
      ccode: setCode,
    });
    if (result) {
      setSalesList([...result]);
    }
  };

  //   const saveReceipt = () => {
  //     html2canvas(document.querySelector(".detail")).then((canvas) => {
  //       var link = document.createElement("a");
  //       link.download = "receipt.png";
  //       link.href = canvas.toDataURL();
  //       link.click();
  //     });
  //   };

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
                  name="r_ititle"
                  value={searchData.r_ititle}
                  onChange={handleChange}
                />
              </div>
              <button
                className="button-32"
                type="button"
                onClick={handleSearch}
              ></button>
            </form>
          </div>
          <div className="table_div">
            <table className="sales list">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>매출 날짜</th>
                  <th>회원 아이디</th>
                  <th>회원권 번호</th>
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
                    <td className="seq">{sales.i_seq}</td>
                    <td className="title">{sales.i_title}</td>
                    <td className="price">
                      {sales.i_price.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <table className="total_list list">
            <tbody>
              <tr className="total">
                <td>총 매출</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="total"></td>
              </tr>
            </tbody>
          </table>
          {detail && (
            <div className="modal-backdrop">
              <div className="detail">
                <div className="sales recipe">
                  <h1>매출 영수증</h1>
                  <div>
                    <label>업체코드</label>
                    <input value={detail.i_ccode} readOnly />
                  </div>
                  <div>
                    <label>업체 명</label>
                    <input
                      value={initialCompanyName.c_name}
                      readOnly
                    />
                  </div>
                  <div>
                    <label>전화번호</label>
                    <input
                      value={initialCompanyName.c_tel}
                      readOnly
                    />
                  </div>
                  <div>
                    <label>주소</label>
                    <input
                      value={initialCompanyName.c_addr}
                      readOnly
                    />
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
                    <input value={detail.i_title} readOnly />
                  </div>
                  <div>
                    <label>회원권가격</label>
                    <input
                      value={detail.i_price.toLocaleString()}
                      readOnly
                    />
                  </div>
                  <div>
                    <button
                      className="button-32"
                      onClick={saveReceipt}
                    >
                      저장하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <style jsx>{`
          .list_title {
            // Add your styles here
          }
          .list_home {
            // Add your styles here
          }
          // Add other styles as necessary
        `}</style>
      </div>
    </>
  );
};

// export async function getServerSideProps() {
//   // 서버에서 데이터를 가져오는 로직을 구현합니다.
//   const salesList = await fetchSalesList();
//   const companyName = await fetchCompanyName();

//   return {
//     props: {
//       initialSalesList: salesList,
//       initialCompanyName: companyName,
//     },
//   };
// }

export default SalesPage;
