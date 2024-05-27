"use client";
import { useEffect, useRef, useState } from "react";
import "../../../css/input.css";
import { createClass } from "../../api/class";
import { getSession } from "next-auth/react";
import { selectAll } from "../../api/teacher";

const InputPage = ({ selectedDate, onColorChange }) => {
  const [teacher, setTeacher] = useState([]);
  const [selectColor, setSelectColor] = useState(null);
  const colorPickerRef = useRef();
  const [errorMessage, setErrorMessage] = useState("");

  const nameRef = useRef(null);
  const sdateRef = useRef(null);
  const edateRef = useRef(null);
  const stimeRef = useRef(null);
  const etimeRef = useRef(null);
  const tnameRef = useRef(null);

  // 선생님 리스트
  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await getSession();
        const ccode = session?.user.id.tbl_company[0].c_code;
        const result = await selectAll(ccode);
        setTeacher([...result]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const [formData, setFormData] = useState({
    c_sdate: selectedDate,
    c_edate: "",
    c_tcode: "",
    c_color: "",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.c_name) {
      setErrorMessage("수업명 입력하세요");
      nameRef.current.focus();
      return;
    }
    if (!formData.c_tcode) {
      setErrorMessage("강사를 선택하세요");
      tnameRef.current.focus();
      return;
    }
    if (!formData.c_sdate) {
      setErrorMessage("시작일자를 입력하세요");
      sdateRef.current.focus();
      return;
    }
    if (!formData.c_edate) {
      setErrorMessage("종료일자를 입력하세요");
      edateRef.current.focus();
      return;
    }
    if (formData.c_edate < formData.c_sdate) {
      setErrorMessage("종료일은 시작일 이후여야 합니다");
      edateRef.current.focus();
      return;
    }
    if (!formData.c_stime) {
      setErrorMessage("시작시간을 입력하세요");
      stimeRef.current.focus();
      return;
    }
    if (!formData.c_etime) {
      setErrorMessage("종료시간을 입력하세요");
      etimeRef.current.focus();
      return;
    }
    if (!formData.c_color) {
      setErrorMessage("색상을 지정하세요");
      return;
    }

    await createClass({ formData: { ...formData, ccode } });
    window.location.reload();
  };

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

  const handleColorClick = (e) => {
    if (selectColor) {
      selectColor.style.border = "";
    }
    e.target.style.border = "1px solid white";
    setSelectColor(e.target);

    const computedStyle = window.getComputedStyle(e.target);
    const backgroundColor = computedStyle.backgroundColor;
    const hexColor = rgbToHex(backgroundColor);

    setFormData((prevFormData) => ({
      ...prevFormData,
      c_color: hexColor,
    }));
    colorPickerRef.current.value = hexColor;
    onColorChange(hexColor);
  };

  return (
    <div className="input_div">
      <form className="input_box" onSubmit={handleSubmit}>
        {errorMessage && <div className="class schedule_error">{errorMessage}</div>}
        <label>수업명</label>
        <input placeholder="수업명" name="c_name" onChange={handleInputChange} ref={nameRef} />
        <label>강사</label>
        <div className="selectBox">
          <select name="c_tcode" onChange={handleInputChange} ref={tnameRef}>
            <option value="">강사선택</option>
            {teacher.map((TEACHER, index) => (
              <option key={index} value={TEACHER.t_code}>
                {TEACHER.t_name}
              </option>
            ))}
          </select>
        </div>
        <label>시작일자</label>
        <input placeholder="시작일자" type="date" name="c_sdate" onChange={handleInputChange} value={selectedDate} ref={sdateRef} />
        <label>종료일자</label>
        <input placeholder="종료일자" type="date" name="c_edate" onChange={handleInputChange} ref={edateRef} />
        <label>시작시간</label>
        <input placeholder="시작시간" type="time" min="00:00" max="24:00" name="c_stime" onChange={handleInputChange} ref={stimeRef} />
        <label>종료시간</label>
        <input placeholder="종료시간" type="time" name="c_etime" onChange={handleInputChange} ref={etimeRef} />
        <label>색상</label>
        <div className="palette">
          <div className="color color1" onClick={handleColorClick}></div>
          <div className="color color2" onClick={handleColorClick}></div>
          <div className="color color3" onClick={handleColorClick}></div>
          <div className="color color4" onClick={handleColorClick}></div>
          <div className="color color5" onClick={handleColorClick}></div>
          <div className="color color6" onClick={handleColorClick}></div>
          <div className="color color7" onClick={handleColorClick}></div>
          <div className="color color8" onClick={handleColorClick}></div>
        </div>
        <input type="hidden" id="colorPicker" className="colorPicker" name="c_color" ref={colorPickerRef} onChange={handleInputChange} />
        <input type="hidden" value={ccode} name="c_ccode" />
        <input type="submit" className="insert" value="작성" />
      </form>
    </div>
  );
};

export default InputPage;
