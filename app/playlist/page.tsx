"use client";

import samplePlaylistData from "@/lib/sample-playlist.json";
import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function PlaylistPage() {
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);

  const data = samplePlaylistData;

  return (
    <div className="h-full w-full overflow-y-auto rounded-[1rem] bg-[#121212]">
      <div
        className={`mx-8 flex h-1/3 items-center gap-4 bg-${samplePlaylistData.primary_color}`}
      >
        <Image
          src={samplePlaylistData.images[0]?.url || "/placeholder.svg"}
          alt={samplePlaylistData.name}
          width={150}
          height={150}
          className="h-[80%] w-auto rounded-sm"
        />
        <div>
          <p>
            {samplePlaylistData.public
              ? "Offentlig spilleliste"
              : "Privat spilleliste"}
          </p>
          <h1 className="text-foreground text-8xl font-bold">
            {samplePlaylistData.name}
          </h1>
        </div>
      </div>
      <div>
        {data.tracks.items.map((song, index) => (
          <div
            key={index}
            className="hover:bg-muted/50 grid grid-cols-12 items-center px-4 py-2 transition-colors"
            onMouseEnter={() => setHoveredSong(song.track.href)}
            onMouseLeave={() => setHoveredSong(null)}
          >
            <div className="col-span-1 flex items-center justify-center">
              {hoveredSong === song.track.href ? (
                <Play className="text-foreground h-4 w-4" />
              ) : (
                <span className="text-muted-foreground">{index + 1}</span>
              )}
            </div>
            <div className="col-span-6 flex items-center gap-3">
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image
                  src={song.track.album.images[0]?.url || "/placeholder.svg"}
                  alt={`${song.track.album.name} album cover`}
                  fill
                  className="rounded-sm object-cover"
                />
              </div>
              <div>
                <div className="text-foreground font-medium">
                  {song.track.name}
                </div>
                <div className="text-muted-foreground text-sm">
                  {song.track.artists[0].name}
                </div>
              </div>
            </div>
            <div className="text-muted-foreground col-span-3 hidden text-sm md:block">
              {song.track.album.name}
            </div>
            <div className="text-muted-foreground col-span-2 text-right text-sm">
              {(() => {
                const totalSeconds = Math.floor(song.track.duration_ms / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                if (hours > 0) {
                  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
                }
                return `${minutes}:${seconds.toString().padStart(2, "0")}`;
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
