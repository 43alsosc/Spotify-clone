"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getRequestWrapper } from "@/lib/get-request-wrapper";
import { GetUsersPlaylistsSchema } from "@/lib/validations/playlist";

export const getCurrentUserPlaylist = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Ugyldig forespørsel");
  }

  const data =
    await getRequestWrapper<z.infer<typeof GetUsersPlaylistsSchema>>(
      `/me/playlists`,
    );

  if (!data) {
    return null;
  }

  if (data.total > data.limit) {
    const nextPage = data.next;

    const nextData = await getRequestWrapper<
      z.infer<typeof GetUsersPlaylistsSchema>
    >(nextPage!);

    if (!nextData) {
      return data;
    }

    return {
      ...data,
      items: [...data.items, ...nextData.items],
    };
  }

  return data;
};
