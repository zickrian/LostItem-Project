import Image from 'next/image';

function bucketFrom(title: string, category: string): 'STNK' | 'Handphone' | 'Buku' | 'Kunci' | 'Dompet' | 'Laptop' | 'Other' {
  const cat = category.toLowerCase();
  if (cat.includes('stnk')) return 'STNK';
  if (cat.includes('handphone') || cat.includes('hp') || cat.includes('phone')) return 'Handphone';
  if (cat.includes('buku') || cat.includes('book')) return 'Buku';
  if (cat.includes('kunci') || cat.includes('key')) return 'Kunci';
  if (cat.includes('dompet') || cat.includes('wallet')) return 'Dompet';
  if (cat.includes('laptop')) return 'Laptop';
  return 'Other';
}

const iconMap = {
  STNK: { src: '/icons/id-card.svg', bg: '#FECACA' },
  Handphone: { src: '/icons/phone.svg', bg: '#A7F3D0' },
  Buku: { src: '/icons/book.svg', bg: '#FBCFE8' },
  Kunci: { src: '/icons/key.svg', bg: '#BFDBFE' },
  Dompet: { src: '/icons/wallet.svg', bg: '#FEF08A' },
  Laptop: { src: '/icons/laptop.svg', bg: '#DDD6FE' },
  Other: { src: '/icons/box.svg', bg: '#E5E7EB' },
};

interface ItemIconProps {
  title: string;
  category: string;
}

export function ItemIcon({ title, category }: ItemIconProps) {
  const bucket = bucketFrom(title, category);
  const { src, bg } = iconMap[bucket];

  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center"
      style={{ backgroundColor: bg }}
    >
      <Image
        src={src}
        alt={bucket}
        width={24}
        height={24}
        className="text-gray-900"
      />
    </div>
  );
}
