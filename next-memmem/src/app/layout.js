"use client";
import "../css/index.css";
import "../css/dash.css";
import { SessionProvider } from "next-auth/react";
import Header from "../include/Header";
import Side from "../include/Side";
import css from "../css/modal.module.css";
import { ModalProvider } from "../provider/ModalProvider";
import TicketModal from "../modals/TicketModal";
import TeacherModal from "../modals/TeacherModal";
import NoticeModal from "../modals/NoticeModal";
import { AddListProvider } from "../provider/AddListProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <SessionProvider>
          <ModalProvider>
            <AddListProvider>
              <div className={css.content}>
                <TicketModal />
                <TeacherModal />
                <NoticeModal />
                <Header />
                <div className="main">
                  <Side />
                  <section>{children}</section>
                </div>
              </div>
            </AddListProvider>
          </ModalProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
