import { NextResponse } from 'next/server';
import { neonRpc } from '@/lib/neon-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const raw = await neonRpc<unknown>('transport_probe', {});
    return NextResponse.json({
      ok: true,
      database: 'reachable',
      auth: 'pin',
      service: 'TahfidzWithLis',
      transport: {
        type: Array.isArray(raw) ? 'array' : typeof raw,
        raw,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        database: 'unreachable',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
