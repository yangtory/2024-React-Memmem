"use client";
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
          <a href="/">
            <h3>Mem</h3>
          </a>
        </div>
        <nav className="nav">
          {loading ? (
            <div>Loading...</div>
          ) : session ? (
            <>
              <a>{session.user.name}님</a>
              <a onClick={() => signOut({ callbackUrl: "/" })}>
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
