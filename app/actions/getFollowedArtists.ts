"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getRequestWrapper } from "@/lib/get-request-wrapper";
import { GetFollowedArtistsSchema } from "@/lib/validations/artist";

export const getFollowedArtists = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Ugyldig forespørsel");
  }

  const data = await getRequestWrapper<
    z.infer<typeof GetFollowedArtistsSchema>
  >(`/me/following?type=artist`);

  if (!data) {
    return null;
  }

  if (data.artists.total > data.artists.limit) {
    const numberOfPages = Math.ceil(data.artists.total / data.artists.limit);
    let nextPage = data.artists.next;

    for (let i = 0; i < numberOfPages - 1; i++) {
      if (!nextPage) break;

      const nextData =
        await getRequestWrapper<z.infer<typeof GetFollowedArtistsSchema>>(
          nextPage,
        );

      if (!nextData) {
        return data;
      }

      data.artists.items.push(...nextData.artists.items);
      nextPage = nextData.artists.next;
    }
  }

  return data;
};
