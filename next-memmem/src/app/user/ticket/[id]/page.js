"use client";
import React, { useEffect, useState } from "react";
import { userMinfoList } from "../../../api/userMinfo";
import { useModal } from "../../../../provider/ModalProvider";

const TicketList = ({ params }) => {
  const [userMinfo, setUserMinfo] = useState([]);
  const { setIsModal } = useModal();

  const id = decodeURIComponent(params.id);

  // insert 클릭하면 modal 띄우기
  const openModal = () => {
    setIsModal(true);
  };
  useEffect(() => {
    const fetchList = async () => {
      const result = await userMinfoList(id);
      setUserMinfo(result);
      // console.log(result);
    };
    fetchList();
  }, []);

  const calcDday = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - today.getTime();
    const differenceInDays = Math.ceil(
      differenceInTime / (1000 * 3600 * 24)
    );
    // console.log(differenceInDays);
    return differenceInDays;
  };

  const viewList = userMinfo.map((list) => {
    const dDay = calcDday(list.r_edate);
    return (
      <tr key={list.r_iseq}>
        <td>{list.r_uid}</td>
        <td>{list.tbl_minfo.i_title}</td>
        <td>{list.r_icount}</td>
        <td>{list.r_sdate}</td>
        <td>{list.r_edate}</td>
        <td>
          <span className="dday">
            {dDay >= 0 ? "-" + dDay : "기간만료"}
          </span>
        </td>
      </tr>
    );
  });

  return (
    <>
      <h1 className="list_title">{id} 님 회원권 정보</h1>
      <div>
        <div className="list_home">
          <div className="insert_btn_box">
            <a className="insert button-32" onClick={openModal}>
              회원권 추가
            </a>
          </div>

          <table className="user_ticket list">
            <thead>
              <tr>
                <th>회원</th>
                <th>수강권</th>
                <th>잔여횟수</th>
                <th>시작일</th>
                <th>종료일</th>
                <th>D-DAY</th>
              </tr>
            </thead>
            <tbody>{viewList}</tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TicketList;
