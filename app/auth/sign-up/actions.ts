'use server';

import { auth } from '@/lib/auth/server';
import { sql } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function signUpAction(
  _prev: { error?: string } | null,
  formData: FormData
) {
  const existing = await sql`select count(*)::int as count from user_profiles`;
  if (Number(existing[0]?.count || 0) > 0) {
    return { error: 'Setup awal sudah selesai. Pembuatan akun baru dikelola oleh administrator.' };
  }

  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  if (!name || !email || password.length < 8) {
    return { error: 'Lengkapi data. Kata sandi minimal 8 karakter.' };
  }

  const { error } = await auth.signUp.email({ name, email, password });
  if (error) return { error: error.message || 'Akun belum berhasil dibuat.' };

  redirect('/setup');
}
