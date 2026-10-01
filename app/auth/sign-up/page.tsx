'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { signUpAction } from './actions';

export default function SignUpPage() {
  const [state, action, pending] = useActionState(signUpAction, null);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="shell-card w-full max-w-xl p-7 sm:p-10 fade-up">
        <Link href="/auth/sign-in" className="inline-flex items-center gap-2 text-sm muted hover:text-[#12372A]"><ArrowLeft size={16}/> Kembali ke login</Link>
        <div className="mt-8 h-12 w-12 rounded-2xl bg-[#f3ead8] text-[#8b6c2f] grid place-items-center"><Sparkles size={22}/></div>
        <span className="gold-kicker block mt-7">First-time setup</span>
        <h1 className="text-4xl font-semibold tracking-[-.04em] mt-2">Buat akun pemilik sistem.</h1>
        <p className="muted mt-3 leading-7">Akun pertama otomatis menjadi Super Admin. Setelah setup selesai, pendaftaran publik akan ditutup.</p>

        <form action={action} className="mt-8 space-y-5">
          <div><label className="label">Nama lengkap</label><input className="field" name="name" placeholder="Nama administrator" required /></div>
          <div><label className="label">Email</label><input className="field" name="email" type="email" placeholder="admin@lembaga.sch.id" required /></div>
          <div><label className="label">Kata sandi</label><input className="field" name="password" type="password" minLength={8} placeholder="Minimal 8 karakter" required /></div>
          {state?.error && <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{state.error}</div>}
          <button className="btn-primary w-full" disabled={pending}>{pending ? 'Membuat akun…' : 'Buat Super Admin'}</button>
        </form>
      </div>
    </main>
  );
}
