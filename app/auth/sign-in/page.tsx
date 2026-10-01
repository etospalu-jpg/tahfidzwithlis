'use client';

import { useActionState } from 'react';
import { BookOpenCheck, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
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
              Satu ruang kerja untuk <span className="text-[#d8c29a]">membimbing hafalan.</span>
            </h1>
            <p className="mt-7 text-lg leading-8 text-white/65 max-w-lg">
              Pantau siswa, setoran, murajaah, target, dan catatan perkembangan dalam satu sistem yang tenang dan terarah.
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm text-white/55">
            <ShieldCheck size={18} className="text-[#d8c29a]" />
            Akses administrator dilindungi dengan sesi server-side.
          </div>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md fade-up">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="h-11 w-11 rounded-2xl bg-[#12372A] text-white grid place-items-center"><BookOpenCheck size={22}/></div>
            <div><div className="font-extrabold">TahfidzWithLis</div><div className="text-xs muted">Monitoring tahfidz modern</div></div>
          </div>

          <div className="h-12 w-12 rounded-2xl bg-[#f3ead8] text-[#8b6c2f] grid place-items-center mb-7">
            <KeyRound size={21}/>
          </div>
          <span className="gold-kicker">Akses administrator</span>
          <h2 className="text-4xl font-semibold tracking-[-.04em] mt-3">Masukkan PIN.</h2>
          <p className="muted mt-3 leading-7">Untuk sementara, administrator masuk cukup menggunakan satu PIN tanpa akun email.</p>

          <form action={action} className="mt-9 space-y-5">
            <div>
              <label className="label" htmlFor="pin">PIN Admin</label>
              <input
                className="field text-center text-2xl tracking-[.35em] font-extrabold"
                id="pin"
                name="pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                autoComplete="off"
                placeholder="••••••"
                required
                autoFocus
              />
            </div>

            {state?.error && <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{state.error}</div>}

            <button className="btn-primary w-full" disabled={pending}>
              {pending ? 'Memverifikasi…' : <>Masuk Dashboard <ArrowRight size={17}/></>}
            </button>
          </form>

          <div className="mt-7 rounded-2xl border border-[#12372A]/8 bg-white/55 px-4 py-3 text-xs muted leading-5">
            PIN sementara dapat diganti nanti dari menu pengaturan admin.
          </div>
        </div>
      </section>
    </main>
  );
}
