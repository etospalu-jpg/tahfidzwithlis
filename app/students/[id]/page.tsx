import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { getCurrentProfile } from '@/lib/current-user';
import { sql } from '@/lib/db';
import { ArrowLeft, BookOpen, Target, Sparkles, Clock3, MessageSquareText, PlusCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentDetailPage({ params }: { params: Promise<{id:string}> }) {
  const { profile } = await getCurrentProfile();
  const { id } = await params;

  const students = await sql`
    select s.*,c.name as class_name,g.name as group_name,t.full_name as teacher_name
    from students s
    left join classes c on c.id=s.class_id
    left join tahfidz_groups g on g.id=s.tahfidz_group_id
    left join teachers t on t.id=g.teacher_id
    where s.id=${id} and s.organization_id=${profile.organization_id}
    limit 1`;

  if (!students.length) notFound();
  const student:any=students[0];

  const [sessions, targetRows, notes] = await Promise.all([
    sql`select * from memorization_sessions where student_id=${id} order by session_date desc,created_at desc limit 12`,
    sql`
      select coalesce(sum(ms.pages),0) as done_pages, mt.target_pages
      from memorization_targets mt
      left join memorization_sessions ms on ms.student_id=mt.student_id and ms.session_date between mt.start_date and mt.end_date
      where mt.student_id=${id} and mt.status='active'
      group by mt.id,mt.target_pages
      order by mt.start_date desc
      limit 1`,
    sql`
      select n.*,t.full_name as teacher_name
      from teacher_notes n
      left join teachers t on t.id=n.teacher_id
      where n.student_id=${id}
      order by n.created_at desc
      limit 5`
  ]);

  const current:any = sessions[0];
  const target:any = targetRows[0] || {done_pages:0,target_pages:student.target_pages};
  const pct = Math.min(100, Math.round(Number(target.done_pages||0)/Math.max(1,Number(target.target_pages||1))*100));
  const avg = sessions.length ? Math.round(sessions.reduce((a:number,b:any)=>a+Number(b.overall_score),0)/sessions.length) : 0;

  return (
    <AppShell userName={profile.full_name} role={profile.role} institution={profile.institution_name}>
      <div className="fade-up pt-5 sm:pt-8 pb-8">
        <Link href="/students" className="inline-flex items-center gap-2 text-sm muted hover:text-[#12372A]"><ArrowLeft size={16}/> Semua siswa</Link>

        <section className="mt-5 shell-card p-5 sm:p-8">
          <div className="flex flex-col xl:flex-row xl:items-center gap-6">
            <div className="h-20 w-20 rounded-[26px] bg-[#12372A] text-white grid place-items-center text-2xl font-black">{initials(student.full_name)}</div>
            <div className="min-w-0 flex-1">
              <span className="gold-kicker">{student.student_no}</span>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-.045em] mt-1">{student.full_name}</h1>
              <p className="muted mt-2">{student.class_name || 'Tanpa kelas'} · {student.group_name || 'Tanpa halaqah'} · {student.teacher_name || 'Belum ada pembimbing'}</p>
            </div>
            <Link href={`/setoran?student=${student.id}`} className="btn-primary self-start xl:self-auto"><PlusCircle size={17}/> Catat Setoran</Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mt-8">
            <Mini icon={Target} label="Target bulan" value={`${pct}%`} note={`${Number(target.done_pages||0).toFixed(1)} / ${Number(target.target_pages||0).toFixed(0)} halaman`} />
            <Mini icon={Sparkles} label="Rata-rata kualitas" value={avg?String(avg):'—'} note="12 setoran terakhir" />
            <Mini icon={BookOpen} label="Terakhir" value={current?.surah_name || '—'} note={current ? `${formatDate(current.session_date)} · ${labelType(current.session_type)}` : 'Belum ada setoran'} />
          </div>

          <div className="mt-7">
            <div className="flex items-center justify-between text-xs font-bold"><span>Progres target aktif</span><span>{pct}%</span></div>
            <div className="progress-track mt-2"><div className="progress-fill" style={{width:`${pct}%`}}/></div>
          </div>
        </section>

        <section className="grid xl:grid-cols-[1.25fr_.75fr] gap-5 mt-5">
          <div className="shell-card p-5 sm:p-7">
            <span className="gold-kicker">Riwayat</span>
            <h2 className="text-2xl font-semibold tracking-[-.03em] mt-1">Setoran & murajaah</h2>
            <div className="mt-5 divide-y divide-[#12372A]/8">
              {sessions.map((r:any)=>(
                <div key={r.id} className="py-4 flex gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-[#edf2ee] grid place-items-center shrink-0"><Clock3 size={16}/></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><span className="font-extrabold">{r.surah_name}</span><span className="pill">{Number(r.overall_score).toFixed(0)}</span></div>
                    <div className="text-xs muted mt-1">{formatDate(r.session_date)} · {labelType(r.session_type)} · Ayat {r.start_ayah || '—'}–{r.end_ayah || '—'}</div>
                    {r.notes && <p className="text-sm mt-2 text-[#4f5c54]">{r.notes}</p>}
                  </div>
                </div>
              ))}
              {!sessions.length && <p className="muted text-sm py-8 text-center">Belum ada riwayat setoran.</p>}
            </div>
          </div>

          <div className="shell-card p-5 sm:p-7">
            <div className="flex items-center gap-2"><MessageSquareText size={18} className="text-[#B69A62]"/><span className="gold-kicker">Catatan guru</span></div>
            <h2 className="text-2xl font-semibold tracking-[-.03em] mt-2">Konteks perkembangan</h2>
            <div className="mt-5 space-y-3">
              {notes.map((n:any)=>(
                <div key={n.id} className="soft-card p-4">
                  <p className="text-sm leading-6">{n.content}</p>
                  <div className="text-[11px] muted mt-3">{n.teacher_name || 'Guru'} · {formatDate(n.created_at)}</div>
                </div>
              ))}
              {!notes.length && <p className="muted text-sm">Belum ada catatan perkembangan.</p>}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Mini({icon:Icon,label,value,note}:any){
  return <div className="soft-card p-4"><div className="flex items-center gap-2 text-xs font-bold muted"><Icon size={15}/>{label}</div><div className="text-2xl font-semibold tracking-[-.03em] mt-3">{value}</div><div className="text-[11px] muted mt-1">{note}</div></div>
}
function initials(n:string){return n.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase()}
function formatDate(d:string|Date){return new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',year:'numeric'}).format(new Date(d))}
function labelType(t:string){return ({new:'Hafalan baru',murajaah:'Murajaah',tasmi:"Tasmi'",exam:'Ujian'} as any)[t]||t}
