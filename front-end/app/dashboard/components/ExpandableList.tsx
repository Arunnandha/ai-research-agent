"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableListProps {
  items: string[];
  previewCount?: number;
  renderItem?: (item: string, index: number) => React.ReactNode;
}

const truncate = (text: string, max = 120) =>
  text.length > max ? text.slice(0, max).trimEnd() + "…" : text;

export default function ExpandableList({ items, previewCount = 3, renderItem }: ExpandableListProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, previewCount);
  const hasMore = items.length > previewCount;

  return (
    <div className="space-y-2">
      {visible.map((item, i) =>
        renderItem ? (
          renderItem(item, i)
        ) : (
          <p key={i} className="text-sm leading-relaxed text-zinc-600">
            <span className="mr-1.5 text-zinc-400">•</span>
            {truncate(item)}
          </p>
        ),
      )}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 flex items-center gap-1 text-xs font-medium text-zinc-500 transition hover:text-zinc-800"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? "Show less" : `Show ${items.length - previewCount} more`}
        </button>
      )}
    </div>
  );
}
