"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import {
  Heart,
  ListMusic,
  Maximize2,
  Mic2,
  MonitorSpeaker,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import Image from "next/image";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 217; // 3:37 in seconds

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex h-[90px] items-center justify-between border-t border-[#282828] bg-[#181818] px-4">
      <div className="flex w-[30%] min-w-[180px] items-center gap-3">
        <div className="relative h-14 w-14 overflow-hidden rounded-md">
          <Image
            src="/placeholder.svg?height=56&width=56"
            alt="Album cover"
            width={56}
            height={56}
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <h4 className="truncate text-sm font-medium text-white">
            Song Title
          </h4>
          <p className="truncate text-xs text-gray-400">Artist Name</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex w-[40%] max-w-[722px] flex-col items-center gap-2">
        <div className="flex items-center gap-5">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            size="icon"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:scale-105"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex w-full items-center gap-2">
          <span className="w-10 text-right text-xs text-gray-400">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            min={0}
            max={duration}
            step={1}
            onValueChange={(value) => setCurrentTime(value[0])}
            className="cursor-pointer"
          />
          <span className="w-10 text-xs text-gray-400">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="flex w-[30%] min-w-[180px] items-center justify-end gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <Mic2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <ListMusic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <MonitorSpeaker className="h-4 w-4" />
        </Button>
        <div className="flex w-24 items-center gap-2">
          <Volume2 className="h-4 w-4 text-gray-400" />
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0])}
            className="cursor-pointer"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
