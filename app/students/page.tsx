import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { getPageData } from '@/lib/page-data';
import {
  Search,
  ChevronRight,
  Users,
  BookOpen,
  Layers3,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const term = q.trim();
  const { profile, data: students } = await getPageData<any[]>('students', term);

  return (
    <AppShell userName={profile.full_name} role={profile.role} institution={profile.institution_name}>
      <div className="page-section fade-up">
        <div className="page-header">
          <div className="page-header-copy">
            <span className="gold-kicker">Direktori siswa</span>
            <h1 className="page-title">Perjalanan setiap siswa.</h1>
            <p className="page-subtitle">
              Cari siswa, buka profil, lalu lihat progres, kualitas hafalan, riwayat setoran, dan catatan guru dalam satu tampilan.
            </p>
          </div>

          <div className="pill self-start">
            <Users size={15}/>
            {students.length} siswa
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <form className="search-wrap" action="/students">
            <Search size={18}/>
            <input
              name="q"
              defaultValue={term}
              className="field"
              placeholder="Cari nama siswa..."
              aria-label="Cari siswa"
            />
          </form>

          {term && (
            <Link href="/students" className="btn-secondary self-start">
              Reset pencarian
            </Link>
          )}
        </div>

        <div className="list-surface mt-5">
          {students.map((s:any) => (
            <Link key={s.id} href={`/students/${s.id}`} prefetch={false} className="student-row">
              <div className="student-avatar">
                {initials(s.full_name)}
              </div>

              <div className="min-w-0">
                <div className="font-extrabold text-[15px] sm:text-base truncate tracking-[-.015em]">
                  {s.full_name}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs muted">
                  <span className="inline-flex items-center gap-1">
                    <Layers3 size={13}/>
                    {s.class_name || 'Tanpa kelas'}
                  </span>
                  <span className="text-[#aab2ad]">•</span>
                  <span>{s.group_name || 'Tanpa halaqah'}</span>
                </div>

                <div className="sm:hidden mt-2 flex items-center gap-2">
                  <span className="score-pill">
                    {s.overall_score ? Number(s.overall_score).toFixed(0) : '—'}
                  </span>
                  <span className="text-[11px] muted truncate">
                    {s.surah_name || 'Belum ada setoran'}
                  </span>
                </div>
              </div>

              <div className="student-score-desktop text-right min-w-0">
                <div className="flex justify-end">
                  <span className="score-pill">
                    {s.overall_score ? Number(s.overall_score).toFixed(0) : '—'}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-end gap-1 text-[11px] muted truncate">
                  <BookOpen size={12}/>
                  <span className="truncate">{s.surah_name || 'Belum ada setoran'}</span>
                </div>
              </div>

              <div className="h-9 w-9 rounded-[12px] bg-white border border-[#12372A]/[.08] grid place-items-center text-[#6d7972]">
                <ChevronRight size={18}/>
              </div>
            </Link>
          ))}

          {!students.length && (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto icon-box">
                <Users size={20}/>
              </div>
              <div className="font-extrabold mt-4">Siswa tidak ditemukan</div>
              <p className="text-sm muted mt-1">Coba kata pencarian lain.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function initials(name:string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}
