const Join = () => {
  return (
    <>
      <div className="join_wrap">
        <form className="join">
          <h1 className="head">Sign Up</h1>
          <div>
            <div className="join error"></div>
            <input placeholder="USERNAME" name="u_id" />
            <input
              type="password"
              placeholder="PASSWORD"
              name="u_password"
            />
            <input placeholder="NAME" name="u_name" />
            <input placeholder="ADDRESS" name="u_addr" />
            <input placeholder="TEL" name="u_tel" />
          </div>
          <h1 className="head">업체정보 입력</h1>
          <div>
            <input placeholder="업체명" name="u_comp" />
            <input placeholder="업체 전화번호" name="c_tel" />
            <input placeholder="업체 주소" name="c_addr" />
            <button type="button" className="join_btn button-32">
              SIGN UP
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default Join;
