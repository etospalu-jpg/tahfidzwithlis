import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { SubmitButton } from '@/components/submit-button';
import { getCurrentProfile } from '@/lib/current-user';
import { getAdminToken } from '@/lib/admin-session';
import { getStudentEditData } from '@/lib/neon-api';
import { updateStudentAction } from '../../actions';
import { ArrowLeft, UserRoundCog } from 'lucide-react';

export const dynamic='force-dynamic';

export default async function EditStudentPage({params}:{params:Promise<{id:string}>}){
  const {profile}=await getCurrentProfile();
  const {id}=await params;
  const token = await getAdminToken();
  if (!token) throw new Error('Admin session is required');

  const data = await getStudentEditData(token, id);
  if (!data) notFound();

  const s:any = data.student;
  const classes:any[] = data.classes || [];
  const groups:any[] = data.groups || [];

  return <AppShell userName={profile.full_name} role={profile.role} institution={profile.institution_name}>
    <div className="fade-up pt-5 sm:pt-8 pb-8">
      <Link href="/manage" className="inline-flex items-center gap-2 text-sm muted hover:text-[#12372A]"><ArrowLeft size={16}/> Kembali ke master data</Link>
      <div className="shell-card max-w-4xl mt-5 p-5 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-[20px] bg-[#12372A] text-white grid place-items-center"><UserRoundCog size={23}/></div>
          <div><span className="gold-kicker">Edit siswa</span><h1 className="text-3xl sm:text-4xl font-semibold tracking-[-.04em]">{s.full_name}</h1></div>
        </div>

        <form action={updateStudentAction} className="grid sm:grid-cols-2 gap-4 mt-8">
          <input type="hidden" name="id" value={s.id}/>
          <Field label="Nama lengkap" name="full_name" defaultValue={s.full_name} required />
          <Field label="Nomor siswa" name="student_no" defaultValue={s.student_no || ''} />
          <div><label className="label">Jenis kelamin</label><select className="field" name="gender" defaultValue={s.gender || ''}><option value="">Pilih</option><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
          <div><label className="label">Status</label><select className="field" name="status" defaultValue={s.status}><option value="active">Aktif</option><option value="inactive">Nonaktif</option><option value="graduated">Lulus</option></select></div>
          <div><label className="label">Kelas</label><select className="field" name="class_id" defaultValue={s.class_id || ''}><option value="">Belum ditentukan</option>{classes.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div><label className="label">Halaqah</label><select className="field" name="tahfidz_group_id" defaultValue={s.tahfidz_group_id || ''}><option value="">Belum ditentukan</option>{groups.map((g:any)=><option key={g.id} value={g.id}>{g.name}</option>)}</select></div>
          <Field label="Juz berjalan" name="current_juz" type="number" defaultValue={s.current_juz} min="1" max="30"/>
          <Field label="Target jumlah juz" name="target_juz" type="number" defaultValue={s.target_juz} min="1" max="30"/>
          <Field label="Target halaman/bulan" name="target_pages" type="number" defaultValue={s.target_pages} min="0" step="0.5"/>
          <Field label="Nama orang tua" name="parent_name" defaultValue={s.parent_name || ''}/>
          <Field label="WhatsApp orang tua" name="parent_phone" defaultValue={s.parent_phone || ''}/>
          <div className="sm:col-span-2"><Field label="Email orang tua" name="parent_email" type="email" defaultValue={s.parent_email || ''}/></div>
          <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
            <p className="text-xs muted">Perubahan langsung memengaruhi dashboard, halaqah, dan laporan siswa.</p>
            <SubmitButton label="Simpan Perubahan"/>
          </div>
        </form>
      </div>
    </div>
  </AppShell>
}

function Field({label,name,type='text',defaultValue,required=false,min,max,step}:any){
  return <div><label className="label">{label}</label><input className="field" name={name} type={type} defaultValue={defaultValue} required={required} min={min} max={max} step={step}/></div>
}
