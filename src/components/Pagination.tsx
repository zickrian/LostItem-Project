"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({
  totalPages,
  currentPage,
  maxButtons = 7,
}: {
  totalPages: number;
  currentPage: number;
  maxButtons?: number;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const goto = (n: number) => {
    const p = Math.min(Math.max(n, 1), Math.max(totalPages, 1));
    const params = new URLSearchParams(sp);
    params.set("page", String(p));
    router.push("?" + params.toString(), { scroll: false }); // tidak full refresh
  };

  if (!totalPages || totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, maxButtons) }, (_, i) => i + 1);

  return (
    <nav className="mt-8 flex items-center justify-center gap-2">
      <button onClick={() => goto(currentPage - 1)} disabled={currentPage <= 1}
        className="px-3 py-1.5 rounded-lg border bg-white disabled:opacity-40">Prev</button>

      {pages.map(n => (
        <button key={n} onClick={() => goto(n)}
          aria-current={n === currentPage ? "page" : undefined}
          className={`px-3 py-1.5 rounded-lg border ${
            n === currentPage ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}>
          {n}
        </button>
      ))}

      <button onClick={() => goto(currentPage + 1)} disabled={currentPage >= totalPages}
        className="px-3 py-1.5 rounded-lg border bg-white disabled:opacity-40">Next</button>
    </nav>
  );
}
