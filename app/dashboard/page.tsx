import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { getCurrentProfile } from '@/lib/current-user';
import { sql } from '@/lib/db';
import { ArrowUpRight, BookOpen, Clock3, Sparkles, Users, AlertCircle, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { profile } = await getCurrentProfile();
  const orgId = profile.organization_id;

  const [summary, focus, recent, groups] = await Promise.all([
    sql`
      with last_sessions as (
        select distinct on (student_id) student_id, session_date, overall_score, status
        from memorization_sessions where organization_id=${orgId}
        order by student_id, session_date desc, created_at desc
      )
      select
        (select count(*) from students where organization_id=${orgId} and status='active')::int as students,
        (select count(*) from memorization_sessions where organization_id=${orgId} and date_trunc('month',session_date)=date_trunc('month',current_date))::int as sessions_month,
        coalesce((select round(avg(overall_score),1) from memorization_sessions where organization_id=${orgId} and session_date >= current_date-30),0) as avg_score,
        (select count(*) from students s left join last_sessions l on l.student_id=s.id
         where s.organization_id=${orgId} and s.status='active'
           and (l.session_date is null or l.session_date < current_date-7 or l.overall_score<80))::int as need_attention
    `,
    sql`
      with last_sessions as (
        select distinct on (student_id) student_id, session_date, overall_score, status, surah_name
        from memorization_sessions where organization_id=${orgId}
        order by student_id, session_date desc, created_at desc
      )
      select s.id,s.full_name,g.name as group_name,l.session_date,l.overall_score,l.status,l.surah_name,
        case
          when l.session_date is null then 'Belum ada setoran'
          when l.session_date < current_date-7 then (current_date-l.session_date)::text || ' hari belum setor'
          when l.overall_score < 80 then 'Nilai terakhir perlu perhatian'
          when l.status='perlu_murajaah' then 'Perlu penguatan murajaah'
          else 'Pantau target bulan ini'
        end as reason
      from students s
      left join tahfidz_groups g on g.id=s.tahfidz_group_id
      left join last_sessions l on l.student_id=s.id
      where s.organization_id=${orgId} and s.status='active'
        and (l.session_date is null or l.session_date < current_date-7 or l.overall_score<80 or l.status='perlu_murajaah')
      order by coalesce(l.session_date,'1900-01-01'::date) asc
      limit 5
    `,
    sql`
      select ms.id,ms.session_date,ms.session_type,ms.surah_name,ms.overall_score,
             s.id as student_id,s.full_name
      from memorization_sessions ms
      join students s on s.id=ms.student_id
      where ms.organization_id=${orgId}
      order by ms.session_date desc, ms.created_at desc
      limit 6
    `,
    sql`
      select g.id,g.name,g.target_label,t.full_name as teacher_name,count(s.id)::int as student_count
      from tahfidz_groups g
      left join teachers t on t.id=g.teacher_id
      left join students s on s.tahfidz_group_id=g.id and s.status='active'
      where g.organization_id=${orgId}
      group by g.id,t.full_name
      order by g.name
    `
  ]);

  const s:any = summary[0];

  return (
    <AppShell userName={profile.full_name} role={profile.role} institution={profile.institution_name}>
      <div className="fade-up pb-8">
        <section className="pt-5 sm:pt-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div>
            <span className="gold-kicker">Workspace hari ini</span>
            <h1 className="text-[38px] sm:text-[52px] font-semibold tracking-[-.052em] leading-[1.03] mt-2">
              Assalamu’alaikum,<br/><span className="text-[#5e6b63]">{String(profile.full_name).split(' ')[0]}.</span>
            </h1>
            <p className="muted mt-4 max-w-xl leading-7">Pantau kondisi hafalan, tentukan prioritas, lalu catat setoran tanpa kehilangan konteks perkembangan siswa.</p>
          </div>
          <Link href="/setoran" className="btn-primary self-start xl:self-auto"><BookOpen size={18}/> Catat Setoran <ArrowUpRight size={16}/></Link>
        </section>

        <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mt-8">
          <Metric icon={Users} label="Siswa aktif" value={String(s.students)} note="dalam pembinaan" />
          <Metric icon={BookOpen} label="Setoran bulan ini" value={String(s.sessions_month)} note="aktivitas tercatat" />
          <Metric icon={Sparkles} label="Rata-rata kualitas" value={String(s.avg_score)} note="30 hari terakhir" />
          <Metric icon={AlertCircle} label="Perlu perhatian" value={String(s.need_attention)} note="prioritas guru" accent />
        </section>

        <section className="grid xl:grid-cols-[1.35fr_.65fr] gap-5 mt-5">
          <div className="shell-card p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div><span className="gold-kicker">Prioritas</span><h2 className="text-2xl font-semibold tracking-[-.03em] mt-1">Fokus hari ini</h2></div>
              <span className="pill">{focus.length} siswa</span>
            </div>
            <div className="mt-5 divide-y divide-[#12372A]/8">
              {focus.length === 0 ? (
                <div className="py-10 text-center"><Sparkles className="mx-auto text-[#B69A62]"/><div className="font-bold mt-3">Semua terlihat stabil</div><p className="muted text-sm mt-1">Belum ada siswa yang masuk indikator perhatian.</p></div>
              ) : focus.map((item:any) => (
                <Link key={item.id} href={`/students/${item.id}`} className="table-row flex items-center gap-4 py-4 rounded-xl px-2 -mx-2">
                  <div className="h-11 w-11 rounded-2xl bg-[#eef2ee] grid place-items-center font-black text-[#12372A]">{initials(item.full_name)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold truncate">{item.full_name}</div>
                    <div className="text-xs muted mt-1 truncate">{item.group_name || 'Belum ada halaqah'} · {item.reason}</div>
                  </div>
                  <ChevronRight size={18} className="muted shrink-0"/>
                </Link>
              ))}
            </div>
          </div>

          <div className="shell-card p-5 sm:p-7 bg-[#12372A] !text-white">
            <span className="text-[#d8c29a] text-[11px] font-black tracking-[.15em] uppercase">Halaqah</span>
            <h2 className="text-2xl font-semibold tracking-[-.03em] mt-1">Kelompok aktif</h2>
            <div className="mt-6 space-y-4">
              {groups.map((g:any) => (
                <div key={g.id} className="rounded-2xl border border-white/10 bg-white/[.055] p-4">
                  <div className="flex items-center justify-between gap-3"><div className="font-extrabold">{g.name}</div><span className="text-xs text-[#d8c29a] font-bold">{g.student_count} siswa</span></div>
                  <div className="text-xs text-white/48 mt-2">{g.teacher_name || 'Belum ada guru'}</div>
                  <div className="text-xs text-white/64 mt-1">{g.target_label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="shell-card p-5 sm:p-7 mt-5">
          <div className="flex items-end justify-between gap-4">
            <div><span className="gold-kicker">Aktivitas</span><h2 className="text-2xl font-semibold tracking-[-.03em] mt-1">Setoran terbaru</h2></div>
            <Link href="/students" className="text-sm font-extrabold text-[#12372A]">Lihat siswa</Link>
          </div>
          <div className="mt-5 grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {recent.map((r:any) => (
              <Link href={`/students/${r.student_id}`} key={r.id} className="soft-card p-4 hover:bg-white transition">
                <div className="flex items-center justify-between gap-3"><div className="font-extrabold truncate">{r.full_name}</div><span className="pill">{Number(r.overall_score).toFixed(0)}</span></div>
                <div className="text-sm mt-3">{r.surah_name}</div>
                <div className="flex items-center gap-2 text-xs muted mt-2"><Clock3 size={13}/>{formatDate(r.session_date)} · {labelType(r.session_type)}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Metric({icon:Icon,label,value,note,accent=false}:any){
  return <div className={"metric-card "+(accent?"bg-[#fff8ef]":"")}><div className="flex items-center justify-between"><span className="gold-kicker">{label}</span><Icon size={18} className={accent?"text-[#a55c28]":"text-[#456455]"}/></div><div className="text-3xl sm:text-4xl font-semibold tracking-[-.04em] mt-5">{value}</div><div className="text-[11px] muted mt-1">{note}</div></div>
}
function initials(n:string){return n.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase()}
function formatDate(d:string|Date){return new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short'}).format(new Date(d))}
function labelType(t:string){return ({new:'Hafalan baru',murajaah:'Murajaah',tasmi:"Tasmi'",exam:'Ujian'} as any)[t]||t}
