import '@/css/App.css';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const Side = () => {
    const { data: session } = useSession();

    return (
        <>
            {session ? (
                <div className="main">
                    <div className="side">
                        <ul>
                            <li>
                                <Link href="/ticket">회원권</Link>
                            </li>
                            <li>회원관리</li>
                            <li>강사관리</li>
                            <li>수업관리</li>
                            <li>일정관리</li>
                            <li>매출관리</li>
                            <li>공지사항</li>
                        </ul>
                    </div>
                </div>
            ) : (
                ''
            )}
        </>
    );
};

export default Side;
