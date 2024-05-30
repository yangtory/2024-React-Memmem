"use client";
import { useEffect, useState } from "react";
import { createUser } from "../api/user";
import { useRouter } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

const JoinPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
    });
  }, []);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    u_id: "",
    u_password: "",
    u_name: "",
    u_tel: "",
    u_comp: "",
    c_tel: "",
    c_addr: "",
  });

  // input 필드 변경 시 호출되는 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 폼 제출 시 호출되는 핸들러
  const handleSubmit = async () => {
    try {
      if (!formData.u_id) {
        setErrorMessage("아이디를 입력하세요");
        return;
      }
      if (!formData.u_password) {
        setErrorMessage("비밀번호를 입력하세요");
        return;
      }
      if (!formData.u_name) {
        setErrorMessage("이름을 입력하세요");
        return;
      }
      if (!formData.u_tel) {
        setErrorMessage("전화번호를 입력하세요");
        return;
      }
      if (
        !formData.u_comp &&
        confirm("업체정보를 입력하지 않으면 일반회원으로 가입됩니다.")
      ) {
        const result = await createUser({ formData });
        console.log("User created:", result);
        router.push("/login");
      } else {
        if (formData.u_comp && formData.c_tel && formData.c_addr) {
          const result = await createUser({ formData });
          console.log("User created:", result);
          router.push("/login");
        } else {
          setErrorMessage("업체정보를 모두 입력해주세요");
          return;
        }
      }
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <div className="join_wrap">
      <div className="div_box_aos" data-aos="fade-up">
        <form className="join" onSubmit={(e) => e.preventDefault()}>
          <h1 className="head">Sign Up</h1>
          <div>
            {errorMessage && (
              <div className="join_error">{errorMessage}</div>
            )}
            <input
              placeholder="USERNAME"
              name="u_id"
              value={formData.u_id}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="PASSWORD"
              name="u_password"
              value={formData.u_password}
              onChange={handleChange}
            />
            <input
              placeholder="NAME"
              name="u_name"
              value={formData.u_name}
              onChange={handleChange}
            />
            <input
              placeholder="TEL"
              name="u_tel"
              value={formData.u_tel}
              onChange={handleChange}
            />
          </div>
          <h1 className="head">업체정보 입력</h1>
          <div>
            <input
              placeholder="업체명"
              name="u_comp"
              value={formData.u_comp}
              onChange={handleChange}
            />
            <input
              placeholder="업체 전화번호"
              name="c_tel"
              value={formData.c_tel}
              onChange={handleChange}
            />
            <input
              placeholder="업체 주소"
              name="c_addr"
              value={formData.c_addr}
              onChange={handleChange}
            />
            <button
              type="button"
              className="join_btn button-32"
              onClick={handleSubmit}
            >
              SIGN UP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default JoinPage;
