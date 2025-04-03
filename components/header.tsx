"use client";

import { Bell, Disc, House, PersonStanding } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Header() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  if (pathname === "/login") {
    return null;
  }

  return (
    <header className="flex items-center justify-between px-6 py-4">
      <div className="flex w-full items-center justify-center gap-2">
        <Link
          href="/"
          className="flex size-14 cursor-pointer items-center justify-center rounded-full bg-[#1F1F1F] hover:bg-[#1F1F1F]/80"
        >
          <House className="size-10" />
        </Link>
        <div className="flex">
          <input
            className="h-14 w-[400px] rounded-l-full bg-[#1F1F1F] pl-10 md:text-lg"
            placeholder="Search"
            autoComplete="off"
          />
          <div className="m-0 h-4/5 w-1 rounded-full bg-white p-0" />
          <Button
            className="flex size-14 cursor-pointer items-center justify-center rounded-r-full bg-[#1F1F1F]"
            variant="ghost"
          >
            <Disc className="size-10" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Bell className="size-10" />
        <PersonStanding className="size-10" />
        <div className="flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-10">
                <AvatarImage
                  src={session?.user.image as string}
                  className="select-none"
                />
                <AvatarFallback className="select-none">
                  <span>{session?.user.name?.[0].toUpperCase()}</span>
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4">
              <DropdownMenuItem asChild className="">
                <button
                  className="w-full"
                  onClick={async () => {
                    await authClient.signOut();
                    router.push("/login");
                  }}
                >
                  Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
