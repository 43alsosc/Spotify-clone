import { getCurrentlyPlayingTrack } from "@/app/actions/getCurrentlyPlaying";
import { NextResponse } from "next/server";

export async function GET() {
  const response = await getCurrentlyPlayingTrack();

  return NextResponse.json(response);
}
