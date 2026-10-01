'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { BookOpenCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { signInAction } from './actions';

export default function SignInPage() {
  const [state, action, pending] = useActionState(signInAction, null);

  return (
    <main className="min-h-screen grid lg:grid-cols-[1.05fr_.95fr]">
      <section className="hidden lg:flex p-12 xl:p-16 bg-[#12372A] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{background:'radial-gradient(circle at 20% 10%, #B69A62 0, transparent 28%), radial-gradient(circle at 90% 90%, #2f6954 0, transparent 32%)'}} />
        <div className="relative z-10 max-w-xl flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/10 border border-white/15 grid place-items-center">
              <BookOpenCheck size={22} />
            </div>
            <div>
              <div className="font-extrabold tracking-tight">TahfidzWithLis</div>
              <div className="text-xs text-white/55">Qur'an Learning Intelligence System</div>
            </div>
          </div>

          <div className="py-16">
            <div className="text-[#d8c29a] text-xs font-black tracking-[.18em] uppercase mb-5">Modern Tahfidz Workspace</div>
            <h1 className="text-5xl xl:text-6xl font-semibold leading-[1.04] tracking-[-.045em]">
              Setiap hafalan punya perjalanan. <span className="text-[#d8c29a]">Pantau dengan utuh.</span>
            </h1>
            <p className="mt-7 text-lg leading-8 text-white/65 max-w-lg">
              Satu ruang kerja premium untuk setoran, murajaah, target, catatan guru, dan perkembangan setiap siswa.
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm text-white/55">
            <ShieldCheck size={18} className="text-[#d8c29a]" />
            Data tersimpan aman di cloud PostgreSQL Neon.
          </div>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md fade-up">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="h-11 w-11 rounded-2xl bg-[#12372A] text-white grid place-items-center"><BookOpenCheck size={22}/></div>
            <div><div className="font-extrabold">TahfidzWithLis</div><div className="text-xs muted">Monitoring tahfidz modern</div></div>
          </div>

          <span className="gold-kicker">Selamat datang kembali</span>
          <h2 className="text-4xl font-semibold tracking-[-.04em] mt-3">Masuk ke ruang guru.</h2>
          <p className="muted mt-3 leading-7">Lanjutkan pemantauan hafalan dan perkembangan siswa Anda.</p>

          <form action={action} className="mt-9 space-y-5">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input className="field" id="email" name="email" type="email" autoComplete="email" placeholder="nama@lembaga.sch.id" required />
            </div>
            <div>
              <label className="label" htmlFor="password">Kata sandi</label>
              <input className="field" id="password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" required />
            </div>

            {state?.error && <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{state.error}</div>}

            <button className="btn-primary w-full" disabled={pending}>
              {pending ? 'Memverifikasi…' : <>Masuk <ArrowRight size={17}/></>}
            </button>
          </form>

          <div className="mt-7 text-sm muted">
            Setup pertama? <Link href="/auth/sign-up" className="font-bold text-[#12372A] hover:underline">Buat akun administrator</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
