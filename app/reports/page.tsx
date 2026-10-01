import { AppShell } from '@/components/app-shell';
import { getCurrentProfile } from '@/lib/current-user';
import { getAdminToken } from '@/lib/admin-session';
import { getReportsData } from '@/lib/neon-api';
import { BarChart3, BookOpen, Users, Target } from 'lucide-react';

export const dynamic='force-dynamic';

export default async function ReportsPage(){
  const {profile}=await getCurrentProfile();
  const token = await getAdminToken();
  if (!token) throw new Error('Admin session is required');
  const s:any = await getReportsData(token);
  return <AppShell userName={profile.full_name} role={profile.role} institution={profile.institution_name}>
    <div className="fade-up pt-5 sm:pt-8 pb-8">
      <span className="gold-kicker">Laporan</span>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-.045em] mt-2">Ringkasan program tahfidz.</h1>
      <p className="muted mt-3 max-w-2xl">Versi awal laporan eksekutif. Modul PDF, rekap per kelas, dan periode akan ditambahkan pada fase berikutnya.</p>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mt-8">
        <Card icon={Users} label="Siswa aktif" value={String(s.students)}/>
        <Card icon={BookOpen} label="Total setoran" value={String(s.sessions)}/>
        <Card icon={BarChart3} label="Rata-rata nilai" value={String(s.avg_score)}/>
        <Card icon={Target} label="Target rata-rata" value={String(s.avg_target)}/>
      </div>
      <div className="shell-card p-6 sm:p-8 mt-5">
        <h2 className="text-2xl font-semibold tracking-[-.03em]">Laporan yang akan tersedia</h2>
        <div className="grid md:grid-cols-3 gap-3 mt-5">
          {['Raport Tahfidz Individu','Rekap Halaqah & Kelas','Laporan Bulanan Lembaga'].map(x=><div key={x} className="soft-card p-5"><div className="font-extrabold">{x}</div><p className="text-sm muted mt-2">Disiapkan untuk ekspor PDF dan arsip.</p></div>)}
        </div>
      </div>
    </div>
  </AppShell>
}
function Card({icon:Icon,label,value}:any){return <div className="metric-card"><div className="flex items-center justify-between"><span className="gold-kicker">{label}</span><Icon size={18} className="text-[#456455]"/></div><div className="text-3xl sm:text-4xl font-semibold tracking-[-.04em] mt-5">{value}</div></div>}
