"use server";

import { auth } from "@/lib/auth";
import { getRequestWrapper } from "@/lib/get-request-wrapper";
import { GetUsersPlaylists } from "@/types/types";
import { headers } from "next/headers";
import { z } from "zod";

export const getCurrentUserPlaylist = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Invalid request");
  }

  const data =
    await getRequestWrapper<z.infer<typeof GetUsersPlaylists>>(`/me/playlists`);

  if (!data) {
    return null;
  }

  if (data.total > data.limit) {
    const nextPage = data.next;

    const nextData = await getRequestWrapper<z.infer<typeof GetUsersPlaylists>>(
      nextPage!,
    );

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
