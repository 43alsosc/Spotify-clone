"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { formatDuration } from "@/lib/utils/format-duration";
import {
  PlaylistTrackSchema,
  PlaylistEpisodeSchema,
  GetPlaylistTracksSchema,
} from "@/lib/validations/playlist";
import { getFullPlaylist } from "@/app/actions/getPlaylist";

type PlaylistTracksProps = {
  data: z.infer<typeof GetPlaylistTracksSchema>;
  playlistId: string;
};

export function PlaylistTracks({ data, playlistId }: PlaylistTracksProps) {
  const {
    data: fullPlaylist,
    isError,
    error,
  } = useQuery({
    queryKey: ["playlist-tracks", playlistId],
    queryFn: async () => {
      const result = await getFullPlaylist(playlistId);
      if (!result) throw new Error("Kunne ikke hente spilleliste");

      return result;
    },
    initialData: data,
  });

  if (isError) {
    console.error(error);
    return <div>Feil ved henting av spilleliste</div>;
  }

  if (!fullPlaylist) {
    return <div>Feil ved henting av spilleliste</div>;
  }

  return (
    <div className="px-6">
      <div className="mb-4 grid grid-cols-[50px_2fr_1fr_1fr_100px] items-center gap-4 border-b border-gray-800 pb-2 text-sm text-gray-400">
        <div>#</div>
        <div>Tittel</div>
        <div>Album</div>
        <div>Dato lagt til</div>
        <div className="flex justify-center">
          <Clock size={16} />
        </div>
      </div>

      <div className="space-y-2 rounded-[0.5rem]">
        {fullPlaylist.items.map((item, i) => {
          if (item.track.type === "track") {
            const parsedTrack = PlaylistTrackSchema.safeParse(item);

            if (!parsedTrack.success) {
              console.error(parsedTrack.error);
              return <div key={i}>Feil ved parsing av spor</div>;
            }

            const trackData = parsedTrack.data;
            const track = trackData.track;

            return (
              <div
                key={i}
                className="group grid grid-cols-[50px_2fr_1fr_1fr_100px] items-center gap-4 rounded-[0.5rem] p-2 hover:bg-gray-800/50"
              >
                <div className="text-gray-400">{i + 1}</div>
                <div className="flex items-center gap-4">
                  <Image
                    src={track.album.images[0].url}
                    alt={track.name}
                    width={40}
                    height={40}
                    className="rounded"
                  />
                  <div>
                    <p className="line-clamp-1 text-white group-hover:text-green-500">
                      {track.name}
                    </p>
                    <p className="line-clamp-1 text-sm text-gray-400">
                      {track.artists.map((artist) => artist.name).join(", ")}
                    </p>
                  </div>
                </div>
                <div className="line-clamp-1 text-gray-400">
                  {track.album.name}
                </div>
                <div className="text-gray-400">-</div>
                <div className="text-center text-gray-400">
                  {formatDuration(track.duration_ms)}
                </div>
              </div>
            );
          } else if (item.track.type === "episode") {
            const parsedEpisode = PlaylistEpisodeSchema.safeParse(item);

            if (!parsedEpisode.success) {
              console.error(parsedEpisode.error);
              return <div key={i}>Feil ved parsing av episode</div>;
            }

            const episodeData = parsedEpisode.data;
            const episode = episodeData.track;

            return (
              <div
                key={i}
                className="group grid grid-cols-[50px_2fr_1fr_1fr_100px] items-center gap-4 rounded-md p-2 hover:bg-gray-800/50"
              >
                <div className="text-gray-400">{i + 1}</div>
                <div className="flex items-center gap-4">
                  <Image
                    src={episode.images?.[0]?.url || "/Placeholder-48x48.svg"}
                    alt={episode.name}
                    width={40}
                    height={40}
                    className="rounded"
                  />
                  <div>
                    <p className="text-white group-hover:text-green-500">
                      {episode.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {episode.show?.name || "Ukjent show"}
                    </p>
                  </div>
                </div>
                <div className="text-gray-400">Podcast</div>
                <div className="text-gray-400">-</div>
                <div className="text-center text-gray-400">
                  {formatDuration(episode.duration_ms)}
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
