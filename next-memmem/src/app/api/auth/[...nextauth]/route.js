import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { findUnique, findUserComp } from '../../user';
import bcrypt from 'bcryptjs';
import { findComp } from '../../company';

const Handler = NextAuth({
    pages: {
        signIn: '/login',
        signOut: '/logout',
        error: '/auth/error',
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
                const comp = await findComp({ c_uid: id });
                if (user && bcrypt.compareSync(password, user.u_password)) {
                    return {
                        id: user.u_id,
                        name: user.u_name,
                        ccode: user.c_code,
                    };
                } else {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.ccode = token.ccode;
            console.log('Session callback session:', session);
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.ccode = user.ccode;
            }
            return token;
        },
    },
});

// hadler 를 get, post 로 요청하면 너가 해
export { Handler as GET, Handler as POST };
