import { useEffect, useRef, useState } from "react";
import { scheduleDelete, scheduleUnique, scheduleUpdate } from "../../../api/schedule";
import "../../../../css/schedule/update.css";
const UpPage = ({ seq, selectedDate }) => {
  const [list, setList] = useState({});
  const [selectColor, setSelectColor] = useState(null);
  const [formData, setFormData] = useState({
    s_seq: "",
    s_title: "",
    s_content: "",
    s_sdate: "",
    s_edate: "",
  });
  const colorPickerRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const result = await scheduleUnique(seq);

      try {
        setFormData(result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [seq]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(() => ({
      ...formData,
      [name]: value,
    }));
  };
  const colorChangeHandler = (color) => {
    setFormData(() => ({
      ...formData,

      s_color: color,
    }));
  };

  const update = async () => {
    await scheduleUpdate(formData.s_seq, {
      s_title: formData.s_title,
      s_content: formData.s_content,
      s_sdate: formData.s_sdate,
      s_edate: formData.s_edate,
      s_color: formData.s_color,
    });
    window.location.reload();
  };
  const deleteHandler = async (s_seq) => {
    await scheduleDelete(s_seq);
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
    // 이전에 선택된 color 요소의 테두리를 초기화
    if (selectColor) {
      selectColor.style.border = "";
    }

    // 현재 클릭한 요소에 테두리를 추가
    e.target.style.border = "1px solid white";
    setSelectColor(e.target); // 현재 클릭한 요소를 선택된 color 요소로 설정

    const computedStyle = window.getComputedStyle(e.target);
    const backgroundColor = computedStyle.backgroundColor;
    const hexColor = rgbToHex(backgroundColor);

    // 선택된 색상을 formData에 설정
    setFormData((formData) => ({
      ...formData,
      s_color: hexColor,
    }));
  };

  return (
    <>
      <div className="update input_div">
        <form className="input_box">
          <input type="hidden" name="s_seq" value={formData.s_seq} />
          <label>제목</label>
          <input placeholder="제목" name="s_title" value={formData.s_title || ""} onChange={handleChange} />
          <label>내용</label>
          <input placeholder="내용" value={formData.s_content || ""} name="s_content" onChange={handleChange} />
          <label>시작일자</label>
          <input placeholder="시작일자" type="date" name="s_sdate" value={formData.s_sdate || selectedDate} onChange={handleChange} />
          <label>종료일자</label>
          <input placeholder="종료일자" type="date" name="s_edate" value={formData.s_edate || ""} onChange={handleChange} />

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
            value={formData.s_color}
            onChange={handleChange}
          />
          <div className="schedule">
            <input type="button" className="insert" value="수정" onClick={update} />
            <input type="button" className="delete" data-seq={seq} value="삭제" onClick={() => deleteHandler(formData.s_seq)} />
          </div>
        </form>
      </div>
    </>
  );
};

export default UpPage;
