"use client";

import { useMemo, useState } from "react";
import { TrendingUp, Target, Eye } from "lucide-react";
import type { AgentReport } from "@/lib/reports";
import TabNav, { type TabKey } from "./components/TabNav";
import InsightCard from "./components/InsightCard";
import IdeaCard from "./components/IdeaCard";
import ItemCard from "./components/ItemCard";
import FilterBar from "./components/FilterBar";

export default function DashboardContent({ data }: { data: AgentReport }) {
  const [tab, setTab] = useState<TabKey>("overview");
  const [category, setCategory] = useState("");
  const [complexity, setComplexity] = useState("");

  const categories = useMemo(
    () => [...new Set(data.items.map((i) => i.category))].sort(),
    [data.items],
  );
  const complexities = useMemo(
    () => [...new Set(data.items.map((i) => i.complexity))].sort(),
    [data.items],
  );

  const filteredItems = useMemo(
    () =>
      data.items.filter(
        (i) =>
          (!category || i.category === category) &&
          (!complexity || i.complexity === complexity),
      ),
    [data.items, category, complexity],
  );

  return (
    <div className="space-y-6">
      <TabNav active={tab} onChange={setTab} />

      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-3">
            <InsightCard
              title="Trends"
              icon={TrendingUp}
              items={data.insight.trends}
              accent="bg-blue-50 text-blue-600"
              previewCount={2}
            />
            <InsightCard
              title="Market Gaps"
              icon={Target}
              items={data.insight.gaps}
              accent="bg-rose-50 text-rose-600"
              previewCount={2}
            />
            <InsightCard
              title="Observations"
              icon={Eye}
              items={data.insight.observations}
              accent="bg-violet-50 text-violet-600"
              previewCount={2}
            />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-800">Top Ideas</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {data.ideas.slice(0, 4).map((idea) => (
                <IdeaCard key={idea.name} idea={idea} />
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "ideas" && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-800">
            All Startup Ideas
            <span className="ml-2 text-xs font-normal text-zinc-400">{data.ideas.length} ideas</span>
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {data.ideas.map((idea) => (
              <IdeaCard key={idea.name} idea={idea} />
            ))}
          </div>
        </div>
      )}

      {tab === "sources" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-800">
              Summarized Items
              <span className="ml-2 text-xs font-normal text-zinc-400">{filteredItems.length} items</span>
            </h3>
            <FilterBar
              categories={categories}
              complexities={complexities}
              selectedCategory={category}
              selectedComplexity={complexity}
              onCategoryChange={setCategory}
              onComplexityChange={setComplexity}
            />
          </div>
          {filteredItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-400">No items match the selected filters.</p>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <ItemCard key={`${item.title}-${item.source}`} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
