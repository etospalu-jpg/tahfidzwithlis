import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { getPageData } from '@/lib/page-data';
import type { DashboardData } from '@/lib/neon-api';
import {
  ArrowUpRight,
  BookOpen,
  Clock3,
  Sparkles,
  Users,
  AlertCircle,
  ChevronRight,
  Layers3,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { profile, data: dashboard } = await getPageData<DashboardData>('dashboard');
  const s:any = dashboard.summary;
  const focus = dashboard.focus || [];
  const recent = dashboard.recent || [];
  const groups = dashboard.groups || [];

  return (
    <AppShell userName={profile.full_name} role={profile.role} institution={profile.institution_name}>
      <div className="page-section fade-up">
        <section className="page-header">
          <div className="page-header-copy">
            <span className="gold-kicker">Workspace hari ini</span>
            <h1 className="page-title">
              Assalamu’alaikum, <span className="text-[#68766e]">Administrator.</span>
            </h1>
            <p className="page-subtitle">
              Pantau kondisi hafalan, tentukan siswa yang perlu perhatian, lalu catat setoran tanpa kehilangan konteks perkembangan.
            </p>
          </div>

          <Link href="/setoran" className="btn-primary self-start">
            <BookOpen size={18}/>
            Catat Setoran
            <ArrowUpRight size={16}/>
          </Link>
        </section>

        <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mt-7">
          <Metric icon={Users} label="Siswa aktif" value={String(s.students)} note="dalam pembinaan" />
          <Metric icon={BookOpen} label="Setoran bulan ini" value={String(s.sessions_month)} note="aktivitas tercatat" />
          <Metric icon={Sparkles} label="Rata-rata kualitas" value={String(s.avg_score)} note="30 hari terakhir" />
          <Metric icon={AlertCircle} label="Perlu perhatian" value={String(s.need_attention)} note="prioritas pembimbing" accent />
        </section>

        <section className="grid xl:grid-cols-[1.35fr_.65fr] gap-4 mt-4">
          <div className="shell-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="gold-kicker">Prioritas pembinaan</span>
                <h2 className="section-title">Fokus hari ini</h2>
                <p className="section-subtitle mt-1">Siswa yang perlu segera ditinjau berdasarkan aktivitas dan kualitas setoran.</p>
              </div>
              <span className="pill">{focus.length} siswa</span>
            </div>

            <div className="mt-4">
              {focus.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="icon-box icon-box-gold mx-auto"><Sparkles size={20}/></div>
                  <div className="font-extrabold mt-4">Semua terlihat stabil</div>
                  <p className="muted text-sm mt-1">Belum ada siswa yang masuk indikator perhatian.</p>
                </div>
              ) : focus.map((item:any) => (
                <Link
                  key={item.id}
                  href={`/students/${item.id}`}
                  className="data-row rounded-[14px] px-2 -mx-2 hover:bg-[#12372A]/[.035] transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="student-avatar shrink-0">{initials(item.full_name)}</div>
                    <div className="min-w-0">
                      <div className="font-extrabold truncate">{item.full_name}</div>
                      <div className="text-[11px] sm:text-xs muted mt-1 truncate">
                        {item.group_name || 'Belum ada halaqah'} · {item.reason}
                      </div>
                    </div>
                  </div>
                  <div className="h-9 w-9 rounded-[12px] bg-white border border-[#12372A]/[.08] grid place-items-center text-[#6d7972]">
                    <ChevronRight size={18}/>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="shell-card p-5 sm:p-6 bg-[#12372A] !text-white shadow-[0_18px_45px_rgba(18,55,42,.15)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[#d8c29a] text-[10px] font-black tracking-[.15em] uppercase">Halaqah</span>
                <h2 className="text-[22px] font-semibold tracking-[-.03em] mt-1">Kelompok aktif</h2>
              </div>
              <div className="h-10 w-10 rounded-[13px] bg-white/[.08] grid place-items-center text-[#d8c29a]">
                <Layers3 size={19}/>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {groups.map((g:any) => (
                <div key={g.id} className="rounded-[17px] border border-white/[.09] bg-white/[.055] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-extrabold truncate">{g.name}</div>
                    <span className="text-[11px] text-[#d8c29a] font-extrabold whitespace-nowrap">{g.student_count} siswa</span>
                  </div>
                  <div className="text-[11px] text-white/48 mt-2 truncate">{g.teacher_name || 'Belum ada guru'}</div>
                  <div className="text-[11px] text-white/68 mt-1 truncate">{g.target_label || 'Belum ada target'}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="shell-card p-5 sm:p-6 mt-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="gold-kicker">Aktivitas terkini</span>
              <h2 className="section-title">Setoran terbaru</h2>
            </div>
            <Link href="/students" className="btn-ghost">
              Lihat siswa
              <ChevronRight size={16}/>
            </Link>
          </div>

          <div className="mt-4 grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {recent.map((r:any) => (
              <Link
                href={`/students/${r.student_id}`}
                key={r.id}
                className="soft-card p-4 hover:bg-white hover:border-[#12372A]/[.15] transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-extrabold truncate">{r.full_name}</div>
                  <span className="score-pill">{Number(r.overall_score).toFixed(0)}</span>
                </div>
                <div className="text-sm font-semibold mt-3 truncate">{r.surah_name}</div>
                <div className="flex items-center gap-2 text-[11px] muted mt-2">
                  <Clock3 size={13}/>
                  {formatDate(r.session_date)} · {labelType(r.session_type)}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Metric({icon:Icon,label,value,note,accent=false}:any){
  return (
    <div className={"metric-card " + (accent ? "bg-[#fff8ef]" : "")}>
      <div className="flex items-center justify-between gap-3">
        <span className="gold-kicker">{label}</span>
        <div className={"h-9 w-9 rounded-[12px] grid place-items-center " + (accent ? "bg-[#fff0e5] text-[#9b4f22]" : "bg-[#edf2ee] text-[#456455]")}>
          <Icon size={17}/>
        </div>
      </div>
      <div className="text-3xl sm:text-[38px] font-semibold tracking-[-.045em] mt-4 leading-none">{value}</div>
      <div className="text-[11px] muted mt-2">{note}</div>
    </div>
  );
}

function initials(name:string){
  return name.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase();
}

function formatDate(d:string|Date){
  return new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short'}).format(new Date(d));
}

function labelType(t:string){
  return ({new:'Hafalan baru',murajaah:'Murajaah',tasmi:"Tasmi'",exam:'Ujian'} as any)[t] || t;
}
