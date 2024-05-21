"use client";
import "../css/index.css";
import { SessionProvider } from "next-auth/react";
import Header from "../include/Header";
import Side from "../include/Side";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <SessionProvider>
          <Header />
          <div className="main">
            <Side />
            <section>{children}</section>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
