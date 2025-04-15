"use server";

import { auth } from "@/lib/auth";
import { getRequestWrapper } from "@/lib/get-request-wrapper";
import { headers } from "next/headers";
import { z } from "zod";
import { GetPlaylistPageSchema, GetPlaylistSchema } from "@/types/types";

export const getPlaylist = async (id: string) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Invalid request");
  }

  const data = await getRequestWrapper<z.infer<typeof GetPlaylistSchema>>(
    `/playlists/${id}`,
  );

  if (!data) {
    return null;
  }

  if (data.tracks.total > data.tracks.limit) {
    const numberOfPages = Math.ceil(data.tracks.total / data.tracks.limit);
    let nextPage = data.tracks.next;

    for (let i = 0; i < numberOfPages - 1; i++) {
      if (!nextPage) break;

      const nextData =
        await getRequestWrapper<z.infer<typeof GetPlaylistPageSchema>>(
          nextPage,
        );

      if (!nextData) {
        return data;
      }

      data.tracks.items.push(...nextData.items);
      nextPage = nextData.next;
    }
  }

  return data;
};
