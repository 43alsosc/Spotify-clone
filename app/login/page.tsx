"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function Login() {
  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "spotify",
    });
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-12">
      <Image
        src="/spotify_logo.png"
        alt="spotify logo"
        width={320}
        height={96}
      />
      <button
        className="hover:bg-opacity-80 flex cursor-pointer rounded-full bg-green-600 px-12 py-2 text-lg tracking-widest uppercase focus:outline-none"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}
