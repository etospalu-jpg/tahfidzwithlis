'use server';

import { createAdminSession } from '@/lib/admin-session';
import { loginWithPin } from '@/lib/neon-api';
import { redirect } from 'next/navigation';

export async function signInAction(
  _prev: { error?: string } | null,
  formData: FormData
) {
  const pin = String(formData.get('pin') || '').trim();

  if (!/^\d{6}$/.test(pin)) {
    return { error: 'Masukkan PIN admin 6 digit.' };
  }

  try {
    const token = await loginWithPin(pin);

    if (!token) {
      return { error: 'PIN admin tidak sesuai.' };
    }

    await createAdminSession(token);
  } catch {
    return { error: 'Layanan sedang tidak tersedia. Coba lagi beberapa detik.' };
  }

  redirect('/dashboard');
}
