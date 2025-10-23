"use client";

import { getFoundItems, FoundItem } from '@/lib/getFoundItems';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import {
  Wallet,
  Smartphone,
  Book,
  Key,
  Headphones,
  Laptop,
  IdCard,
  MapPin,
  Clock
} from 'lucide-react';

const ICONS: Record<string, React.ReactElement> = {
  Dompet: <Wallet className="w-8 h-8 text-yellow-400" />,
  Handphone: <Smartphone className="w-8 h-8 text-green-400" />,
  Buku: <Book className="w-8 h-8 text-pink-400" />,
  Kunci: <Key className="w-8 h-8 text-blue-400" />,
  Headphone: <Headphones className="w-8 h-8 text-red-400" />,
  Laptop: <Laptop className="w-8 h-8 text-purple-400" />,
  STNK: <IdCard className="w-8 h-8 text-red-400" />,
};

export default function FoundItemsSection() {
  const [items, setItems] = useState<FoundItem[]>([]);

  useEffect(() => {
    getFoundItems().then(setItems);
  }, []);

  return (
    <section className="relative py-24 bg-white overflow-hidden" style={{contentVisibility: 'auto', containIntrinsicSize: '0 600px'}}>
      {/* Floating bubbles background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bubble-particle w-16 h-16 absolute top-20 left-10 animate-floatBubbles"></div>
        <div className="bubble-particle w-10 h-10 absolute top-40 right-20 animate-floatBubbles-delay"></div>
        <div className="bubble-particle w-12 h-12 absolute bottom-20 left-1/4 animate-floatBubbles"></div>
        <div className="bubble-particle w-8 h-8 absolute top-60 right-1/3 animate-floatBubbles-delay"></div>
        <div className="bubble-particle w-14 h-14 absolute bottom-40 right-10 animate-floatBubbles"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fadeInUp">
            Barang yang Ditemukan
          </h2>
          <p className="text-gray-600 text-lg">
            Barang-barang yang berhasil ditemukan dan dikembalikan kepada pemiliknya
          </p>
        </div>

        {items.length === 0 ? (
          <div className="p-6 bg-gray-50 rounded-xl shadow-sm text-gray-500 text-center">
            Belum ada barang ditemukan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 hover:scale-[1.02]"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-gray-100">
                    {ICONS[item.category] ?? <Wallet className="w-6 h-6 text-gray-300" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Ditemukan pada {format(new Date(item.found_date), "d MMM yyyy", { locale: id })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
