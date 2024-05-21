"use client";

import { useEffect } from "react";
import "../../css/class/main.css";
import ClassCalendar from "../../js/class/main";
const ClassPage = () => {
  useEffect(() => {
    ClassCalendar();
  }, []);

  return (
    <section>
      <div className="section_box">
        <aside className="left">
          <div className="calendar">
            <div className="calHeader">
              <div className="year-month"></div>
              <div className="calNav">
                <button className="nav-btn go-prev">&lt;</button>
                <button className="nav-btn go-today">Today</button>
                <button className="nav-btn go-next">&gt;</button>
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
                <div className="dates"></div>
              </div>
            </div>
          </div>
        </aside>
        <aside className="right"></aside>
      </div>
    </section>
  );
};
export default ClassPage;
