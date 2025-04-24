import { NextResponse } from "next/server";
import { getCurrentlyPlayingTrack } from "@/app/actions/getCurrentlyPlaying";
import { GetCurrentlyPlayingTrackSchema } from "@/lib/validations/currently-playing";

export async function GET() {
  try {
    const response = await getCurrentlyPlayingTrack();

    if (!response) {
      return NextResponse.json(
        { error: "Ingen spor spilles for øyeblikket" },
        { status: 404 },
      );
    }

    const validatedResponse = GetCurrentlyPlayingTrackSchema.parse(response);
    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error("Feil ved henting av nåværende spor:", error);
    return NextResponse.json(
      { error: "Kunne ikke hente nåværende spor" },
      { status: 500 },
    );
  }
}
