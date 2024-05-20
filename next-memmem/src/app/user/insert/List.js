// List.js
"use client";
import { useState, useEffect } from "react";

const List = () => {
  const [users, setUsers] = useState([]);

  return (
    <>
      {users.map((user) => (
        <tr key={user.us_uid} data-id={user.us_uid}>
          <td>{user.us_uid}</td>
          <td>{user.us_uname}</td>
          <td>{user.us_utel}</td>
          {/* 추가적인 사용자 정보 표시 */}
          <td>{user.tbl_user_comp ? user.tbl_user_comp.us_cname : ""}</td>
          <td>{user.tbl_user_comp ? user.tbl_user_comp.us_date : ""}</td>
        </tr>
      ))}
    </>
  );
};

export default List;
