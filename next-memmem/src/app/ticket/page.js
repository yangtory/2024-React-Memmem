"use client";
import { useEffect, useState } from "react";
import { ticketAll } from "../api/ticket";
import { useSession } from "next-auth/react";

const TicketPage = () => {
  const { data: session } = useSession();
  const [ticketList, setTicketList] = useState([]);

  useEffect(() => {
    if (session) {
      const ccode = session;
      console.log(ccode);

      const ticketFetch = async () => {
        const result = await ticketAll(ccode);
        setTicketList([...result]);
      };
      ticketFetch();
    }
  }, [session]);

  useEffect(() => {
    console.log("Session:", session);
  }, [session]);

  return (
    <div className="list_home">
      <div className="insert_btn_box">
        <a className="insert button-32">수강권 추가</a>
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
          <tbody>
            {ticketList.map((ticket, index) => (
              <tr key={ticket.i_seq} data-seq={ticket.i_seq}>
                <td>{index + 1}</td>
                <td>{ticket.i_title}</td>
                <td>{ticket.i_price.toLocaleString()}</td>
                <td>{ticket.i_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketPage;
