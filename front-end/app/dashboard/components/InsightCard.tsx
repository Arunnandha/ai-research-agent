"use client";

import type { LucideIcon } from "lucide-react";
import ExpandableList from "./ExpandableList";

interface InsightCardProps {
  title: string;
  icon: LucideIcon;
  items: string[];
  accent: string;
  previewCount?: number;
}

export default function InsightCard({ title, icon: Icon, items, accent, previewCount = 3 }: InsightCardProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-100 bg-white p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent}`}>
            <Icon size={16} />
          </div>
          <h3 className="text-sm font-semibold text-zinc-800">{title}</h3>
        </div>
        <p className="text-sm text-zinc-400">No data available yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-100 bg-white p-5 transition hover:shadow-md">
      <div className="flex items-center gap-2.5 mb-4">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent}`}>
          <Icon size={16} />
        </div>
        <h3 className="text-sm font-semibold text-zinc-800">{title}</h3>
        <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
          {items.length}
        </span>
      </div>
      <ExpandableList items={items} previewCount={previewCount} />
    </div>
  );
}
