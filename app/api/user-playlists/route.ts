import { getCurrentUserPlaylist } from "@/app/actions/getCurrentUserPlaylist";
import { NextResponse } from "next/server";

export async function GET() {
  const response = await getCurrentUserPlaylist();

  return NextResponse.json(response);
}
