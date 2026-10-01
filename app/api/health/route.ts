import { NextResponse } from 'next/server';
import { neonRpc } from '@/lib/neon-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await neonRpc<boolean>('admin_validate', { p_token: '' });
    return NextResponse.json({
      ok: true,
      database: 'reachable',
      auth: 'pin',
      service: 'TahfidzWithLis',
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
