import { NextResponse } from "next/server";

export async function GET() {
  try {
    const credentials = {
      maptilerApiKey: process.env.NEXT_PUBLIC_MAPTILER_API_KEY,
      maptilerMapIds: {
        outdoor: process.env.NEXT_PUBLIC_MAPTILER_MAP_ID_OUTDOOR,
        streets: process.env.NEXT_PUBLIC_MAPTILER_MAP_ID_STREETS,
        landscape: process.env.NEXT_PUBLIC_MAPTILER_MAP_ID_LANDSCAPE,
      },
    };

    return NextResponse.json(credentials);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch credentials", details: error },
      { status: 500 }
    );
  }
}
