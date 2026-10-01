import { isAdminSessionValid } from '@/lib/admin-session';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Home() {
  redirect((await isAdminSessionValid()) ? '/dashboard' : '/auth/sign-in');
}
