"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getSession, signIn } from "next-auth/react";
import AOS from "aos";
import "aos/dist/aos.css";

const LoginPage = () => {
  const idRef = useRef();
  const passRef = useRef();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    AOS.init({
      duration: 1200,
    });
  }, []);

  useEffect(() => {
    const searchParam = new URLSearchParams(window.location.search);
    const uselogin = searchParam.get("error");
    if (uselogin) {
      setErrorMessage("로그인이 필요한 서비스입니다.");
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const idValue = idRef.current.value;
    const passwordValue = passRef.current.value;

    if (!idValue || !passwordValue) {
      setErrorMessage("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    const res = await signIn("credentials", {
      id: idValue,
      password: passwordValue,
      redirect: false,
    });
    if (res?.error === "CredentialsSignin") {
      setErrorMessage("아이디 또는 비밀번호가 잘못되었습니다.");
    } else {
      // 세션 객체의 유무를 확인하여 페이지 이동 처리
      const session = await getSession();
      if (session) {
        window.location.href = "/dash";
      }
    }
  });

  return (
    <>
      <div className="login_wrap">
        <div className="div_box_aos" data-aos="fade-up">
          <form className="login" onSubmit={handleSubmit}>
            <h1>Login</h1>
            {errorMessage && (
              <div className="login_error">{errorMessage}</div>
            )}
            <div>
              <input placeholder="Username" ref={idRef} />
              <input
                type="password"
                placeholder="Password"
                ref={passRef}
              />
              <button type="submit" className="login_btn button-32">
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
