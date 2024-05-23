"use client";
import { useEffect, useState } from "react";
import "../../../css/input.css";
import { createClass, getTeacherList } from "../../api/class";
import { getSession } from "next-auth/react";

import { selectAll } from "../../api/teacher";

const InputPage = ({ date, selectedDate }) => {
  const [teacher, setTeacher] = useState([]);

  // 선생님 리스트
  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await getSession();
        const ccode = session?.user.id.tbl_company[0].c_code;
        const result = await selectAll(ccode);
        console.log(result);
        setTeacher([...result]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const [formData, setFormData] = useState({
    c_sdate: selectedDate,
  });
  const [ccode, setCcode] = useState("");
  useEffect(() => {
    const getCCode = async () => {
      const session = await getSession();

      const ccode = session?.user.id.tbl_company[0].c_code;

      setCcode(ccode);
    };
    getCCode();
  }, []);
  const InputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      ccode,
    });
  };
  const submit = async () => {
    const result = createClass({ formData });
    console.log("추가완료", result);
    router.push("/class");
  };

  return (
    <>
      <div className="input_div">
        <form className="input_box" onSubmit={submit}>
          <div className="class error"></div>
          <label>수업명</label>
          <input placeholder="수업명" name="c_name" onChange={InputChange} />
          <label>강사</label>
          <div className="selectBox">
            <select name="c_tcode" onChange={InputChange}>
              <option value="">강사선택</option>
              {teacher.map((TEACHER, index) => (
                <option value={TEACHER.t_code}>{TEACHER.t_name}</option>
              ))}
            </select>
          </div>
          <label>시작일자</label>
          <input placeholder="시작일자" type="date" name="c_sdate" onChange={InputChange} value={selectedDate} />
          <label>종료일자</label>
          <input placeholder="종료일자" type="date" name="c_edate" onChange={InputChange} />
          <label>시작시간</label>
          <input placeholder="시작시간" type="time" min="00:00" max="24:00" name="c_stime" onChange={InputChange} />
          <label>종료시간</label>
          <input placeholder="종료시간" type="time" name="c_etime" onChange={InputChange} />
          <label>색상</label>
          <div className="palette">
            <div className="color color1"></div>
            <div className="color color2"></div>
            <div className="color color3"></div>
            <div className="color color4"></div>
            <div className="color color5"></div>
            <div className="color color6"></div>
            <div className="color color7"></div>
            <div className="color color8"></div>
          </div>
          <input type="hidden" id="colorPicker" className="colorPicker" value="#ffffff" name="c_color" onChange={InputChange} />
          <input type="hidden" value={ccode} name="c_ccode" />
          <input type="submit" className="insert" value="작성" />
        </form>
      </div>
    </>
  );
};
export default InputPage;
