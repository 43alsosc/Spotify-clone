import { Bell, Disc, House, PersonStanding, User } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <div className="flex w-full items-center justify-center gap-2">
        <Button
          className="flex size-14 cursor-pointer items-center justify-center rounded-full bg-[#1F1F1F]"
          variant={"ghost"}
        >
          <House className="size-10" />
        </Button>
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
        <User className="size-10" />
      </div>
    </header>
  );
}
