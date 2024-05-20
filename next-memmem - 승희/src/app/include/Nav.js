import "@/css/nav.css";
import Header from "./Header";
import Link from "next/link";
const Nav = () => {
  return (
    <>
      <div className="main">
        <div className="side">
          <ul>
            <li>
              <Link href="/ticket">회원권</Link>
            </li>
            <li>
              <Link href="user">회원관리</Link>
            </li>
            <li>강사관리</li>
            <li>수업관리</li>
            <li>일정관리</li>
            <li>매출관리</li>
            <li>공지사항</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Nav;
