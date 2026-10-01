import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { getCurrentProfile } from '@/lib/current-user';
import { getAdminToken } from '@/lib/admin-session';
import { getStudentsList } from '@/lib/neon-api';
import { Search, ChevronRight, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentsPage({ searchParams }: { searchParams: Promise<{q?:string}> }) {
  const { profile } = await getCurrentProfile();
  const { q='' } = await searchParams;
  const term = q.trim();

  const token = await getAdminToken();
  if (!token) throw new Error('Admin session is required');
  const students = await getStudentsList(token, term);

  return (
    <AppShell userName={profile.full_name} role={profile.role} institution={profile.institution_name}>
      <div className="fade-up pt-5 sm:pt-8 pb-8">
        <span className="gold-kicker">Direktori siswa</span>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mt-2">
          <div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-.045em]">Perjalanan setiap siswa.</h1>
            <p className="muted mt-3">Buka profil untuk melihat progres, kualitas hafalan, histori setoran, dan catatan guru.</p>
          </div>
          <div className="pill self-start"><Users size={14}/>{students.length} siswa</div>
        </div>

        <form className="mt-7 max-w-xl relative">
          <Search size={18} className="absolute left-4 top-3.5 muted"/>
          <input name="q" defaultValue={term} className="field pl-12" placeholder="Cari nama siswa…" />
        </form>

        <div className="shell-card mt-5 overflow-hidden">
          <div className="divide-y divide-[#12372A]/8">
            {students.map((s:any)=>(
              <Link key={s.id} href={`/students/${s.id}`} className="table-row flex items-center gap-4 p-4 sm:px-6 sm:py-5">
                <div className="h-12 w-12 rounded-[18px] bg-[#edf2ee] grid place-items-center font-black text-[#12372A] shrink-0">{initials(s.full_name)}</div>
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold truncate">{s.full_name}</div>
                  <div className="text-xs muted mt-1 truncate">{s.class_name || 'Tanpa kelas'} · {s.group_name || 'Tanpa halaqah'}</div>
                </div>
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-extrabold">{s.overall_score ? Number(s.overall_score).toFixed(0) : '—'}</div>
                  <div className="text-[11px] muted mt-1">{s.surah_name || 'Belum setor'}</div>
                </div>
                <ChevronRight size={18} className="muted shrink-0"/>
              </Link>
            ))}
            {!students.length && <div className="p-10 text-center"><div className="font-bold">Siswa tidak ditemukan</div><p className="text-sm muted mt-1">Coba kata pencarian lain.</p></div>}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function initials(n:string){return n.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase()}
