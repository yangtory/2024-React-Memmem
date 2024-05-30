import { NextResponse } from "next/server";

export const middleware = async (req) => {
  const { pathname } = req.nextUrl;
  // console.log(req.cookies.get('next-auth.session-token'));

  // 보호할 경로
  const protectedPaths = [
    "/dash",
    "/user",
    "/ticket",
    "/teacher",
    "/class",
    "/schedule",
    "/notice",
  ];

  // 오류를 가정하고 메시지를 설정
  if (
    !req.cookies.get("next-auth.session-token") &&
    protectedPaths.some((path) => pathname.startsWith(path))
  ) {
    const errorMessage = "uselogin";
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("error", errorMessage);

    return NextResponse.redirect(redirectUrl);
  } else {
    return NextResponse.next();
  }
};

// export const config = {
//     // matcher: ['/dash', '/user', '/ticket', '/teacher', '/class', '/schedule', '/notice'],
//     // matcher: ['/login'],
// };
