import "@/css/nav.css";
import Header from "./Header";
import Link from "next/link";
import Script from "next/script";
const Nav = () => {
  return (
    <>
      <div className="side">
        <ul>
          <li>
            <Link href="/ticket">회원권</Link>
          </li>
          <li>
            <Link href="user">회원관리</Link>
          </li>
          <li>강사관리</li>
          <Link href="class">
            <li>수업관리</li>
          </Link>
          <li>일정관리</li>
          <li>매출관리</li>
          <li>공지사항</li>
        </ul>
      </div>
    </>
  );
};

export default Nav;
