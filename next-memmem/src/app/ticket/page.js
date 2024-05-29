"use client";
import { useEffect, useState } from "react";
import { deleteTicket, getTicketInfo, getUserCount, ticketAll, updateTicket } from "../api/ticket";
import { useSession } from "next-auth/react";
import "../../css/table.css";
import "../../css/detail.css";
import { useModal } from "../../provider/ModalProvider";
import { useAdd } from "../../provider/AddListProvider";

const TicketPage = () => {
  const { data: session } = useSession();
  const { ticketList, setTicketList } = useAdd();
  const [ticketSeq, setTicketSeq] = useState("");
  const [ticket, setTicket] = useState(null);
  const { setIsModal } = useModal();
  const [count, setCount] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [listUpdate, setListUpdate] = useState(null);
  const [formData, setFormData] = useState({
    i_seq: "",
    i_price: "",
    i_count: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
          // console.log(result);
          setTicketList([...result]);
        } catch (error) {
          console.log(error);
        }
      };
      ticketFetch();
    }
  }, [session, setTicketList, isEditMode, listUpdate]);

  // detail 데이터 셋팅
  useEffect(() => {
    if (ticketSeq) {
      const fetchTicket = async () => {
        try {
          // detail
          const result = await getTicketInfo(ticketSeq);
          setTicket(result[0]);
          setFormData({
            i_seq: result[0].i_seq,
            i_price: result[0].i_price,
            i_count: result[0].i_count,
          });
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
    <tr key={ticket?.i_seq} onClick={() => setTicketSeq(ticket?.i_seq)}>
      <td>{index + 1}</td>
      <td>{ticket?.i_title}</td>
      <td>{ticket?.i_price.toLocaleString()}</td>
      <td>{ticket?.i_count}</td>
    </tr>
  ));

  // 수정버튼 클릭
  const updateClickHandler = () => {
    setIsEditMode(true);
  };

  // 저장버튼 클릭
  const saveClickHandler = async () => {
    // console.log(formData);
    if (confirm("정말 수정할까요?")) {
      const { i_seq, i_price, i_count } = formData;
      await updateTicket({
        seq: i_seq,
        price: i_price,
        count: i_count,
      });
      setIsEditMode(false);
      setTicketSeq(i_seq);
    }
  };

  const deleteClickHandler = async (seq) => {
    if (confirm("정말 삭제할까요?")) {
      await deleteTicket(seq);
      setTicket(null);
      // ticket 상태를 변경하면 detail 클릭 시 무한 렌더링함
      // 삭제 후 임시로 상태를 변경하는 코드
      if (listUpdate === null) {
        setListUpdate("");
      } else {
        setListUpdate(null);
      }
    }
  };

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
                      <input value={formData.i_seq} type="hidden" />
                      <div>
                        <strong>가격</strong>
                        <input
                          name="i_price"
                          value={formData.i_price}
                          readOnly={!isEditMode}
                          onChange={handleChange}
                          style={{
                            border: isEditMode ? "0.5px solid black" : "none",
                          }}
                        />
                      </div>
                      <div>
                        <strong>수강횟수</strong>
                        <input
                          name="i_count"
                          value={formData.i_count}
                          readOnly={!isEditMode}
                          onChange={handleChange}
                          style={{
                            border: isEditMode ? "0.5px solid black" : "none",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="detail_btn_box">
                    {isEditMode ? (
                      <button className="button-32" onClick={saveClickHandler}>
                        저장
                      </button>
                    ) : (
                      <>
                        <button className="button-32" onClick={updateClickHandler}>
                          수정
                        </button>
                        <button
                          className="button-32"
                          onClick={() => {
                            deleteClickHandler(ticketSeq);
                          }}
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="noticket card">No ticket selected</div>
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
