"use client";
import "../../css/table.css";
import { useState, useEffect } from "react";
import { findUsers, userDetail } from "../api/userComp";
import { useSession } from "next-auth/react";
import { findUnique } from "../api/user";

const UserPage = () => {
  const [users, setUsers] = useState([]); // userList
  const [uname, setUname] = useState("");
  const [uid, setUid] = useState("");
  const [utel, setUtel] = useState("");
  const { data: session } = useSession();
  const [detail, setDetail] = useState("");
  const [ccode, setCcode] = useState("");
  // 검색
  useEffect(() => {
    const userFetch = async () => {
      const u_id = session.user.id;
      const ccode = (await findUnique({ u_id })).tbl_company[0].c_code;
      const result = await findUsers({
        uname,
        uid,
        utel,
        ccode,
      });
      if (result) {
        setUsers([...result]);
      }
    };

    userFetch();
  }, [uname, uid, utel]);

  // 디테일
  useEffect(() => {
    if (detail) {
      const detailFetch = async () => {
        try {
          const result = await userDetail(detail);
          setDetail(result[0]);
        } catch (error) {
          console.log(error);
        }
      };
      detailFetch();
    }
  }, [detail, users]);

  const debounce = (callback, delay = 200) => {
    let debounceTimer;
    return (...args) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => callback.apply(this, args), delay);
    };
  };

  const onUnameChange = (e) => {
    setUname(e.target.value);
  };

  const onUidChange = (e) => {
    setUid(e.target.value);
  };

  const onUtelChange = (e) => {
    setUtel(e.target.value);
  };
  const onUnameHandler = debounce(onUnameChange, 300);
  const onUidHandler = debounce(onUidChange, 300);
  const onUtelHandler = debounce(onUtelChange, 300);

  return (
    <>
      <h1 className="list_title">회원 리스트</h1>
      <div className="list_home">
        <div className="insert_btn_box">
          <a className="insert button-32" href="/user/insert">
            수강생 추가
          </a>
        </div>
        <div className="customer btn_box search">
          <form method="GET" modelAttribute="SEARCH">
            <input className="search_input" placeholder="아이디" defaultValue={uid} onChange={onUidHandler} />
            <input className="search_input" placeholder="이름" defaultValue={uname} onChange={onUnameHandler} />
            <input className="search_input" placeholder="전화번호" defaultValue={utel} onChange={onUtelHandler} />
            <img src="${rootPath }/static/images/search.png" width="10px" height="10px" />
          </form>
        </div>
        <div className="table_div">
          <table className="customer list">
            <thead>
              <tr>
                <th>ID</th>
                <th>이름</th>
                <th>전화번호</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.us_uid} data-id={user.us_uid} onClick={() => setDetail(user.us_uid)}>
                  <td>{user.us_uid}</td>
                  <td>{user.us_uname}</td>
                  <td>{user.us_utel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="view_box">
          {detail ? (
            <div>
              <h1>회원detail</h1>
              <p>ID : {detail.us_uid}</p>
              <p>이름 : {detail.us_uname}</p>
              <p>전화번호 : {detail.us_utel}</p>
            </div>
          ) : (
            <p>No user selected</p>
          )}
        </div>
      </div>
    </>
  );
};
export default UserPage;
