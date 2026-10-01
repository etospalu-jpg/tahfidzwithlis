import { AppShell } from '@/components/app-shell';
import { getPageData } from '@/lib/page-data';
import type { ReportsData } from '@/lib/neon-api';
import {
  BarChart3,
  BookOpen,
  Users,
  Target,
  Layers3,
  TrendingUp,
} from 'lucide-react';

export const dynamic='force-dynamic';

export default async function ReportsPage(){
  const { profile, data } = await getPageData<ReportsData>('reports');
  const s:any = data.summary;
  const groups:any[] = data.groups || [];
  const monthly:any[] = data.monthly || [];
  const maxSessions = Math.max(1, ...monthly.map((m:any)=>Number(m.sessions || 0)));

  return (
    <AppShell userName={profile.full_name} role={profile.role} institution={profile.institution_name}>
      <div className="page-section fade-up">
        <div className="page-header">
          <div className="page-header-copy">
            <span className="gold-kicker">Laporan program</span>
            <h1 className="page-title">Ringkasan yang mudah dibaca.</h1>
            <p className="page-subtitle">
              Pantau skala program, kualitas setoran, aktivitas bulanan, dan performa setiap halaqah dari data yang sudah tercatat.
            </p>
          </div>
          <div className="pill self-start"><TrendingUp size={15}/>Data aktual</div>
        </div>

        <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mt-7">
          <Card icon={Users} label="Siswa aktif" value={String(s.students)} note="peserta pembinaan"/>
          <Card icon={BookOpen} label="Total setoran" value={String(s.sessions)} note="seluruh periode"/>
          <Card icon={BarChart3} label="Rata-rata nilai" value={String(s.avg_score)} note="kualitas keseluruhan"/>
          <Card icon={Target} label="Target rata-rata" value={String(s.avg_target)} note="halaman per bulan"/>
        </section>

        <section className="grid xl:grid-cols-[.82fr_1.18fr] gap-4 mt-4">
          <div className="shell-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="gold-kicker">Aktivitas</span>
                <h2 className="section-title">6 bulan terakhir</h2>
                <p className="section-subtitle mt-1">Jumlah setoran yang tercatat per bulan.</p>
              </div>
              <div className="icon-box icon-box-gold"><BarChart3 size={19}/></div>
            </div>

            <div className="mt-6 space-y-4">
              {monthly.map((m:any)=> {
                const sessions = Number(m.sessions || 0);
                const width = Math.max(3, Math.round((sessions / maxSessions) * 100));
                return (
                  <div key={m.month_start}>
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-extrabold">{monthLabel(m.month_start)}</span>
                      <span className="muted">{sessions} setoran · rata-rata {Number(m.avg_score || 0).toFixed(1)}</span>
                    </div>
                    <div className="progress-track mt-2">
                      <div className="progress-fill" style={{width:`${width}%`}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="shell-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="gold-kicker">Halaqah</span>
                <h2 className="section-title">Performa kelompok</h2>
                <p className="section-subtitle mt-1">Ringkasan siswa, aktivitas, dan kualitas setoran tiap halaqah.</p>
              </div>
              <div className="icon-box"><Layers3 size={19}/></div>
            </div>

            <div className="mt-4">
              {groups.map((g:any)=>(
                <div key={g.id} className="data-row">
                  <div className="min-w-0">
                    <div className="font-extrabold truncate">{g.name}</div>
                    <div className="text-[11px] sm:text-xs muted mt-1 truncate">
                      {g.teacher_name || 'Belum ada pembimbing'} · {g.target_label || 'Belum ada target'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="hidden sm:block text-right">
                      <div className="text-sm font-extrabold">{g.student_count}</div>
                      <div className="text-[10px] muted">siswa</div>
                    </div>
                    <div className="hidden md:block text-right min-w-[56px]">
                      <div className="text-sm font-extrabold">{g.session_count}</div>
                      <div className="text-[10px] muted">setoran</div>
                    </div>
                    <span className="score-pill">{Number(g.avg_score || 0).toFixed(0)}</span>
                  </div>
                </div>
              ))}

              {!groups.length && (
                <div className="py-10 text-center muted text-sm">Belum ada data halaqah.</div>
              )}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Card({icon:Icon,label,value,note}:any){
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between gap-3">
        <span className="gold-kicker">{label}</span>
        <div className="h-9 w-9 rounded-[12px] bg-[#edf2ee] text-[#456455] grid place-items-center">
          <Icon size={17}/>
        </div>
      </div>
      <div className="text-3xl sm:text-[38px] font-semibold tracking-[-.045em] mt-4 leading-none">{value}</div>
      <div className="text-[11px] muted mt-2">{note}</div>
    </div>
  );
}

function monthLabel(value:string|Date){
  return new Intl.DateTimeFormat('id-ID',{month:'short',year:'numeric'}).format(new Date(value));
}
