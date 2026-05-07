"use client";

const colorMap: Record<string, string> = {
  SaaS: "bg-blue-50 text-blue-700 border-blue-200",
  API: "bg-purple-50 text-purple-700 border-purple-200",
  "open source": "bg-green-50 text-green-700 border-green-200",
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-red-50 text-red-700 border-red-200",
};

const fallback = "bg-zinc-50 text-zinc-600 border-zinc-200";

export default function Tag({ label, value }: { label?: string; value: string }) {
  const colors = colorMap[value] ?? fallback;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors}`}>
      {label ? `${label}: ` : ""}{value}
    </span>
  );
}
