'use server';

import { sql } from '@/lib/db';
import { createAdminSession } from '@/lib/admin-session';
import { redirect } from 'next/navigation';

export async function signInAction(
  _prev: { error?: string } | null,
  formData: FormData
) {
  const pin = String(formData.get('pin') || '').trim();

  if (!/^\d{6}$/.test(pin)) {
    return { error: 'Masukkan PIN admin 6 digit.' };
  }

  const rows = await sql`
    select (value = crypt(${pin}, value)) as ok
    from app_settings
    where key='admin_pin_hash'
    limit 1
  `;

  if (!rows[0]?.ok) {
    return { error: 'PIN admin tidak sesuai.' };
  }

  await createAdminSession();
  redirect('/dashboard');
}
