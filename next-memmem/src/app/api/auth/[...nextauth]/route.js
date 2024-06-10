'use server';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { findUnique } from '../../user';
import bcrypt from 'bcryptjs';

const Handler = NextAuth({
    pages: {
        signIn: '/login',
        signOut: '/logout',
        // error: '/auth/error',
        verifyRequest: 'auth-verify-request',
        newUser: '/join',
    },
    providers: [
        CredentialsProvider({
            name: 'Id and Password',
            credentials: {
                id: {
                    label: '아이디',
                    type: 'id',
                    placeholder: '아이디를 입력하세요',
                },
                password: {
                    label: '비밀번호',
                    type: 'password',
                    placeholder: '비밀번호를 입력하세요',
                },
            },
            async authorize(credentials) {
                const { id, password } = credentials;

                const user = await findUnique({ u_id: id });
                // console.log("USER", user);
                if (!bcrypt.compareSync(password, user.u_password)) {
                    throw new Error('CredentialsSignin');
                }
                if (user && user.tbl_role[0].r_role === 'ROLE_USER') {
                    throw new Error('role_user');
                }
                if (user && bcrypt.compareSync(password, user.u_password)) {
                    // console.log("USER OK", user);
                    return {
                        ...user, // 이걸로 바꾸니까 위의 user 값이 다 나옴
                        // id: user.u_id,
                        // name: user.u_name,
                        // member: user,
                    };
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // token.id = user.id;
                // token.name = user.name;
                token = { ...token, ...user };
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token;
            session.user.name = token.name;
            return session;
        },
    },
    session: {
        maxAge: 3600,
    },
    secret: process.env.NEXTAUTH_SECRET,
    // 추가: 환경 변수 사용
    url: process.env.NEXTAUTH_URL,
    jwt: {
        encryption: true,
    },
});

// hadler 를 get, post 로 요청하면 너가 해
export { Handler as GET, Handler as POST };
