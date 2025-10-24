import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Use server-side env vars (without NEXT_PUBLIC_) in API routes
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables in /api/stats/found-items');
      console.error('Available env vars:', {
        hasPublicUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasUrl: !!process.env.SUPABASE_URL,
        hasPublicKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasKey: !!process.env.SUPABASE_ANON_KEY
      });
      return NextResponse.json(
        {
          'Elektronik': 0,
          'Dokumen': 0,
          'Kunci': 0,
          'Tas & Dompet': 0,
          'Buku & Alat Tulis': 0,
          'Aksesoris': 0,
          error: 'Missing configuration',
        },
        { status: 200 }
      );
    }

    // Query langsung ke database untuk mendapatkan semua kategori
    const directQueryUrl = `${supabaseUrl}/rest/v1/reports?select=category`;
    const directRes = await fetch(directQueryUrl, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!directRes.ok) {
      console.error('❌ Failed to fetch reports directly:', directRes.status);
      // Fallback ke fungsi RPC asli
      const url = `${supabaseUrl}/rest/v1/rpc/get_found_item_totals`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        console.error('❌ Failed to fetch found items stats:', res.status);
        const errorText = await res.text();
        console.error('Error details:', errorText);
        return NextResponse.json(
          {
            'Elektronik': 0,
            'Dokumen': 0,
            'Kunci': 0,
            'Tas & Dompet': 0,
            'Buku & Alat Tulis': 0,
            'Aksesoris': 0,
            error: `API Error: ${res.status}`,
          },
          { status: 200 }
        );
      }

      const json = await res.json();
      console.log('📊 Found Items Stats API Response (RPC):', json);

      const cats = ['Elektronik', 'Dokumen', 'Kunci', 'Tas & Dompet', 'Buku & Alat Tulis', 'Aksesoris'] as const;
      const out: Record<string, number> = {};
      for (const c of cats) {
        out[c] = Number(json?.[c] ?? 0);
      }

      return NextResponse.json(out);
    }

    const reports = await directRes.json();
    console.log('📊 Direct reports query result:', reports);

    // Hitung jumlah per kategori dengan pemetaan kategori
    const categoryCounts: Record<string, number> = {};
    const targetCategories = ['Elektronik', 'Dokumen', 'Kunci', 'Tas & Dompet', 'Buku & Alat Tulis', 'Aksesoris'];
    
    // Initialize all target categories to 0
    targetCategories.forEach(cat => categoryCounts[cat] = 0);
    
    // Count reports by category
    reports.forEach((report: { category: string }) => {
      const reportCategory = report.category;
      
      if (targetCategories.includes(reportCategory)) {
        categoryCounts[reportCategory] = (categoryCounts[reportCategory] || 0) + 1;
      }
    });

    console.log('📊 Raw reports:', reports);
    console.log('📊 Category counts:', categoryCounts);

    return NextResponse.json(categoryCounts);
  } catch (error) {
    console.error('❌ Error in /api/stats/found-items:', error);
    return NextResponse.json(
      {
        'Elektronik': 0,
        'Dokumen': 0,
        'Kunci': 0,
        'Tas & Dompet': 0,
        'Buku & Alat Tulis': 0,
        'Aksesoris': 0,
        error: 'Internal error',
      },
      { status: 200 }
    );
  }
}
