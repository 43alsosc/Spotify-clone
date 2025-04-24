"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getRequestWrapper } from "@/lib/get-request-wrapper";
import { TrackSchema } from "@/lib/validations/track";
import { ArtistSchema } from "@/lib/validations/artist";
import { TimeRange, ItemType } from "@/lib/validations/top-items";

type GetTopItemsParams = {
  timeRange?: TimeRange;
  limit?: number;
  type?: ItemType;
};

type TopItemsResponse<T extends ItemType> = {
  items: T extends "artists"
    ? z.infer<typeof ArtistSchema>[]
    : z.infer<typeof TrackSchema>[];
  total: number;
  limit: number;
  offset: number;
};

export const getTopTracksAndArtists = async ({
  timeRange = "short_term",
  limit = 50,
  type = "artists",
}: GetTopItemsParams = {}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Ugyldig forespørsel");
  }

  const data = await getRequestWrapper<TopItemsResponse<typeof type>>(
    `/me/top/${type}?time_range=${timeRange}&limit=${limit}`,
  );

  return data;
};
