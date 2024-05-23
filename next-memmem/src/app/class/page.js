"use client";

import React, { useEffect, useState } from "react";
import "../../css/class/main.css";

import ClassDetail from "./detail/[dates]/page";
import InputPage from "./insert/page";
import UpPage from "./update/[seq]/page";
import { getSession, useSession } from "next-auth/react";
import { findUnique } from "../api/user";
import { classAll } from "../api/class"; // import the function to fetch class data

const ClassPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth() + 1);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showInputPage, setShowInputPage] = useState(false);
  const [seq, setSeq] = useState(null);
  const [classList, setClassList] = useState([]);
  const [list, setList] = useState([]);

  const { data: session } = useSession();
  const listFetch = async (ccode, formattedDate) => {
    const result = await classAll(ccode, formattedDate);
    console.log(result);
    setList(result);
  };

  useEffect(() => {
    const fetchData = async () => {
      await listFetch();
      setIsLoading(false);
    };
    fetchData();
  }, [viewYear, viewMonth]); // viewYear, viewMonth 상태가 변경될 때마다 실행됩니다.
  useEffect(() => {
    if (!isLoading) {
      renderCalendar(); // 데이터를 가져온 후에 달력을 다시 렌더링합니다.
    }
  }, [isLoading]);

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
      return (
        <div key={i} className={`date ${date ? "this" : "other"}`} onClick={() => handleDateClick(date)}>
          <div>{date}</div>
          {date && list.some((item) => item.c_sdate === formatDate(new Date(viewYear, viewMonth - 1, date))) && (
            <div>{list.find((item) => item.c_sdate === formatDate(new Date(viewYear, viewMonth - 1, date))).c_name}</div>
          )}
        </div>
      );
    });

    setDates(dateElements);
  };

  const handleDateClick = async (date) => {
    if (!date) return;
    const selectedDate = formatDate(new Date(viewYear, viewMonth - 1, date));
    setSelectedDate(selectedDate);
    setShowInputPage(false);
    setSeq(null);

    if (session) {
      const u_id = session.user.id;
      const ccode = (await findUnique({ u_id })).tbl_company[0].c_code;
      const result = await classAll(ccode, selectedDate);
      setClassList(result);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const prevMonth = () => {
    if (viewMonth === 1) {
      setViewYear((prev) => prev - 1);
      setViewMonth(12);
    } else {
      setViewMonth((prev) => prev - 1);
    }
    setIsLoading(true); // 화면 전환 시 로딩 상태를 true로 설정하여 로딩 상태를 보여줍니다.
  };

  const nextMonth = () => {
    if (viewMonth === 12) {
      setViewYear((prev) => prev + 1);
      setViewMonth(1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
    setIsLoading(true); // 화면 전환 시 로딩 상태를 true로 설정하여 로딩 상태를 보여줍니다.
  };

  const goToday = () => {
    const today = new Date();
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth() + 1);
    setIsLoading(true); // 화면 전환 시 로딩 상태를 true로 설정하여 로딩 상태를 보여줍니다.
  };

  return (
    <section>
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
            <InputPage date={selectedDate} selectedDate={selectedDate} />
          ) : seq ? (
            <UpPage seq={seq} selectedDate={selectedDate} />
          ) : (
            selectedDate && (
              <ClassDetail
                date={selectedDate}
                classList={classList}
                setClassList={setClassList}
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

export default ClassPage;
