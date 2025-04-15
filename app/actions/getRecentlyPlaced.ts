"use server";

import { auth } from "@/lib/auth";
import { getRequestWrapper } from "@/lib/get-request-wrapper";
import { GetRecentlyPlayed } from "@/types/types";
import { headers } from "next/headers";
import { z } from "zod";

export const getRecentlyPlayedTracks = async (limit: number = 20) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Invalid request");
  }

  const data = await getRequestWrapper<z.infer<typeof GetRecentlyPlayed>>(
    `/me/player/recently-played?limit=${limit}`,
  );

  return data?.items;
};
