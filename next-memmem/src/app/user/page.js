"use client";
import "../../css/table.css";
import "../../css/detail.css";
import "../../css/search.css";
import { useState, useEffect } from "react";
import { deleteUser, findUsers, userDetail } from "../api/userComp";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const UserPage = () => {
  const [users, setUsers] = useState([]); // userList
  const [uname, setUname] = useState("");
  const [uid, setUid] = useState("");
  const [utel, setUtel] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);

  const router = useRouter();

  // 검색
  useEffect(() => {
    const userFetch = async () => {
      const session = await getSession();
      const ccode = session?.user.id.tbl_company[0].c_code;
      const result = await findUsers({
        uname,
        uid,
        utel,
        ccode,
      });
      if (result) {
        console.log(result);
        setUsers([...result]);
      }
    };

    userFetch();
  }, [uname, uid, utel, selectedUser]);

  // 디테일
  useEffect(() => {
    const detailFetch = async () => {
      if (selectedUser) {
        const session = await getSession();
        const ccode = session?.user.id.tbl_company[0].c_code;
        try {
          const result = await userDetail(selectedUser, ccode);
          if (result) {
            console.log(result);
            setSelectedUser(result); // 반환된 데이터로 설정
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    detailFetch();
  }, [selectedUser]);
  const onUserClick = (user) => {
    setSelectedUser(user);
    // console.log(selectedUser);
  };

  const debounce = (callback, delay = 200) => {
    let debounceTimer;
    return (...args) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(
        () => callback.apply(this, args),
        delay
      );
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

  const updateHandler = (id) => {
    // if (selectedUser) {
    router.push(`/user/update/${id}`);
    // }
  };

  const deleteHandler = async (us_uid, us_ccode) => {
    await deleteUser(us_uid, us_ccode);
    setSelectedUser(null);
    // window.location.reload();
  };

  const userMinfoListHandler = async (id) => {
    router.push(`/user/ticket/${id}`);
  };
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
          <form method="GET">
            <input
              className="search_input"
              placeholder="아이디"
              defaultValue={uid}
              onChange={onUidHandler}
            />
            <input
              className="search_input"
              placeholder="이름"
              defaultValue={uname}
              onChange={onUnameHandler}
            />
            <input
              className="search_input"
              placeholder="전화번호"
              defaultValue={utel}
              onChange={onUtelHandler}
            />
            <img
              src="/images/search.png"
              width="10px"
              height="10px"
            />
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
                <tr
                  key={user.us_uid}
                  data-id={user.us_uid}
                  onClick={() => onUserClick(user.tbl_user.u_id)}
                >
                  <td>{user.us_uid}</td>
                  <td>{user.us_uname}</td>
                  <td>{user.us_utel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          {selectedUser && (
            <div className="detail_box width">
              <div className="card">
                <div className="info_container">
                  <div
                    className="info_head"
                    key={selectedUser.us_uid}
                    data-id={selectedUser.us_uid}
                  >
                    <strong>ID</strong>
                    <p>{selectedUser[0].us_uid}</p>
                    <strong>전화번호</strong>
                    <p>{selectedUser[0].us_utel}</p>
                    <a className="message_btn button-32">
                      <img
                        src="/images/mail.png"
                        width="10px"
                        height="10px"
                      ></img>
                    </a>
                  </div>
                  <div className="info_detail">
                    <div>
                      <strong>업체코드</strong>
                      <p>{selectedUser[0].us_ccode}</p>
                    </div>
                    <div>
                      <strong>업체명</strong>
                      <p>{selectedUser[0].us_cname}</p>
                    </div>
                    <div>
                      <strong>이름</strong>
                      <p>{selectedUser[0].us_uname}</p>
                    </div>
                    <div>
                      <strong>메모</strong>
                      <p>다이어트, 식단관리 원함</p>
                    </div>
                  </div>
                </div>
                <div className="detail btn_box">
                  <a
                    className="button-32"
                    onClick={() =>
                      updateHandler(selectedUser[0].us_uid)
                    }
                  >
                    수정
                  </a>
                  <a
                    className="delete_btn button-32"
                    onClick={() =>
                      deleteHandler(
                        selectedUser[0].us_uid,
                        selectedUser[0].us_ccode
                      )
                    }
                  >
                    삭제
                  </a>
                  <a
                    className="button-32"
                    onClick={() =>
                      userMinfoListHandler(selectedUser[0].us_uid)
                    }
                  >
                    회원권
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default UserPage;
