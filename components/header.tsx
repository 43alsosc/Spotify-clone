"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Bell, PersonStanding } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchBox } from "./search-box";

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

  console.log(session);

  return (
    <header className="mx-6 flex h-16 items-center justify-between p-2">
      <Image
        src="/Primary_Logo_White_CMYK.svg"
        alt="Spotify"
        height={32}
        width={32}
      />

      <div className="flex h-12 w-full items-center justify-center gap-2">
        <Link
          href="/"
          className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-[#1F1F1F] hover:bg-[#1F1F1F]/80"
          aria-label="Gå til hjem"
        >
          {pathname === "/" ? (
            <span>
              <svg
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-12 fill-white"
              >
                <path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732l-7.5-4.33z"></path>
              </svg>
            </span>
          ) : (
            <span>
              <svg
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-7 fill-white"
              >
                <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z"></path>
              </svg>
            </span>
          )}
        </Link>

        <SearchBox placeholder="Hva vil du spille av?" className="w-1/3" />
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="size-10 hover:rounded-full"
          aria-label="Varsler"
        >
          <Bell className="size-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="size-10 hover:rounded-full"
          aria-label="Min profil"
        >
          <PersonStanding className="size-6" />
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
