'use client';
import Header from '@/include/Header.js';
import '@/css/index.css';
import Side from '@/include/Side';
import { SessionProvider } from 'next-auth/react';

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
