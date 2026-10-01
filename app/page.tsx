import { getAdminToken } from '@/lib/admin-session';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const token = await getAdminToken();
  redirect(token ? '/dashboard' : '/auth/sign-in');
}
