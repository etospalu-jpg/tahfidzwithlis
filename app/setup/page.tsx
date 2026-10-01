import { auth } from '@/lib/auth/server';
import { sql } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Building2, Crown } from 'lucide-react';
import { finishSetupAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function SetupPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect('/auth/sign-in');

  const profile = await sql`select id from user_profiles where auth_user_id=${session.user.id} limit 1`;
  if (profile.length) redirect('/dashboard');

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="shell-card w-full max-w-2xl p-7 sm:p-10 fade-up">
        <div className="flex items-center justify-between">
          <div className="h-13 w-13 rounded-2xl bg-[#12372A] text-white p-3"><Crown /></div>
          <span className="pill status-gold">Super Admin</span>
        </div>
        <span className="gold-kicker block mt-8">Langkah terakhir</span>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-.045em] mt-2">Siapkan identitas lembaga.</h1>
        <p className="muted mt-4 leading-7 max-w-xl">Ini akan menjadi workspace utama Anda. Semua data guru, siswa, setoran, dan laporan akan berada di bawah lembaga ini.</p>

        <form action={finishSetupAction} className="mt-9 grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2"><label className="label">Nama lembaga / program</label><div className="relative"><Building2 className="absolute left-4 top-3.5 text-[#7c887f]" size={19}/><input className="field pl-12" name="institution" defaultValue="TahfidzWithLis" required /></div></div>
          <div className="sm:col-span-2"><label className="label">Nama administrator</label><input className="field" name="full_name" defaultValue={session.user.name || ''} required /></div>
          <button className="btn-primary sm:col-span-2 mt-2">Masuk ke Dashboard</button>
        </form>
      </div>
    </main>
  );
}
