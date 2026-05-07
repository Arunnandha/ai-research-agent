import { NextResponse } from "next/server";

import { runIntelligencePipeline } from "@/lib/agents";
import { log, saveDailyReport } from "@/lib/utils";

// Increase timeout for long-running LLM pipeline (requires Vercel Pro/Enterprise)
export const maxDuration = 300;

export async function POST(): Promise<NextResponse> {
  try {
    log("info", "Pipeline triggered via API.");
    const report = await runIntelligencePipeline({ maxItems: 12 });
    const reportPath = await saveDailyReport(report, new Date());
    log("info", `Pipeline completed. Report saved to ${reportPath}.`);
    return NextResponse.json({ success: true, reportPath, itemCount: report.items.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown failure";
    log("error", `Pipeline failed: ${message}`);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
