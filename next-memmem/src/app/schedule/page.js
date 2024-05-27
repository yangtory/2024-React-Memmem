"use client";

import React, { useEffect, useState } from "react";
import "../../css/schedule/main.css";

import { getSession, useSession } from "next-auth/react";
import { scheduleAll } from "../api/schedule";
import ScheduleDetail from "./detail/[dates]/page";
import InputPage from "./insert/page";
import UpPage from "./update/[seq]/page";

const SchedulePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [viewYear, setViewYear] = useState(new Date().getFullYear()); // 현재 연도
  const [viewMonth, setViewMonth] = useState(new Date().getMonth() + 1); // 현재 월 (0부터 시작하므로 +1)
  const [dates, setDates] = useState([]); // 달력 날짜들
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜
  const [showInputPage, setShowInputPage] = useState(false); // 입력 페이지 표시 여부
  const [seq, setSeq] = useState(null); // 선택된 수업의 고유 번호
  const [scheduleList, setScheduleList] = useState([]);
  const [list, setList] = useState([]); // 전체 수업 목록
  const [selectColor, setSelectColor] = useState("#ffffff"); // 선택된 색상(지우면 오류생김)
  const { data: session } = useSession(); // 사용자 세션 데이터 가져오기

  // 선택된 색상을 변경하는 함수
  const handleColorChange = (color) => {
    setSelectColor(color);
  };

  // 특정 날짜의 수업 목록을 가져오는 함수
  const listFetch = async (ccode, formattedDate) => {
    const result = await scheduleAll(ccode, formattedDate);
    setList(result);
  };

  useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();
      const ccode = session?.user.id.tbl_company[0].c_code;
      await listFetch(ccode);
      setIsLoading(false);
    };
    fetchData();
  }, [viewYear, viewMonth]); // 연도와 월이 변경될 때마다 실행

  // 로딩이 완료되면 달력을 렌더링하는 함수
  useEffect(() => {
    if (!isLoading) {
      renderCalendar();
    }
  }, [isLoading]);

  // 달력을 렌더링하는 함수
  const renderCalendar = async () => {
    document.querySelector(".year-month").textContent = `${viewYear}년 ${viewMonth}월`;
    const today = new Date(viewYear, viewMonth - 1, 1);
    const lastDay = new Date(viewYear, viewMonth, 0).getDate();

    const prevDates = [];
    const thisDates = Array.from({ length: lastDay }, (_, i) => i + 1);

    const firstDayIndex = today.getDay();
    const lastDayIndex = new Date(viewYear, viewMonth, 0).getDay();
    const nextDays = 7 - lastDayIndex - 1;

    for (let x = firstDayIndex; x > 0; x--) {
      prevDates.push("");
    }
    for (let j = 1; j <= nextDays; j++) {
      thisDates.push("");
    }

    const allDates = prevDates.concat(thisDates);

    const dateElements = allDates.map((date, i) => {
      const matchingItems = list?.filter(
        (item) =>
          item.s_sdate <= formatDate(new Date(viewYear, viewMonth - 1, date)) && item.s_edate >= formatDate(new Date(viewYear, viewMonth - 1, date))
      );

      return (
        <div key={i} className={`date ${date ? "this" : "other"}`} onClick={() => handleDateClick(date)}>
          <div>{date}</div>
          {date &&
            matchingItems &&
            matchingItems.length > 0 &&
            matchingItems.map((item, index) => (
              <div key={index} className="class" style={{ backgroundColor: item.s_color, color: "black" }}>
                {item.s_title}
              </div>
            ))}
        </div>
      );
    });

    setDates(dateElements);
  };

  // 날짜 클릭 시 실행되는 함수
  const handleDateClick = async (date) => {
    if (!date) return;
    const selectedDate = formatDate(new Date(viewYear, viewMonth - 1, date));
    setSelectedDate(selectedDate);
    setShowInputPage(false);
    setSeq(null);

    if (session) {
      const session = await getSession();
      const ccode = session?.user.id.tbl_company[0].c_code;
      const result = await scheduleAll(ccode, selectedDate);
      setScheduleList(result);
    }
  };

  // 날짜를 YYYY-MM-DD 형식으로 포맷하는 함수
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 이전 달로 이동하는 함수
  const prevMonth = () => {
    if (viewMonth === 1) {
      setViewYear((prev) => prev - 1);
      setViewMonth(12);
    } else {
      setViewMonth((prev) => prev - 1);
    }
    setIsLoading(true);
  };

  // 다음 달로 이동하는 함수
  const nextMonth = () => {
    if (viewMonth === 12) {
      setViewYear((prev) => prev + 1);
      setViewMonth(1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
    setIsLoading(true);
  };

  // 오늘 날짜로 이동하는 함수
  const goToday = () => {
    const today = new Date();
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth() + 1);
    setIsLoading(true);
  };

  return (
    <section className="classPage">
      <h1 className="list_title">일정관리</h1>
      <div className="section_box">
        <aside className="left">
          <div className="calendar">
            <div className="calHeader">
              <div className="year-month"></div>
              <div className="calNav">
                <button className="nav-btn go-prev" onClick={prevMonth}>
                  &lt;
                </button>
                <button className="nav-btn go-today" onClick={goToday}>
                  Today
                </button>
                <button className="nav-btn go-next" onClick={nextMonth}>
                  &gt;
                </button>
              </div>
            </div>
            <div className="cal_wrapper">
              <div className="calMain">
                <div className="days">
                  <div className="day">일</div>
                  <div className="day">월</div>
                  <div className="day">화</div>
                  <div className="day">수</div>
                  <div className="day">목</div>
                  <div className="day">금</div>
                  <div className="day">토</div>
                </div>
                <div className="dates">{dates}</div>
              </div>
            </div>
          </div>
        </aside>
        <aside className="right">
          {showInputPage ? (
            <InputPage date={selectedDate} selectedDate={selectedDate} onColorChange={handleColorChange} />
          ) : seq ? (
            <UpPage seq={seq} selectedDate={selectedDate} />
          ) : (
            selectedDate && (
              <ScheduleDetail
                date={selectedDate}
                scheduleList={scheduleList}
                setScheduleList={setScheduleList}
                showInputPage={setShowInputPage}
                selectedDate={selectedDate}
                setSeq={setSeq}
              />
            )
          )}
        </aside>
      </div>
    </section>
  );
};
export default SchedulePage;
