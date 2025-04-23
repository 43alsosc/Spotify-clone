"use client";

import {
  Maximize2,
  Play,
  PlusCircle,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import Image from "next/image";
import { formatDuration } from "@/utils/format-duration";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { getCurrentlyPlayingTrack } from "@/app/actions/getCurrentlyPlaying";

export function MusicPlayer() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["currently-playing-track"],
    queryFn: () => getCurrentlyPlayingTrack(),
    refetchInterval: 1000,
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (data?.is_playing) {
      // Set initial progress
      setProgress(data.progress_ms || 0);

      // Update progress every second
      const timer = setInterval(() => {
        setProgress((prev) => Math.min(prev + 1000, data.item.duration_ms));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [data?.is_playing, data?.progress_ms, data?.item.duration_ms]);

  if (!data) {
    return <div>No data</div>;
  }

  if (error) {
    console.error("Error fetching currently playing track:", error);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <footer className="sticky bottom-0 z-20 flex h-20 items-center justify-between bg-black px-4">
      <div className="flex w-1/3 items-center gap-3">
        <div className="relative size-14 flex-shrink-0 rounded bg-zinc-800">
          <Image
            src={
              data?.item.type === "track"
                ? data?.item.album.images[0].url
                : data?.item.images[0].url || "Placeholder-48x48.svg"
            }
            alt={data?.item.name || ""}
            fill
            sizes="5vw"
            className="rounded"
          />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-white">
            {data?.item.name}
          </div>
          <div className="truncate text-xs text-zinc-400">
            {data?.item.type === "track"
              ? data?.item.artists.map((artist) => artist.name).join(", ")
              : ""}
          </div>
        </div>
        <button className="p-1.5 text-zinc-400 transition-colors hover:text-white">
          <PlusCircle className="h-4 w-4" />
        </button>
      </div>

      <div className="flex w-1/3 flex-col items-center">
        <div className="flex items-center gap-4">
          <button className="p-1.5 text-zinc-400 transition-colors hover:text-white">
            <Shuffle className={`h-4 w-4 text-white`} />
          </button>
          <button className="p-1.5 text-zinc-400 transition-colors hover:text-white">
            <SkipBack className="h-4 w-4" />
          </button>
          <button className="rounded-full bg-white p-2 text-black transition-transform hover:scale-105">
            <Play className="h-5 w-5 fill-black" />
          </button>
          <button className="p-1.5 text-zinc-400 transition-colors hover:text-white">
            <SkipForward className="h-4 w-4" />
          </button>
          <button className="p-1.5 text-zinc-400 transition-colors hover:text-white">
            <Repeat className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-1 flex w-full items-center gap-2">
          <span className="text-xs text-zinc-500">
            {formatDuration(data?.progress_ms || 0)}
          </span>
          <Slider
            value={[progress]}
            min={0}
            max={data?.item.duration_ms || 100}
            className="cursor-pointer"
            onValueChange={(values) => {
              setProgress(values[0]);
              // Update the progress of the currently playing track
            }}
          />
          <span className="text-xs text-zinc-500">
            {formatDuration(data?.item.duration_ms || 0)}
          </span>
        </div>
      </div>

      <div className="flex w-1/3 items-center justify-end gap-3">
        <button className="p-1.5 text-zinc-400 transition-colors hover:text-white">
          <Volume2 className="h-4 w-4" />
        </button>
        <div className="h-1 w-24 rounded-full bg-zinc-700">
          <div className="h-full w-1/2 rounded-full bg-zinc-400"></div>
        </div>
        <button className="p-1.5 text-zinc-400 transition-colors hover:text-white">
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </footer>
  );
}
