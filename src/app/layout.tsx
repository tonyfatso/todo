import type { Metadata } from "next";
import { Providers } from './providers';
import { fonts } from './fonts';
import './app.scss';


export const metadata: Metadata = {
  title: "test",
  description: "test",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fonts.rubik.variable}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}