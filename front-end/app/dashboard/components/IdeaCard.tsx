"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import Tag from "./Tag";

interface Idea {
  name: string;
  description: string;
  target_user: string;
  mvp_features: string[];
  differentiation: string;
}

export default function IdeaCard({ idea }: { idea: Idea }) {
  const [open, setOpen] = useState(false);

  const oneLiner =
    idea.description.length > 100
      ? idea.description.slice(0, 100).trimEnd() + "…"
      : idea.description;

  return (
    <div className="group rounded-xl border border-zinc-100 bg-white p-5 transition hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <Lightbulb size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-zinc-900">{idea.name}</h4>
          <p className="mt-1 text-sm leading-relaxed text-zinc-500">{oneLiner}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <Tag value={idea.target_user} />
          </div>
        </div>
      </div>

      {open && (
        <div className="mt-4 space-y-3 border-t border-zinc-100 pt-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Description</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600">{idea.description}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Differentiation</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600">{idea.differentiation}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">MVP Features</p>
            <ul className="mt-1 space-y-1">
              {idea.mvp_features.map((f) => (
                <li key={f} className="text-sm text-zinc-600">
                  <span className="mr-1.5 text-zinc-400">•</span>{f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="mt-3 flex items-center gap-1 text-xs font-medium text-zinc-500 transition hover:text-zinc-800"
      >
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {open ? "Hide details" : "View details"}
      </button>
    </div>
  );
}
