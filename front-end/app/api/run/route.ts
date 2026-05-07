import { NextResponse } from "next/server";

import { runIntelligencePipeline } from "@/lib/agents";
import { log } from "@/lib/utils";

export const maxDuration = 300;

export async function POST(): Promise<NextResponse> {
  try {
    log("info", "Pipeline triggered via API.");
    const report = await runIntelligencePipeline({ maxItems: 12 });
    log("info", `Pipeline completed. ${report.items.length} items processed.`);
    return NextResponse.json({ success: true, report, itemCount: report.items.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown failure";
    log("error", `Pipeline failed: ${message}`);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
