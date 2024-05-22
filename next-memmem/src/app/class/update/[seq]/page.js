"use client";
import { useEffect, useState } from "react";
import { Classupdate, classUnique } from "../../../api/class";

const UpPage = ({ seq, selectedDate }) => {
  const [list, setList] = useState({});

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

  const update = async (e) => {
    e.preventDefault();
    try {
      await Classupdate(list, list.c_seq);
      alert("수정이 완료되었습니다.");
    } catch (error) {
      alert("수정에 실패했습니다.");
    }
  };

  return (
    <>
      <h1>{seq}수정페이지</h1>

      <h1 class="list_title">수업 수정</h1>
      <div class="update input_div">
        <form class="input_box" onSubmit={update}>
          <div class="class error"></div>

          <input type="hidden" name="c_seq" value={list.c_seq} />
          <label>수업명</label>
          <input placeholder="수업명" name="c_name" value={list.c_name} onChange={handleChange} />
          <label>강사명</label>
          <input placeholder="강사명" value={list.tbl_teacher?.t_name} name="t_name" readonly />
          <label>개강일자</label>
          <input
            placeholder="개강일자"
            type="date"
            value={selectedDate}
            name="c_sdate"
            onChange={handleChange}
          />
          <label>종강일자</label>
          <input
            placeholder="종강일자"
            type="date"
            name="c_edate"
            value={list.c_edate}
            onChange={handleChange}
          />
          <label>시작시간</label>
          <input
            placeholder="시작시간"
            type="time"
            name="c_stime"
            value={list.c_stime}
            onChange={handleChange}
          />
          <label>종료시간</label>
          <input
            placeholder="종료시간"
            type="time"
            name="c_etime"
            value={list.c_etime}
            onChange={handleChange}
          />
          <label>색상</label>
          <div class="palette">
            <div class="color color1"></div>
            <div class="color color2"></div>
            <div class="color color3"></div>
            <div class="color color4"></div>
            <div class="color color5"></div>
            <div class="color color6"></div>
            <div class="color color7"></div>
            <div class="color color8"></div>
          </div>
          <input type="hidden" id="colorPicker" value={list.c_color} name="c_color" />
          <div class="schedule">
            <input type="submit" class="insert" value="수정" />
            <input type="button" class="delete" data-seq={seq} value="삭제" />
          </div>
        </form>
      </div>
    </>
  );
};
export default UpPage;
