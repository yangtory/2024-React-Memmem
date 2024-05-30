"use client";
import styles from "../css/modal.module.css";
import { useModal } from "../provider/ModalProvider";
import { useEffect, useRef, useState } from "react";
import { createTicket } from "../app/api/ticket";
import { useAdd } from "../provider/AddListProvider";
import { getSession } from "next-auth/react";
import "../css/input.css";
const TicketModal = () => {
  const { isModal, setIsModal } = useModal();
  const { addTicket } = useAdd();
  const [formData, setFormData] = useState({
    i_title: "",
    i_price: "",
    i_count: "",
    i_ccode: "",
  });
  const title = useRef();
  const price = useRef();
  const count = useRef();
  const [error, setError] = useState("");

  // ccode
  useEffect(() => {
    const getCCode = async () => {
      const session = await getSession();
      // const id = session?.user.id;
      const code = session?.user.id.tbl_company[0].c_code;
      setFormData((prevFormData) => ({
        ...prevFormData,
        i_ccode: code,
      }));
    };
    getCCode();
  }, [isModal]);

  // input 입력 할수 있게
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 폼 제출, insert 실행
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.i_title) {
      setError("제목을 입력해 주세요");
      title.current?.focus();
      return;
    }
    if (!formData.i_count || isNaN(Number(formData.i_count))) {
      setError("올바른 수강횟수를 입력해 주세요");
      count.current?.focus();
      return;
    }
    if (!formData.i_price || isNaN(Number(formData.i_price))) {
      setError("올바른 가격을 입력해 주세요");
      price.current?.focus();
      return;
    }
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
              {error && <div className="ticket_error">{error}</div>}
              <label>업체코드</label>
              <input value={formData.i_ccode} name="i_ccode" readOnly />
              <label>제목</label>
              <input
                placeholder="제목"
                name="i_title"
                value={formData.i_title}
                onChange={handleChange}
                ref={title}
              />
              <label>수강횟수</label>
              <input
                placeholder="수강횟수"
                name="i_count"
                value={formData.i_count}
                onChange={handleChange}
                ref={count}
              />
              <label>가격</label>
              <input
                placeholder="가격"
                name="i_price"
                value={formData.i_price}
                onChange={handleChange}
                ref={price}
              />
            </div>
          </main>
          <footer className={styles.footer}>
            <button type="submit" className={styles["btn-left"]}>
              추가
            </button>
            <button className={styles["btn-right"]} onClick={onClickClose}>
              Close
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default TicketModal;
