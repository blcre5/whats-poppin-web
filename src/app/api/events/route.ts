import { NextResponse } from "next/server";
import { getSheetEvents } from "../../sheets";

export const revalidate = 60;

export async function GET() {
  const result = await getSheetEvents();
  return NextResponse.json({
    source: result.source,
    count: result.events.length,
    error: result.error,
    events: result.events,
  });
}
