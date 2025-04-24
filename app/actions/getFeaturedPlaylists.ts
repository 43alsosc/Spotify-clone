"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getRequestWrapper } from "@/lib/get-request-wrapper";
import { GetFeaturedPlaylistsSchema } from "@/lib/validations/playlist";

type GetFeaturedPlaylistsResponse = {
  categories: z.infer<typeof GetFeaturedPlaylistsSchema>;
};

type GetFeaturedPlaylistsParams = {
  limit?: number;
};

export const getFeaturedPlaylists = async ({
  limit = 20,
}: GetFeaturedPlaylistsParams = {}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Ugyldig forespørsel");
  }

  const data = await getRequestWrapper<GetFeaturedPlaylistsResponse>(
    `/browse/categories?locale=no_NB&limit=${limit}`,
  );

  return data?.categories.items;
};
