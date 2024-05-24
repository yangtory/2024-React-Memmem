"use client";
import { useState, useEffect } from "react";
import "../../css/table.css";
import "../../css/notice.css";
import "../../css/search.css";
import "../../css/notice_detail.css";
import { useTicket } from "../../provider/TicketProvider";
import { useModal } from "../../provider/ModalProvider";
import {
  deleteNotice,
  findNotice,
  selectAll,
  updateNotice,
} from "../api/notice";
import { getSession } from "next-auth/react";

const NoticePage = () => {
  const { noticeList, setNoticeList } = useTicket();
  const { setNoticeModal } = useModal();
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [ntitle, setNtitle] = useState("");
  const [ndate, setNdate] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    n_seq: "",
    n_title: "",
    n_content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 검색 기능
  const onNtitleChange = (e) => {
    setNtitle(e.target.value);
  };

  const onNdateChange = (e) => {
    setNdate(e.target.value);
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
  const onNtitleHandler = debounce(onNtitleChange, 300);
  const onNdateHandler = debounce(onNdateChange, 300);

  // insert 클릭하면 modal 띄우기
  const openModal = () => {
    setNoticeModal(true);
  };

  useEffect(() => {
    const fetchNotices = async () => {
      const session = await getSession();
      const ccode = session?.user.id.tbl_company[0].c_code;
      // 프리즈마를 사용하여 공지사항 데이터 가져오기
      try {
        const result = await selectAll({ ccode });
        setNoticeList([...result]);
      } catch (error) {
        console.error("Failed to fetch notices:", error);
      }
      const result = await findNotice({
        ntitle,
        ndate,
        ccode,
      });
      if (result) {
        setNoticeList([...result]);
      }
    };
    fetchNotices();
  }, [setNoticeList, ntitle, ndate, selectedNotice]);

  // notice detail 띄우기
  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    setFormData({
      n_seq: notice.n_seq,
      n_title: notice.n_title,
      n_content: notice.n_content,
    });
  };

  // detail 닫기
  const handleCloseModal = () => {
    setSelectedNotice(null);
    setIsEditMode(false);
  };

  // 삭제
  const deleteHandler = async (seq) => {
    await deleteNotice(seq);
    setSelectedNotice(null);
  };

  // 디테일에서 수정버튼 누르기
  const updateClickHandler = () => {
    setIsEditMode(true); // readonly 해제
  };

  // 수정버튼을 누르고 나서 수정완료를 누를때
  const updateHandler = async () => {
    const updateTitle = formData.n_title;
    const updateContent = formData.n_content;
    const seq = formData.n_seq;
    await updateNotice({
      seq,
      title: updateTitle,
      content: updateContent,
    });
    setIsEditMode(false);
    setSelectedNotice(null);
  };

  return (
    <>
      <h1 className="list_title">공지사항</h1>
      <div className="list_home">
        <div className="insert_btn_box">
          <button
            className="insert button-32"
            type="button"
            onClick={openModal}
          >
            글쓰기
          </button>
        </div>

        <div className="notice search">
          <form>
            <input
              className="search_input"
              placeholder="제목"
              name="n_title"
              defaultValue={ntitle}
              onChange={onNtitleHandler}
            />
            <input
              className="search_input"
              placeholder="등록일"
              name="n_date"
              value={ndate}
              onChange={onNdateHandler}
            />
          </form>
        </div>

        {noticeList.length === 0 ? (
          <div>
            <table className="notice list">
              <thead>
                <tr>
                  <th className="index" width="20px">
                    No.
                  </th>
                  <th className="date" width="80px">
                    작성일자
                  </th>
                  <th className="title" width="200px">
                    제목
                  </th>
                  <th className="id" width="20px">
                    작성자
                  </th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
            <div className="noList_wrapper">
              <div className="noList">
                등록된 공지사항이 없습니다.
              </div>
            </div>
          </div>
        ) : (
          <div className="table_div">
            <table className="notice list">
              <thead>
                <tr>
                  <th className="index" width="20px">
                    No.
                  </th>
                  <th className="date" width="80px">
                    작성일자
                  </th>
                  <th className="title" width="200px">
                    제목
                  </th>
                  <th className="id" width="20px">
                    작성자
                  </th>
                </tr>
              </thead>
              <tbody>
                {noticeList.map((notice, index) => (
                  <tr
                    key={notice.n_seq}
                    onClick={() => handleNoticeClick(notice)}
                  >
                    <td className="index">{index + 1}</td>
                    <td className="date">
                      {notice.n_date}
                      <br />
                      {notice.n_time}
                    </td>
                    <td className="title">{notice.n_title}</td>
                    <td className="id">{notice.n_uid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div
          className={
            selectedNotice ? "modal-backdrop show" : "modal-backdrop"
          }
        >
          <div className={selectedNotice ? "detail show" : "detail"}>
            <div className="close_btn" onClick={handleCloseModal}>
              <span>X</span>
            </div>
            <div className="notice input_box">
              {isEditMode ? (
                <>
                  <h3>공지사항 수정</h3>
                  <input
                    id="seq"
                    value={selectedNotice.n_seq}
                    readOnly
                    type="hidden"
                  />
                </>
              ) : (
                ""
              )}

              <label htmlFor="n_title">제목</label>
              <input
                id="n_title"
                name="n_title"
                value={formData.n_title}
                readOnly={!isEditMode} // 수정모드 readonly=false
                onChange={handleChange} // 수정모드에서 값 변경 가능하게 설정
              />

              <label htmlFor="n_content">내용</label>
              <textarea
                id="n_content"
                name="n_content"
                rows="20"
                value={formData.n_content}
                readOnly={!isEditMode}
                onChange={handleChange}
              ></textarea>

              <div className="btn_box">
                {isEditMode ? (
                  <button
                    className="notice_update button-32"
                    onClick={updateHandler}
                  >
                    수정완료
                  </button>
                ) : (
                  <>
                    <button
                      className="notice_update button-32"
                      onClick={() =>
                        updateClickHandler(selectedNotice?.n_seq)
                      }
                    >
                      수정
                    </button>
                    <button
                      className="notice_delete button-32"
                      onClick={() =>
                        deleteHandler(selectedNotice?.n_seq)
                      }
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoticePage;
