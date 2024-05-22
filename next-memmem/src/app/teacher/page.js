"use client";
import { useState, useEffect } from "react";
import "../../css/table.css"; // CSS 파일을 가져옵니다.
import { getSession } from "next-auth/react";
import { selectAll } from "../api/teacher";
const TeacherPage = () => {
  const { ccode, setCcode } = useState();
  const [teacherList, setTeacherList] = useState([]);
  const [searchParams, setSearchParams] = useState({
    tname: "",
    tcode: "",
    ttel: "",
  });

  // user의 ccode 셋팅
  useEffect(() => {
    const getCCode = async () => {
      const session = await getSession();
      const u_id = session?.user?.id;
      console.log(session);
      const ccode = await findUnique({ u_id }).tbl_company[0].c_code;
      console.log(ccode);
      setCcode(ccode);
    };
    getCCode();
  }, []);

  // 회원권 리스트 셋팅
  useEffect(() => {
    const teacherFetch = async () => {
      try {
        const result = await selectAll(ccode);
        console.log(result);
        setTeacherList([...result]);
      } catch (error) {
        console.log(error);
      }
    };
    teacherFetch();
  }, [setTeacherList]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // 검색 기능을 구현합니다. 실제로는 API 호출로 대체해야 합니다.
    fetch(
      `/api/teachers?name=${searchParams.tname}&code=${searchParams.tcode}&tel=${searchParams.ttel}`
    )
      .then((response) => response.json())
      .then((data) => setTeacher(data))
      .catch((error) =>
        console.error("Error searching teachers:", error)
      );
  };

  return (
    <div className="list_home">
      <h1 className="list_title">강사 리스트</h1>
      <div className="teacher input insert_btn_box">
        <button
          className="teacher input insert button-32"
          type="button"
        >
          강사추가
        </button>
      </div>
      <div className="teacher btn_box search">
        <form onSubmit={handleSearch}>
          <input
            className="search_input"
            placeholder="이름"
            name="tname"
            value={searchParams.tname}
            onChange={handleInputChange}
          />
          <input
            className="search_input"
            placeholder="강사코드"
            name="tcode"
            value={searchParams.tcode}
            onChange={handleInputChange}
          />
          <input
            className="search_input"
            placeholder="전화번호"
            name="ttel"
            value={searchParams.ttel}
            onChange={handleInputChange}
          />
          <button className="button-32" type="submit">
            <img
              src="/images/search.png"
              width="10"
              height="10"
              alt="검색"
            />
          </button>
        </form>
      </div>
      <div className="table_div">
        <table className="teacher list">
          <thead>
            <tr>
              <th>No.</th>
              <th>강사코드</th>
              <th>강사이름</th>
              <th>전화번호</th>
            </tr>
          </thead>
          <tbody>
            {teacherList.map((teacher, index) => (
              <tr key={teacher.t_code} data-code={teacher.t_code}>
                <td>{index + 1}</td>
                <td>{teacher.t_code}</td>
                <td>{teacher.t_name}</td>
                <td>{teacher.t_tel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherPage;
