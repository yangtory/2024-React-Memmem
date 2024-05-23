'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useHref } from 'react-router-dom';

const LoginPage = () => {
    const idRef = useRef();
    const passRef = useRef();
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const searchParam = new URLSearchParams(window.location.search);
        const uselogin = searchParam.get('error');
        if (uselogin) {
            setErrorMessage('로그인이 필요한 서비스입니다.');
        }
        // setErrorMessage(uselogin);
        // console.log('router.query:', router.query);
        // 페이지 로드 시 URL 쿼리 파라미터에서 오류 메시지 읽기
        // if (router.query && router.query.error === 'uselogin') {
        //     setErrorMessage('로그인이 필요한 서비스입니다.'); // 오류 메시지는 문자열 형태로 변경
        // }
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setErrorMessage('');
        const res = await signIn('credentials', {
            id: idRef.current.value,
            password: passRef.current.value,
            redirect: false,
        });
        if (res?.error === 'CredentialsSignin') {
            setErrorMessage('아이디 또는 비밀번호가 잘못되었습니다.');
        } else {
            // 세션 객체의 유무를 확인하여 페이지 이동 처리
            const session = await getSession();
            if (session) {
                window.location.href = '/';
            }
        }
    });

    return (
        <>
            <div className="login_wrap">
                <form className="login" onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    {errorMessage && <div className="login error">{errorMessage}</div>}
                    <div>
                        <div className="login error"></div>
                        <input placeholder="Username" ref={idRef} />
                        <input type="password" placeholder="Password" ref={passRef} />
                        <button type="submit" className="login_btn button-32">
                            SUBMIT
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};
export default LoginPage;
