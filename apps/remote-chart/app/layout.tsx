import type { Metadata } from "next";
import "@portfolio/shared/styles/reset.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Remote Chart",
  description: "Chart remote app"
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
