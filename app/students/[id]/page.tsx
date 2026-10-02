import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { getPageData } from '@/lib/page-data';
import type { StudentDetailData } from '@/lib/neon-api';
import {
  ArrowLeft,
  BookOpen,
  Target,
  Sparkles,
  Clock3,
  MessageSquareText,
  PlusCircle,
  UserRound,
  Layers3,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentDetailPage({ params }: { params: Promise<{id:string}> }) {
  const { id } = await params;
  const { profile, data } = await getPageData<StudentDetailData | null>('student_detail', id);
  if (!data) notFound();

  const student:any = data.student;
  const sessions:any[] = data.sessions || [];
  const notes:any[] = data.notes || [];
  const current:any = sessions[0];
  const target:any = data.target && Object.keys(data.target).length
    ? data.target
    : {done_pages:0,target_pages:student.target_pages};

  const pct = Math.min(
    100,
    Math.round(Number(target.done_pages || 0) / Math.max(1, Number(target.target_pages || 1)) * 100)
  );
  const avg = sessions.length
    ? Math.round(sessions.reduce((a:number,b:any)=>a + Number(b.overall_score),0) / sessions.length)
    : 0;

  return (
    <AppShell userName={profile.full_name} role={profile.role} institution={profile.institution_name}>
      <div className="page-section fade-up">
        <Link href="/students" className="btn-ghost px-0 hover:bg-transparent">
          <ArrowLeft size={17}/>
          Semua siswa
        </Link>

        <section className="shell-card mt-3 p-5 sm:p-7">
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-[22px] bg-[#1C4C6E] text-white grid place-items-center text-xl sm:text-2xl font-black shrink-0">
              {initials(student.full_name)}
            </div>

            <div className="min-w-0 flex-1">
              <span className="gold-kicker">{student.student_no || 'Profil siswa'}</span>
              <h1 className="text-[32px] sm:text-[44px] leading-[1.02] font-semibold tracking-[-.045em] mt-1.5">
                {student.full_name}
              </h1>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="pill"><Layers3 size={13}/>{student.class_name || 'Tanpa kelas'}</span>
                <span className="pill">{student.group_name || 'Tanpa halaqah'}</span>
                <span className="pill"><UserRound size={13}/>{student.teacher_name || 'Belum ada pembimbing'}</span>
              </div>
            </div>

            <Link href={`/setoran?student=${student.id}`} className="btn-primary self-start lg:self-center">
              <PlusCircle size={18}/>
              Catat Setoran
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <Mini
              icon={Target}
              label="Target bulan"
              value={`${pct}%`}
              note={`${Number(target.done_pages||0).toFixed(1)} / ${Number(target.target_pages||0).toFixed(0)} halaman`}
            />
            <Mini
              icon={Sparkles}
              label="Rata-rata kualitas"
              value={avg ? String(avg) : '—'}
              note="12 setoran terakhir"
            />
            <Mini
              icon={BookOpen}
              label="Setoran terakhir"
              value={current?.surah_name || '—'}
              note={current ? `${formatDate(current.session_date)} · ${labelType(current.session_type)}` : 'Belum ada setoran'}
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3 text-xs font-extrabold">
              <span>Progres target aktif</span>
              <span className="text-[#153B57]">{pct}%</span>
            </div>
            <div className="progress-track mt-2.5">
              <div className="progress-fill" style={{width:`${pct}%`}}/>
            </div>
          </div>
        </section>

        <section className="grid xl:grid-cols-[1.25fr_.75fr] gap-4 mt-4">
          <div className="shell-card p-5 sm:p-6">
            <div>
              <span className="gold-kicker">Riwayat hafalan</span>
              <h2 className="section-title">Setoran & murajaah</h2>
            </div>

            <div className="mt-4">
              {sessions.map((r:any)=>(
                <div key={r.id} className="data-row">
                  <div className="flex gap-3 min-w-0">
                    <div className="icon-box shrink-0"><Clock3 size={18}/></div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold truncate">{r.surah_name}</span>
                        <span className="score-pill">{Number(r.overall_score).toFixed(0)}</span>
                      </div>
                      <div className="text-[11px] sm:text-xs muted mt-1.5">
                        {formatDate(r.session_date)} · {labelType(r.session_type)} · Ayat {r.start_ayah || '—'}–{r.end_ayah || '—'}
                      </div>
                      {r.notes && (
                        <p className="text-sm mt-2.5 text-[#607687] leading-6">{r.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {!sessions.length && (
                <div className="py-10 text-center">
                  <div className="icon-box mx-auto"><BookOpen size={19}/></div>
                  <div className="font-extrabold mt-4">Belum ada setoran</div>
                  <p className="text-sm muted mt-1">Mulai catat setoran pertama siswa ini.</p>
                </div>
              )}
            </div>
          </div>

          <div className="shell-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="gold-kicker">Catatan guru</span>
                <h2 className="section-title">Konteks perkembangan</h2>
              </div>
              <div className="icon-box icon-box-gold">
                <MessageSquareText size={18}/>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {notes.map((n:any)=>(
                <div key={n.id} className="soft-card p-4">
                  <p className="text-sm leading-6">{n.content}</p>
                  <div className="text-[11px] muted mt-3">
                    {n.teacher_name || 'Guru'} · {formatDate(n.created_at)}
                  </div>
                </div>
              ))}

              {!notes.length && (
                <div className="soft-card p-5 text-sm muted">
                  Belum ada catatan perkembangan.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Mini({icon:Icon,label,value,note}:any){
  return (
    <div className="soft-card p-4 sm:p-5">
      <div className="flex items-center gap-2 text-[11px] font-extrabold muted">
        <Icon size={16}/>
        {label}
      </div>
      <div className="text-2xl sm:text-[28px] font-semibold tracking-[-.035em] mt-3 truncate">{value}</div>
      <div className="text-[11px] muted mt-1.5 truncate">{note}</div>
    </div>
  );
}

function initials(name:string){
  return name.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase();
}

function formatDate(d:string|Date){
  return new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',year:'numeric'}).format(new Date(d));
}

function labelType(t:string){
  return ({new:'Hafalan baru',murajaah:'Murajaah',tasmi:"Tasmi'",exam:'Ujian'} as any)[t] || t;
}
