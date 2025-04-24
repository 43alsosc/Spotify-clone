"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Bell, Disc, House, PersonStanding } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between px-6">
      <div className="flex w-full items-center justify-center gap-2">
        <Link
          href="/"
          className="flex size-14 cursor-pointer items-center justify-center rounded-full bg-[#1F1F1F] hover:bg-[#1F1F1F]/80"
          aria-label="Gå til hjem"
        >
          <House className="size-10" />
        </Link>

        <div className="flex">
          <input
            type="search"
            className="h-14 w-[400px] rounded-l-full bg-[#1F1F1F] pl-10 md:text-lg"
            placeholder="Søk"
            autoComplete="off"
            aria-label="Søk etter innhold"
          />
          <div className="m-0 h-4/5 w-1 rounded-full bg-white p-0" />
          <Button
            className="flex size-14 cursor-pointer items-center justify-center rounded-r-full bg-[#1F1F1F]"
            variant="ghost"
            aria-label="Start avspilling"
          >
            <Disc className="size-10" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="size-10"
          aria-label="Varsler"
        >
          <Bell className="size-10" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="size-10"
          aria-label="Min profil"
        >
          <PersonStanding className="size-10" />
        </Button>

        <div className="flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-10">
                <AvatarImage
                  src={session?.user.image as string}
                  alt={session?.user.name || "Profilbilde"}
                  className="select-none"
                />
                <AvatarFallback className="select-none">
                  {session?.user.name?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4">
              <DropdownMenuItem asChild>
                <button className="w-full" onClick={handleLogout}>
                  Logg ut
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
