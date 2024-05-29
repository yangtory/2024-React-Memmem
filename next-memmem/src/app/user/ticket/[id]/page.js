"use client";
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import {
  userMinfoList,
  findDetail,
  createUserTicket,
  updateUserTicket,
  deleteUserTicket,
} from "../../../api/userMinfo";
import { ticketAll } from "../../../api/ticket";
import "../../../../css/user/userTicketModal.css";
import TicketDetail from "./TicketDetail";
import TicketModal from "./TicketModal";
import TicketRow from "./TicketRow";

const TicketList = ({ params }) => {
  const [userMinfo, setUserMinfo] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [ticketList, setTicketList] = useState([]);
  const [ticketSeq, setTicketSeq] = useState(null);
  const [formData, setFormData] = useState({
    r_iseq: "",
    r_icount: "",
    r_sdate: "",
    r_edate: "",
    i_title: "",
  });

  const id = decodeURIComponent(params.id);

  const fetchList = async () => {
    const result = await userMinfoList(id);
    setUserMinfo(result);
  };

  useEffect(() => {
    fetchList();
  }, [isModal, isEditMode, ticketSeq]);

  useEffect(() => {
    const fetchTicket = async () => {
      const session = await getSession();
      const ccode = session?.user.id.tbl_company[0].c_code;
      const result = await ticketAll(ccode);
      setTicketList(result);
    };
    fetchTicket();
  }, []);

  const openModal = () => setIsModal(true);
  const closeModal = () => setIsModal(false);

  const findUser = async () => {
    const result = await findDetail(ticketSeq, id);
    if (ticketSeq) {
      setFormData({
        r_edate: result.r_edate,
        r_sdate: result.r_sdate,
        r_icount: result.r_icount,
        r_iseq: result.r_iseq,
        r_uid: result.r_uid,
        i_title: result.tbl_minfo.i_title,
      });
    }
  };

  useEffect(() => {
    findUser();
  }, [ticketSeq, id]);

  const selectList = ticketList.map((list) => (
    <option key={list.i_seq} value={list.i_seq}>
      {list.i_title}
    </option>
  ));

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

          <div className="view_box">
            {ticketSeq ? (
              <TicketDetail
                formData={formData}
                setFormData={setFormData}
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
                ticketSeq={ticketSeq}
                id={id}
                updateUserTicket={updateUserTicket}
                deleteUserTicket={deleteUserTicket}
                setTicketSeq={setTicketSeq}
              />
            ) : (
              <div className="noticket card">No ticket selected</div>
            )}
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
            <tbody>
              {userMinfo.map((list) => (
                <TicketRow
                  key={list.r_iseq}
                  list={list}
                  setTicketSeq={setTicketSeq}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModal && (
        <TicketModal
          closeModal={closeModal}
          formData={formData}
          setFormData={setFormData}
          selectList={selectList}
          createUserTicket={createUserTicket}
          id={id}
        />
      )}
    </>
  );
};

export default TicketList;
