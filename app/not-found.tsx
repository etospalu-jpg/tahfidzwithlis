import Link from 'next/link';
import { SearchX, Home, Users } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f5f3ec] flex items-center justify-center p-5">
      <div className="w-full max-w-[520px] shell-card p-6 sm:p-8 text-center">
        <div className="icon-box icon-box-gold mx-auto">
          <SearchX size={20}/>
        </div>
        <h1 className="text-3xl font-semibold tracking-[-.04em] mt-5">Data tidak ditemukan.</h1>
        <p className="text-sm muted leading-6 mt-3">
          Halaman atau data yang Anda buka mungkin sudah berubah atau tidak tersedia.
        </p>
        <div className="grid sm:grid-cols-2 gap-2 mt-6">
          <Link href="/dashboard" className="btn-primary"><Home size={17}/>Beranda</Link>
          <Link href="/students" className="btn-secondary"><Users size={17}/>Daftar Siswa</Link>
        </div>
      </div>
    </main>
  );
}
