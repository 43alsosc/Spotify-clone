import Image from "next/image";
import { Music, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaItemProps {
  item: {
    id: number;
    title: string;
    type: string;
    owner: string;
    songs: number;
    image: string;
  };
  viewMode: string;
  isCollapsed?: boolean;
}

export default function MediaItem({
  item,
  viewMode,
  isCollapsed = false,
}: MediaItemProps) {
  if (isCollapsed) {
    return (
      <div
        className="relative mb-2 h-10 w-10 cursor-pointer overflow-hidden rounded-md transition-opacity hover:opacity-80"
        title={item.title}
      >
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-zinc-700/50",
        viewMode === "compact" && "py-1",
        viewMode === "grid" && "flex-col items-start",
      )}
    >
      <div
        className={cn(
          "relative aspect-square overflow-hidden",
          viewMode === "compact" && "h-10 w-10",
          viewMode === "grid" && "w-full max-w-[120px]",
          viewMode === "list" && "h-12 w-12",
          "rounded-md",
        )}
      >
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
          <button className="bg-primary text-primary-foreground scale-0 transform rounded-full p-2 transition-transform group-hover:scale-100">
            <Music className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "flex min-w-0 flex-col",
          viewMode === "grid" && "w-full pt-2",
        )}
      >
        <h3 className="truncate font-medium text-white">{item.title}</h3>
        <div className="flex items-center text-sm text-zinc-400">
          <span>{item.type}</span>
          <span className="mx-1">•</span>
          {item.type === "Playlist" ? (
            <span className="flex items-center gap-1 truncate">
              <User className="h-3 w-3" />
              {item.owner}
            </span>
          ) : (
            <span className="truncate">{item.owner}</span>
          )}
        </div>
      </div>

      <div className="ml-auto text-sm text-zinc-500">{item.songs} songs</div>
    </div>
  );
}
