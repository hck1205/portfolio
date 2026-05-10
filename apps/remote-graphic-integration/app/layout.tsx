import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Remote Graphic Integration",
  description: "Graphic integration remote app"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
