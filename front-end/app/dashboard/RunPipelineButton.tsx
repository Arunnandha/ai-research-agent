"use client";

import { useState } from "react";
import { Play, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function RunPipelineButton() {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleRun = async () => {
    setStatus("running");
    setMessage("");
    try {
      const res = await fetch(`${BACKEND_API_URL}api/run`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setStatus("done");
        setMessage(`${data.itemCount} items processed`);
        setTimeout(() => router.refresh(), 1500);
      } else {
        setStatus("error");
        setMessage(data.error ?? "Pipeline failed.");
      }
    } catch {
      setStatus("error");
      setMessage("Backend unreachable. Is it running?");
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
