import { redirect } from 'next/navigation';
import { getAdminToken } from '@/lib/admin-session';
import { getAppPage, type AppPageBundle } from '@/lib/neon-api';

export async function getPageData<T>(
  page: string,
  arg: string | null = null
): Promise<AppPageBundle<T>> {
  const token = await getAdminToken();
  if (!token) redirect('/auth/sign-in');

  try {
    return await getAppPage<T>(token, page, arg);
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : '';
    if (message.includes('unauthorized')) {
      redirect('/auth/sign-in');
    }
    throw error;
  }
}
