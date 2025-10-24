import { getFoundItemTotals } from '@/lib/getFoundItemTotals';

const CATS = [
  { key:'STNK',       label:'STNK' },
  { key:'Handphone',  label:'Handphone' },
  { key:'Buku',       label:'Buku' },
  { key:'Kunci',      label:'Kunci' },
  { key:'Dompet',     label:'Dompet' },
  { key:'Laptop',     label:'Laptop' },
] as const;

export default async function FrequentFoundSection() {
  const totals = await getFoundItemTotals();

  return (
    <section aria-labelledby="frequent-items-title" className="py-24 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 id="frequent-items-title" className="text-4xl md:text-5xl font-bold mb-4">Barang Yang Sering Ditemukan</h2>
          <p className="text-gray-300 text-lg">Statistik barang hilang yang berhasil ditemukan di kampus kami</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATS.map(cat => (
            <article key={cat.key} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-center hover:bg-gray-800/70 transition-all hover:-translate-y-1">
              <div className="mx-auto mb-3 w-12 h-12 rounded-xl bg-gray-700/30 flex items-center justify-center" aria-hidden="true">★</div>
              <h3 className="text-xl font-semibold">{cat.label}</h3>
              <p className="text-sm text-gray-400">Jumlah yang ditemukan</p>
              <p className="text-4xl font-extrabold mt-1">{totals[cat.key as keyof typeof totals] ?? 0}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
