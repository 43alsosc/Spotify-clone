import type React from "react";
import type { Metadata } from "next";
import "../globals.css";
import { Header } from "@/components/header";
import { MusicPlayer } from "@/components/music-player";
import localFont from "next/font/local";
import Providers from "@/app/(home)/query-client-provider";
import ResizablePanels from "@/components/resizable-panels";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const circularBlack = localFont({
  src: "../fonts/circular-black.ttf",
  variable: "--font-circular-black",
});

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "A modern Spotify clone built with Next.js and Tailwind CSS",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.id) {
    return;
  }

  // For Premium tier users
  return (
    <html suppressHydrationWarning>
      <Providers>
        <body
          className={`${circularBlack.variable} bg-black text-gray-300 antialiased`}
        >
          <div className="flex h-screen flex-col">
            <Header />
            <main className="flex-1 overflow-hidden bg-black px-4">
              <ResizablePanels>{children}</ResizablePanels>
            </main>
            <MusicPlayer token={session.user.accessToken!} />
          </div>
        </body>
      </Providers>
    </html>
  );
}
