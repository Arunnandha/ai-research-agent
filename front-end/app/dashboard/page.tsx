import { getLatestReport } from "@/lib/reports";
import type { ReactNode } from "react";

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
    <h2 className="mb-3 text-lg font-semibold text-zinc-900">{title}</h2>
    {children}
  </section>
);

export default async function DashboardPage() {
  const latest = await getLatestReport();

  if (!latest) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-4 p-6">
        <h1 className="text-2xl font-bold text-zinc-900">AI Research Dashboard</h1>
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
          No reports found in `reports/`. Run your pipeline first to generate a daily report.
        </p>
      </main>
    );
  }

  const { date, data } = latest;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 bg-zinc-50 p-6">
      <header className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900">AI Research Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600">Latest report: {date}</p>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        <Section title="Trends">
          <ul className="space-y-2 text-sm text-zinc-700">
            {data.insight.trends.map((trend) => (
              <li key={trend} className="rounded-md bg-zinc-100 p-2">
                {trend}
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Market Gaps">
          <ul className="space-y-2 text-sm text-zinc-700">
            {data.insight.gaps.map((gap) => (
              <li key={gap} className="rounded-md bg-zinc-100 p-2">
                {gap}
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Observations">
          <ul className="space-y-2 text-sm text-zinc-700">
            {data.insight.observations.map((observation) => (
              <li key={observation} className="rounded-md bg-zinc-100 p-2">
                {observation}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="Generated Startup Ideas">
        <div className="grid gap-3 md:grid-cols-2">
          {data.ideas.map((idea) => (
            <article key={idea.name} className="rounded-lg border border-zinc-200 p-4">
              <h3 className="text-base font-semibold text-zinc-900">{idea.name}</h3>
              <p className="mt-2 text-sm text-zinc-700">{idea.description}</p>
              <p className="mt-2 text-sm text-zinc-600">
                <span className="font-medium">Target user:</span> {idea.target_user}
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                <span className="font-medium">Differentiation:</span> {idea.differentiation}
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                {idea.mvp_features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Summarized Items">
        <div className="space-y-3">
          {data.items.map((item) => (
            <article key={`${item.title}-${item.source}`} className="rounded-lg border border-zinc-200 p-4">
              <h3 className="text-base font-semibold text-zinc-900">{item.title}</h3>
              <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">{item.source}</p>
              <p className="mt-2 text-sm text-zinc-700">{item.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-600">
                <span className="rounded-full bg-zinc-100 px-2 py-1">Category: {item.category}</span>
                <span className="rounded-full bg-zinc-100 px-2 py-1">Model: {item.business_model}</span>
                <span className="rounded-full bg-zinc-100 px-2 py-1">
                  Complexity: {item.complexity}
                </span>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </main>
  );
}
