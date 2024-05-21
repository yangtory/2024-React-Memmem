"use client";
import { useEffect, useState } from "react";
import { findUnique } from "../../api/user";
import { getSession } from "next-auth/react";
import { createTicket } from "../../api/ticket";

const TicketInput = ({ initialValues }) => {
  // 상태 변수를 사용하여 입력값을 관리합니다.
  const [formData, setFormData] = useState(initialValues || {});
  const [ccode, setCcode] = useState("");

  useEffect(() => {
    const getCCode = async () => {
      const session = await getSession();
      const u_id = session.user.id;
      console.log(session);
      const ccode = (await findUnique({ u_id })).tbl_company[0]
        .c_code;
      console.log(ccode);
      setCcode(ccode);
    };
    getCCode();
  }, []);
  // 입력값이 변경될 때마다 상태를 업데이트합니다.
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      ccode,
    });
  };

  // 폼을 제출할 때 수행되는 함수입니다.
  const handleSubmit = async () => {
    try {
      const result = await createTicket({ formData });
      console.log("Ticket created:", result);
      router.push("/ticket");
    } catch (error) {
      console.error("Failed to create user:", error);
    }
    // 폼 데이터를 서버로 전송하거나 필요한 작업을 수행합니다.
    console.log(formData);
  };

  return (
    <div>
      <h1 className="list_title">회원권 등록</h1>
      <div className="input_div">
        <form className="ticket input_box" onSubmit={handleSubmit}>
          <div className="ticket error"></div>
          <label>업체코드</label>
          <input value={ccode} name="i_ccode" readOnly />
          <label>제목</label>
          <input
            placeholder="제목"
            name="i_title"
            value={formData.i_title || initialValues?.i_title || ""}
            onChange={handleChange}
          />
          <label>수강횟수</label>
          <input
            placeholder="수강횟수"
            name="i_count"
            value={formData.i_count || initialValues?.i_count || ""}
            onChange={handleChange}
          />
          <label>가격</label>
          <input
            placeholder="가격"
            name="i_price"
            value={formData.i_price || initialValues?.i_price || ""}
            onChange={handleChange}
          />
          <input
            type="submit"
            className="insert button-32"
            value={initialValues ? "수정" : "추가"}
          />
        </form>
      </div>
    </div>
  );
};

export default TicketInput;
