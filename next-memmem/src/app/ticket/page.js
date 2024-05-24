"use client";
import { useEffect, useState } from "react";
import {
  getTicketInfo,
  getUserCount,
  ticketAll,
} from "../api/ticket";
import { useSession } from "next-auth/react";
import "../../css/table.css";
import "../../css/detail.css";
import { useModal } from "../../provider/ModalProvider";
import { useTicket } from "../../provider/TicketProvider";
import AOS from "aos";

const TicketPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
    });
  }, []);

  const { data: session } = useSession();
  const { ticketList, setTicketList } = useTicket();
  const [ticketSeq, setTicketSeq] = useState("");
  const [ticket, setTicket] = useState(null);
  const { setIsModal } = useModal();
  const [count, setCount] = useState("");

  // insert 클릭하면 modal 띄우기
  const openModal = () => {
    setIsModal(true);
  };

  // 회원권 리스트 셋팅
  useEffect(() => {
    if (session) {
      const ticketFetch = async () => {
        try {
          const ccode = session?.user.id.tbl_company[0].c_code;
          const result = await ticketAll(ccode);
          console.log(result);
          setTicketList([...result]);
        } catch (error) {
          console.log(error);
        }
      };
      ticketFetch();
    }
  }, [session, setTicketList]);

  // detail 데이터 셋팅
  useEffect(() => {
    if (ticketSeq) {
      const fetchTicket = async () => {
        try {
          // detail
          const result = await getTicketInfo(ticketSeq);
          setTicket(result[0]);
          // 이용중인 회원
          const count = await getUserCount(ticketSeq);
          setCount(count);
        } catch (error) {
          console.log(error);
        }
      };
      fetchTicket();
    }
  }, [ticketSeq, ticketList]);

  const ticketViewList = ticketList.map((ticket, index) => (
    <tr
      key={ticket?.i_seq}
      onClick={() => setTicketSeq(ticket?.i_seq)}
    >
      <td>{index + 1}</td>
      <td>{ticket?.i_title}</td>
      <td>{ticket?.i_price.toLocaleString()}</td>
      <td>{ticket?.i_count}</td>
    </tr>
  ));

  return (
    <>
      <h1 className="list_title">회원권 등록</h1>
      <div className="list_home half">
        <div className="insert_btn_box">
          <a className="insert button-32" onClick={openModal}>
            회원권 추가
          </a>
        </div>
        <div className="view_box">
          {ticket ? (
            <div>
              <div className="detail_box">
                <div className="card">
                  <h3>{ticket.i_title}</h3>
                  <div className="container">
                    <p>
                      현재 <span className="p_count">{count}명</span>
                      이용중입니다
                    </p>
                    <hr />
                    <div className="info">
                      <div>
                        <strong>가격</strong>
                        <p>{ticket.i_price}</p>
                      </div>
                      <div>
                        <strong>수강횟수</strong>
                        <p>{ticket.i_count} 회</p>
                      </div>
                    </div>
                  </div>
                  <div className="detail btn_box">
                    <button className="button-32">수정</button>
                    <button className="button-32">삭제</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="noticket card" data-aos="fade-up">
              No ticket selected
            </div>
          )}
        </div>
        <div className="table_div half">
          <table className="ticket list">
            <thead>
              <tr>
                <th>No.</th>
                <th>수강권</th>
                <th>가격</th>
                <th>수강횟수</th>
              </tr>
            </thead>
            <tbody>{ticketViewList}</tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TicketPage;
