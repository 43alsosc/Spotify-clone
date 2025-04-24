import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Dot, Play, User } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils/cn";
import { SimplifiedPlaylistSchema } from "@/lib/validations/playlist";
import { ArtistSchema } from "@/lib/validations/artist";

type ViewMode = "compact" | "grid" | "list";

interface MediaItemProps {
  item: z.infer<typeof SimplifiedPlaylistSchema> | z.infer<typeof ArtistSchema>;
  viewMode?: ViewMode;
  isCollapsed?: boolean;
}

export default function MediaItem({
  item,
  viewMode,
  isCollapsed = false,
}: MediaItemProps) {
  const params = useParams();
  const id = params.id as string;

  const getImageUrl = () => {
    if (!item.images?.length) return "/Placeholder-48x48.svg";
    return (
      item.images[0].url ?? item.images[1]?.url ?? "/Placeholder-48x48.svg"
    );
  };

  const isArtist = item.type === "artist";
  const linkPath = isArtist ? `/artist/${item.id}` : `/playlist/${item.id}`;

  if (isCollapsed) {
    return (
      <div className="group relative aspect-square size-16 cursor-pointer overflow-hidden rounded-[0.5rem] bg-[#121212] p-2 transition-all hover:bg-[#2F2F2F] active:bg-black">
        <div className="relative h-full w-full overflow-hidden rounded-[0.5rem]">
          <Link href={linkPath}>
            <Image
              src={getImageUrl()}
              alt={item.name}
              fill
              sizes="5rem"
              className={cn(
                "object-cover",
                isArtist === true && "rounded-full",
                isArtist === false && "rounded-[0.5rem]",
              )}
            />
          </Link>
        </div>
      </div>
    );
  }

  if (viewMode === "compact") {
    return (
      <div className="group cursor-pointer rounded-[0.5rem] px-2 py-1 hover:bg-zinc-700/50 active:bg-black">
        <Link href={linkPath} className="flex items-center gap-2">
          <h3 className="truncate font-medium text-white">{item.name}</h3>
          <span className="text-xs text-zinc-400">
            {isArtist ? "Artist" : "Spilleliste"}
          </span>
        </Link>
      </div>
    );
  }

  const isCurrentItem =
    item.href ===
    `https://api.spotify.com/v1/${isArtist ? "artists" : "playlists"}/${id}`;

  return (
    <div
      className={cn(
        "group cursor-pointer rounded-[0.3rem] p-2 transition-colors hover:bg-[#1F1F1F] active:bg-black",
        viewMode === "list" && [
          "mx-auto line-clamp-1 flex w-[95%] min-w-0 items-center gap-3",
          isCurrentItem && "bg-[#2A2A2A] hover:bg-[#3A3A3A]",
        ],
        viewMode === "grid" && "flex-col items-start",
      )}
    >
      <div
        className={cn(
          "relative aspect-square overflow-hidden rounded-md",
          viewMode === "list" && "h-12 w-12 flex-shrink-0",
          viewMode === "grid" && "w-full",
        )}
      >
        <Link href={linkPath}>
          <Image
            src={getImageUrl()}
            alt={item.name}
            fill
            sizes={
              viewMode === "grid" ? "(max-width: 768px) 50vw, 33vw" : "5vw"
            }
            className={cn(
              "object-cover",
              isArtist === true && "rounded-full",
              isArtist === false && "rounded-[0.5rem]",
            )}
          />
          {viewMode !== "grid" && (
            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                className="text-primary-foreground scale-0 transform rounded-full p-2 transition-transform group-hover:scale-100"
                aria-label="Spill av"
              >
                <Play className="size-5 text-white" fill="white" />
              </button>
            </div>
          )}
        </Link>
      </div>

      {viewMode !== "grid" && (
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Link href={linkPath}>
            <h3 className="truncate font-medium text-white">{item.name}</h3>
            <div className="flex items-center text-sm text-zinc-400">
              <span className="truncate">
                {(item as z.infer<typeof SimplifiedPlaylistSchema>).type ===
                "playlist"
                  ? "Spilleliste"
                  : "Artist"}
              </span>
              {!isArtist && (
                <div className="flex items-center">
                  <Dot className="mx-1 size-4 flex-shrink-0" />
                  <span className="flex items-center gap-1 truncate">
                    <User className="h-3 w-3 flex-shrink-0" />
                    {(item as z.infer<typeof SimplifiedPlaylistSchema>).owner
                      .display_name ?? "Ukjent"}
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>
      )}

      {viewMode !== "grid" && !isArtist && (
        <div className="ml-auto flex-shrink-0 text-sm text-zinc-500">
          {(item as z.infer<typeof SimplifiedPlaylistSchema>).tracks.total}{" "}
          sanger
        </div>
      )}
    </div>
  );
}
