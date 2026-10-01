import Link from 'next/link';
import { BookOpenCheck, LayoutDashboard, Users, PlusCircle, ClipboardList, Settings, LogOut, Bell, Search } from 'lucide-react';
import { signOutAction } from '@/app/actions';

type Props = {
  children: React.ReactNode;
  userName: string;
  role: string;
  institution: string;
};

const nav = [
  { href:'/dashboard', label:'Beranda', icon:LayoutDashboard },
  { href:'/students', label:'Siswa', icon:Users },
  { href:'/setoran', label:'Setoran', icon:PlusCircle },
  { href:'/reports', label:'Laporan', icon:ClipboardList },
];

export function AppShell({ children, userName, role, institution }: Props) {
  return (
    <div className="min-h-screen">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[270px] p-5">
        <div className="w-full rounded-[30px] bg-[#12372A] text-white px-5 py-6 flex flex-col shadow-[0_20px_70px_rgba(18,55,42,.2)]">
          <div className="flex items-center gap-3 px-2">
            <div className="h-11 w-11 rounded-2xl bg-white/10 border border-white/15 grid place-items-center"><BookOpenCheck size={22}/></div>
            <div><div className="font-extrabold tracking-tight">TahfidzWithLis</div><div className="text-[11px] text-white/48 max-w-[150px] truncate">{institution}</div></div>
          </div>
          <nav className="mt-10 space-y-2">
            {nav.map(({href,label,icon:Icon}) => (
              <Link key={href} href={href} className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold text-white/66 hover:text-white hover:bg-white/10 transition">
                <Icon size={18}/><span>{label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <Link href="/settings" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/58 hover:text-white"><Settings size={18}/> Pengaturan</Link>
            <div className="mt-4 border-t border-white/10 pt-5">
              <div className="px-3 mb-4"><div className="font-bold text-sm truncate">{userName}</div><div className="text-[11px] text-white/45 mt-1 capitalize">{role.replaceAll('_',' ')}</div></div>
              <form action={signOutAction}><button className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/58 hover:text-white hover:bg-white/10"><LogOut size={18}/> Keluar</button></form>
            </div>
          </div>
        </div>
      </aside>

      <main className="lg:pl-[290px] pb-24 lg:pb-8">
        <header className="sticky top-0 z-30 px-4 sm:px-7 lg:px-8 py-4">
          <div className="max-w-[1380px] mx-auto flex items-center justify-between gap-4 rounded-[22px] border border-white/70 bg-[#f5f3ec]/85 backdrop-blur-xl px-2 py-2">
            <div className="lg:hidden flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl bg-[#12372A] text-white grid place-items-center"><BookOpenCheck size={20}/></div>
              <div><div className="font-extrabold text-sm">TahfidzWithLis</div><div className="text-[10px] muted truncate max-w-[150px]">{institution}</div></div>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-sm muted px-3"><Search size={17}/> <span>Cari siswa, surah, atau catatan…</span></div>
            <div className="ml-auto flex items-center gap-2">
              <button className="h-10 w-10 rounded-2xl bg-white border border-[#12372A]/8 grid place-items-center relative"><Bell size={17}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#B69A62]"/></button>
              <div className="hidden sm:flex h-10 items-center rounded-2xl bg-white border border-[#12372A]/8 px-3 text-xs font-extrabold">{userName.split(' ')[0]}</div>
            </div>
          </div>
        </header>
        <div className="max-w-[1380px] mx-auto px-4 sm:px-7 lg:px-8">{children}</div>
      </main>

      <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40">
        <div className="grid grid-cols-4 rounded-[24px] bg-[#12372A]/96 backdrop-blur-xl px-2 py-2 shadow-[0_18px_45px_rgba(18,55,42,.25)]">
          {nav.map(({href,label,icon:Icon}) => (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 py-2 text-white/67 active:text-white">
              <Icon size={19}/><span className="text-[10px] font-bold">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
