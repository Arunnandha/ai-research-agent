"use client";

export type TabKey = "overview" | "ideas" | "sources";

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "ideas", label: "Ideas" },
  { key: "sources", label: "Sources" },
];

export default function TabNav({ active, onChange }: { active: TabKey; onChange: (tab: TabKey) => void }) {
  return (
    <nav className="flex gap-1 rounded-lg bg-zinc-100 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            active === tab.key
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
