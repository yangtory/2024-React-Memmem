"use client";
import "../../../css/table.css";
import "../../../css/input.css";
import { useEffect, useState } from "react";
import { AllUser, findUnique } from "../../api/user";
import { useSession } from "next-auth/react";
import { AddUserComp } from "../../api/userComp";
import { useRouter } from "next/router";

const InsertPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [userList, setUserList] = useState([]);
  const [ccode, setCcode] = useState("");
  const [cname, setCname] = useState("");

  const [formData, setFormData] = useState({
    us_ccode: ccode,
  });
  const [id, setId] = useState();
  const [selectUser, setSelectUser] = useState(null);
  // 모든 유저 찾기
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await AllUser();

        setUserList(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // UserList 클릭했을때
  const userClick = (id) => {
    // 클릭한 사용자 정보 찾기
    const clickUser = userList.find((user) => user.u_id === id);
    // 사용자 정보 설정
    setSelectUser(clickUser);
    setFormData({
      us_uid: clickUser.u_id,
      us_uname: clickUser.u_name,
      us_utel: clickUser.u_tel,
      us_cname: cname,
    });
  };

  const changeUser = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (session) {
      const codeFetch = async () => {
        const u_id = session.user.id;
        const ccode = (await findUnique({ u_id })).tbl_company[0].c_code;
        const cname = (await findUnique({ u_id })).tbl_company[0].c_name;
        setCname(cname);
        setCcode(ccode);
      };
      codeFetch();
    }
  }, [session]);
  // const addComp = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //     ccode,
  //   });
  // };

  const submit = async () => {
    try {
      const result = AddUserComp({ formData, ccode });
      console.log(result);
      router.push("/user");
    } catch (error) {}
  };

  return (
    <>
      <h1 className="list_title">회원 등록</h1>
      <div className="wrap">
        <div className="input_div">
          <form className="formBox input_box" onSubmit={submit}>
            <h3>회원 정보</h3>
            <div className="user_error"></div>
            <label>ID</label>
            <input className="us_uid" placeholder="리스트에서 선택해주세요" name="us_uid" readonly value={formData.us_uid} onChange={changeUser} />
            <label>이름</label>
            <input
              className="us_uname"
              placeholder="리스트에서 선택해주세요"
              name="us_uname"
              readonly
              value={formData.us_uname}
              onChange={changeUser}
            />
            <input className="us_utel" placeholder="전화번호" name="us_utel" value={formData.us_utel} onChange={changeUser} />
            <input className="us_cname" placeholder="업체명" name="us_cname" readonly value={formData.us_cname} onChange={changeUser} />
            <input className="us_ccode" placeholder="업체코드" name="us_ccode" value={ccode} onChange={changeUser} readonly />

            {/* <h3>수강권 정보</h3>
            <div className="m_error"></div>

            <div className="selectBox">
              <select className="select" name="r_iseq">
                <option value="0">--수강권선택--</option>
                <option></option>
              </select>
            </div>
            <label>수강권횟수</label>
            <input className="r_icount" placeholder="수강권횟수" name="r_icount" readonly />
            <label>시작일</label>
            <input className="r_sdate" type="date" name="r_sdate" value="${U.r_sdate }" />
            <label>종료일</label>
            <input className="r_edate" type="date" name="r_edate" value="${U.r_edate }" /> */}

            <input type="submit" value="저장" className="insert" />
          </form>
        </div>

        <div className="member_list">
          <h3>USER 리스트</h3>

          <div className="table_wrapper">
            <table className="list tbl">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>이름</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((USER, index) => (
                  <tr key={USER.u_id} data-id={USER.u_id} onClick={() => userClick(USER.u_id)}>
                    <td>{USER.u_id}</td>
                    <td>{USER.u_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
export default InsertPage;
