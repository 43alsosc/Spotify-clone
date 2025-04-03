"use client";

import { useEffect, useState } from "react";
import MediaItem from "../media-item";
import { getCurrentUserPlaylist } from "@/app/actions/getCurrentUserPlaylist";
import { Playlist } from "@/types/types";

interface MediaItemsListProps {
  viewMode: string;
}

export default function MediaItemsList({ viewMode }: MediaItemsListProps) {
  const [mediaItems, setMediaItems] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user playlists
  useEffect(() => {
    const fetchUserPlaylists = async () => {
      try {
        const response = await getCurrentUserPlaylist();
        if (!response) {
          return;
        }

        console.log(response);

        setMediaItems(response);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPlaylists();
  }, []);

  if (isLoading) {
    return <div className="p-4 text-zinc-400">Loading playlists...</div>;
  }

  if (mediaItems.length === 0) {
    return <div className="p-4 text-zinc-400">No playlists found</div>;
  }

  return (
    <div className="p-2">
      {mediaItems.map((item, index) => (
        <MediaItem
          key={index}
          item={item}
          viewMode={viewMode}
          isCollapsed={false}
        />
      ))}
    </div>
  );
}
