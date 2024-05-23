"use client";

import React, { useEffect, useState } from "react";
import "../../css/schedule/main.css";

import { useRouter } from "next/navigation";

const SchedulePage = () => {
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [dates, setDates] = useState([]);
  const router = useRouter();

  useEffect(() => {
    renderCalendar();
  }, [viewYear, viewMonth]);

  const renderCalendar = async () => {
    document.querySelector(".year-month").textContent = `${viewYear}년 ${viewMonth + 1}월`;

    const prevLast = new Date(viewYear, viewMonth, 0);
    const thisLast = new Date(viewYear, viewMonth + 1, 0);

    const PLDate = prevLast.getDate();
    const PLDay = prevLast.getDay();
    const TLDate = thisLast.getDate();
    const TLDay = thisLast.getDay();

    const prevDates = [];
    const thisDates = [...Array(TLDate + 1).keys()].slice(1);
    const nextDates = [];

    if (PLDay !== 6) {
      for (let i = 0; i < PLDay + 1; i++) {
        prevDates.unshift(PLDate - i);
      }
    }

    for (let i = 1; i < 7 - TLDay; i++) {
      nextDates.push(i);
    }

    const allDates = prevDates.concat(thisDates, nextDates);
    const firstDateIndex = allDates.indexOf(1);
    const lastDateIndex = allDates.lastIndexOf(TLDate);

    const dateElements = allDates.map((date, i) => {
      const condition = i >= firstDateIndex && i < lastDateIndex + 1 ? "this" : "other";
      return `<div class="date"><div class=${condition}>${date}</div></div>`;
    });

    setDates(dateElements);
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((prev) => prev - 1);
      setViewMonth(11);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((prev) => prev + 1);
      setViewMonth(0);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const goToday = () => {
    const today = new Date();
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  const onClickHandler = (e) => {
    const target = e.target.closest(".date");
    if (target) {
      const date = target.querySelector("div").innerText;
      const selectedDate = new Date(viewYear, viewMonth, date);
      const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(
        selectedDate.getDate()
      ).padStart(2, "0")}`;
      router.push(`/schedule/detail/${formattedDate}`);
    }
  };

  return (
    <section className="schedulePage">
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
                <div className="dates" onClick={onClickHandler} dangerouslySetInnerHTML={{ __html: dates.join("") }}></div>
              </div>
            </div>
          </div>
        </aside>
        <aside className="right"></aside>
      </div>
    </section>
  );
};
export default SchedulePage;
