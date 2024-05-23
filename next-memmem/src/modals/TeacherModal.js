"use client";
import styles from "../css/modal.module.css";
import { useModal } from "../provider/ModalProvider";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { findUnique } from "../app/api/user";
import { useTicket } from "../provider/TicketProvider";
import { createTeacher, selectAll } from "../app/api/teacher";

const TeacherModal = () => {
  const { teacherModal, setTeacherModal } = useModal();
  const { addTeacher } = useTicket();
  const [formData, setFormData] = useState({
    t_code: "",
    t_name: "",
    t_tel: "",
    t_ccode: "",
  });

  // user의 ccode 셋팅
  // useEffect(() => {
  //   const getCCode = async () => {
  //     const session = await getSession();
  //     const u_id = session?.user?.id;
  //     const code = (await findUnique({ u_id })).tbl_company[0].c_code;

  //     // console.log(code);
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       t_ccode: code,
  //     }));
  //   };
  //   const createTCode = async () => {
  //     let tcode = "T0001";
  //     const result = await selectAll();
  //     if (result.length > 0) {
  //       const lastNum = Number(result.length - 1);
  //       const currentNum = result[lastNum].t_code;
  //       const subNum = currentNum.substring(1, 5);
  //       const strNum = String(Number(subNum) + 1);
  //       tcode = "T" + strNum.padStart(4, "0");
  //       // console.log(tcode);
  //       setFormData((prevFormData) => ({
  //         ...prevFormData,
  //         t_code: tcode,
  //       }));
  //     }
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       t_code: tcode,
  //     }));
  //   };
  //   getCCode();
  //   createTCode();
  // }, [teacherModal]);

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
    try {
      const result = await createTeacher({ formData });
      addTeacher(result);
      setTeacherModal(false);
      setFormData("");
      console.log("Ticket created:", result);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };
  if (!teacherModal) return null;

  // 모달 close 하기
  function onClickClose() {
    setTeacherModal(false);
    setFormData("");
  }

  return (
    <div className={teacherModal ? styles["modal"] : styles["close"]}>
      <section>
        <header>
          <div>강사 등록</div>
          <button onClick={onClickClose}>X</button>
        </header>
        <form className={styles.form} onSubmit={handleSubmit}>
          <main>
            <div className={styles.input_div}>
              <div className="ticket error"></div>
              <label>업체코드</label>
              <input
                value={formData.t_ccode}
                name="t_ccode"
                readOnly
              />
              <label>강사코드</label>
              <input
                placeholder="강사코드"
                name="t_code"
                value={formData.t_code}
                onChange={handleChange}
                readOnly
              />
              <label>강사이름</label>
              <input
                placeholder="강사이름"
                name="t_name"
                value={formData.t_name}
                onChange={handleChange}
              />
              <label>전화번호</label>
              <input
                placeholder="전화번호"
                name="t_tel"
                value={formData.t_tel}
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

export default TeacherModal;
