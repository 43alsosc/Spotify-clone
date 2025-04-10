import type React from "react";
import type { Metadata } from "next";
import "../globals.css";
import { Header } from "@/components/header";
import { MusicPlayer } from "@/components/music-player";
import localFont from "next/font/local";
import Providers from "@/providers/query-client-provider";
import ResizablePanels from "@/components/resizable-panels";

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
          <div className="flex h-screen flex-col">
            <Header />
            <main className="flex-1 overflow-hidden p-4">
              <ResizablePanels>{children}</ResizablePanels>
            </main>
            <MusicPlayer />
          </div>
        </body>
      </Providers>
    </html>
  );
}
