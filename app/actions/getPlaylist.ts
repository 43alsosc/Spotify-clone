"use server";

import { auth } from "@/lib/auth";
import { getRequestWrapper } from "@/lib/get-request-wrapper";
import { headers } from "next/headers";
import { z } from "zod";
import {
  GetPlaylistPageSchema,
  GetPlaylistTracksSchema,
  playlistDetailsSchema,
} from "@/types/types";

export const getPlaylistDetails = async (id: string) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Invalid request");
  }

  const data = await getRequestWrapper<z.infer<typeof playlistDetailsSchema>>(
    `playlists/${id}?fields=collaborative%2Cdescription%2Cimages%2Cid%2Cname%2Cowner%2Cpublic%2Ctype%2Ctracks%28total%29`,
  );

  if (!data) {
    return null;
  }

  return data;
};

export const getPlaylist = async (
  id: string,
  offset: number,
  limit: number,
) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Invalid request");
  }

  const data = await getRequestWrapper<z.infer<typeof GetPlaylistTracksSchema>>(
    `/playlists/${id}/tracks?offset=${offset}&limit=${limit}`,
  );

  if (!data) {
    return null;
  }

  return data;
};

export const getFullPlaylist = async (id: string) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Invalid request");
  }

  const data = await getRequestWrapper<z.infer<typeof GetPlaylistTracksSchema>>(
    `/playlists/${id}/tracks`,
  );

  if (!data) {
    return null;
  }

  if (data.total > data.limit) {
    const numberOfPages = Math.ceil(data.total / data.limit);
    let nextPage = data.next;

    for (let i = 0; i < numberOfPages - 1; i++) {
      if (!nextPage) break;

      const nextData =
        await getRequestWrapper<z.infer<typeof GetPlaylistPageSchema>>(
          nextPage,
        );

      if (!nextData) {
        return data;
      }

      data.items.push(...nextData.items);
      nextPage = nextData.next;
    }
  }

  return data;
};
