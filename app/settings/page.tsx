import { AppShell } from '@/components/app-shell';
import { getCurrentProfile } from '@/lib/current-user';
import { ShieldCheck, Database, Palette } from 'lucide-react';

export const dynamic='force-dynamic';

export default async function SettingsPage(){
  const {profile}=await getCurrentProfile();
  return <AppShell userName={profile.full_name} role={profile.role} institution={profile.institution_name}>
    <div className="fade-up pt-5 sm:pt-8 pb-8">
      <span className="gold-kicker">Pengaturan</span>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-.045em] mt-2">Workspace & sistem.</h1>
      <p className="muted mt-3">Kontrol identitas lembaga, keamanan, dan integrasi backend.</p>
      <div className="grid lg:grid-cols-3 gap-4 mt-8">
        <Box icon={Palette} title="Identitas lembaga" body="Nama lembaga, logo, warna, dan identitas raport."/>
        <Box icon={ShieldCheck} title="Akses & role" body="Super Admin, koordinator, guru, orang tua, dan siswa."/>
        <Box icon={Database} title="Neon Backend" body="PostgreSQL + Managed Auth aktif pada branch production."/>
      </div>
    </div>
  </AppShell>
}
function Box({icon:Icon,title,body}:any){return <div className="shell-card p-6"><div className="h-11 w-11 rounded-2xl bg-[#edf2ee] grid place-items-center"><Icon size={19}/></div><h2 className="font-extrabold mt-5">{title}</h2><p className="text-sm muted mt-2 leading-6">{body}</p></div>}
