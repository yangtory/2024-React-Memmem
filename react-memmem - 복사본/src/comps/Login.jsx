import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [loginOk, setLoginOk] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useNavigate();

  const loginHandler = () => {
    if (username === "tory" && password === "1") {
      setLoginOk(true);
      localStorage.setItem("loginOk", true);
      history("/main");
    } else {
      setErrorMessage("아이디 또는 비밀번호를 확인하세요!");
    }
  };

  // const logoutHandler = () =>{
  //   setLoginOk(false);
  //   localStorage.removeItem("loginOk")
  // }

  return (
    <>
      <div className="login_wrap">
        <form className="login">
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
            <button
              type="button"
              className="login_btn button-32"
              onClick={loginHandler}
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
