import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Do2Nite: Local Event Calendar | What to Do 2Nite Near You",
  description:
    "Do2Nite is the free local event calendar that shows you what to do near you tonight or this weekend. Find live music, trivia, and food specials without following pages or digging through social media feeds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Caveat:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
