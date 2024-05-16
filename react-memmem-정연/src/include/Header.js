const Header = () => {
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
          <a href="/login">Log in</a>
          <a href="/join" className="signup_btn">
            Sign up
          </a>
        </nav>
      </div>
    </>
  );
};

export default Header;
