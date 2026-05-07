"use client";

interface FilterBarProps {
  categories: string[];
  complexities: string[];
  selectedCategory: string;
  selectedComplexity: string;
  onCategoryChange: (v: string) => void;
  onComplexityChange: (v: string) => void;
}

export default function FilterBar({
  categories,
  complexities,
  selectedCategory,
  selectedComplexity,
  onCategoryChange,
  onComplexityChange,
}: FilterBarProps) {
  const selectClass =
    "rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 outline-none transition focus:border-zinc-400";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)} className={selectClass}>
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select value={selectedComplexity} onChange={(e) => onComplexityChange(e.target.value)} className={selectClass}>
        <option value="">All complexity</option>
        {complexities.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}
