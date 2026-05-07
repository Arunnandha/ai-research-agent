import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-8 p-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900">
        <BarChart3 size={24} className="text-white" />
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          AI Research Agent
        </h1>
        <p className="mt-3 max-w-lg text-base leading-relaxed text-zinc-500">
          Daily intelligence reports with trend analysis, market gaps, and AI-generated startup ideas.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 active:scale-[0.98]"
      >
        Open Dashboard
        <ArrowRight size={14} />
      </Link>
    </main>
  );
}
