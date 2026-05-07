"use client";

import { useState } from "react";
import { Play, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import type { AgentReport } from "@/lib/reports";

interface Props {
  onSuccess: (result: { date: string; data: AgentReport }) => void;
}

export default function RunPipelineButton({ onSuccess }: Props) {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleRun = async () => {
    setStatus("running");
    setMessage("");
    try {
      const res = await fetch("/api/run", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setStatus("done");
        setMessage(`${json.itemCount} items processed`);
        onSuccess({
          date: new Date().toISOString().slice(0, 10),
          data: json.report as AgentReport,
        });
      } else {
        setStatus("error");
        setMessage(json.error ?? "Pipeline failed.");
      }
    } catch {
      setStatus("error");
      setMessage("Pipeline failed. Check server logs.");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleRun}
        disabled={status === "running"}
        className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 active:scale-[0.98] disabled:opacity-60"
      >
        {status === "running" ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Play size={14} />
        )}
        {status === "running" ? "Running…" : "Run Pipeline"}
      </button>
      {message && (
        <span className={`inline-flex items-center gap-1 text-xs font-medium ${
          status === "error" ? "text-red-500" : "text-emerald-600"
        }`}>
          {status === "error" ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
          {message}
        </span>
      )}
    </div>
  );
}
