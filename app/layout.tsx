import type { ReactNode } from 'react';
import './globals.css';
import { Header } from './components/ui/header/header';
import { Fraunces } from 'next/font/google';

const fraunces = Fraunces({
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fraunces.className}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
