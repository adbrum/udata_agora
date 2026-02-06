import { Noto_Sans } from 'next/font/google';
import '@ama-pt/agora-design-system/artifacts/dist/style.css';
import './globals.css';

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
      <body className={`${notoSans.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
