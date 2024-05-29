"use client";
import { useEffect, useRef, useState } from "react";
import { Classupdate, classDelete, classUnique } from "../../../api/class";
import "../../../../css/class/update.css";
import { getSession } from "next-auth/react";
import { selectAll } from "../../../api/teacher";

const UpPage = ({ seq, selectedDate, isLoad, setIsLoad, setShowUpdatePage }) => {
  const [list, setList] = useState({});
  const [teacher, setTeacher] = useState([]);
  const [selectColor, setSelectColor] = useState(null);
  const colorPickerRef = useRef();
  const nameRef = useRef(null);
  const sdateRef = useRef(null);
  const edateRef = useRef(null);
  const stimeRef = useRef(null);
  const etimeRef = useRef(null);

  const [errorMessage, setErrorMessage] = useState("");
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

  useEffect(() => {
    const fetchData = async () => {
      const result = await classUnique(seq);
      try {
        setList(result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [seq]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setList((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleColorChange = (color) => {
    setList((data) => ({
      ...data,
      c_color: color,
    }));
  };

  const update = async () => {
    if (!list.c_name) {
      setErrorMessage("수업명 입력하세요");
      nameRef.current.focus();
      return;
    }

    if (!list.c_sdate) {
      setErrorMessage("시작일자를 입력하세요");
      sdateRef.current.focus();
      return;
    }
    if (!list.c_edate) {
      setErrorMessage("종료일자를 입력하세요");
      edateRef.current.focus();
      return;
    }
    if (list.c_edate < list.c_sdate) {
      setErrorMessage("종료일은 시작일 이후로 입력해주세요");
      edateRef.current.focus();
      return;
    }
    if (!list.c_stime) {
      setErrorMessage("시작시간을 입력하세요");
      stimeRef.current.focus();
      return;
    }
    if (!list.c_etime) {
      setErrorMessage("종료시간을 입력하세요");
      etimeRef.current.focus();
      return;
    }
    if (!list.c_color) {
      setErrorMessage("색상을 지정하세요");
      return;
    }

    await Classupdate(list, list.c_seq);

    if (isLoad === true) {
      setIsLoad(false);
    } else {
      setIsLoad(true);
    }
    setShowUpdatePage(false);
  };

  const deleteHandler = async (c_seq) => {
    await classDelete(c_seq);

    if (isLoad === true) {
      setIsLoad(false);
    } else {
      setIsLoad(true);
    }
    setShowUpdatePage(false);
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

    setList({ ...list, c_color: hexColor }); // 선택된 색상을 list에 추가
    colorPickerRef.current.value = hexColor;
    handleColorChange(hexColor); // 선택된 색상을 부모 컴포넌트로 전달
  };

  return (
    <>
      <div className="update input_div">
        <form className="input_box">
          {errorMessage && <div className="class schedule_error">{errorMessage}</div>}
          <input type="hidden" name="c_seq" value={list.c_seq} />
          <label>수업명</label>
          <input
            placeholder="수업명"
            name="c_name"
            value={list.c_name || ""}
            onChange={handleChange}
            ref={nameRef}
          />
          <label>강사명</label>
          <input
            placeholder="강사명"
            value={list.tbl_teacher?.t_name || ""}
            name="t_name"
            readOnly
          />
          <label>개강일자</label>
          <input
            placeholder="개강일자"
            type="date"
            value={list.c_sdate || selectedDate}
            name="c_sdate"
            onChange={handleChange}
            ref={sdateRef}
          />
          <label>종강일자</label>
          <input
            placeholder="종강일자"
            type="date"
            name="c_edate"
            value={list.c_edate || ""}
            onChange={handleChange}
            ref={edateRef}
          />
          <label>시작시간</label>
          <input
            placeholder="시작시간"
            type="time"
            name="c_stime"
            value={list.c_stime || ""}
            onChange={handleChange}
            ref={stimeRef}
          />
          <label>종료시간</label>
          <input
            placeholder="종료시간"
            type="time"
            name="c_etime"
            value={list.c_etime || ""}
            onChange={handleChange}
            ref={etimeRef}
          />
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
            value={list.c_color || ""}
            onChange={handleChange}
          />
          <div className="schedule">
            <input type="button" className="insert" value="수정" onClick={update} />
            <input
              type="button"
              className="delete"
              data-seq={seq}
              value="삭제"
              onClick={() => deleteHandler(list.c_seq)}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default UpPage;
