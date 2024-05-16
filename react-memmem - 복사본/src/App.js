import { useState, useEffect } from "react";
import Join from "./comps/Join";
import Login from "./comps/Login";
import Main from "./comps/Main";
import Dash from "./comps/Dash";
import Header from "./include/Header";
import AOS from "aos";
import "aos/dist/aos.css";
import "./css/App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
} from "react-router-dom";

const App = () => {
  AOS.init({
    duration: 1200,
  });

  const loginStatus = localStorage.getItem("loginOk");

  return (
    <>
      <Header />
      <div className="main">
        <div
          className={loginStatus != false ? "side" : "side hidden"}
        >
          <ul>
            <li>
              <Link to="/ticket">회원권</Link>
            </li>
            <li>회원관리</li>
            <li>강사관리</li>
            <li>수업관리</li>
            <li>일정관리</li>
            <li>매출관리</li>
            <li>공지사항</li>
          </ul>
        </div>
        <section>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/main" element={<Dash />} />
            <Route path="/ticket" element={<Dash />} />
          </Routes>
        </section>
      </div>
    </>
  );
};
export default App;
