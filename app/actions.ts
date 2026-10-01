'use server';

import { clearAdminSession } from '@/lib/admin-session';
import { redirect } from 'next/navigation';

export async function signOutAction() {
  await clearAdminSession();
  redirect('/auth/sign-in');
}
