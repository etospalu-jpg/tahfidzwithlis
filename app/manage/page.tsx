import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { SubmitButton } from '@/components/submit-button';
import { getCurrentProfile } from '@/lib/current-user';
import { sql } from '@/lib/db';
import { createTeacherAction, createClassAction, createGroupAction, createStudentAction } from './actions';
import { UsersRound, GraduationCap, Layers3, UserPlus, Pencil, UserCog, School } from 'lucide-react';

export const dynamic='force-dynamic';

export default async function ManagePage(){
  const { profile } = await getCurrentProfile();
  const orgId=profile.organization_id;

  const [teachers,classes,groups,students]=await Promise.all([
    sql`select id,employee_code,full_name,title,specialization,phone,is_active from teachers where organization_id=\${orgId} order by full_name`,
    sql`select id,name,grade,homeroom_name from classes where organization_id=\${orgId} order by name`,
    sql`select g.id,g.name,g.target_label,t.full_name as teacher_name,g.teacher_id,
               count(s.id)::int as student_count
        from tahfidz_groups g
        left join teachers t on t.id=g.teacher_id
        left join students s on s.tahfidz_group_id=g.id and s.status='active'
        where g.organization_id=\${orgId}
        group by g.id,t.full_name
        order by g.name`,
    sql`select s.id,s.student_no,s.full_name,s.status,c.name as class_name,g.name as group_name
        from students s
        left join classes c on c.id=s.class_id
        left join tahfidz_groups g on g.id=s.tahfidz_group_id
        where s.organization_id=\${orgId}
        order by s.full_name`
  ]);

  return <AppShell userName={profile.full_name} role={profile.role} institution={profile.institution_name}>
    <div className="fade-up pt-5 sm:pt-8 pb-8">
      <span className="gold-kicker">Master data</span>
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5 mt-2">
        <div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-.045em]">Kelola fondasi program.</h1>
          <p className="muted mt-3 max-w-2xl">Tambah guru, kelas, halaqah, dan siswa dari satu tempat. Semua data langsung tersimpan di Neon.</p>
        </div>
        <div className="pill self-start"><School size={14}/>{students.filter((s:any)=>s.status==='active').length} siswa aktif</div>
      </div>

      <section className="grid xl:grid-cols-2 gap-5 mt-8">
        <CreatePanel icon={UserCog} kicker="Guru" title="Tambah pembimbing tahfidz">
          <form action={createTeacherAction} className="grid sm:grid-cols-2 gap-4">
            <Field label="Nama guru" name="full_name" placeholder="Ustadz/Ustadzah..." required />
            <Field label="Kode guru" name="employee_code" placeholder="GR-003" />
            <Field label="Jabatan" name="title" placeholder="Pembimbing Tahfidz" />
            <Field label="Spesialisasi" name="specialization" placeholder="Tahsin, Juz 30, Tasmi..." />
            <div className="sm:col-span-2"><Field label="No. WhatsApp" name="phone" placeholder="08..." /></div>
            <div className="sm:col-span-2 flex justify-end"><SubmitButton label="Tambah Guru"/></div>
          </form>
        </CreatePanel>

        <CreatePanel icon={GraduationCap} kicker="Kelas" title="Tambah kelas akademik">
          <form action={createClassAction} className="grid sm:grid-cols-2 gap-4">
            <Field label="Nama kelas" name="name" placeholder="VIII A" required />
            <Field label="Jenjang" name="grade" placeholder="VIII" />
            <div className="sm:col-span-2"><Field label="Wali kelas" name="homeroom_name" placeholder="Nama wali kelas" /></div>
            <div className="sm:col-span-2 flex justify-end"><SubmitButton label="Tambah Kelas"/></div>
          </form>
        </CreatePanel>

        <CreatePanel icon={Layers3} kicker="Halaqah" title="Buat kelompok tahfidz">
          <form action={createGroupAction} className="grid sm:grid-cols-2 gap-4">
            <Field label="Nama halaqah" name="name" placeholder="Halaqah An-Nur" required />
            <div><label className="label">Pembimbing</label><select className="field" name="teacher_id"><option value="">Belum ditentukan</option>{teachers.filter((t:any)=>t.is_active).map((t:any)=><option key={t.id} value={t.id}>{t.full_name}</option>)}</select></div>
            <div className="sm:col-span-2"><Field label="Target kelompok" name="target_label" placeholder="Juz 30 · Mutqin" /></div>
            <div className="sm:col-span-2 flex justify-end"><SubmitButton label="Buat Halaqah"/></div>
          </form>
        </CreatePanel>

        <CreatePanel icon={UserPlus} kicker="Siswa" title="Tambah siswa baru">
          <form action={createStudentAction} className="grid sm:grid-cols-2 gap-4">
            <Field label="Nama lengkap" name="full_name" placeholder="Nama siswa" required />
            <Field label="Nomor siswa" name="student_no" placeholder="S-013" />
            <div><label className="label">Jenis kelamin</label><select className="field" name="gender"><option value="">Pilih</option><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
            <div><label className="label">Kelas</label><select className="field" name="class_id"><option value="">Belum ditentukan</option>{classes.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><label className="label">Halaqah</label><select className="field" name="tahfidz_group_id"><option value="">Belum ditentukan</option>{groups.map((g:any)=><option key={g.id} value={g.id}>{g.name}</option>)}</select></div>
            <Field label="Juz berjalan" name="current_juz" type="number" defaultValue="30" min="1" max="30" />
            <Field label="Target jumlah juz" name="target_juz" type="number" defaultValue="1" min="1" max="30" />
            <Field label="Target halaman/bulan" name="target_pages" type="number" defaultValue="20" min="0" step="0.5" />
            <Field label="Nama orang tua" name="parent_name" placeholder="Nama wali" />
            <Field label="WhatsApp orang tua" name="parent_phone" placeholder="08..." />
            <div className="sm:col-span-2"><Field label="Email orang tua" name="parent_email" type="email" placeholder="wali@email.com" /></div>
            <div className="sm:col-span-2 flex justify-end"><SubmitButton label="Tambah Siswa"/></div>
          </form>
        </CreatePanel>
      </section>

      <section className="grid xl:grid-cols-[1.05fr_.95fr] gap-5 mt-5">
        <div className="shell-card p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div><span className="gold-kicker">Siswa</span><h2 className="text-2xl font-semibold tracking-[-.03em] mt-1">Data peserta</h2></div>
            <span className="pill">{students.length} total</span>
          </div>
          <div className="mt-5 divide-y divide-[#12372A]/8">
            {students.map((s:any)=><div key={s.id} className="py-4 flex items-center gap-4">
              <div className="h-11 w-11 rounded-2xl bg-[#edf2ee] grid place-items-center font-black text-[#12372A]">{initials(s.full_name)}</div>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold truncate">{s.full_name}</div>
                <div className="text-xs muted mt-1 truncate">{s.student_no || 'Tanpa nomor'} · {s.class_name || 'Tanpa kelas'} · {s.group_name || 'Tanpa halaqah'}</div>
              </div>
              <span className={"pill "+(s.status==='active'?'':'status-risk')}>{s.status==='active'?'Aktif':s.status}</span>
              <Link href={`/manage/students/\${s.id}`} className="h-10 w-10 rounded-2xl border border-[#12372A]/10 bg-white grid place-items-center"><Pencil size={16}/></Link>
            </div>)}
          </div>
        </div>

        <div className="space-y-5">
          <div className="shell-card p-5 sm:p-7">
            <div className="flex items-center justify-between"><div><span className="gold-kicker">Pembimbing</span><h2 className="text-2xl font-semibold tracking-[-.03em] mt-1">Guru tahfidz</h2></div><UsersRound size={20} className="text-[#B69A62]"/></div>
            <div className="mt-5 space-y-3">
              {teachers.map((t:any)=><div key={t.id} className="soft-card p-4">
                <div className="font-extrabold">{t.full_name}</div>
                <div className="text-xs muted mt-1">{t.title || 'Pembimbing Tahfidz'} · {t.specialization || 'Tahfidz'}</div>
              </div>)}
            </div>
          </div>

          <div className="shell-card p-5 sm:p-7">
            <span className="gold-kicker">Halaqah</span><h2 className="text-2xl font-semibold tracking-[-.03em] mt-1">Kelompok aktif</h2>
            <div className="mt-5 space-y-3">
              {groups.map((g:any)=><div key={g.id} className="soft-card p-4">
                <div className="flex items-center justify-between gap-3"><div className="font-extrabold">{g.name}</div><span className="pill">{g.student_count} siswa</span></div>
                <div className="text-xs muted mt-2">{g.teacher_name || 'Belum ada pembimbing'} · {g.target_label || 'Belum ada target'}</div>
              </div>)}
            </div>
          </div>
        </div>
      </section>
    </div>
  </AppShell>
}

function CreatePanel({icon:Icon,kicker,title,children}:any){
  return <details className="shell-card p-5 sm:p-7 group" open>
    <summary className="list-none cursor-pointer flex items-center gap-3">
      <div className="h-11 w-11 rounded-2xl bg-[#edf2ee] grid place-items-center"><Icon size={19}/></div>
      <div><span className="gold-kicker">{kicker}</span><h2 className="text-xl font-semibold tracking-[-.02em]">{title}</h2></div>
    </summary>
    <div className="mt-6">{children}</div>
  </details>
}

function Field({label,name,type='text',placeholder,required=false,defaultValue,min,max,step}:any){
  return <div><label className="label">{label}</label><input className="field" name={name} type={type} placeholder={placeholder} required={required} defaultValue={defaultValue} min={min} max={max} step={step}/></div>
}

function initials(n:string){return n.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase()}
