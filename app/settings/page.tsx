import { AppShell } from '@/components/app-shell';
import { getCurrentProfile } from '@/lib/current-user';
import { ChangePinForm } from '@/components/change-pin-form';
import {
  ShieldCheck,
  Database,
  Building2,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

export const dynamic='force-dynamic';

export default async function SettingsPage(){
  const {profile}=await getCurrentProfile();

  return (
    <AppShell userName={profile.full_name} role={profile.role} institution={profile.institution_name}>
      <div className="page-section fade-up">
        <div className="page-header">
          <div className="page-header-copy">
            <span className="gold-kicker">Pengaturan</span>
            <h1 className="page-title">Workspace & keamanan.</h1>
            <p className="page-subtitle">
              Lihat status sistem dan kelola akses administrator tanpa harus masuk ke dashboard backend.
            </p>
          </div>
          <span className="pill self-start"><CheckCircle2 size={15}/>Sistem aktif</span>
        </div>

        <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-7">
          <StatusBox
            icon={Building2}
            title="Workspace"
            value={profile.institution_name}
            body="Identitas lembaga aktif."
          />
          <StatusBox
            icon={ShieldCheck}
            title="Akses"
            value="PIN Admin"
            body="Sesi server-side 12 jam."
          />
          <StatusBox
            icon={Database}
            title="Database"
            value="Neon PostgreSQL"
            body="Data tersimpan di cloud."
          />
          <StatusBox
            icon={Smartphone}
            title="Aplikasi"
            value="PWA Ready"
            body="Dapat dipasang dari browser."
          />
        </section>

        <section className="mt-4">
          <ChangePinForm />
        </section>

        <section className="shell-card p-5 sm:p-6 mt-4">
          <div className="flex items-start gap-3">
            <div className="icon-box"><Database size={19}/></div>
            <div className="min-w-0">
              <span className="gold-kicker">Arsitektur</span>
              <h2 className="section-title">Neon Data API</h2>
              <p className="section-subtitle mt-1 max-w-3xl">
                Aplikasi memakai RPC terkontrol untuk dashboard, siswa, setoran, laporan, dan master data. Session admin disimpan server-side dan cookie browser bersifat httpOnly.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function StatusBox({icon:Icon,title,value,body}:any){
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between gap-3">
        <span className="gold-kicker">{title}</span>
        <div className="h-9 w-9 rounded-[12px] bg-[#edf2ee] text-[#456455] grid place-items-center">
          <Icon size={17}/>
        </div>
      </div>
      <div className="font-extrabold mt-4 truncate">{value}</div>
      <div className="text-[11px] muted mt-2">{body}</div>
    </div>
  );
}
