"use client";
import { useEffect, useState } from "react";
import { getTicketInfo, ticketAll } from "../api/ticket";
import { useSession } from "next-auth/react";
import "../../css/table.css";
import { useModal } from "../../provider/ModalProvider";
import { useTicket } from "../../provider/TicketProvider";
import { useUser } from "../../provider/UserProvider";

const TicketPage = () => {
  const { data: session } = useSession();
  const { ticketList, setTicketList } = useTicket();
  const [ticketSeq, setTicketSeq] = useState("");
  const [ticket, setTicket] = useState(null);
  const { setIsModal } = useModal();
  const { ccode } = useUser();

  // insert 클릭하면 modal 띄우기
  const openModal = () => {
    setIsModal(true);
  };

  // 회원권 리스트 셋팅
  useEffect(() => {
    if (session) {
      const ticketFetch = async () => {
        try {
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
          const result = await getTicketInfo(ticketSeq);
          setTicket(result[0]);
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
            수강권 추가
          </a>
        </div>
        <div className="table_div">
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
        <div className="view_box">
          {ticket ? (
            <div>
              <h1>회원권Detail</h1>
              <p>회원권 : {ticket.i_title}</p>
              <p>횟수 : {ticket.i_count}</p>
              <p>가격 : {ticket.i_price}</p>
            </div>
          ) : (
            <p>No ticket selected</p>
          )}
        </div>
      </div>
    </>
  );
};

export default TicketPage;
