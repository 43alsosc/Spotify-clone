import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ResizableSidePanel } from "@/components/sidepanel";
import { Header } from "@/components/header";
import { MusicPlayer } from "@/components/music-player";
import localFont from "next/font/local";

const circularBlack = localFont({
  src: "./fonts/Circular-Black.ttf",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${circularBlack.variable} bg-black text-gray-300 antialiased`}
      >
        <div className="flex h-screen flex-col">
          <Header />
          <div className="flex flex-1 overflow-x-hidden">
            <ResizableSidePanel>{children}</ResizableSidePanel>
          </div>
          <MusicPlayer />
        </div>
      </body>
    </html>
  );
}
