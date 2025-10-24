import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables in /api/stats/found-items');
      return NextResponse.json(
        {
          STNK: 0,
          Handphone: 0,
          Buku: 0,
          Kunci: 0,
          Dompet: 0,
          Laptop: 0,
          error: 'Missing configuration',
        },
        { status: 200 }
      );
    }

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
          STNK: 0,
          Handphone: 0,
          Buku: 0,
          Kunci: 0,
          Dompet: 0,
          Laptop: 0,
          error: `API Error: ${res.status}`,
        },
        { status: 200 }
      );
    }

    const json = await res.json();
    console.log('📊 Found Items Stats API Response:', json);

    const cats = ['STNK', 'Handphone', 'Buku', 'Kunci', 'Dompet', 'Laptop'] as const;
    const out: Record<string, number> = {};
    for (const c of cats) {
      out[c] = Number(json?.[c] ?? 0);
    }

    return NextResponse.json(out);
  } catch (error) {
    console.error('❌ Error in /api/stats/found-items:', error);
    return NextResponse.json(
      {
        STNK: 0,
        Handphone: 0,
        Buku: 0,
        Kunci: 0,
        Dompet: 0,
        Laptop: 0,
        error: 'Internal error',
      },
      { status: 200 }
    );
  }
}
