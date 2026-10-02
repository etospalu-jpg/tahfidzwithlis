'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useEffect} from 'react';
import {AlertTriangle,RefreshCw,Home} from 'lucide-react';
export default function GlobalError({error,reset}:{error:Error&{digest?:string};reset:()=>void}){
 useEffect(()=>console.error(error),[error]);
 return <main className="min-h-screen bg-white flex items-center justify-center p-5">
  <div className="w-full max-w-[520px] shell-card p-6 sm:p-8 text-center">
   <div className="brand-mark h-20 w-20 rounded-[18px] border border-[#e3ebf0] p-1.5 mx-auto"><Image src="/bina-insan-logo.jpg" alt="Bina Insan" width={140} height={140} className="brand-logo"/></div>
   <div className="h-11 w-11 rounded-[14px] bg-[#fff4e8] text-[#a45c16] grid place-items-center mx-auto mt-6"><AlertTriangle size={20}/></div>
   <h1 className="text-3xl font-bold tracking-[-.04em] text-[#153b57] mt-5">Halaman belum berhasil dimuat.</h1>
   <p className="text-sm muted leading-6 mt-3">Coba muat ulang. Data yang sudah tersimpan sebelumnya tetap aman.</p>
   {error.digest&&<div className="mt-4 text-[10px] muted">Kode: {error.digest}</div>}
   <div className="grid sm:grid-cols-2 gap-2 mt-6"><button onClick={reset} className="btn-primary"><RefreshCw size={17}/>Coba Lagi</button><Link href="/dashboard" className="btn-secondary"><Home size={17}/>Beranda</Link></div>
  </div>
 </main>;
}
