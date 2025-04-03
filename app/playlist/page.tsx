import samplePlaylistData from "@/lib/sample-playlist.json";
import Image from "next/image";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Dot } from "lucide-react";

export default function PlaylistPage() {
  const formattedData = samplePlaylistData.tracks.items.map((item) => ({
    title: item.track.name,
    album: item.track.album.name,
    dateAdded: new Date(item.added_at).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    duration: (() => {
      const totalSeconds = Math.floor(item.track.duration_ms / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    })(),
    artists: item.track.artists.map((artist) => artist.name).join(", "),
    image:
      item.track.album.images[2]?.url ||
      item.track.album.images[1]?.url ||
      item.track.album.images[0]?.url ||
      "/Placeholder-48x48.svg",
  }));

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
        <div className="flex h-[80%] flex-col justify-between">
          <div className="flex h-full flex-col justify-center">
            <p>
              {samplePlaylistData.public
                ? "Offentlig spilleliste"
                : "Privat spilleliste"}
            </p>
            <h1 className="text-foreground text-8xl font-bold">
              {samplePlaylistData.name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <p>{samplePlaylistData.owner.display_name}</p>
            <span>
              <Dot className="size-4" />
            </span>
            <p>
              {samplePlaylistData.tracks.items.length} låter,{" "}
              {(() => {
                const totalMinutes = Math.floor(
                  samplePlaylistData.tracks.items.reduce(
                    (acc, item) => acc + item.track.duration_ms / 1000,
                    0,
                  ) / 60,
                );
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                return `${hours} t ${minutes} min`;
              })()}
            </p>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={formattedData} />
    </div>
  );
}
