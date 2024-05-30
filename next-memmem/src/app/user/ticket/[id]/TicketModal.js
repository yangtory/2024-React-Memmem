import React, { useRef, useState } from "react";
import { getTicketInfo } from "../../../api/ticket";
import "../../../../css/input.css";
const TicketModal = ({ closeModal, formData, setFormData, selectList, createUserTicket, id }) => {
  const [error, setError] = useState("");
  const riseq = useRef();
  const sdate = useRef();
  const edate = useRef();

  const changeTicket = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addClickHandler = async () => {
    if (!formData.r_iseq) {
      setError("수강권을 선택해주세요");
      riseq.current?.focus();
      return;
    }
    if (!formData.r_sdate) {
      setError("시작일을 입력해 주세요");
      sdate.current?.focus();
      return;
    }
    if (!formData.r_edate) {
      setError("종료일을 입력해 주세요");
      edate.current?.focus();
      return;
    }
    if (formData.r_sdate > formData.r_edate) {
      setError("종료일은 시작일 이후로 입력해주세요");
      edate.current?.focus();
      return;
    }

    const result = await createUserTicket({ formData, id });
    closeModal();
    setFormData({
      r_iseq: "",
      r_icount: "",
      r_sdate: "",
      r_edate: "",
    });
    console.log(result);
  };

  const handleSelectChange = async (e) => {
    const seq = e.target.value;
    if (seq !== "0") {
      const result = await getTicketInfo(parseInt(seq));
      setFormData({
        r_icount: result[0].i_count,
        r_iseq: result[0].i_seq,
      });
    }
  };

  return (
    <div className="modal-backdrop show">
      <div className="detail show">
        <div className="close_btn" onClick={closeModal}>
          <span>X</span>
        </div>
        <div className="notice input_box">
          <h3>수강권 추가</h3>
          <div className="m_error">{error}</div>
          <label>수강권</label>
          <select
            className="select"
            name="r_iseq"
            value={formData.r_iseq}
            onChange={handleSelectChange}
            ref={riseq}
          >
            <option value="0">--수강권선택--</option>
            {selectList}
          </select>
          <label>수강권횟수</label>
          <input
            className="r_icount"
            placeholder="수강권횟수"
            name="r_icount"
            value={formData.r_icount}
            onChange={changeTicket}
            readOnly
          />
          <label>시작일</label>
          <input
            className="r_sdate"
            type="date"
            name="r_sdate"
            value={formData.r_sdate}
            onChange={changeTicket}
            ref={sdate}
          />
          <label>종료일</label>
          <input
            className="r_edate"
            type="date"
            name="r_edate"
            value={formData.r_edate}
            onChange={changeTicket}
            ref={edate}
          />

          <div className="btn_box">
            <button className="button-32" onClick={addClickHandler}>
              추가
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
