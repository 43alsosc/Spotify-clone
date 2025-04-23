import type React from "react";
import type { Metadata } from "next";
import "../globals.css";
import localFont from "next/font/local";
import Providers from "@/app/(home)/query-client-provider";

const circularBlack = localFont({
  src: "../fonts/circular-black.ttf",
  variable: "--font-circular-black",
});

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "A modern Spotify clone built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <Providers>
        <body
          className={`${circularBlack.variable} bg-black text-gray-300 antialiased`}
        >
          <main>{children}</main>
        </body>
      </Providers>
    </html>
  );
}
