"use client";
import { useEffect, useRef, useState } from "react";
import "../../../css/input.css";
import { createClass, getTeacherList } from "../../api/class";
import { getSession } from "next-auth/react";

import { selectAll } from "../../api/teacher";
import { createSchedule } from "../../api/schedule";

const InputPage = ({ selectedDate, onColorChange }) => {
  const [selectColor, setSelectColor] = useState(null);
  const colorPickerRef = useRef();

  const [formData, setFormData] = useState({
    s_sdate: selectedDate,
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
    const result = createSchedule({ formData });
    console.log("추가완료", result);
    router.push("/schedule");
  };

  // RGB 형식을 HEX 형식으로 변환하는 함수
  const rgbToHex = (rgb) => {
    const rgbArray = rgb.match(/\d+/g);
    return (
      "#" +
      rgbArray
        .map((x) => {
          const hex = parseInt(x).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  const colorClick = (e) => {
    if (selectColor) {
      selectColor.style.border = ""; // 이전에 선택된 color 요소의 테두리를 초기화
    }
    e.target.style.border = "1px solid white"; // 클릭한 요소에 테두리를 추가
    setSelectColor(e.target); // 현재 클릭한 요소를 선택된 color 요소로 설정

    const computedStyle = window.getComputedStyle(e.target);
    const backgroundColor = computedStyle.backgroundColor;
    const hexColor = rgbToHex(backgroundColor);

    setFormData({ ...formData, c_color: hexColor }); // 선택된 색상을 formData에 추가
    colorPickerRef.current.value = hexColor;
    onColorChange(hexColor); // 선택된 색상을 부모 컴포넌트로 전달
  };

  return (
    <>
      <div className="input_div">
        <form className="input_box" onSubmit={submit}>
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
          <input
            placeholder="시작일자"
            type="date"
            name="c_sdate"
            onChange={InputChange}
            value={selectedDate}
          />
          <label>종료일자</label>
          <input placeholder="종료일자" type="date" name="c_edate" onChange={InputChange} />
          <label>시작시간</label>
          <input
            placeholder="시작시간"
            type="time"
            min="00:00"
            max="24:00"
            name="c_stime"
            onChange={InputChange}
          />
          <label>종료시간</label>
          <input placeholder="종료시간" type="time" name="c_etime" onChange={InputChange} />
          <label>색상</label>
          <div className="palette">
            <div className="color color1" onClick={colorClick}></div>
            <div className="color color2" onClick={colorClick}></div>
            <div className="color color3" onClick={colorClick}></div>
            <div className="color color4" onClick={colorClick}></div>
            <div className="color color5" onClick={colorClick}></div>
            <div className="color color6" onClick={colorClick}></div>
            <div className="color color7" onClick={colorClick}></div>
            <div className="color color8" onClick={colorClick}></div>
          </div>
          <input
            type="hidden"
            id="colorPicker"
            className="colorPicker"
            name="c_color"
            ref={colorPickerRef}
            onChange={InputChange}
          />
          <input type="hidden" value={ccode} name="c_ccode" />
          <input type="submit" className="insert" value="작성" />
        </form>
      </div>
    </>
  );
};
export default InputPage;
