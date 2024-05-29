"use client";
import React, { useEffect, useState } from "react";
import {
  createUserTicket,
  findDetail,
  userMinfoList,
} from "../../../api/userMinfo";
import "../../../../css/user/userTicketModal.css";
import { getSession } from "next-auth/react";
import { getTicketInfo, ticketAll } from "../../../api/ticket";

const TicketList = ({ params }) => {
  const [userMinfo, setUserMinfo] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [ticketList, setTicketList] = useState([]);
  const [ticketSeq, setTicketSeq] = useState(null);
  const [detail, setDetail] = useState(null);
  const [formData, setFormData] = useState({
    r_iseq: "",
    r_icount: "",
    r_sdate: "",
    r_edate: "",
  });

  const changeTicket = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const id = decodeURIComponent(params.id);

  // insert 클릭하면 modal 띄우기
  const openModal = () => {
    setIsModal(true);
  };

  const closeModal = () => {
    setIsModal(false);
  };
  useEffect(() => {
    const fetchList = async () => {
      const result = await userMinfoList(id);
      setUserMinfo(result);

      // console.log(result);
    };
    fetchList();
  }, [isModal]);

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
    setFormData({ r_iseq: seq });
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

  // 수강권추가
  const addClickHandler = async () => {
    const result = await createUserTicket({ formData, id });
    setIsModal(false);
    setFormData({
      r_iseq: "",
      r_icount: "",
      r_sdate: "",
      r_edate: "",
    });
    console.log(result);
  };

  // 디데이 계산
  const calcDday = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - today.getTime();
    const differenceInDays = Math.ceil(
      differenceInTime / (1000 * 3600 * 24)
    );
    // console.log(differenceInDays);
    return differenceInDays;
  };

  const viewList = userMinfo.map((list) => {
    const dDay = calcDday(list.r_edate);
    return (
      <tr key={list.r_iseq} onClick={() => setTicketSeq(list.r_iseq)}>
        <td>{list.r_uid}</td>
        <td>{list.tbl_minfo.i_title}</td>
        <td>{list.r_icount}</td>
        <td>{list.r_sdate}</td>
        <td>{list.r_edate}</td>
        <td>
          <span className="dday">
            {dDay >= 0 ? "-" + dDay : "기간만료"}
          </span>
        </td>
      </tr>
    );
  });

  // 디테일 정보찾기
  useEffect(() => {
    const findUser = async () => {
      const result = await findDetail(ticketSeq, id);
      console.log("server", result);
      setDetail(result);
    };
    findUser();
  }, [ticketSeq, id]);

  return (
    <>
      <h1 className="list_title">{id} 님 회원권 정보</h1>
      <div>
        <div className="list_home">
          <div className="insert_btn_box">
            <a className="insert button-32" onClick={openModal}>
              회원권 추가
            </a>
          </div>

          <div className="view_box">
            {detail ? (
              <div>
                <div className="detail_box">
                  <div className="card">
                    <h3>{detail.tbl_minfo.i_title}</h3>
                    <div className="container">
                      <div className="info">
                        <div>
                          <strong>잔여횟수</strong>
                          <input
                            name="r_icount"
                            value={detail.r_icount}
                            readOnly={!isEditMode}
                            onChange={changeTicket}
                            style={{
                              border: isEditMode
                                ? "0.5px solid black"
                                : "none",
                            }}
                          />
                        </div>
                        <div>
                          <strong>기간</strong>
                          <input
                            name="r_icount"
                            value={detail.r_sdate}
                            readOnly={!isEditMode}
                            // onChange={handleChange}
                            style={{
                              border: isEditMode
                                ? "0.5px solid black"
                                : "none",
                            }}
                          />
                          <input
                            name="r_icount"
                            value={detail.r_edate}
                            readOnly={!isEditMode}
                            // onChange={handleChange}
                            style={{
                              border: isEditMode
                                ? "0.5px solid black"
                                : "none",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="detail_btn_box">
                      {isEditMode ? (
                        <button
                          className="button-32"
                          // onClick={saveClickHandler}
                        >
                          저장
                        </button>
                      ) : (
                        <>
                          <button
                            className="button-32"
                            // onClick={updateClickHandler}
                          >
                            수정
                          </button>
                          <button
                            className="button-32"
                            // onClick={() => {
                            //   deleteClickHandler(ticketSeq);
                            // }}
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

          <table className="user_ticket list">
            <thead>
              <tr>
                <th>회원</th>
                <th>수강권</th>
                <th>잔여횟수</th>
                <th>시작일</th>
                <th>종료일</th>
                <th>D-DAY</th>
              </tr>
            </thead>
            <tbody>{viewList}</tbody>
          </table>
        </div>
      </div>
      <div
        className={isModal ? "modal-backdrop show" : "modal-backdrop"}
      >
        <div className={isModal ? "detail show" : "detail"}>
          <div className="close_btn" onClick={closeModal}>
            <span>X</span>
          </div>
          <div className="notice input_box">
            {isEditMode ? (
              <>
                <h3>수강권 수정</h3>
                <input
                  id="seq"
                  value={id}
                  readOnly
                  // type="hidden"
                />
              </>
            ) : (
              ""
            )}
            <h3>수강권 추가</h3>
            <label>수강권</label>
            <select
              className="select"
              name="r_iseq"
              value={formData.r_iseq}
              onChange={handleSelectChange}
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
            />
            <label>종료일</label>
            <input
              className="r_edate"
              type="date"
              name="r_edate"
              value={formData.r_edate}
              onChange={changeTicket}
            />

            <div className="btn_box">
              {isEditMode ? (
                <button
                  className="notice_update button-32"
                  onClick={updateHandler}
                >
                  수정완료
                </button>
              ) : (
                <>
                  <button
                    className="button-32"
                    onClick={addClickHandler}
                  >
                    추가
                  </button>
                  {/* <button
                    className="notice_update button-32"
                    onClick={() =>
                      updateClickHandler(selectedNotice?.n_seq)
                    }
                  >
                    수정
                  </button>
                  <button
                    className="notice_delete button-32"
                    onClick={() =>
                      deleteHandler(selectedNotice?.n_seq)
                    }
                  >
                    삭제
                  </button> */}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketList;
