"use client";
import { getSession } from "next-auth/react";
import styles from "../css/modal.module.css";
import { useModal } from "../provider/ModalProvider";
import { useEffect, useState } from "react";
import { getTicketInfo, ticketAll } from "../app/api/ticket";

const UserTicketModal = () => {
  const { isModal, setIsModal } = useModal();
  const [ticketList, setTicketList] = useState([]);
  const [formData, setFormData] = useState({
    r_iseq: "",
    r_icount: "",
    r_sdate: "",
    r_edate: "",
  });

  useEffect(() => {
    const fetchTicket = async () => {
      // 티켓 찾기
      const session = await getSession();
      const ccode = session?.user.id.tbl_company[0].c_code;
      const result = await ticketAll(ccode);
      // console.log(result);
      setTicketList(result);
    };
    fetchTicket();
  }, []);
  // select 정보
  const selectList = ticketList.map((list) => (
    <option key={list.i_seq} value={list.i_seq}>
      {list.i_title}
    </option>
  ));

  // ticket 선택 i_count 정보 찾기
  const ticketInfoHandler = async (seq) => {
    try {
      const result = await getTicketInfo(parseInt(seq));
      setFormData({
        r_icount: result[0].i_count,
        r_iseq: result[0].i_seq,
      });
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  // select의 체인지 핸들러,
  const handleSelectChange = (e) => {
    const seq = e.target.value; //select 가 change 되면
    if (seq !== "0") {
      ticketInfoHandler(seq); // ticketInfoHandler 에 seq 넘겨주고 count 셋팅하기
    }
  };

  // input 입력 할수 있게
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 모달 close 하기
  function onClickClose() {
    setIsModal(false);
  }

  // 폼 제출, insert 실행
  const handleSubmit = async (e) => {
    console.log(formData);
    // e.preventDefault();
    // try {
    //   const result = await createTicket({ formData });
    //   addTicket(result);
    //   setIsModal(false);
    //   setFormData("");
    //   console.log("Ticket created:", result);
    // } catch (error) {
    //   console.error("Failed to create user:", error);
    // }
  };
  if (!isModal) return null;

  return (
    <div className={isModal ? styles["modal"] : styles["close"]}>
      <section>
        <header>
          <div>수강권 등록</div>
          <button onClick={onClickClose}>X</button>
        </header>
        <form className={styles.form} onSubmit={handleSubmit}>
          <main>
            <div className={styles.input_div}>
              <div className="ticket error"></div>
              <div className={styles.selectBox}>
                <select
                  className={styles.select}
                  name="r_iseq"
                  value={formData.r_iseq}
                  onChange={handleSelectChange}
                >
                  <option value="0">--수강권선택--</option>
                  {selectList}
                </select>
              </div>
              <label>수강횟수</label>
              <input
                value={formData.r_icount}
                name="r_icount"
                readOnly
              />
              <label>시작일</label>
              <input
                name="r_sdate"
                type="date"
                value={formData.r_sdate}
                onChange={handleChange}
              />
              <label>종료일</label>
              <input
                name="r_edate"
                type="date"
                value={formData.r_edate}
                onChange={handleChange}
              />
            </div>
          </main>
          <footer className={styles.footer}>
            <button type="submit" className={styles["btn-left"]}>
              추가
            </button>
            <button
              className={styles["btn-right"]}
              onClick={onClickClose}
            >
              Close
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default UserTicketModal;
