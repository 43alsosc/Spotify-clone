"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getRequestWrapper } from "@/lib/get-request-wrapper";
import { GetRecentlyPlayedSchema } from "@/lib/validations/recently-played";

type GetRecentlyPlayedTracksParams = {
  limit?: number;
};

export const getRecentlyPlayedTracks = async ({
  limit = 20,
}: GetRecentlyPlayedTracksParams = {}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Ugyldig forespørsel");
  }

  const data = await getRequestWrapper<z.infer<typeof GetRecentlyPlayedSchema>>(
    `/me/player/recently-played?limit=${limit}`,
  );

  return data?.items;
};
