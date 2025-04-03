"use server";

import { auth } from "@/lib/auth";
import { getRequestWrapper } from "@/lib/get-request-wrapper";
import { Playlist } from "@/types/types";
import { headers } from "next/headers";

export const getCurrentUserPlaylist = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Invalid request");
  }

  console.log("Fetching users playlists");

  const data = await getRequestWrapper<{
    items: Playlist[];
  }>(`/me/playlists`);

  console.log("Playlists fetched", data);

  return data?.items;
};
