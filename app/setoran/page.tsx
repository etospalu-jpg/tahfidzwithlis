import { AppShell } from '@/components/app-shell';
import { SubmitButton } from '@/components/submit-button';
import { getPageData } from '@/lib/page-data';
import { saveSetoranAction } from './actions';
import {
  BookOpenCheck,
  Gauge,
  NotebookPen,
  CalendarDays,
  UserRound,
  Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SetoranPage({
  searchParams,
}: {
  searchParams: Promise<{student?:string}>;
}) {
  const { student: selected='' } = await searchParams;
  const { profile, data: students } = await getPageData<any[]>('setoran');

  const today = new Date().toISOString().slice(0,10);

  return (
    <AppShell userName={profile.full_name} role={profile.role} institution={profile.institution_name}>
      <div className="page-section fade-up">
        <div className="page-header">
          <div className="page-header-copy">
            <span className="gold-kicker">Pencatatan hafalan</span>
            <h1 className="page-title">Catat setoran dengan cepat.</h1>
            <p className="page-subtitle">
              Pilih siswa, isi detail hafalan, lalu nilai kualitasnya. Semua perubahan langsung masuk ke riwayat perkembangan siswa.
            </p>
          </div>
          <div className="pill self-start">
            <Sparkles size={15}/>
            Quick Entry
          </div>
        </div>

        <form action={saveSetoranAction} className="mt-6 grid xl:grid-cols-[1.08fr_.92fr] gap-4 items-start">
          <section className="shell-card p-5 sm:p-6">
            <SectionHeader
              icon={BookOpenCheck}
              kicker="Setoran"
              title="Detail hafalan"
              subtitle="Informasi utama hafalan yang disetorkan hari ini."
            />

            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              <div className="sm:col-span-2">
                <label className="label">Siswa</label>
                <div className="relative">
                  <UserRound size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#738078] pointer-events-none"/>
                  <select className="field !pl-10" name="student_id" defaultValue={selected} required>
                    <option value="">Pilih siswa</option>
                    {students.map((s:any)=>(
                      <option key={s.id} value={s.id}>
                        {s.full_name} · {s.class_name || 'Tanpa kelas'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Tanggal</label>
                <div className="relative">
                  <CalendarDays size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#738078] pointer-events-none"/>
                  <input className="field !pl-10" type="date" name="session_date" defaultValue={today} required/>
                </div>
              </div>

              <div>
                <label className="label">Jenis setoran</label>
                <select className="field" name="session_type" defaultValue="new">
                  <option value="new">Hafalan baru</option>
                  <option value="murajaah">Murajaah</option>
                  <option value="tasmi">Tasmi'</option>
                  <option value="exam">Ujian</option>
                </select>
              </div>

              <div>
                <label className="label">Juz</label>
                <input className="field" type="number" name="juz_no" min="1" max="30" defaultValue="30" required/>
              </div>

              <div>
                <label className="label">Surah</label>
                <input className="field" name="surah_name" placeholder="Contoh: An-Naba" required/>
              </div>

              <div>
                <label className="label">Ayat mulai</label>
                <input className="field" type="number" name="start_ayah" min="1" placeholder="1"/>
              </div>

              <div>
                <label className="label">Ayat selesai</label>
                <input className="field" type="number" name="end_ayah" min="1" placeholder="20"/>
              </div>

              <div>
                <label className="label">Estimasi halaman</label>
                <input className="field" type="number" name="pages" min="0" step="0.1" defaultValue="1"/>
              </div>

              <div>
                <label className="label">Jumlah kesalahan</label>
                <input className="field" type="number" name="mistakes_count" min="0" defaultValue="0"/>
              </div>

              <div className="sm:col-span-2">
                <label className="label">Status hafalan</label>
                <select className="field" name="status" defaultValue="lancar">
                  <option value="belum_lancar">Belum lancar</option>
                  <option value="cukup">Cukup</option>
                  <option value="lancar">Lancar</option>
                  <option value="sangat_lancar">Sangat lancar</option>
                  <option value="mutqin">Mutqin</option>
                  <option value="perlu_murajaah">Perlu murajaah</option>
                </select>
              </div>
            </div>
          </section>

          <div className="space-y-4 xl:sticky xl:top-[90px]">
            <section className="shell-card p-5 sm:p-6">
              <SectionHeader
                icon={Gauge}
                kicker="Assessment"
                title="Kualitas hafalan"
                subtitle="Nilai 0–100. Gunakan standar yang konsisten antar siswa."
                gold
              />

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-5">
                <Score name="fluency" label="Kelancaran" value={85}/>
                <Score name="tajwid" label="Tajwid" value={85}/>
                <Score name="makhraj" label="Makhraj" value={85}/>
                <Score name="accuracy" label="Ketepatan" value={85}/>

                <div className="col-span-2">
                  <label className="label">
                    Nilai murajaah <span className="font-normal muted">(opsional)</span>
                  </label>
                  <div className="relative">
                    <input className="field pr-12" type="number" name="murajaah_score" min="0" max="100" placeholder="0–100"/>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold muted">/100</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="shell-card p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="icon-box icon-box-gold">
                  <NotebookPen size={18}/>
                </div>
                <div>
                  <div className="font-extrabold">Catatan guru</div>
                  <p className="text-xs muted mt-1 leading-5">Tambahkan konteks yang membantu murajaah berikutnya.</p>
                </div>
              </div>

              <textarea
                className="field min-h-[120px] resize-y mt-4"
                name="notes"
                placeholder="Contoh: Perkuat sambungan ayat 18–20 sebelum menambah hafalan berikutnya."
              />

              <div className="mt-4 border-t border-[#12372A]/[.08] pt-4">
                <SubmitButton/>
              </div>
            </section>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

function Score({name,label,value}:{name:string,label:string,value:number}) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <input className="field pr-11" type="number" name={name} min="0" max="100" defaultValue={value} required/>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold muted">/100</span>
      </div>
    </div>
  );
}

function SectionHeader({icon:Icon,kicker,title,subtitle,gold=false}:any){
  return (
    <div className="flex items-start gap-3">
      <div className={"icon-box " + (gold ? "icon-box-gold" : "")}>
        <Icon size={19}/>
      </div>
      <div className="min-w-0">
        <span className="gold-kicker">{kicker}</span>
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
