'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  ClipboardList,
  SlidersHorizontal,
} from 'lucide-react';

const items = [
  { href:'/dashboard', label:'Beranda', icon:LayoutDashboard },
  { href:'/students', label:'Siswa', icon:Users },
  { href:'/setoran', label:'Setoran', icon:PlusCircle },
  { href:'/manage', label:'Kelola', icon:SlidersHorizontal },
  { href:'/reports', label:'Laporan', icon:ClipboardList },
];

function active(pathname:string, href:string){
  return pathname === href || pathname.startsWith(href + '/');
}

export function DesktopAppNav(){
  const pathname = usePathname();
  return (
    <nav className="mt-9 space-y-1.5">
      {items.map(({href,label,icon:Icon}) => {
        const isActive = active(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={
              "flex items-center gap-3 rounded-[15px] px-3.5 py-3 text-sm font-bold transition " +
              (isActive
                ? "bg-white text-[#12372A] shadow-[0_8px_20px_rgba(0,0,0,.08)]"
                : "text-white/64 hover:text-white hover:bg-white/[.08]")
            }
          >
            <Icon size={19} strokeWidth={2.1}/>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileAppNav(){
  const pathname = usePathname();
  return (
    <div className="grid grid-cols-5 rounded-[22px] border border-white/10 bg-[#12372A]/[.97] backdrop-blur-xl px-1.5 py-1.5 shadow-[0_18px_45px_rgba(18,55,42,.24)]">
      {items.map(({href,label,icon:Icon}) => {
        const isActive = active(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={
              "relative flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-[16px] transition " +
              (isActive ? "bg-white text-[#12372A]" : "text-white/62 active:text-white")
            }
          >
            <Icon size={20} strokeWidth={isActive ? 2.35 : 2}/>
            <span className="text-[9px] font-extrabold leading-none">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
