import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { SubmitButton } from '@/components/submit-button';
import { getPageData } from '@/lib/page-data';
import type { ManageData } from '@/lib/neon-api';
import {
  createTeacherAction,
  createClassAction,
  createGroupAction,
  createStudentAction,
} from './actions';
import {
  UsersRound,
  GraduationCap,
  Layers3,
  UserPlus,
  Pencil,
  UserCog,
  School,
  ChevronDown,
} from 'lucide-react';

export const dynamic='force-dynamic';

export default async function ManagePage(){
  const { profile, data } = await getPageData<ManageData>('manage');
  const teachers = data.teachers || [];
  const classes = data.classes || [];
  const groups = data.groups || [];
  const students = data.students || [];
  const activeStudents = students.filter((s:any)=>s.status==='active').length;

  return (
    <AppShell userName={profile.full_name} role={profile.role} institution={profile.institution_name}>
      <div className="page-section fade-up">
        <div className="page-header">
          <div className="page-header-copy">
            <span className="gold-kicker">Master data</span>
            <h1 className="page-title">Kelola fondasi program.</h1>
            <p className="page-subtitle">
              Atur guru, kelas, halaqah, dan siswa dari satu workspace. Form tambah dibuat ringkas agar halaman tetap mudah dipindai.
            </p>
          </div>
          <div className="pill self-start"><School size={15}/>{activeStudents} siswa aktif</div>
        </div>

        <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 mt-6">
          <Overview icon={UsersRound} label="Guru" value={teachers.length}/>
          <Overview icon={GraduationCap} label="Kelas" value={classes.length}/>
          <Overview icon={Layers3} label="Halaqah" value={groups.length}/>
          <Overview icon={School} label="Siswa" value={students.length}/>
        </section>

        <section className="grid lg:grid-cols-2 gap-4 mt-4">
          <CreatePanel icon={UserCog} kicker="Guru" title="Tambah pembimbing" subtitle="Identitas dan spesialisasi guru tahfidz.">
            <form action={createTeacherAction} className="grid sm:grid-cols-2 gap-4">
              <Field label="Nama guru" name="full_name" placeholder="Ustadz/Ustadzah..." required />
              <Field label="Kode guru" name="employee_code" placeholder="GR-003" />
              <Field label="Jabatan" name="title" placeholder="Pembimbing Tahfidz" />
              <Field label="Spesialisasi" name="specialization" placeholder="Tahsin, Juz 30, Tasmi..." />
              <div className="sm:col-span-2"><Field label="No. WhatsApp" name="phone" placeholder="08..." /></div>
              <div className="sm:col-span-2 flex justify-end"><SubmitButton label="Tambah Guru"/></div>
            </form>
          </CreatePanel>

          <CreatePanel icon={GraduationCap} kicker="Kelas" title="Tambah kelas" subtitle="Kelas akademik tempat siswa terdaftar.">
            <form action={createClassAction} className="grid sm:grid-cols-2 gap-4">
              <Field label="Nama kelas" name="name" placeholder="VIII A" required />
              <Field label="Jenjang" name="grade" placeholder="VIII" />
              <div className="sm:col-span-2"><Field label="Wali kelas" name="homeroom_name" placeholder="Nama wali kelas" /></div>
              <div className="sm:col-span-2 flex justify-end"><SubmitButton label="Tambah Kelas"/></div>
            </form>
          </CreatePanel>

          <CreatePanel icon={Layers3} kicker="Halaqah" title="Buat halaqah" subtitle="Kelompok pembinaan beserta pembimbingnya.">
            <form action={createGroupAction} className="grid sm:grid-cols-2 gap-4">
              <Field label="Nama halaqah" name="name" placeholder="Halaqah An-Nur" required />
              <div>
                <label className="label">Pembimbing</label>
                <select className="field" name="teacher_id">
                  <option value="">Belum ditentukan</option>
                  {teachers.filter((t:any)=>t.is_active).map((t:any)=>(
                    <option key={t.id} value={t.id}>{t.full_name}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2"><Field label="Target kelompok" name="target_label" placeholder="Juz 30 · Mutqin" /></div>
              <div className="sm:col-span-2 flex justify-end"><SubmitButton label="Buat Halaqah"/></div>
            </form>
          </CreatePanel>

          <CreatePanel icon={UserPlus} kicker="Siswa" title="Tambah siswa" subtitle="Profil dasar, kelas, halaqah, dan target bulanan.">
            <form action={createStudentAction} className="grid sm:grid-cols-2 gap-4">
              <Field label="Nama lengkap" name="full_name" placeholder="Nama siswa" required />
              <Field label="Nomor siswa" name="student_no" placeholder="S-013" />
              <div>
                <label className="label">Jenis kelamin</label>
                <select className="field" name="gender">
                  <option value="">Pilih</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="label">Kelas</label>
                <select className="field" name="class_id">
                  <option value="">Belum ditentukan</option>
                  {classes.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Halaqah</label>
                <select className="field" name="tahfidz_group_id">
                  <option value="">Belum ditentukan</option>
                  {groups.map((g:any)=><option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
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

        <section className="grid xl:grid-cols-[1.08fr_.92fr] gap-4 mt-4">
          <div className="shell-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="gold-kicker">Peserta</span>
                <h2 className="section-title">Data siswa</h2>
                <p className="section-subtitle mt-1">Edit kelas, halaqah, target, kontak orang tua, dan status siswa.</p>
              </div>
              <span className="pill">{students.length} total</span>
            </div>

            <div className="mt-4">
              {students.map((s:any)=>(
                <div key={s.id} className="data-row">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="student-avatar shrink-0">{initials(s.full_name)}</div>
                    <div className="min-w-0">
                      <div className="font-extrabold truncate">{s.full_name}</div>
                      <div className="text-[11px] sm:text-xs muted mt-1 truncate">
                        {s.student_no || 'Tanpa nomor'} · {s.class_name || 'Tanpa kelas'} · {s.group_name || 'Tanpa halaqah'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={"pill hidden sm:inline-flex " + (s.status==='active' ? '' : 'status-risk')}>
                      {s.status==='active' ? 'Aktif' : s.status}
                    </span>
                    <Link
                      href={`/manage/students/${s.id}`}
                      prefetch={false}
                      className="h-10 w-10 rounded-[13px] border border-[#12372A]/[.10] bg-white grid place-items-center text-[#415049] hover:border-[#12372A]/[.22] transition"
                      aria-label={`Edit ${s.full_name}`}
                    >
                      <Pencil size={17}/>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="shell-card p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="gold-kicker">Pembimbing</span>
                  <h2 className="section-title">Guru tahfidz</h2>
                </div>
                <div className="icon-box"><UsersRound size={19}/></div>
              </div>
              <div className="mt-4 space-y-2.5">
                {teachers.map((t:any)=>(
                  <div key={t.id} className="soft-card p-4">
                    <div className="font-extrabold truncate">{t.full_name}</div>
                    <div className="text-[11px] muted mt-1.5 truncate">
                      {t.title || 'Pembimbing Tahfidz'} · {t.specialization || 'Tahfidz'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="shell-card p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="gold-kicker">Kelompok</span>
                  <h2 className="section-title">Halaqah aktif</h2>
                </div>
                <div className="icon-box icon-box-gold"><Layers3 size={19}/></div>
              </div>
              <div className="mt-4 space-y-2.5">
                {groups.map((g:any)=>(
                  <div key={g.id} className="soft-card p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-extrabold truncate">{g.name}</div>
                      <span className="pill">{g.student_count} siswa</span>
                    </div>
                    <div className="text-[11px] muted mt-2 truncate">
                      {g.teacher_name || 'Belum ada pembimbing'} · {g.target_label || 'Belum ada target'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Overview({icon:Icon,label,value}:any){
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between gap-3">
        <span className="gold-kicker">{label}</span>
        <div className="h-9 w-9 rounded-[12px] bg-[#edf2ee] text-[#456455] grid place-items-center">
          <Icon size={17}/>
        </div>
      </div>
      <div className="text-3xl font-semibold tracking-[-.04em] mt-4">{value}</div>
    </div>
  );
}

function CreatePanel({icon:Icon,kicker,title,subtitle,children}:any){
  return (
    <details className="shell-card group overflow-hidden">
      <summary className="list-none cursor-pointer p-5 sm:p-6 flex items-center gap-3">
        <div className="icon-box"><Icon size={19}/></div>
        <div className="min-w-0 flex-1">
          <span className="gold-kicker">{kicker}</span>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle mt-1">{subtitle}</p>
        </div>
        <ChevronDown size={19} className="muted transition-transform group-open:rotate-180"/>
      </summary>
      <div className="border-t border-[#12372A]/[.08] p-5 sm:p-6 pt-5">
        {children}
      </div>
    </details>
  );
}

function Field({label,name,type='text',placeholder,required=false,defaultValue,min,max,step}:any){
  return (
    <div>
      <label className="label">{label}</label>
      <input
        className="field"
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}

function initials(name:string){
  return name.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase();
}
