'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {LayoutDashboard,Users,PlusCircle,ClipboardList,SlidersHorizontal} from 'lucide-react';

const items=[
 {href:'/dashboard',label:'Beranda',icon:LayoutDashboard},
 {href:'/students',label:'Siswa',icon:Users},
 {href:'/setoran',label:'Setoran',icon:PlusCircle},
 {href:'/manage',label:'Kelola',icon:SlidersHorizontal},
 {href:'/reports',label:'Laporan',icon:ClipboardList},
];
const active=(pathname:string,href:string)=>pathname===href||pathname.startsWith(href+'/');

export function DesktopAppNav(){
 const pathname=usePathname();
 return <nav className="mt-8 space-y-1.5">{items.map(({href,label,icon:Icon})=>{
  const on=active(pathname,href);
  return <Link key={href} href={href} prefetch aria-current={on?'page':undefined}
   className={"flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-sm font-extrabold transition "+(on?"bg-[#1c4c6e] text-white shadow-[0_7px_18px_rgba(28,76,110,.14)]":"text-[#607687] hover:text-[#1c4c6e] hover:bg-[#f4f8fa]")}>
   <Icon size={19} strokeWidth={on?2.35:2}/><span>{label}</span>
  </Link>;
 })}</nav>;
}

export function MobileAppNav(){
 const pathname=usePathname();
 return <div className="grid grid-cols-5 px-2 pt-1.5 pb-1">
  {items.map(({href,label,icon:Icon})=>{
   const on=active(pathname,href);
   const isSetoran=href==='/setoran';
   return <Link key={href} href={href} prefetch aria-current={on?'page':undefined}
    className={"relative flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-[14px] transition active:scale-[.98] "+(on?"text-[#1c4c6e]":"text-[#7c8d99]")}>
    <span className={"grid place-items-center rounded-[12px] "+(on?"h-8 min-w-10 px-2 bg-[#e8f9fd]":isSetoran?"h-8 min-w-10 px-2 bg-[#1c4c6e] text-white":"h-8 min-w-10 px-2")}>
      <Icon size={20} strokeWidth={on||isSetoran?2.35:2}/>
    </span>
    <span className={"text-[9px] leading-none "+(on?"font-black":"font-bold")}>{label}</span>
   </Link>;
  })}
 </div>;
}
