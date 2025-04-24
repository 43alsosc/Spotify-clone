"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getRequestWrapper } from "@/lib/get-request-wrapper";
import { GetCurrentlyPlayingTrackSchema } from "@/lib/validations/currently-playing";

export const getCurrentlyPlayingTrack = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Ugyldig forespørsel");
  }

  const data = await getRequestWrapper<
    z.infer<typeof GetCurrentlyPlayingTrackSchema>
  >("/me/player/currently-playing");

  if (!data) {
    return null;
  }

  return data;
};
