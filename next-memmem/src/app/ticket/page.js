"use client";
import { useEffect, useState } from "react";
import { ticketAll } from "../api/ticket";
import { useSession } from "next-auth/react";
import { findUnique } from "../api/user";
import "../../css/table.css";

const TicketPage = () => {
  const { data: session } = useSession();
  const [ticketList, setTicketList] = useState([]);

  useEffect(() => {
    if (session) {
      const ticketFetch = async () => {
        try {
          const u_id = session.user.id;
          const ccode = (await findUnique({ u_id })).tbl_company[0]
            .c_code;
          const result = await ticketAll(ccode);
          setTicketList([...result]);
        } catch (error) {
          console.log(error);
        }
      };
      ticketFetch();
    }
  }, [session]);

  return (
    <div className="list_home">
      <div className="insert_btn_box">
        <a href="/ticket/insert" className="insert button-32">
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
