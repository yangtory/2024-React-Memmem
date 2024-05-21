'use client';
import '../css/index.css';
import { SessionProvider } from 'next-auth/react';
import Header from '../include/Header';
import Side from '../include/Side';
import css from '../css/modal.module.css';
import Modal from './Modal';
import { ModalProvider } from '../provider/ModalProvider';

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
            <body>
                <SessionProvider>
                    <ModalProvider>
                        <div className={css.content}>
                            <Header />
                            <Modal />
                            <div className="main">
                                <Side />
                                <section>{children}</section>
                            </div>
                        </div>
                    </ModalProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
