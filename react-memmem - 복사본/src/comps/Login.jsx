import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [loginOk, setLoginOk] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useNavigate();

  // const loginHandler = () => {
  //   if (username === "tory" && password === "1") {
  //     setLoginOk(true);
  //     localStorage.setItem("loginOk", true);
  //     history("/main");
  //   } else {
  //     setErrorMessage("아이디 또는 비밀번호를 확인하세요!");
  //   }
  // };

  const springLogin = async (e) => {
    e.preventDefault(); // submit action을 안타도록 설정

    try {
      const response = await fetch("/main/login", {
        method: "POST", //메소드 지정
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        localStorage.setItem("loginOk", true);
        history("/main");
      } else {
        setErrorMessage("아이디 또는 비밀번호를 확인하세요!");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  // const logoutHandler = () =>{
  //   setLoginOk(false);
  //   localStorage.removeItem("loginOk")
  // }

  return (
    <>
      <div className="login_wrap">
        <form className="login" onSubmit={(e) => springLogin(e)}>
          <h1>Login</h1>
          <div>
            <div className="login error">{errorMessage}</div>
            <input
              placeholder="Username"
              name="u_id"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              name="u_password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="login_btn button-32">
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
