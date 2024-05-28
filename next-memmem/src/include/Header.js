"use client";
import "../css/App.css";
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  return (
    <>
      <div className="header">
        <div>
          <img
            src="/images/bug.png"
            width="30px"
            height="30px"
            alt=""
          />
          {session ? (
            <a href="/dash">
              <h4>Mem</h4>
            </a>
          ) : (
            <a href="/">
              <h4>Mem</h4>
            </a>
          )}
        </div>
        <nav className="nav">
          {loading ? (
            <div>Loading...</div>
          ) : session ? (
            <>
              <a className="show_cname">
                {session.user.id.tbl_company[0].c_name}
              </a>
              <a>{session.user.id.u_name} 님</a>
              <a
                className="logout"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Log out
              </a>
            </>
          ) : (
            <>
              <a href="/login">Log in</a>
              <a href="/join" className="signup_btn">
                Sign up
              </a>
            </>
          )}
        </nav>
      </div>
    </>
  );
};

export default Header;
