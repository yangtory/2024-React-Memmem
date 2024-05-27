import { NextResponse } from "next/server";

export const middleware = async (req) => {
  const { pathname } = req.nextUrl;
  // console.log(req.cookies.get('next-auth.session-token'));

  // 보호할 경로를 배열에 정의합니다.
  const protectedPaths = [
    "/dash",
    "/user",
    "/ticket",
    "/teacher",
    "/class",
    "/schedule",
    "/notice",
  ];

  // 오류를 가정하고 메시지를 설정합니다.
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
  // 리다이렉트 시에 query string을 사용하여 오류 메시지를 전달합니다.
};

// export const config = {
//     // matcher: ['/dash', '/user', '/ticket', '/teacher', '/class', '/schedule', '/notice'],
//     // matcher: ['/login'],
// };
