import { AppShell } from '@/components/app-shell';
import { SubmitButton } from '@/components/submit-button';
import { getCurrentProfile } from '@/lib/current-user';
import { sql } from '@/lib/db';
import { saveSetoranAction } from './actions';
import { BookOpenCheck, Gauge, NotebookPen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SetoranPage({ searchParams }: { searchParams: Promise<{student?:string}> }) {
  const { profile } = await getCurrentProfile();
  const { student: selected='' } = await searchParams;
  const students = await sql`
    select s.id,s.full_name,s.student_no,c.name as class_name,g.name as group_name
    from students s
    left join classes c on c.id=s.class_id
    left join tahfidz_groups g on g.id=s.tahfidz_group_id
    where s.organization_id=\${profile.organization_id} and s.status='active'
    order by s.full_name`;

  const today = new Date().toISOString().slice(0,10);

  return (
    <AppShell userName={profile.full_name} role={profile.role} institution={profile.institution_name}>
      <div className="fade-up pt-5 sm:pt-8 pb-8">
        <span className="gold-kicker">Quick entry</span>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-.045em] mt-2">Catat setoran tanpa ribet.</h1>
        <p className="muted mt-3 max-w-2xl leading-7">Satu layar untuk hafalan baru, murajaah, tasmi’, dan ujian. Nilai otomatis diringkas sebagai kualitas setoran siswa.</p>

        <form action={saveSetoranAction} className="mt-7 grid xl:grid-cols-[1fr_.8fr] gap-5">
          <section className="shell-card p-5 sm:p-7">
            <div className="flex items-center gap-3"><div className="h-11 w-11 rounded-2xl bg-[#edf2ee] grid place-items-center"><BookOpenCheck size={20}/></div><div><span className="gold-kicker">Setoran</span><h2 className="text-xl font-semibold">Detail hafalan</h2></div></div>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <div className="sm:col-span-2"><label className="label">Siswa</label><select className="field" name="student_id" defaultValue={selected} required><option value="">Pilih siswa</option>{students.map((s:any)=><option key={s.id} value={s.id}>{s.full_name} · {s.class_name || 'Tanpa kelas'}</option>)}</select></div>
              <div><label className="label">Tanggal</label><input className="field" type="date" name="session_date" defaultValue={today} required/></div>
              <div><label className="label">Jenis setoran</label><select className="field" name="session_type" defaultValue="new"><option value="new">Hafalan baru</option><option value="murajaah">Murajaah</option><option value="tasmi">Tasmi'</option><option value="exam">Ujian</option></select></div>
              <div><label className="label">Juz</label><input className="field" type="number" name="juz_no" min="1" max="30" defaultValue="30" required/></div>
              <div><label className="label">Surah</label><input className="field" name="surah_name" placeholder="Contoh: An-Naba" required/></div>
              <div><label className="label">Ayat mulai</label><input className="field" type="number" name="start_ayah" min="1" placeholder="1"/></div>
              <div><label className="label">Ayat selesai</label><input className="field" type="number" name="end_ayah" min="1" placeholder="20"/></div>
              <div><label className="label">Estimasi halaman</label><input className="field" type="number" name="pages" min="0" step="0.1" defaultValue="1"/></div>
              <div><label className="label">Jumlah kesalahan</label><input className="field" type="number" name="mistakes_count" min="0" defaultValue="0"/></div>
              <div className="sm:col-span-2"><label className="label">Status hafalan</label><select className="field" name="status" defaultValue="lancar"><option value="belum_lancar">Belum lancar</option><option value="cukup">Cukup</option><option value="lancar">Lancar</option><option value="sangat_lancar">Sangat lancar</option><option value="mutqin">Mutqin</option><option value="perlu_murajaah">Perlu murajaah</option></select></div>
            </div>
          </section>

          <div className="space-y-5">
            <section className="shell-card p-5 sm:p-7">
              <div className="flex items-center gap-3"><div className="h-11 w-11 rounded-2xl bg-[#f7efdd] text-[#876b30] grid place-items-center"><Gauge size={20}/></div><div><span className="gold-kicker">Assessment</span><h2 className="text-xl font-semibold">Kualitas hafalan</h2></div></div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Score name="fluency" label="Kelancaran" value={85}/>
                <Score name="tajwid" label="Tajwid" value={85}/>
                <Score name="makhraj" label="Makhraj" value={85}/>
                <Score name="accuracy" label="Ketepatan" value={85}/>
                <div className="col-span-2"><label className="label">Nilai murajaah <span className="font-normal muted">(opsional)</span></label><input className="field" type="number" name="murajaah_score" min="0" max="100" placeholder="0–100"/></div>
              </div>
            </section>

            <section className="shell-card p-5 sm:p-7">
              <div className="flex items-center gap-3 mb-5"><NotebookPen size={18} className="text-[#B69A62]"/><div className="font-extrabold">Catatan guru</div></div>
              <textarea className="field min-h-[120px] resize-y" name="notes" placeholder="Contoh: Perkuat sambungan ayat 18–20 sebelum menambah hafalan berikutnya."/>
              <div className="mt-5 flex justify-end"><SubmitButton/></div>
            </section>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

function Score({name,label,value}:{name:string,label:string,value:number}) {
  return <div><label className="label">{label}</label><div className="relative"><input className="field pr-10" type="number" name={name} min="0" max="100" defaultValue={value} required/><span className="absolute right-3 top-3.5 text-xs font-black muted">/100</span></div></div>
}
