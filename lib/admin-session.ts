import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'tahfidz_admin_session';
const SESSION_HOURS = 12;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET || process.env.DATABASE_URL;
  if (!value) throw new Error('Session secret is not configured');
  return value;
}

function signature(expiresAt: number) {
  return createHmac('sha256', secret())
    .update(`tahfidz-admin:${expiresAt}`)
    .digest('hex');
}

export async function createAdminSession() {
  const expiresAt = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const sig = signature(expiresAt);
  const jar = await cookies();

  jar.set(COOKIE_NAME, `${expiresAt}.${sig}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(expiresAt),
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });
}

export async function isAdminSessionValid() {
  const jar = await cookies();
  const value = jar.get(COOKIE_NAME)?.value;
  if (!value) return false;

  const [expiresRaw, provided] = value.split('.');
  const expiresAt = Number(expiresRaw);
  if (!expiresAt || !provided || expiresAt <= Date.now()) return false;

  const expected = signature(expiresAt);
  const a = Buffer.from(expected);
  const b = Buffer.from(provided);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function requireAdminSession() {
  if (!(await isAdminSessionValid())) redirect('/auth/sign-in');
}
