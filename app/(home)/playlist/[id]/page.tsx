import { getPlaylist } from "@/app/actions/getPlaylist";
import { PlaylistEpisodeSchema, PlaylistTrackSchema } from "@/types/types";
import Image from "next/image";
import { Clock } from "lucide-react";
import PlaylistHeader from "./playlist-header";

export const formatDuration = (ms: number): string => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  const paddedSeconds = seconds.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedHours = hours.toString().padStart(2, "0");
  const paddedDays = days.toString().padStart(2, "0");

  if (days > 0) {
    return `${paddedDays}:${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  } else if (hours > 0) {
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  } else {
    return `${paddedMinutes}:${paddedSeconds}`;
  }
};

export default async function PlaylistPage({
  params,
}: {
  params: { id: string };
}) {
  const param = await params;
  const id = param.id;

  const data = await getPlaylist(id);

  if (!data) {
    return <div>Playlist not found</div>;
  }

  return (
    <div>
      <PlaylistHeader data={data} />

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
          {data.tracks.items.map((item, i) => {
            if (item.track.type === "track") {
              const parsedTrack = PlaylistTrackSchema.safeParse(item);

              if (!parsedTrack.success) {
                console.error(parsedTrack.error);
                return <div key={i}>Error parsing track</div>;
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
                return <div key={i}>Error parsing episode</div>;
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
    </div>
  );
}
