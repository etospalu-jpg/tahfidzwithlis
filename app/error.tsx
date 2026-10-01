'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home, BookOpenCheck } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#f5f3ec] flex items-center justify-center p-5">
      <div className="w-full max-w-[520px] shell-card p-6 sm:p-8 text-center">
        <div className="h-12 w-12 rounded-[16px] bg-[#12372A] text-white grid place-items-center mx-auto">
          <BookOpenCheck size={23}/>
        </div>
        <div className="h-12 w-12 rounded-[16px] bg-[#fff0e5] text-[#9b4f22] grid place-items-center mx-auto mt-6">
          <AlertTriangle size={21}/>
        </div>

        <h1 className="text-3xl font-semibold tracking-[-.04em] mt-5">Halaman belum berhasil dimuat.</h1>
        <p className="text-sm muted leading-6 mt-3">
          Coba muat ulang. Jika masalah berulang, sistem akan tetap menyimpan data yang sudah tercatat sebelumnya.
        </p>

        {error.digest && (
          <div className="mt-4 text-[10px] muted">Kode: {error.digest}</div>
        )}

        <div className="grid sm:grid-cols-2 gap-2 mt-6">
          <button onClick={reset} className="btn-primary">
            <RefreshCw size={17}/>
            Coba Lagi
          </button>
          <Link href="/dashboard" className="btn-secondary">
            <Home size={17}/>
            Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
