"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Tag from "./Tag";

interface Item {
  title: string;
  description: string;
  source: string;
  summary: string;
  problem: string;
  target_user: string;
  category: string;
  business_model: string;
  complexity: string;
}

export default function ItemCard({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);

  const oneLiner =
    item.summary.length > 100
      ? item.summary.slice(0, 100).trimEnd() + "…"
      : item.summary;

  return (
    <div className="group rounded-xl border border-zinc-100 bg-white px-5 py-4 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-semibold text-zinc-900">{item.title}</h4>
            <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              {item.source}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-zinc-500">{oneLiner}</p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="shrink-0 rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
        >
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <Tag label="Category" value={item.category} />
        <Tag label="Model" value={item.business_model} />
        <Tag label="Complexity" value={item.complexity} />
      </div>

      {open && (
        <div className="mt-3 space-y-2 border-t border-zinc-100 pt-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Summary</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600">{item.summary}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Problem</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600">{item.problem}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Target User</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600">{item.target_user}</p>
          </div>
        </div>
      )}
    </div>
  );
}
