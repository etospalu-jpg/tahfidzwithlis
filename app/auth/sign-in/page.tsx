'use client';

import { useActionState } from 'react';
import {
  BookOpenCheck,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Database,
  Sparkles,
} from 'lucide-react';
import { signInAction } from './actions';

export default function SignInPage() {
  const [state, action, pending] = useActionState(signInAction, null);

  return (
    <main className="min-h-screen grid lg:grid-cols-[1.08fr_.92fr] bg-[#f5f3ec]">
      <section className="hidden lg:flex m-4 rounded-[30px] p-10 xl:p-14 bg-[#12372A] text-white relative overflow-hidden shadow-[0_26px_80px_rgba(18,55,42,.22)]">
        <div
          className="absolute inset-0 opacity-25"
          style={{background:'radial-gradient(circle at 18% 8%, #B69A62 0, transparent 26%), radial-gradient(circle at 88% 92%, #2f6954 0, transparent 34%)'}}
        />

        <div className="relative z-10 max-w-xl flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-[16px] bg-white/[.10] border border-white/[.13] grid place-items-center">
              <BookOpenCheck size={24}/>
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-[-.025em]">TahfidzWithLis</div>
              <div className="text-[11px] text-white/48">Qur'an Learning Intelligence System</div>
            </div>
          </div>

          <div className="py-12 xl:py-16">
            <span className="text-[#d8c29a] text-[10px] font-black tracking-[.18em] uppercase">
              Modern Tahfidz Workspace
            </span>
            <h1 className="text-5xl xl:text-[64px] font-semibold leading-[1.01] tracking-[-.052em] mt-5">
              Hafalan lebih mudah <span className="text-[#d8c29a]">dipantau dan dibimbing.</span>
            </h1>
            <p className="mt-7 text-base xl:text-lg leading-8 text-white/62 max-w-lg">
              Siswa, setoran, murajaah, target, laporan, dan catatan perkembangan tersusun dalam satu workspace yang tenang.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-8 max-w-lg">
              <Feature icon={Database} text="Neon cloud database"/>
              <Feature icon={ShieldCheck} text="Session admin aman"/>
              <Feature icon={Sparkles} text="Monitoring progres"/>
              <Feature icon={BookOpenCheck} text="Setoran terstruktur"/>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-white/48">
            <ShieldCheck size={17} className="text-[#d8c29a]"/>
            Akses administrator dilindungi session server-side.
          </div>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-5 py-8 sm:p-10">
        <div className="w-full max-w-[420px] fade-up">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="h-12 w-12 rounded-[16px] bg-[#12372A] text-white grid place-items-center shadow-[0_10px_26px_rgba(18,55,42,.17)]">
              <BookOpenCheck size={23}/>
            </div>
            <div>
              <div className="font-extrabold text-base tracking-[-.025em]">TahfidzWithLis</div>
              <div className="text-[11px] muted">Monitoring tahfidz modern</div>
            </div>
          </div>

          <div className="icon-box icon-box-gold mb-6">
            <KeyRound size={20}/>
          </div>

          <span className="gold-kicker">Akses administrator</span>
          <h2 className="text-[38px] sm:text-[44px] leading-none font-semibold tracking-[-.045em] mt-3">
            Masukkan PIN.
          </h2>
          <p className="page-subtitle !mt-3">
            Masuk ke workspace untuk mengelola siswa, setoran, target, dan laporan program.
          </p>

          <form action={action} className="mt-7 space-y-4">
            <div>
              <label className="label" htmlFor="pin">PIN Admin</label>
              <input
                className="field min-h-[54px] text-center text-xl tracking-[.38em] font-extrabold"
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

            {state?.error && (
              <div className="rounded-[14px] bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                {state.error}
              </div>
            )}

            <button className="btn-primary w-full min-h-[50px]" disabled={pending}>
              {pending ? (
                'Memverifikasi…'
              ) : (
                <>
                  Masuk Dashboard
                  <ArrowRight size={18}/>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-[16px] border border-[#12372A]/[.08] bg-white/60 px-4 py-3 text-[11px] muted leading-5">
            PIN dapat diganti kapan saja dari menu <strong className="text-[#46534c]">Pengaturan</strong> setelah masuk.
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({icon:Icon,text}:any){
  return (
    <div className="rounded-[16px] border border-white/[.08] bg-white/[.045] p-3.5 flex items-center gap-3">
      <Icon size={17} className="text-[#d8c29a] shrink-0"/>
      <span className="text-xs font-bold text-white/70">{text}</span>
    </div>
  );
}
