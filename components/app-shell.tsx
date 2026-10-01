import Link from 'next/link';
import {
  BookOpenCheck,
  Search,
  Settings,
  LogOut,
  PlusCircle,
  UserRound,
} from 'lucide-react';
import { signOutAction } from '@/app/actions';
import { DesktopAppNav, MobileAppNav } from '@/components/app-nav';

type Props = {
  children: React.ReactNode;
  userName: string;
  role: string;
  institution: string;
};

export function AppShell({ children, userName, role, institution }: Props) {
  const firstName = userName.split(' ')[0] || 'Admin';

  return (
    <div className="min-h-screen">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[252px] p-4 z-40">
        <div className="w-full rounded-[28px] bg-[#12372A] text-white px-4 py-5 flex flex-col shadow-[0_22px_70px_rgba(18,55,42,.19)]">
          <Link href="/dashboard" className="flex items-center gap-3 px-2 py-1">
            <div className="h-11 w-11 rounded-[15px] bg-white/[.10] border border-white/[.13] grid place-items-center">
              <BookOpenCheck size={22} strokeWidth={2.15}/>
            </div>
            <div className="min-w-0">
              <div className="font-extrabold tracking-[-.02em]">TahfidzWithLis</div>
              <div className="text-[10px] text-white/45 max-w-[145px] truncate mt-0.5">{institution}</div>
            </div>
          </Link>

          <DesktopAppNav />

          <div className="mt-auto space-y-1">
            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-[15px] px-3.5 py-3 text-sm font-bold text-white/60 hover:text-white hover:bg-white/[.08] transition"
            >
              <Settings size={19} strokeWidth={2.1}/>
              Pengaturan
            </Link>

            <div className="mt-4 border-t border-white/[.10] pt-4">
              <Link href="/settings" className="flex items-center gap-3 rounded-[16px] px-3 py-2.5 hover:bg-white/[.07] transition">
                <div className="h-10 w-10 rounded-[13px] bg-white/[.10] grid place-items-center text-white/80">
                  <UserRound size={19}/>
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-sm truncate">{userName}</div>
                  <div className="text-[10px] text-white/42 mt-0.5 capitalize">{role.replaceAll('_',' ')}</div>
                </div>
              </Link>

              <form action={signOutAction} className="mt-1">
                <button className="w-full flex items-center gap-3 rounded-[15px] px-3.5 py-3 text-sm font-bold text-white/56 hover:text-white hover:bg-white/[.08] transition">
                  <LogOut size={19}/>
                  Keluar
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      <main className="lg:pl-[268px] mobile-safe-bottom lg:pb-6">
        <header className="sticky top-0 z-30 px-3 sm:px-5 lg:px-6 pt-3 lg:pt-4">
          <div className="page-shell">
            <div className="min-h-[58px] flex items-center justify-between gap-3 rounded-[20px] border border-white/80 bg-[#f5f3ec]/88 backdrop-blur-xl px-2.5 sm:px-3 shadow-[0_8px_26px_rgba(28,46,37,.035)]">
              <Link href="/dashboard" className="lg:hidden flex min-w-0 items-center gap-2.5">
                <div className="h-10 w-10 shrink-0 rounded-[13px] bg-[#12372A] text-white grid place-items-center">
                  <BookOpenCheck size={20}/>
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-sm tracking-[-.02em] truncate">TahfidzWithLis</div>
                  <div className="text-[9px] muted truncate max-w-[130px]">{institution}</div>
                </div>
              </Link>

              <form action="/students" className="hidden lg:block flex-1 max-w-[620px]">
                <div className="relative">
                  <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7b8780]"/>
                  <input
                    name="q"
                    className="w-full h-10 rounded-[13px] border border-transparent bg-transparent pl-10 pr-3 text-sm outline-none placeholder:text-[#89958e] hover:bg-white/45 focus:bg-white focus:border-[#12372A]/10 transition"
                    placeholder="Cari siswa..."
                  />
                </div>
              </form>

              <div className="ml-auto flex items-center gap-2">
                <Link
                  href="/students"
                  className="lg:hidden h-10 w-10 rounded-[13px] bg-white border border-[#12372A]/[.08] grid place-items-center text-[#415049]"
                  aria-label="Cari siswa"
                >
                  <Search size={19}/>
                </Link>

                <Link
                  href="/setoran"
                  className="hidden sm:inline-flex h-10 items-center gap-2 rounded-[13px] bg-[#12372A] text-white px-3.5 text-xs font-extrabold shadow-[0_8px_18px_rgba(18,55,42,.13)]"
                >
                  <PlusCircle size={17}/>
                  Setoran
                </Link>

                <Link
                  href="/settings"
                  className="h-10 items-center gap-2 rounded-[13px] bg-white border border-[#12372A]/[.08] px-3 hidden sm:flex"
                >
                  <div className="h-6 w-6 rounded-[9px] bg-[#edf2ee] text-[#12372A] grid place-items-center">
                    <UserRound size={14}/>
                  </div>
                  <span className="text-xs font-extrabold">{firstName}</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="page-shell px-4 sm:px-6 lg:px-6">
          {children}
        </div>
      </main>

      <nav className="lg:hidden fixed bottom-2.5 left-2.5 right-2.5 z-50 pb-[env(safe-area-inset-bottom)]">
        <MobileAppNav />
      </nav>
    </div>
  );
}
