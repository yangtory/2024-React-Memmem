"use client";

import { useEffect, useState } from "react";
import { userDetail, userUpdate } from "../../../api/userComp";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "../../../../css/input.css";
import "../../../../css/table.css";
const updatePage = ({ params }) => {
  const router = useRouter();
  const pathName = decodeURIComponent(params.id);
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    us_uid: "",
    us_uname: "",
    us_utel: "",
    us_ccode: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const session = await getSession();
      const ccode = session?.user.id.tbl_company[0].c_code;
      const result = await userDetail(pathName, ccode);
      setUserInfo(result[0]);
      console.log(result[0]);
      setFormData({
        us_uid: result[0].us_uid,
        us_uname: result[0].us_uname,
        us_utel: result[0].us_utel,
        us_ccode: ccode,
      });
    };
    fetchUserInfo();
  }, [pathName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const updateHandler = async () => {
    const { us_uid, us_uname, us_utel, us_ccode } = formData;

    await userUpdate({
      us_uid,
      us_uname,
      us_utel,
      us_ccode,
    });
    router.push("/user");
  };

  return (
    <>
      <h1 className="list_title">회원 수정</h1>
      <div className="wrap">
        <div className="input_div">
          <form className="formBox input_box">
            <h3>회원 정보</h3>
            <div className="user_error"></div>
            <label>ID</label>
            <input className="us_uid" name="us_uid" value={pathName} readOnly />
            <label>이름</label>
            <input
              className="us_uname"
              name="us_uname"
              value={formData?.us_uname || ""}
              onChange={handleChange}
            />
            <input
              className="us_utel"
              value={formData?.us_utel}
              name="us_utel"
              onChange={handleChange}
            />
            <input
              type="hidden"
              className="us_cname"
              value={userInfo?.us_cname}
              name="us_cname"
              readOnly
            />
            <input
              type="hidden"
              className="us_ccode"
              value={formData?.us_ccode}
              name="us_ccode"
              readOnly
            />

            <h3>수강권 정보</h3>
            <div className="m_error"></div>

            <input type="button" value="수정" className="insert" onClick={updateHandler} />
          </form>
        </div>
      </div>
    </>
  );
};

export default updatePage;
