"use client";
import "../css/index.css";
import { SessionProvider } from "next-auth/react";
import Header from "../include/Header";
import Side from "../include/Side";
import css from "../css/modal.module.css";
import Modal from "../modals/TicketModal";
import { ModalProvider } from "../provider/ModalProvider";
import { TicketProvider } from "../provider/TicketProvider";
import { UserProvider } from "../provider/UserProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <SessionProvider>
          <UserProvider>
            <ModalProvider>
              <TicketProvider>
                <div className={css.content}>
                  <Header />
                  <Modal />
                  <div className="main">
                    <Side />
                    <section>{children}</section>
                  </div>
                </div>
              </TicketProvider>
            </ModalProvider>
          </UserProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
