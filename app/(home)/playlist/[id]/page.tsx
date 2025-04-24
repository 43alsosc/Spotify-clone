import PlaylistHeader from "./playlist-header";
import { getPlaylist, getPlaylistDetails } from "@/app/actions/getPlaylist";
import { PlaylistTracks } from "./playlist-tracks";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";

type Params = Promise<{ id: string }>;

async function PlaylistTracksWrapper({ id }: { id: string }) {
  const tracks = await getPlaylist(id, 0, 20);

  if (!tracks) {
    return <div>Tracks not found</div>;
  }

  return <PlaylistTracks data={tracks} playlistId={id} />;
}

export default async function PlaylistPage(props: { params: Params }) {
  const params = await props.params;
  const id = params.id;

  const details = await getPlaylistDetails(id);

  if (!details) {
    return <div>Playlist not found</div>;
  }

  return (
    <div>
      <PlaylistHeader data={details} />
      <Suspense fallback={<LoadingTracks />}>
        <PlaylistTracksWrapper id={id} />
      </Suspense>
    </div>
  );
}

function LoadingTracks() {
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
      <div className="flex flex-wrap justify-center gap-4">
        <Skeleton className="h-15 w-full rounded-full p-2" />
        <Skeleton className="h-15 w-full rounded-full p-2" />
        <Skeleton className="h-15 w-full rounded-full p-2" />
        <Skeleton className="h-15 w-full rounded-full p-2" />
        <Skeleton className="h-15 w-full rounded-full p-2" />
        <Skeleton className="h-15 w-full rounded-full p-2" />
        <Skeleton className="h-15 w-full rounded-full p-2" />
        <Skeleton className="h-15 w-full rounded-full p-2" />
      </div>
    </div>
  );
}
