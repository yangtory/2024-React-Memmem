'use client';
import { useState, useEffect } from 'react';
import '../../css/table.css';
import '../../css/search.css';
import { useTicket } from '../../provider/TicketProvider';
import { useUser } from '../../provider/UserProvider';
import { useModal } from '../../provider/ModalProvider';
import { findNotice, selectAll } from '../api/notice';

const NoticePage = () => {
    const { noticeList, setNoticeList } = useTicket();
    const { ccode } = useUser();
    const { setNoticeModal } = useModal();
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [ntitle, setNtitle] = useState('');
    const [ndate, setNdate] = useState('');

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
            debounceTimer = setTimeout(() => callback.apply(this, args), delay);
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
            try {
                // 프리즈마를 사용하여 공지사항 데이터 가져오기
                const result = await selectAll.findMany({ ccode });
                setNoticeList(result);
            } catch (error) {
                console.error('Failed to fetch notices:', error);
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
    }, [setNoticeList, ntitle, ndate]);

    const handleNoticeClick = (notice) => {
        setSelectedNotice(notice);
    };

    const handleCloseModal = () => {
        setSelectedNotice(null);
    };

    return (
        <>
            <h1 className="list_title">공지사항</h1>
            <div className="list_home">
                <div className="insert_btn_box">
                    <button className="insert button-32" type="button" onClick={openModal}>
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
                                    <th className="content">내용</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                        <div className="noList_wrapper">
                            <div className="noList">등록된 공지사항이 없습니다.</div>
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
                                    <th className="content">내용</th>
                                </tr>
                            </thead>
                            <tbody>
                                {noticeList.map((notice, index) => (
                                    <tr key={notice.n_seq} onClick={() => handleNoticeClick(notice)}>
                                        <td className="index">{index + 1}</td>
                                        <td className="date">
                                            {notice.n_date}
                                            <br />
                                            {notice.n_time}
                                        </td>
                                        <td className="title">{notice.n_title}</td>
                                        <td className="id">{notice.n_uid}</td>
                                        <td className="content">{notice.n_content}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedNotice && (
                    <div className="modal-backdrop" onClick={handleCloseModal}>
                        <div className="detail" onClick={(e) => e.stopPropagation()}>
                            <div className="notice input_box">
                                <label>제목</label>
                                <input name="title" value={selectedNotice.n_title} readOnly />
                                <label>내용</label>
                                <textarea name="content" rows="20" value={selectedNotice.n_content} readOnly></textarea>
                                <div className="btn_box">
                                    <button className="notice_update button-32">수정</button>
                                    <button className="notice_delete button-32">삭제</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default NoticePage;
