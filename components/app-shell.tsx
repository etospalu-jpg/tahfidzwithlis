import Image from 'next/image';
import Link from 'next/link';
import { Search, Settings, LogOut, PlusCircle, UserRound } from 'lucide-react';
import { signOutAction } from '@/app/actions';
import { DesktopAppNav, MobileAppNav } from '@/components/app-nav';

type Props={children:React.ReactNode;userName:string;role:string;institution:string};

export function AppShell({children,userName,role,institution}:Props){
  const firstName=userName.split(' ')[0]||'Admin';
  return (
    <div className="min-h-screen bg-white">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[252px] z-40 border-r border-[#e3ebf0] bg-white">
        <div className="w-full px-4 py-5 flex flex-col">
          <Link href="/dashboard" prefetch className="flex items-center gap-3 px-2 py-1.5">
            <div className="brand-mark h-14 w-14 shrink-0 rounded-[16px] border border-[#e3ebf0] p-1.5">
              <Image src="/bina-insan-logo.jpg" alt="SD Islam Terpadu Bina Insan Palu" width={96} height={96} className="brand-logo" priority/>
            </div>
            <div className="min-w-0">
              <div className="font-black tracking-[-.025em] text-[#153b57]">TahfidzWithLis</div>
              <div className="text-[10px] text-[#718392] max-w-[145px] truncate mt-0.5">{institution}</div>
            </div>
          </Link>
          <DesktopAppNav/>
          <div className="mt-auto space-y-1">
            <Link href="/settings" prefetch className="flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-sm font-bold text-[#607687] hover:text-[#1c4c6e] hover:bg-[#f4f8fa] transition">
              <Settings size={19}/><span>Pengaturan</span>
            </Link>
            <div className="mt-4 border-t border-[#e3ebf0] pt-4">
              <Link href="/settings" prefetch className="flex items-center gap-3 rounded-[15px] px-3 py-2.5 hover:bg-[#f4f8fa] transition">
                <div className="h-10 w-10 rounded-[12px] bg-[#e8f9fd] text-[#1c4c6e] grid place-items-center"><UserRound size={19}/></div>
                <div className="min-w-0">
                  <div className="font-extrabold text-sm truncate text-[#153b57]">{userName}</div>
                  <div className="text-[10px] text-[#8293a0] mt-0.5 capitalize">{role.replaceAll('_',' ')}</div>
                </div>
              </Link>
              <form action={signOutAction} className="mt-1">
                <button className="w-full flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-sm font-bold text-[#718392] hover:text-[#1c4c6e] hover:bg-[#f4f8fa] transition"><LogOut size={19}/>Keluar</button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      <main className="lg:pl-[252px] mobile-safe-bottom lg:pb-6 bg-white min-h-screen">
        <header className="sticky top-0 z-30 border-b border-[#edf2f5] bg-white/95 backdrop-blur-xl">
          <div className="page-shell px-3 sm:px-5 lg:px-6">
            <div className="min-h-[68px] flex items-center justify-between gap-3">
              <Link href="/dashboard" prefetch className="lg:hidden flex min-w-0 items-center gap-2.5">
                <div className="brand-mark h-11 w-11 shrink-0 rounded-[12px] border border-[#e3ebf0] p-1">
                  <Image src="/bina-insan-logo.jpg" alt="Bina Insan" width={80} height={80} className="brand-logo" priority/>
                </div>
                <div className="min-w-0">
                  <div className="font-black text-sm tracking-[-.02em] truncate text-[#153b57]">TahfidzWithLis</div>
                  <div className="text-[9px] text-[#718392] truncate max-w-[155px]">{institution}</div>
                </div>
              </Link>
              <form action="/students" className="hidden lg:block flex-1 max-w-[620px]">
                <div className="relative">
                  <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7b8d99]"/>
                  <input name="q" className="w-full h-11 rounded-[13px] border border-[#e3ebf0] bg-[#f8fbfd] pl-10 pr-3 text-sm outline-none placeholder:text-[#8a9aa6] focus:bg-white focus:border-[#08b9df] focus:ring-4 focus:ring-[#08b9df]/10 transition" placeholder="Cari siswa..."/>
                </div>
              </form>
              <div className="ml-auto flex items-center gap-2">
                <Link href="/students" prefetch className="lg:hidden h-10 w-10 rounded-[12px] bg-white border border-[#e3ebf0] grid place-items-center text-[#1c4c6e]" aria-label="Cari siswa"><Search size={19}/></Link>
                <Link href="/setoran" prefetch className="hidden sm:inline-flex h-10 items-center gap-2 rounded-[12px] bg-[#1c4c6e] text-white px-3.5 text-xs font-extrabold shadow-[0_7px_18px_rgba(28,76,110,.14)]"><PlusCircle size={17}/>Setoran</Link>
                <Link href="/settings" prefetch className="h-10 w-10 sm:w-auto flex items-center justify-center gap-2 rounded-[12px] bg-white border border-[#e3ebf0] sm:px-3" aria-label="Pengaturan akun">
                  <div className="h-6 w-6 rounded-[8px] bg-[#e8f9fd] text-[#1c4c6e] grid place-items-center"><UserRound size={14}/></div>
                  <span className="hidden sm:inline text-xs font-extrabold text-[#153b57]">{firstName}</span>
                </Link>
              </div>
            </div>
          </div>
        </header>
        <div className="page-shell px-4 sm:px-6 lg:px-6">{children}</div>
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#e3ebf0] bg-white/96 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <MobileAppNav/>
      </nav>
    </div>
  );
}
