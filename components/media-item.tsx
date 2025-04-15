import Image from "next/image";
import { Play, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimplifiedPlaylist } from "@/types/types";
import Link from "next/link";
import { z } from "zod";

interface MediaItemProps {
  item: z.infer<typeof SimplifiedPlaylist>;
  viewMode?: "compact" | "grid" | "list";
  isCollapsed?: boolean;
}

export default function MediaItem({
  item,
  viewMode,
  isCollapsed = false,
}: MediaItemProps) {
  if (isCollapsed) {
    return (
      <div className="group relative aspect-square size-16 cursor-pointer overflow-hidden rounded-[0.5rem] bg-[#121212] p-2 transition-all hover:bg-[#2F2F2F]">
        <div className="relative h-full w-full overflow-hidden rounded-[0.5rem]">
          <Link href={`/playlist/${item.id}`}>
            <Image
              src={
                item.images && item.images.length > 0
                  ? (item.images[0].url ?? item.images[1]?.url)
                  : "/Placeholder-48x48.svg"
              }
              alt={item.name}
              fill
              sizes="5rem"
              className="rounded-[0.5rem] object-cover"
            />
          </Link>
        </div>
      </div>
    );
  }

  // Compact view - only title and type
  if (viewMode === "compact") {
    return (
      <div className="group cursor-pointer rounded-[0.5rem] px-2 py-1 hover:bg-zinc-700/50">
        <Link href={`/playlist/${item.id}`} className="flex items-center gap-2">
          <h3 className="truncate font-medium text-white">{item.name}</h3>
          <span className="text-xs text-zinc-400">Playlist</span>
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group cursor-pointer rounded-[1rem] p-2 transition-colors hover:bg-zinc-700/50",
        viewMode === "list" &&
          "line-clamp-1 flex w-full min-w-0 items-center gap-3",
        viewMode === "grid" && "flex-col items-start",
      )}
    >
      <div
        className={cn(
          "relative aspect-square overflow-hidden",
          viewMode === "list" && "h-12 w-12 flex-shrink-0",
          viewMode === "grid" && "w-full",
          "rounded-md",
        )}
      >
        <Link href={`/playlist/${item.id}`}>
          <Image
            src={
              item.images && item.images.length > 0
                ? (item.images[0].url ?? item.images[1]?.url)
                : "/Placeholder-48x48.svg"
            }
            alt={item.name}
            fill
            sizes={
              viewMode === "grid" ? "(max-width: 768px) 50vw, 33vw" : "5vw"
            }
            className="aspect-square rounded-[0.5rem] object-cover"
          />
          {viewMode !== "grid" && (
            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
              <button className="text-primary-foreground scale-0 transform rounded-full p-2 transition-transform group-hover:scale-100">
                <Play className="size-5 text-white" fill="white" />
              </button>
            </div>
          )}
        </Link>
      </div>

      {viewMode !== "grid" && (
        <div className={cn("flex min-w-0 flex-1 flex-col overflow-hidden")}>
          <Link href={`/playlist/${item.id}`}>
            <h3 className="truncate font-medium text-white">{item.name}</h3>
            <div className="flex items-center text-sm text-zinc-400">
              <span className="truncate">
                {item.public ? "Public" : "Private"}
              </span>
              <span className="mx-1 flex-shrink-0">•</span>
              <span className="flex items-center gap-1 truncate">
                <User className="h-3 w-3 flex-shrink-0" />
                {item.owner.display_name ?? "Unknown"}
              </span>
            </div>
          </Link>
        </div>
      )}

      {viewMode !== "grid" && (
        <div className="ml-auto flex-shrink-0 text-sm text-zinc-500">
          {item.tracks.total} songs
        </div>
      )}
    </div>
  );
}
