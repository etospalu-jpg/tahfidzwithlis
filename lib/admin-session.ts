import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { logoutAdminToken, validateAdminToken } from '@/lib/neon-api';

const COOKIE_NAME = 'tahfidz_admin_session';
const SESSION_HOURS = 12;

export async function getAdminToken() {
  const jar = await cookies();
  return jar.get(COOKIE_NAME)?.value || null;
}

export async function createAdminSession(token: string) {
  const expiresAt = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const jar = await cookies();

  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(expiresAt),
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;

  if (token) {
    try {
      await logoutAdminToken(token);
    } catch {
      // Always clear the browser cookie even if the remote session is already gone.
    }
  }

  jar.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });
}

export async function isAdminSessionValid() {
  const token = await getAdminToken();
  if (!token) return false;

  try {
    return Boolean(await validateAdminToken(token));
  } catch {
    return false;
  }
}

export async function requireAdminSession() {
  if (!(await isAdminSessionValid())) redirect('/auth/sign-in');
}
