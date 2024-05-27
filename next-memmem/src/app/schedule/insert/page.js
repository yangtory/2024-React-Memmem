"use client";
import { useEffect, useRef, useState } from "react";
import "../../../css/input.css";

import { getSession } from "next-auth/react";

import { createSchedule } from "../../api/schedule";

const InputPage = ({ selectedDate, onColorChange }) => {
  const [selectColor, setSelectColor] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const titleRef = useRef(null);
  const contentRef = useRef(null);

  const edateRef = useRef(null);

  const colorPickerRef = useRef();

  const [formData, setFormData] = useState({
    s_sdate: selectedDate,
    s_edate: "",
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
  const submit = async (e) => {
    e.preventDefault();

    if (!formData.s_title) {
      setErrorMessage("제목을 입력하세요");
      titleRef.current.focus();
      return;
    }
    if (!formData.s_content) {
      setErrorMessage("내용을 입력하세요");
      contentRef.current.focus();
      return;
    }
    if (!formData.s_edate) {
      setErrorMessage("종료일을 입력하세요");
      edateRef.current.focus();
      return;
    }
    if (formData.s_edate < formData.s_sdate) {
      setErrorMessage("종료일은 시작일 이후여야 합니다");
      edateRef.current.focus();
      return;
    }
    if (!formData.s_color) {
      setErrorMessage("색상을 지정하세요");

      return;
    }

    await createSchedule({ formData });

    window.location.reload();
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

    setFormData({ ...formData, s_color: hexColor }); // 선택된 색상을 formData에 추가
    colorPickerRef.current.value = hexColor;
    onColorChange(hexColor); // 선택된 색상을 부모 컴포넌트로 전달
  };

  return (
    <>
      <div className="input_div">
        <form className="input_box" onSubmit={submit}>
          {errorMessage && <div className="class schedule_error">{errorMessage}</div>}
          <label>제목</label>
          <input placeholder="제목" name="s_title" onChange={InputChange} ref={titleRef} />
          <label>내용</label>
          <input placeholder="제목" name="s_content" onChange={InputChange} ref={contentRef} />
          <label>시작일자</label>
          <input placeholder="시작일자" type="date" name="s_sdate" onChange={InputChange} value={selectedDate} />
          <label>종료일자</label>
          <input placeholder="종료일자" type="date" name="s_edate" onChange={InputChange} ref={edateRef} />
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
          <input type="hidden" id="colorPicker" className="colorPicker" name="s_color" ref={colorPickerRef} onChange={InputChange} />
          <input type="hidden" value={ccode} name="s_ccode" />
          <input type="submit" className="insert" value="작성" />
        </form>
      </div>
    </>
  );
};
export default InputPage;
