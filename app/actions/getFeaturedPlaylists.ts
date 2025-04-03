"use server";

import { auth } from "@/lib/auth";
import { getRequestWrapper } from "@/lib/get-request-wrapper";
import { Category } from "@/types/types";
import { headers } from "next/headers";

export const getFeaturedPlaylists = async (limit: number = 20) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Invalid request");
  }

  const data = await getRequestWrapper<{
    categories: Category;
  }>(`/browse/categories?locale=no_NB&limit=${limit}`);

  return data?.categories.items;
};
