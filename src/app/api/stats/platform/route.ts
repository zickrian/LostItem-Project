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

    return NextResponse.json({
      hilang: Number(json?.reported ?? 0),
      ditemukan: Number(json?.found ?? 0),
      diklaim: Number(json?.claimed ?? 0),
    });
  } catch (error) {
    console.error('❌ Error in /api/stats/platform:', error);
    return NextResponse.json(
      { hilang: 0, ditemukan: 0, diklaim: 0, error: 'Internal error' },
      { status: 200 }
    );
  }
}
