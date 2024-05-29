import React, { useRef } from "react";

const TicketDetail = ({
  formData,
  setFormData,
  isEditMode,
  setIsEditMode,
  updateUserTicket,
  deleteUserTicket,
  ticketSeq,
  id,
  setTicketSeq,
}) => {
  const icountInputRef = useRef(null);

  const changeTicket = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const updateClickHandler = () => {
    setIsEditMode(true);
    setTimeout(() => {
      if (icountInputRef.current) {
        icountInputRef.current.focus();
        icountInputRef.current.select();
      }
    }, 0);
  };

  const saveClickHandler = async () => {
    if (confirm("정말 수정할까요?")) {
      await updateUserTicket(formData, id);
      setIsEditMode(false);
    }
  };

  const deleteClickHandler = async () => {
    if (confirm("정말 삭제할까요?")) {
      await deleteUserTicket(ticketSeq, id);
      setTicketSeq(null);
    }
  };

  return (
    <div className="detail_box">
      <div className="card">
        <h3>{formData.i_title}</h3>
        <div className="container">
          <div className="info">
            <div>
              <strong>잔여횟수</strong>
              <input
                ref={icountInputRef}
                className="ticket_input"
                name="r_icount"
                value={formData.r_icount}
                readOnly={!isEditMode}
                onChange={changeTicket}
                style={{
                  border: isEditMode ? "0.5px solid #888" : "none",
                }}
              />
            </div>
            <div>
              <strong>시작일</strong>
              <input
                className="ticket_input"
                name="r_sdate"
                type="date"
                value={formData.r_sdate}
                readOnly={!isEditMode}
                onChange={changeTicket}
                style={{
                  border: isEditMode ? "0.5px solid #888" : "none",
                }}
              />
            </div>
            <div>
              <strong>종료일</strong>
              <input
                className="ticket_input"
                name="r_edate"
                type="date"
                value={formData.r_edate}
                readOnly={!isEditMode}
                onChange={changeTicket}
                style={{
                  border: isEditMode ? "0.5px solid #888" : "none",
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
              <button
                className="button-32"
                onClick={updateClickHandler}
              >
                수정
              </button>
              <button
                className="button-32"
                onClick={deleteClickHandler}
              >
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
