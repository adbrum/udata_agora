import { Nunito_Sans } from 'next/font/google';
import '@ama-pt/agora-design-system/artifacts/dist/style.css';
import './globals.css';

const nunito = Nunito_Sans({
  variable: '--font-nunito',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
