'use client';
import Image from 'next/image';
import {useActionState} from 'react';
import {ArrowRight,KeyRound,ShieldCheck,BookOpenCheck,Users,ChartNoAxesCombined} from 'lucide-react';
import {signInAction} from './actions';

export default function SignInPage(){
 const [state,action,pending]=useActionState(signInAction,null);
 return (
  <main className="min-h-screen bg-white grid lg:grid-cols-[1.02fr_.98fr]">
   <section className="hidden lg:flex min-h-screen border-r border-[#e3ebf0] bg-[#f8fbfd] p-10 xl:p-14">
    <div className="w-full max-w-[620px] mx-auto flex flex-col justify-between">
     <div className="flex items-center gap-4">
      <div className="brand-mark h-20 w-20 rounded-[20px] border border-[#dfe9ef] p-2 shadow-[0_8px_24px_rgba(28,76,110,.06)]">
       <Image src="/bina-insan-logo.jpg" alt="SD Islam Terpadu Bina Insan Palu" width={160} height={160} className="brand-logo" priority/>
      </div>
      <div>
       <div className="text-[11px] font-black tracking-[.16em] uppercase text-[#08a8cb]">SD Islam Terpadu</div>
       <div className="text-2xl font-black tracking-[-.035em] text-[#153b57]">Bina Insan Palu</div>
      </div>
     </div>
     <div className="py-12">
      <span className="text-[#1c4c6e] text-[10px] font-black tracking-[.18em] uppercase">Tahfidz Intelligence Workspace</span>
      <h1 className="text-5xl xl:text-[64px] font-bold leading-[1.01] tracking-[-.055em] mt-5 text-[#153b57]">
       Hafalan lebih mudah <span className="text-[#08b9df]">dipantau dan dibimbing.</span>
      </h1>
      <p className="mt-7 text-base xl:text-lg leading-8 text-[#607687] max-w-lg">
       Siswa, setoran, murajaah, target, laporan, dan catatan perkembangan dalam satu aplikasi yang ringan dan terstruktur.
      </p>
      <div className="grid grid-cols-3 gap-3 mt-8 max-w-lg">
       <Feature icon={BookOpenCheck} label="Setoran"/><Feature icon={Users} label="Siswa"/><Feature icon={ChartNoAxesCombined} label="Laporan"/>
      </div>
     </div>
     <div className="flex items-center gap-2 text-xs text-[#718392]"><ShieldCheck size={17} className="text-[#1c4c6e]"/>Akses administrator terlindungi session server-side.</div>
    </div>
   </section>

   <section className="min-h-screen flex items-center justify-center p-5 sm:p-8">
    <div className="w-full max-w-[430px]">
     <div className="lg:hidden text-center mb-8">
      <div className="brand-mark h-28 w-28 rounded-[24px] border border-[#e3ebf0] p-2 mx-auto shadow-[0_10px_30px_rgba(28,76,110,.06)]">
       <Image src="/bina-insan-logo.jpg" alt="SD Islam Terpadu Bina Insan Palu" width={220} height={220} className="brand-logo" priority/>
      </div>
      <div className="mt-4 text-[10px] font-black tracking-[.16em] uppercase text-[#08a8cb]">SD Islam Terpadu</div>
      <div className="text-xl font-black tracking-[-.03em] text-[#153b57]">Bina Insan Palu</div>
     </div>

     <div className="mb-7">
      <span className="text-[#1c4c6e] text-[10px] font-black tracking-[.16em] uppercase">TahfidzWithLis</span>
      <h2 className="text-[38px] sm:text-[44px] font-bold tracking-[-.05em] leading-[1.04] text-[#153b57] mt-2">Masuk ke workspace.</h2>
      <p className="text-sm leading-6 text-[#718392] mt-3">Masukkan PIN administrator untuk melanjutkan.</p>
     </div>

     <form action={action} className="space-y-4">
      <div>
       <label className="label">PIN Administrator</label>
       <div className="relative">
        <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718392]"/>
        <input name="pin" type="password" inputMode="numeric" autoComplete="current-password" autoFocus className="field !h-14 !pl-12 !text-lg tracking-[.22em]" placeholder="••••••••" required/>
       </div>
      </div>
      {state?.error&&<div className="rounded-[13px] border border-[#f2d7c5] bg-[#fff7f1] px-4 py-3 text-sm font-semibold text-[#a45c16]">{state.error}</div>}
      <button disabled={pending} className="btn-primary !h-14 !w-full !rounded-[14px] !text-sm">
       {pending?'Memverifikasi...':'Masuk'}<ArrowRight size={18}/>
      </button>
     </form>
     <p className="text-center text-[11px] text-[#8a9aa6] mt-6">TahfidzWithLis · SD Islam Terpadu Bina Insan Palu</p>
    </div>
   </section>
  </main>
 );
}
function Feature({icon:Icon,label}:any){
 return <div className="rounded-[16px] border border-[#e3ebf0] bg-white p-4"><div className="h-9 w-9 rounded-[11px] bg-[#e8f9fd] text-[#1c4c6e] grid place-items-center"><Icon size={17}/></div><div className="text-xs font-extrabold text-[#38566b] mt-3">{label}</div></div>;
}
