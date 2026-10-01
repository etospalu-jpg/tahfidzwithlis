import { redirect } from 'next/navigation';
import { getAdminToken } from '@/lib/admin-session';
import { getAdminProfile } from '@/lib/neon-api';

export async function getCurrentProfile() {
  const token = await getAdminToken();
  if (!token) redirect('/auth/sign-in');

  try {
    const profile = await getAdminProfile(token);
    if (!profile) throw new Error('Organization is not configured');
    return { profile, token };
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : '';
    if (message.includes('unauthorized')) redirect('/auth/sign-in');
    throw error;
  }
}
