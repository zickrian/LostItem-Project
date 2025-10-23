"use client";

import { MapPin, Clock, FileBadge, Wallet, Smartphone, Book, Key, Headphones, Laptop, IdCard } from "lucide-react";
import Pagination from "@/components/Pagination";

type Item = { id: string; name: string; category: string; location: string; found_date: string; };

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  STNK: IdCard,
  Dompet: Wallet,
  Handphone: Smartphone,
  Buku: Book,
  Kunci: Key,
  Headphone: Headphones,
  Laptop: Laptop,
};

const ICON_BG: Record<string, string> = {
  STNK: "bg-rose-200",
  Dompet: "bg-yellow-300",
  Handphone: "bg-emerald-200",
  Buku: "bg-pink-200",
  Kunci: "bg-sky-200",
  Headphone: "bg-rose-200",
  Laptop: "bg-violet-200",
  Lainnya: "bg-slate-200",
};

function guessDisplayCategory(raw: string): string {
  const s = (raw || "").toLowerCase();
  if (s.includes("stnk") || s.includes("id")) return "STNK";
  if (s.includes("dompet") || s.includes("wallet") || s.includes("tas")) return "Dompet";
  if (s.includes("hp") || s.includes("handphone") || s.includes("phone")) return "Handphone";
  if (s.includes("buku") || s.includes("book")) return "Buku";
  if (s.includes("kunci") || s.includes("key")) return "Kunci";
  if (s.includes("headphone") || s.includes("ear") || s.includes("headset")) return "Headphone";
  if (s.includes("laptop") || s.includes("notebook")) return "Laptop";
  return "Lainnya";
}

export default function FoundItemsSection({
  data,
  page,
}: {
  data: { items: Item[]; totalPages: number };
  page: number;
}) {
  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <section
      id="found-items"
      aria-labelledby="found-items-title"
      className="relative bg-gradient-to-b from-[#eef4ff] via-white to-white py-14 md:py-16 pb-8 overflow-hidden"
    >
      {/* gelembung latar (ringan, sama feel dengan beranda) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bubble bubble-lg top-10 left-12" />
        <div className="bubble bubble-md top-24 right-20" style={{ animationDelay: '2s' }} />
        <div className="bubble bubble-lg bottom-16 left-1/4" style={{ animationDelay: '4s' }} />
        <div className="bubble bubble-sm top-2/3 right-1/3" style={{ animationDelay: '6s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="relative z-10 text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Barang yang Ditemukan
          </h2>
          <p className="mt-4 text-slate-500 text-base md:text-lg">
            Barang-barang yang berhasil ditemukan dan dikembalikan kepada pemiliknya
          </p>
        </div>

        {/* kosong */}
        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-slate-50 text-center py-12 text-slate-500 border border-slate-200">
            Belum ada barang ditemukan.
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {items.map((it) => {
                const label = guessDisplayCategory(it.category || it.name || "");
                const Icon = ICONS[label] ?? FileBadge;
                const bg = ICON_BG[label] ?? ICON_BG.Lainnya;

                return (
                  <article
                    key={it.id}
                    className="group relative bg-white rounded-2xl shadow-lg p-6 border border-slate-100 hover:-translate-y-1 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-slate-900" aria-hidden="true" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-lg md:text-xl font-semibold text-slate-900 truncate">
                          {it.name}
                        </h3>

                        <div className="mt-2 flex items-center gap-5 text-slate-600 text-sm">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" aria-hidden="true" />
                            {it.location || "-"}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-4 h-4" aria-hidden="true" />
                            {new Date(it.found_date).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ring hover */}
                    <div className="absolute inset-0 rounded-2xl ring-0 ring-sky-200/50 group-hover:ring-8 transition" />
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 mb-0 flex justify-center">
                <Pagination totalPages={totalPages} currentPage={page} />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
