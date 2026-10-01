import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { SubmitButton } from '@/components/submit-button';
import { getPageData } from '@/lib/page-data';
import type { StudentEditData } from '@/lib/neon-api';
import { updateStudentAction } from '../../actions';
import {
  ArrowLeft,
  UserRoundCog,
  BadgeCheck,
  School,
  Layers3,
} from 'lucide-react';

export const dynamic='force-dynamic';

export default async function EditStudentPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const { profile, data } = await getPageData<StudentEditData | null>('student_edit', id);
  if (!data) notFound();

  const s:any = data.student;
  const classes:any[] = data.classes || [];
  const groups:any[] = data.groups || [];

  return (
    <AppShell userName={profile.full_name} role={profile.role} institution={profile.institution_name}>
      <div className="page-section fade-up">
        <Link href="/manage" className="btn-ghost px-0 hover:bg-transparent">
          <ArrowLeft size={17}/>
          Kembali ke master data
        </Link>

        <div className="page-header mt-2">
          <div className="page-header-copy">
            <span className="gold-kicker">Edit siswa</span>
            <h1 className="page-title">{s.full_name}</h1>
            <p className="page-subtitle">
              Perbarui identitas, penempatan kelas dan halaqah, target, serta kontak orang tua.
            </p>
          </div>
          <span className={"pill self-start " + (s.status === 'active' ? '' : 'status-risk')}>
            <BadgeCheck size={15}/>
            {statusLabel(s.status)}
          </span>
        </div>

        <form action={updateStudentAction} className="mt-6 grid xl:grid-cols-[1.05fr_.95fr] gap-4 items-start">
          <section className="shell-card p-5 sm:p-6">
            <SectionHeader
              icon={UserRoundCog}
              kicker="Identitas"
              title="Data siswa"
              subtitle="Informasi dasar dan status keaktifan."
            />

            <input type="hidden" name="id" value={s.id}/>

            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              <Field label="Nama lengkap" name="full_name" defaultValue={s.full_name} required />
              <Field label="Nomor siswa" name="student_no" defaultValue={s.student_no || ''} />

              <div>
                <label className="label">Jenis kelamin</label>
                <select className="field" name="gender" defaultValue={s.gender || ''}>
                  <option value="">Pilih</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="label">Status</label>
                <select className="field" name="status" defaultValue={s.status}>
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                  <option value="graduated">Lulus</option>
                </select>
              </div>

              <div>
                <label className="label">Kelas</label>
                <div className="relative">
                  <School size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#738078] pointer-events-none"/>
                  <select className="field !pl-10" name="class_id" defaultValue={s.class_id || ''}>
                    <option value="">Belum ditentukan</option>
                    {classes.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Halaqah</label>
                <div className="relative">
                  <Layers3 size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#738078] pointer-events-none"/>
                  <select className="field !pl-10" name="tahfidz_group_id" defaultValue={s.tahfidz_group_id || ''}>
                    <option value="">Belum ditentukan</option>
                    {groups.map((g:any)=><option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-4">
            <section className="shell-card p-5 sm:p-6">
              <SectionHeader
                icon={BadgeCheck}
                kicker="Target"
                title="Arah pembinaan"
                subtitle="Target hafalan dan progres yang sedang berjalan."
                gold
              />

              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <Field label="Juz berjalan" name="current_juz" type="number" defaultValue={s.current_juz} min="1" max="30"/>
                <Field label="Target jumlah juz" name="target_juz" type="number" defaultValue={s.target_juz} min="1" max="30"/>
                <div className="sm:col-span-2">
                  <Field label="Target halaman/bulan" name="target_pages" type="number" defaultValue={s.target_pages} min="0" step="0.5"/>
                </div>
              </div>
            </section>

            <section className="shell-card p-5 sm:p-6">
              <span className="gold-kicker">Orang tua / wali</span>
              <h2 className="section-title">Kontak pendamping</h2>

              <div className="grid gap-4 mt-5">
                <Field label="Nama orang tua" name="parent_name" defaultValue={s.parent_name || ''}/>
                <Field label="WhatsApp orang tua" name="parent_phone" defaultValue={s.parent_phone || ''}/>
                <Field label="Email orang tua" name="parent_email" type="email" defaultValue={s.parent_email || ''}/>
              </div>

              <div className="mt-5 border-t border-[#12372A]/[.08] pt-4">
                <p className="text-[11px] muted leading-5 mb-4">
                  Perubahan akan langsung memengaruhi dashboard, halaqah, dan laporan siswa.
                </p>
                <SubmitButton label="Simpan Perubahan"/>
              </div>
            </section>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

function SectionHeader({icon:Icon,kicker,title,subtitle,gold=false}:any){
  return (
    <div className="flex items-start gap-3">
      <div className={"icon-box " + (gold ? "icon-box-gold" : "")}>
        <Icon size={19}/>
      </div>
      <div>
        <span className="gold-kicker">{kicker}</span>
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function Field({label,name,type='text',defaultValue,required=false,min,max,step}:any){
  return (
    <div>
      <label className="label">{label}</label>
      <input
        className="field"
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}

function statusLabel(status:string){
  return ({active:'Aktif',inactive:'Nonaktif',graduated:'Lulus'} as Record<string,string>)[status] || status;
}
