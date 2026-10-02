import Image from 'next/image';
import Link from 'next/link';
import {SearchX,Home,Users} from 'lucide-react';
export default function NotFound(){
 return <main className="min-h-screen bg-white flex items-center justify-center p-5">
  <div className="w-full max-w-[520px] shell-card p-6 sm:p-8 text-center">
   <div className="brand-mark h-20 w-20 rounded-[18px] border border-[#e3ebf0] p-1.5 mx-auto"><Image src="/bina-insan-logo.jpg" alt="Bina Insan" width={140} height={140} className="brand-logo"/></div>
   <div className="icon-box icon-box-gold mx-auto mt-5"><SearchX size={20}/></div>
   <h1 className="text-3xl font-bold tracking-[-.04em] text-[#153b57] mt-5">Data tidak ditemukan.</h1>
   <p className="text-sm muted leading-6 mt-3">Halaman atau data yang Anda buka mungkin sudah berubah atau tidak tersedia.</p>
   <div className="grid sm:grid-cols-2 gap-2 mt-6"><Link href="/dashboard" className="btn-primary"><Home size={17}/>Beranda</Link><Link href="/students" className="btn-secondary"><Users size={17}/>Daftar Siswa</Link></div>
  </div>
 </main>;
}
