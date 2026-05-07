import { getLatestReport } from "@/lib/reports";
import { BarChart3, Calendar } from "lucide-react";
import RunPipelineButton from "./RunPipelineButton";
import DashboardContent from "./DashboardContent";

export default async function DashboardPage() {
  const latest = await getLatestReport();

  if (!latest) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-6 p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
          <BarChart3 size={28} className="text-zinc-400" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-semibold text-zinc-900">No reports yet</h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
            Run the pipeline to fetch data from your sources, analyze trends, and generate startup ideas.
          </p>
        </div>
        <RunPipelineButton />
      </main>
    );
  }

  const { date, data } = latest;

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            AI Research Dashboard
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-400">
            <Calendar size={13} />
            {date}
          </p>
        </div>
        <RunPipelineButton />
      </header>

      <DashboardContent data={data} />
    </main>
  );
}
