import NextAuth, { DefaultSession } from 'next-auth';
import { PostItem, UserType } from '.';

// session.user 속성 재정의
declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name: string;
            ccode: string;
        } & DefaultSession['user'];
    }
    interface User {
        id: string;
        name: string;
        ccode: string;
    }

    interface JWT {
        id: string;
        name: string;
        ccode: string;
    }
}
