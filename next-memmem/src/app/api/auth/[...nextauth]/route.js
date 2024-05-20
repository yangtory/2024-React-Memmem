import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUnique } from "../../user";
import bcrypt from "bcryptjs";

const Handler = NextAuth({
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/auth/error",
    verifyRequest: "auth-verify-request",
    newUser: "/join",
  },
  providers: [
    CredentialsProvider({
      name: "Id and Password",
      credentials: {
        id: {
          label: "아이디",
          type: "id",
          placeholder: "아이디를 입력하세요",
        },
        password: {
          label: "비밀번호",
          type: "password",
          placeholder: "비밀번호를 입력하세요",
        },
      },
      async authorize(credentials) {
        const { id, password } = credentials;

        const user = await findUnique({ u_id: id });
        if (user && bcrypt.compareSync(password, user.u_password)) {
          return {
            id: user.u_id,
            name: user.u_name,
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
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
  },
});

// hadler 를 get, post 로 요청하면 너가 해
export { Handler as GET, Handler as POST };
