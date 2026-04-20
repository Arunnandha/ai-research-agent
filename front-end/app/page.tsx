import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-6 bg-zinc-50 p-6">
      <h1 className="text-center text-4xl font-bold text-zinc-900">AI Research Agent UI</h1>
      <p className="max-w-2xl text-center text-zinc-600">
        View daily pipeline outputs including summarized items, trend insights, and generated startup ideas.
      </p>
      <Link
        href="/dashboard"
        className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition hover:bg-zinc-700"
      >
        Open Dashboard
      </Link>
    </main>
  );
}
