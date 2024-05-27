"use client";
import styles from "../css/modal.module.css";
import { useModal } from "../provider/ModalProvider";
import { useEffect, useState } from "react";
import { useTicket } from "../provider/TicketProvider";
import { getSession } from "next-auth/react";
import { createNotice } from "../app/api/notice";
import moment from "moment";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const NoticeModal = () => {
  const { noticeModal, setNoticeModal } = useModal();
  const { addNotice } = useTicket();

  const [formData, setFormData] = useState({
    n_seq: "",
    n_title: "",
    n_content: "",
    n_ccode: "",
    n_uid: "",
    n_date: moment().format("YYYY-MM-DD"),
    n_time: moment().format("HH:mm:ss"),
  });

  // ccode, id, seq, date, time 셋팅
  useEffect(() => {
    const formSetting = async () => {
      const session = await getSession();
      const id = session?.user.id.u_id;
      const ccode = session?.user.id.tbl_company[0].c_code;
      // console.log(id);
      // console.log(ccode);

      const seq = uuidv4();
      // console.log(seq);
      const saltRounds = 3;
      const hashedSeq = await bcrypt.hash(seq, saltRounds);
      // console.log("Hashed Seq:", hashedSeq);

      setFormData((prevFormData) => ({
        ...prevFormData,
        n_seq: hashedSeq,
        n_ccode: ccode,
        n_uid: id,
        n_date: moment().format("YYYY-MM-DD"),
        n_time: moment().format("HH:mm:ss"),
      }));
    };
    formSetting();
  }, [noticeModal, addNotice]);

  // // input 입력 할수 있게
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 폼 제출, insert 실행
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createNotice({ formData });
      addNotice(result);
      setNoticeModal(false);

      // formData 초기화
      setFormData({
        n_seq: "",
        n_title: "",
        n_content: "",
        n_date: "",
        n_time: "",
      });
      console.log("Ticket created:", result);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };
  if (!noticeModal) return null;

  // 모달 close 하기
  function onClickClose() {
    setNoticeModal(false);
  }

  return (
    <div className={noticeModal ? styles["modal"] : styles["close"]}>
      <section>
        <header>
          <div>공지사항 등록</div>
          <button onClick={onClickClose}>X</button>
        </header>
        <form className={styles.form} onSubmit={handleSubmit}>
          <main>
            <div className={styles.input_div}>
              <div className="ticket error"></div>
              <input
                value={formData.n_date}
                name="n_date"
                type="hidden"
                readOnly
              />
              <input
                value={formData.n_time}
                name="n_time"
                type="hidden"
                readOnly
              />
              <input
                value={formData.n_uid}
                name="n_uid"
                type="hidden"
                readOnly
              />
              <label>업체코드</label>
              <input
                value={formData.n_ccode}
                name="n_ccode"
                readOnly
              />
              <label>제목</label>
              <input
                placeholder="제목"
                name="n_title"
                value={formData.n_title}
                onChange={handleChange}
              />
              <label>내용</label>
              <textarea
                className={styles.textarea}
                placeholder="내용"
                rows="7"
                name="n_content"
                value={formData.n_content}
                onChange={handleChange}
              ></textarea>
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

export default NoticeModal;
