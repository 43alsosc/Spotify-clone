import { NextResponse } from "next/server";
import { getCurrentUserPlaylist } from "@/app/actions/getCurrentUserPlaylist";
import { GetUsersPlaylistsSchema } from "@/lib/validations/playlist";

export async function GET() {
  try {
    const response = await getCurrentUserPlaylist();

    if (!response) {
      return NextResponse.json(
        { error: "Ingen spillelister funnet" },
        { status: 404 },
      );
    }

    const validatedResponse = GetUsersPlaylistsSchema.parse(response);
    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error("Feil ved henting av spillelister:", error);
    return NextResponse.json(
      { error: "Kunne ikke hente spillelister" },
      { status: 500 },
    );
  }
}
