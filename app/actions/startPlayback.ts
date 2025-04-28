"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

type StartPlaybackParams = {
  uris?: string[];
  context_uri?: string;
  offset?: {
    position?: number;
    uri?: string;
  };
  position_ms?: number;
};

export const startPlayback = async (params: StartPlaybackParams) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Ugyldig forespørsel");
  }

  const response = await fetch("https://api.spotify.com/v1/me/player/play", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Kunne ikke starte avspilling");
  }

  return true;
};
