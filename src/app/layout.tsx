import { Noto_Sans } from 'next/font/google';
import '@ama-pt/agora-design-system/artifacts/dist/style.css';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const notoSans = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} antialiased font-sans min-h-screen flex flex-col`}>
        <Header />
        <div className="grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
