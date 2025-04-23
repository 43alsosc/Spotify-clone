"use server";

import { auth } from "@/lib/auth";
import { getRequestWrapper } from "@/lib/get-request-wrapper";
import { GetCurrentlyPlayingTrackSchema } from "@/types/types";
import { headers } from "next/headers";
import { z } from "zod";

export const getCurrentlyPlayingTrack = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Invalid request");
  }

  const data = await getRequestWrapper<
    z.infer<typeof GetCurrentlyPlayingTrackSchema>
  >("/me/player/currently-playing");

  if (!data) {
    return null;
  }

  return data;
};
