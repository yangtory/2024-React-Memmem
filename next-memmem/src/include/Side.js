import { useSession } from "next-auth/react";
import "../css/App.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import AOS from "aos";
const Side = () => {
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    AOS.init({
      duration: 1200,
    });
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (status === "loading") {
    return null; // 로딩 중일 때 아무것도 렌더링하지 않음
  }

  if (!session) {
    return null; // 세션이 없으면 아무것도 렌더링하지 않음
  }
  /*
    Link 컴포넌트에 prefetch={false}를 추가하여 성능을 최적화 
    이 속성은 페이지가 보이기 전에 미리 로드되는 것을 방지
    */
  return (
    isMounted && (
      <div data-aos="flip-left" className="side">
        <ul>
          <li>
            <Link href="/ticket" prefetch={false}>
              회원권
            </Link>
          </li>
          <li>
            <Link href="/user" prefetch={false}>
              회원관리
            </Link>
          </li>
          <li>
            <Link href="/teacher" prefetch={false}>
              강사관리
            </Link>
          </li>
          <li>
            <Link href="/class" prefetch={false}>
              수업관리
            </Link>
          </li>
          <li>
            <Link href="/schedule" prefetch={false}>
              일정관리
            </Link>
          </li>
          <li>매출관리</li>
          <li>
            <Link href="/notice" prefetch={false}>
              공지사항
            </Link>
          </li>
        </ul>
      </div>
    )
  );
};

export default Side;
