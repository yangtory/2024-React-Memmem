"use client";
import "../../../css/table.css";
import "../../../css/input.css";
import { useEffect, useRef, useState } from "react";
import { AllUser } from "../../api/user";
import { getSession, useSession } from "next-auth/react";
import { AddUserComp } from "../../api/userComp";

import "../../../css/user/userInput.css";
import { getTicketInfo, ticketAll } from "../../api/ticket";
import { addUserMinfo } from "../../api/userMinfo";

const InsertPage = () => {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  const { data: session } = useSession();
  const [userList, setUserList] = useState([]);
  const [ccode, setCcode] = useState("");
  const [cname, setCname] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectUser, setSelectUser] = useState("");
  const [formData, setFormData] = useState({
    us_ccode: ccode,
  });
  const uid = useRef();
  const uname = useRef();
  const sdate = useRef();
  const edate = useRef();
  const riseq = useRef();
  const [errorMessage, setErrorMessage] = useState("");
  const [mErrorMessage, setMErrorMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // ticket-----------------------------------------------------------------
  const [ticketList, setTicketList] = useState([]);
  // const [ticket, setTicket] = useState(null);
  const [ticketFormData, setTicketFormData] = useState({
    r_iseq: "",
    r_icount: "",
    r_sdate: "",
    r_edate: "",
  });

  const changeTicket = (e) => {
    setTicketFormData({
      ...ticketFormData,
      [e.target.name]: e.target.value,
    });
  };

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
    setTicketFormData({ r_iseq: seq });
    try {
      const result = await getTicketInfo(parseInt(seq));
      setTicketFormData({
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

  //----------------------------------------------------------------------
  // 모든 유저 찾기
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await AllUser();
        setUserList(users);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // UserList 클릭했을때
  const userClick = (id) => {
    // 클릭한 사용자 정보 찾기
    const clickUser = userList.find((user) => user.u_id === id);
    // 사용자 정보 설정
    setSelectUser(clickUser);
    setFormData({
      us_uid: clickUser.u_id,
      us_uname: clickUser.u_name,
      us_utel: clickUser.u_tel,
      us_cname: cname,
      us_date: formattedDate,
    });
  };

  const changeUser = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (session) {
      const codeFetch = async () => {
        const session = await getSession();
        const ccode = session?.user.id.tbl_company[0].c_code;
        const cname = session?.user.id.tbl_company[0].c_name;
        setCname(cname);
        setCcode(ccode);
      };
      codeFetch();
    }
  }, [session]);

  const submit = async (e) => {
    e.preventDefault();
    if (!formData.us_uid) {
      setErrorMessage("리스트에서 유저를 선택해주세요");

      uid.current.focus();
      return;
    } else {
      setErrorMessage("");
    }
    if (!formData.us_uname) {
      setErrorMessage("리스트에서 유저를 선택해주세요");
      uname.current.focus();
      return;
    }
    const hasTicketInfo = ticketFormData.r_iseq || ticketFormData.r_sdate || ticketFormData.r_edate;

    if (!hasTicketInfo) {
      if (!hasTicketInfo) {
        setShowConfirmModal(true);
        return;
      }
    } else {
      if (!ticketFormData.r_iseq) {
        setMErrorMessage("수강권을 선택해 주세요");
        riseq.current.focus();
        return;
      }
      if (!ticketFormData.r_sdate) {
        setMErrorMessage("시작일을 입력해 주세요");
        sdate.current.focus();
        return;
      }
      if (!ticketFormData.r_edate) {
        setMErrorMessage("종료일을 입력해 주세요");
        edate.current.focus();
        return;
      }
      if (ticketFormData.r_sdate > ticketFormData.r_edate) {
        setMErrorMessage("종료일은 시작일 이후로 입력해주세요");
        edate.current.focus();
        return;
      }
    }
    try {
      // 회원권 정보가 없으면 유저만 등록
      if (ticketFormData.r_icount === "") {
        await AddUserComp({ formData, ccode, formattedDate });
      } else {
        // 있으면 회원권도 등록
        await AddUserComp({ formData, ccode, formattedDate });
        const ruid = formData.us_uid;
        await addUserMinfo({
          ticketFormData,
          ruid,
        });
      }

      window.location.href = "/user";
    } catch (error) {
      console.log(error);
    }
  };

  const submitWithoutTicket = async () => {
    try {
      await AddUserComp({ formData, ccode, formattedDate });
      window.location.href = "/user";
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = () => {
    setShowConfirmModal(false);
    setMErrorMessage("수강권을 선택해 주세요");
    riseq.current.focus();
  };
  const handleConfirm = () => {
    setShowConfirmModal(false);
    submitWithoutTicket();
  };

  return (
    <>
      <h1 className="list_title">회원 등록</h1>
      <div className="wrap">
        <div className="input_div formBox">
          <form className="formBox input_box">
            <h3>회원 정보</h3>
            {errorMessage && <div className="user_error">{errorMessage}</div>}
            <label>ID</label>
            <input
              className="us_uid"
              placeholder="리스트에서 선택해주세요"
              name="us_uid"
              readOnly
              value={formData.us_uid}
              onChange={changeUser}
              ref={uid}
            />
            <label>이름</label>
            <input
              className="us_uname"
              placeholder="리스트에서 선택해주세요"
              name="us_uname"
              readOnly
              value={formData.us_uname}
              onChange={changeUser}
              ref={uname}
            />
            <input
              className="us_utel"
              type="hidden"
              placeholder="전화번호"
              name="us_utel"
              value={formData.us_utel}
              onChange={changeUser}
            />
            <input
              className="us_cname"
              type="hidden"
              placeholder="업체명"
              name="us_cname"
              readOnly
              value={formData.us_cname}
              onChange={changeUser}
            />
            <input
              className="us_ccode"
              type="hidden"
              placeholder="업체코드"
              name="us_ccode"
              value={ccode}
              onChange={changeUser}
              readOnly
            />
            <input
              className="us_date"
              placeholder="날짜"
              name="us_date"
              value={formattedDate}
              onChange={changeUser}
              readOnly
            />

            <h3>수강권 정보</h3>
            {mErrorMessage && <div className="m_error">{mErrorMessage}</div>}

            <div className="selectBox">
              <select
                className="select"
                name="r_iseq"
                value={ticketFormData.r_iseq}
                onChange={handleSelectChange}
                ref={riseq}
              >
                <option value="0">--수강권선택--</option>
                {selectList}
              </select>
            </div>
            <label>수강권횟수</label>
            <input
              className="r_icount"
              placeholder="수강권횟수"
              name="r_icount"
              value={ticketFormData.r_icount}
              onChange={changeTicket}
              readOnly
            />
            <label>시작일</label>
            <input
              className="r_sdate"
              type="date"
              name="r_sdate"
              value={ticketFormData.r_sdate}
              onChange={changeTicket}
              ref={sdate}
            />
            <label>종료일</label>
            <input
              className="r_edate"
              type="date"
              name="r_edate"
              value={ticketFormData.r_edate}
              onChange={changeTicket}
              ref={edate}
            />

            <input type="button" value="저장" className="insert" onClick={submit} />
          </form>
        </div>

        <div className="member_list right">
          <h3>USER 리스트</h3>

          <div className="table_wrapper">
            <table className="list tbl">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>이름</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="2">로딩 중...</td>
                  </tr>
                ) : (
                  userList &&
                  userList.map((USER) => (
                    <tr key={USER.u_id} data-id={USER.u_id} onClick={() => userClick(USER.u_id)}>
                      <td>{USER.u_id}</td>
                      <td>{USER.u_name}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showConfirmModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={handleCancel}>
              X
            </button>
            <p>수강권 없이 등록하겠습니까?</p>
            <div className="modalBtn">
              <button className="confirmBtn" onClick={handleConfirm}>
                네
              </button>
              <button className="confirmBtn" onClick={handleCancel}>
                아니요
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default InsertPage;
