import { NextResponse } from "next/server";

import { triggerPipelineRun } from "@/lib/backend";

export async function POST(): Promise<NextResponse> {
  try {
    const result = await triggerPipelineRun();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown failure";
    return NextResponse.json(
      { success: false, error: `Backend unreachable: ${message}` },
      { status: 502 },
    );
  }
}
