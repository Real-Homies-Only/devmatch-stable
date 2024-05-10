import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevMatch",
  description: "Match. Create. Repeat."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
