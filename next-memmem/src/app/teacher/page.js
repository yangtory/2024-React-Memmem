"use client";
import { useState, useEffect } from "react";
import "../../css/table.css"; // CSS 파일을 가져옵니다.
import "../../css/search.css";

import "../../css/teacher_detail.css";
import {
  findTeacher,
  getTeacherInfo,
  selectAll,
} from "../api/teacher";
import { useModal } from "../../provider/ModalProvider";
import { useTicket } from "../../provider/TicketProvider";
import { getSession } from "next-auth/react";
const TeacherPage = () => {
  const { teacherList, setTeacherList } = useTicket();

  const { setTeacherModal } = useModal();
  const [tname, setTname] = useState("");
  const [tcode, setTcode] = useState("");
  const [ttel, setTtel] = useState("");
  const [detail, setDetail] = useState("");

  // 검색 기능
  const onTnameChange = (e) => {
    setTname(e.target.value);
  };

  const onTcodeChange = (e) => {
    setTcode(e.target.value);
  };

  const onTtelChange = (e) => {
    setTtel(e.target.value);
  };

  const debounce = (callback, delay = 200) => {
    let debounceTimer;
    return (...args) => {
      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(
        () => callback.apply(this, args),
        delay
      );

    };
  };
  const onTnameHandler = debounce(onTnameChange, 300);
  const onTcodeHandler = debounce(onTcodeChange, 300);
  const onTtelHandler = debounce(onTtelChange, 300);

  // insert 클릭하면 modal 띄우기
  const openModal = () => {
    setTeacherModal(true);
  };
  // 회원권 리스트 셋팅
  useEffect(() => {
    const teacherFetch = async () => {

      const session = await getSession();
      const ccode = session?.user.id.tbl_company[0].c_code;

      try {
        const result = await selectAll(ccode);
        console.log(result);
        setTeacherList([...result]);
      } catch (error) {
        console.log(error);
      }
      // 검색 기능
      const result = await findTeacher({
        tname,
        tcode,
        ttel,
        ccode,
      });
      if (result) {
        setTeacherList([...result]);
      }
    };
    teacherFetch();
  }, [setTeacherList, tcode, tname, ttel]);

  const teacherViewList = teacherList.map((teacher, index) => (

    <tr
      key={teacher?.t_code}
      onClick={() => setDetail(teacher?.t_code)}
    >

      <td>{index + 1}</td>
      <td>{teacher.t_code}</td>
      <td>{teacher.t_name}</td>
      <td>{teacher.t_tel}</td>
    </tr>
  ));

  // detail 데이터 셋팅
  useEffect(() => {
    if (detail) {
      const detailTeacher = async () => {
        try {
          const result = await getTeacherInfo(detail);
          setDetail(result[0]);
        } catch (error) {
          console.log(error);
        }
      };
      detailTeacher();
    }
  }, [detail, teacherList]);

  return (
    <>
      <h1 className="list_title">강사 리스트</h1>
      <div className="list_home">
        <div className="teacher input insert_btn_box">

          <button
            className="teacher input insert button-32"
            type="button"
            onClick={openModal}
          >

            강사추가
          </button>
        </div>
        <div className="teacher btn_box search">
          <form>
            <input
              className="search_input"
              placeholder="이름"
              name="tname"
              defaultValue={tname}
              onChange={onTnameHandler}
            />
            <input
              className="search_input"
              placeholder="강사코드"
              name="tcode"
              defaultValue={tcode}
              onChange={onTcodeHandler}
            />
            <input
              className="search_input"
              placeholder="전화번호"
              name="ttel"
              defaultValue={ttel}
              onChange={onTtelHandler}
            />
          </form>
        </div>

        <div className="view_box">
          {detail ? (
            <div>
              <div className="detail_box">
                <div className="card">
                  <div className="img_box">
                    <div className="pro_box">
                      <span className="pro">PRO</span>
                      <h3>{detail.t_name}</h3>
                    </div>
                    {/* <img src="/images/bug.png" width="150px" /> */}
                  </div>
                  <div className="teacher_info">
                    <h4>광주</h4>
                    <p>
                      체력단련, 근력강화, 다이어트, 신체균형 <br />
                      여러 헬스 클럽에서 헬스 트레이너로 근무한 경험이
                      있음
                    </p>
                    <div>
                      <strong>강사코드</strong>
                      <span>{detail.t_code}</span>
                    </div>
                    <div>
                      <strong>전화번호</strong>
                      <span>{detail.t_tel}</span>
                    </div>
                  </div>
                  <div className="detail btn_box">
                    <button className="button-32">수정</button>
                    <button className="button-32">삭제</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="nocard">No ticket selected</div>
          )}
        </div>
        <div className="table_div">
          <table className="teacher list">
            <thead>
              <tr>
                <th>No.</th>
                <th>강사코드</th>
                <th>강사이름</th>
                <th>전화번호</th>
              </tr>
            </thead>
            <tbody>{teacherViewList}</tbody>
          </table>
        </div>

      </div>
    </>
  );
};

export default TeacherPage;
