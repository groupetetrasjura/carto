import { NextResponse } from "next/server";

export async function GET() {
  try {
    const credentials = {
      maptilerApiKey: process.env.NEXT_PUBLIC_MAPTILER_API_KEY,
      maptilerMapId: process.env.NEXT_PUBLIC_MAPTILER_MAP_ID,
    };

    return NextResponse.json(credentials);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch credentials", details: error },
      { status: 500 }
    );
  }
}
