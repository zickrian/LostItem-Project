export const dynamic = 'force-dynamic';
export const revalidate = 0;

import HomeClient from '@/components/HomeClient';
import FoundItemsSection from '@/components/FoundItemsSection';
import PlatformStatsSection from '@/components/PlatformStatsSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import { getFoundItemsPage } from '@/lib/getFoundItemsPage';

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const searchParamsResolved = await searchParams;
  const page = Math.max(1, Number(searchParamsResolved?.page ?? '1') || 1);
  const found = await getFoundItemsPage(page, 6);

  return (
    <>
      {/* Bagian atas landing (hero, fitur, frequent, dst—tanpa stats) */}
      <HomeClient />

      {/* Barang yang Ditemukan */}
      <FoundItemsSection data={found} page={page} />

      {/* Statistik Platform */}
      <PlatformStatsSection />

      {/* About Section */}
      <AboutSection />

      {/* Footer tetap di bawah */}
      <footer>
        <Footer />
      </footer>
    </>
  );
}
