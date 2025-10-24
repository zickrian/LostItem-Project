import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables in /api/stats/platform');
      return NextResponse.json(
        { 
          hilang: 0, 
          ditemukan: 0, 
          diklaim: 0,
          error: 'Missing configuration' 
        },
        { status: 200 }
      );
    }

    const url = `${supabaseUrl}/rest/v1/rpc/get_platform_stats`;
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
      console.error('❌ Failed to fetch platform stats:', res.status);
      const errorText = await res.text();
      console.error('Error details:', errorText);
      return NextResponse.json(
        { hilang: 0, ditemukan: 0, diklaim: 0, error: `API Error: ${res.status}` },
        { status: 200 }
      );
    }

    const json = await res.json();
    console.log('📊 Platform Stats API Response:', json);
    console.log('📊 Raw values - reported:', json?.reported, 'found:', json?.found, 'claimed:', json?.claimed);
    console.log('📊 Raw values (ID) - BarangHilangDilaporkan:', json?.BarangHilangDilaporkan, 'BarangDitemukan:', json?.BarangDitemukan, 'BarangDiklaim:', json?.BarangDiklaim);

    const stats = {
      hilang: Number(json?.reported ?? json?.BarangHilangDilaporkan ?? 0),
      ditemukan: Number(json?.found ?? json?.BarangDitemukan ?? 0),
      diklaim: Number(json?.claimed ?? json?.BarangDiklaim ?? 0),
    };
    
    console.log('📊 Processed stats:', stats);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('❌ Error in /api/stats/platform:', error);
    return NextResponse.json(
      { hilang: 0, ditemukan: 0, diklaim: 0, error: 'Internal error' },
      { status: 200 }
    );
  }
}
