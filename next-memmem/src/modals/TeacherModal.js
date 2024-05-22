"use client";
import styles from "../css/modal.module.css";
import { useModal } from "../provider/ModalProvider";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { createTicket } from "../app/api/ticket";
import { useRouter } from "next/navigation";
import { findUnique } from "../app/api/user";
import { useTicket } from "../provider/TicketProvider";

const Modal = () => {
  const { isModal, setIsModal } = useModal();
  const { addTicket } = useTicket();
  const router = useRouter();
  const [ccode, setCcode] = useState("");
  const [formData, setFormData] = useState({
    i_title: "",
    i_price: "",
    i_count: "",
    ccode: ccode,
  });

  // user의 ccode 셋팅
  useEffect(() => {
    const getCCode = async () => {
      const session = await getSession();
      const u_id = session?.user?.id;
      console.log(session);
      const ccode = (await findUnique({ u_id })).tbl_company[0]
        .c_code;
      console.log(ccode);
      setCcode(ccode);
    };
    getCCode();
  }, []);

  // input 입력 할수 있게
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      ccode,
    });
  };

  // 폼 제출, insert 실행
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createTicket({ formData });
      addTicket(result);
      setIsModal(false);
      setFormData("");
      console.log("Ticket created:", result);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };
  if (!isModal) return null;

  // 모달 close 하기
  function onClickClose() {
    setIsModal(false);
  }

  return (
    <div className={isModal ? styles["modal"] : styles["close"]}>
      <section>
        <header>
          <div>회원권 등록</div>
          <button onClick={onClickClose}>X</button>
        </header>
        <form className={styles.form} onSubmit={handleSubmit}>
          <main>
            <div className={styles.input_div}>
              <div className="ticket error"></div>
              <label>업체코드</label>
              <input value={ccode} name="i_ccode" readOnly />
              <label>제목</label>
              <input
                placeholder="제목"
                name="i_title"
                value={formData.i_title}
                onChange={handleChange}
              />
              <label>수강횟수</label>
              <input
                placeholder="수강횟수"
                name="i_count"
                value={formData.i_count}
                onChange={handleChange}
              />
              <label>가격</label>
              <input
                placeholder="가격"
                name="i_price"
                value={formData.i_price}
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

export default Modal;
