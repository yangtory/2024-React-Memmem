"use client";
import { useCallback, useRef, useState } from "react";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  const idRef = useRef();
  const passRef = useRef();
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    await signIn("credentials", {
      id: idRef.current,
      password: passRef.current,
      redirect: true,
      callbackUrl: "/",
    });
    if (res.ok) {
      // 로그인 성공 처리
      console.log("로그인 성공");
    } else {
      // 로그인 실패 처리
      console.log("로그인 실패");
    }
  }, []);

  return (
    <>
      <div className="login_wrap">
        <form className="login">
          <h1>Login</h1>
          <div>
            <div className="login error"></div>
            <input placeholder="Username" ref={idRef} />
            <input
              type="password"
              placeholder="Password"
              ref={passRef}
            />
            <button
              type="submit"
              className="login_btn button-32"
              onClick={handleSubmit}
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default LoginPage;
