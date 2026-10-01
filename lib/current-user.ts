import { requireAdminSession, getAdminToken } from '@/lib/admin-session';
import { getAdminProfile } from '@/lib/neon-api';

export async function getCurrentProfile() {
  await requireAdminSession();

  const token = await getAdminToken();
  if (!token) throw new Error('Admin session is required');

  const profile = await getAdminProfile(token);
  if (!profile) throw new Error('Organization is not configured');

  return { profile };
}
