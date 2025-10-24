import { Target, ShieldCheck, Users, Mail } from "lucide-react";
import { Reveal, RevealStagger } from "./Reveal";

const TEAM = [
  {
    name: "Firdaus Khotibul Zickrian",
    role: "Pengembang Sisi Admin & Database",
    initials: "FZ",
  },
  {
    name: "Amanda Devyana",
    role: "UI/UX Designer & Ide Konseptual",
    initials: "AD",
  },
  {
    name: "Maulida Cahya Kurnia",
    role: "Pengembang Landing Page & Integrasi Statistik",
    initials: "MC",
  },
  {
    name: "Andika Apriyanto",
    role: "Perancang Fitur & Ide Konseptual",
    initials: "AA",
  },
  {
    name: "Ryandika Syauqi Ramadhani",
    role: "Penulis Dokumentasi & Jurnal Tim",
    initials: "RS",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-white">
      {/* Background gelembung lembut */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-sky-100 blur-2xl" />
        <div className="absolute top-24 right-10 h-28 w-28 rounded-full bg-indigo-100 blur-xl" />
        <div className="absolute bottom-10 left-1/3 h-24 w-24 rounded-full bg-blue-100 blur-xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-24">
        {/* Header */}
        <div className="relative z-10 text-center mb-12">
          <Reveal as="h2" preset="fadeUp" className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Tentang Kami
          </Reveal>
          <Reveal as="p" preset="slideLeft" delay={0.1} className="mt-4 text-slate-500 text-base md:text-lg">
            Kami adalah tim pengembang muda dari Universitas Dian Nuswantoro
            yang berkolaborasi membangun <strong>SITEMU</strong> -
            sistem Lost &amp; Found kampus berbasis digital dengan pendekatan
            kolaboratif dan modern.
          </Reveal>
        </div>

        {/* Dua kolom: deskripsi + tim */}
        <div className="grid gap-10 md:grid-cols-2">
          {/* Visi / Nilai */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl font-semibold text-slate-900">Visi Kami</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Menghadirkan solusi digital untuk mempermudah proses pelaporan dan
              penemuan barang hilang di lingkungan kampus UDINUS, dengan fokus
              pada keamanan data, kemudahan penggunaan, dan kecepatan akses.
            </p>

            <ul className="mt-6 space-y-4">
              <li className="flex gap-3">
                <Target className="h-5 w-5 text-indigo-500 mt-1" />
                <div>
                  <p className="font-medium text-slate-900">Fokus Pengguna</p>
                  <p className="text-slate-600 text-sm">
                    Desain yang mudah dipahami dengan pengalaman pengguna yang
                    efisien dan cepat.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-500 mt-1" />
                <div>
                  <p className="font-medium text-slate-900">Keamanan Data</p>
                  <p className="text-slate-600 text-sm">
                    Kami memastikan keamanan informasi pengguna melalui sistem
                    yang terpercaya.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <Users className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <p className="font-medium text-slate-900">Kolaborasi Tim</p>
                  <p className="text-slate-600 text-sm">
                    Setiap anggota berperan penting dalam membangun sistem ini
                    secara profesional dan solid.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Tim */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Tim Pengembang SITEMU
            </h3>
            <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {TEAM.map((member, i) => (
                <Reveal key={member.name} preset="zoom" delay={i * 0.05}>
                  <div className="bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white font-semibold text-lg">
                      {member.initials}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                    <p className="text-sky-600 font-medium">{member.role}</p>
                  </div>
                </Reveal>
              ))}
            </RevealStagger>

            <div className="mt-8 text-center">
              <a
                href="mailto:sitemuDinus@dinus.ac.id"
                className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2 text-white font-medium shadow-sm hover:bg-sky-700 transition"
              >
                <Mail className="h-4 w-4" />
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
