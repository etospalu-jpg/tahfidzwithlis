'use server';

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function signInAction(
  _prev: { error?: string } | null,
  formData: FormData
) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  if (!email || !password) return { error: 'Email dan kata sandi wajib diisi.' };

  const { error } = await auth.signIn.email({ email, password });
  if (error) return { error: error.message || 'Login gagal. Periksa kembali akun Anda.' };

  redirect('/dashboard');
}
