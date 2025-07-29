import './globals.css';
import { ReactNode } from 'react';
import NavBar from './components/NavBar';

export const metadata = {
  title: 'Mini Webshop',
  description: 'Next.js webshop aplikacija',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-[#2C2C2C] via-[#522546] to-[#88304E]">
        <NavBar />
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
