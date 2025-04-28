"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  PlusCircle,
  Shuffle,
  SkipBack,
  Play,
  SkipForward,
  Repeat,
  Volume2,
  Maximize2,
  Pause,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { formatDuration } from "@/lib/utils/format-duration";
// import { formatDuration } from "@/lib/utils";

interface MusicPlayerProps {
  token: string;
}

export function MusicPlayer(props: MusicPlayerProps) {
  const [player, setPlayer] = useState<Spotify.Player | undefined>();

  const [isPaused, setIsPaused] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentTrack, setTrack] = useState<Spotify.Track | undefined>();
  const [position, setPosition] = useState(0);

  useEffect(() => {
    // Connect to Spotify Web Playback SDK
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Spotify Clone",
        getOAuthToken(cb) {
          cb(props.token);
        },
        volume: 0.5,
      });

      // Assign the player
      setPlayer(player);

      // Listen for when the player is ready
      player.addListener("ready", () => {
        setIsActive(true);
        // Aktiver elementet for å håndtere autoplay-restriksjoner
        player.activateElement();
      });

      // Listen for when the player is not ready
      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
        setIsActive(false);
      });

      // Lytt etter autoplay_failed event
      player.addListener("autoplay_failed", () => {
        console.log("Autoplay er ikke tillatt av nettleserens regler");
        // Prøv å aktivere elementet igjen
        player.activateElement();
      });

      // Listen for when the player state changes
      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        // Set the current track
        setTrack(state.track_window.current_track);
        setIsPaused(state.paused);

        // Listen for when the player is active
        player.getCurrentState().then((state) => {
          setIsActive(Boolean(state));
        });

        // Update the MediaSession API with the current track info
        if ("mediaSession" in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: state.track_window.current_track.name,
            artist: state.track_window.current_track.artists
              .map((artist) => artist.name)
              .join(", "),
            album: state.track_window.current_track.album.name,
            artwork: state.track_window.current_track.album.images.map(
              (image) => ({
                src: image.url,
                sizes: "512x512",
                type: "image/jpeg",
              }),
            ),
          });
        }
      });

      // Set up MediaSession API handlers
      if ("mediaSession" in navigator) {
        navigator.mediaSession.setActionHandler("play", () => {
          player.resume();
        });
        navigator.mediaSession.setActionHandler("pause", () => {
          player.pause();
        });
        navigator.mediaSession.setActionHandler("previoustrack", () => {
          player.previousTrack();
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
          player.nextTrack();
        });
        navigator.mediaSession.setActionHandler("seekto", (details) => {
          player.seek(details.seekTime!);
        });
      }

      // Add keyboard controls
      const handleKeyPress = (e: KeyboardEvent) => {
        // Check if focus is on an input or textarea
        if (
          document.activeElement?.tagName === "INPUT" ||
          document.activeElement?.tagName === "TEXTAREA"
        ) {
          return;
        }

        switch (e.code) {
          case "Space":
            e.preventDefault();
            player.togglePlay();
            break;
          case "MediaPlayPause":
            player.togglePlay();
            break;
          case "MediaTrackNext":
            player.nextTrack();
            break;
          case "MediaTrackPrevious":
            player.previousTrack();
            break;
        }
      };

      // Add event listener for keyboard controls
      document.addEventListener("keydown", handleKeyPress);
      player.connect();

      // Cleanup
      return () => {
        document.removeEventListener("keydown", handleKeyPress);
        player.disconnect();
      };
    };
  }, [props.token]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && player) {
        player.getCurrentState().then((state) => {
          if (state) {
            setPosition(state.position);
          }
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, player]);

  return (
    <footer className="sticky bottom-0 z-20 flex h-20 items-center justify-between bg-black px-4">
      <div className="flex w-1/3 items-center gap-3">
        <div className="relative size-14 flex-shrink-0 rounded bg-zinc-800">
          <Image
            src={currentTrack?.album.images[0].url || "Placeholder-48x48.svg"}
            alt={currentTrack?.name || ""}
            fill
            sizes="5vw"
            className="rounded"
          />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-white">
            {currentTrack?.name}
          </div>
          <div className="truncate text-xs text-zinc-400">
            {currentTrack?.artists.map((artist) => artist.name).join(", ")}
          </div>
        </div>
        <button className="p-1.5 text-zinc-400 transition-colors hover:text-white">
          <PlusCircle className="size-4" />
        </button>
      </div>

      <div className="flex w-1/3 flex-col items-center">
        <div className="flex items-center gap-4">
          <button className="p-1.5 text-zinc-400 transition-colors hover:text-white">
            <Shuffle className={`size-4 text-white`} />
          </button>
          <button
            className="p-1.5 text-zinc-400 transition-colors hover:text-white"
            onClick={() => {
              player?.previousTrack().then(() => {
                console.log("Previous");
              });
            }}
          >
            <SkipBack className="size-5 fill-zinc-400" />
          </button>
          {isPaused ? (
            <button
              className="rounded-full bg-white p-2 text-black transition-transform hover:scale-105"
              onClick={() => {
                player?.togglePlay();
                console.log("Play");
              }}
            >
              <Play className="size-5 fill-black" />
            </button>
          ) : (
            <button
              className="rounded-full bg-white p-2 text-black transition-transform hover:scale-105"
              onClick={() => {
                player?.togglePlay();
                console.log("Pause");
              }}
            >
              <Pause className="size-5 fill-black" />
            </button>
          )}
          <button
            className="p-1.5 text-zinc-400 transition-colors hover:text-white"
            onClick={() => {
              player?.nextTrack().then(() => {
                console.log("Next");
              });
            }}
          >
            <SkipForward className="size-5 fill-zinc-400" />
          </button>
          <button className="p-1.5 text-zinc-400 transition-colors hover:text-white">
            <Repeat className="size-4" />
          </button>
        </div>
        <div className="mt-1 flex w-full items-center gap-2">
          <span className="text-xs text-zinc-500">
            {formatDuration(position)}
          </span>
          <Slider
            value={[position]}
            min={0}
            max={currentTrack?.duration_ms}
            className="cursor-pointer"
            onValueChange={(values) => {
              player?.seek(values[0]);
              setPosition(values[0]);
            }}
          />
          <span className="text-xs text-zinc-500">
            {formatDuration(currentTrack?.duration_ms || 0)}
          </span>
        </div>
      </div>

      <div className="flex w-1/3 items-center justify-end gap-3">
        <button className="p-1.5 text-zinc-400 transition-colors hover:text-white">
          <Volume2 className="size-4" />
        </button>
        <div className="h-1 w-24 rounded-full bg-zinc-700">
          <div className="h-full w-1/2 rounded-full bg-zinc-400"></div>
        </div>
        <button className="p-1.5 text-zinc-400 transition-colors hover:text-white">
          <Maximize2 className="size-4" />
        </button>
      </div>
    </footer>
  );
}
