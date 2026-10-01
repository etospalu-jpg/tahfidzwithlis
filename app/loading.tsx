import { BookOpenCheck } from 'lucide-react';

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f5f3ec] flex items-center justify-center p-5">
      <div className="w-full max-w-[760px]">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-[16px] bg-[#12372A] text-white grid place-items-center">
            <BookOpenCheck size={23}/>
          </div>
          <div>
            <div className="font-extrabold tracking-[-.02em]">TahfidzWithLis</div>
            <div className="text-[11px] muted">Menyiapkan workspace…</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map((item)=>(
            <div key={item} className="metric-card animate-pulse">
              <div className="h-3 w-20 rounded-full bg-[#e4e8e5]"/>
              <div className="h-8 w-16 rounded-xl bg-[#dde4df] mt-5"/>
              <div className="h-2.5 w-24 rounded-full bg-[#e8ebe9] mt-3"/>
            </div>
          ))}
        </div>

        <div className="shell-card p-6 mt-4 animate-pulse">
          <div className="h-4 w-40 rounded-full bg-[#e1e6e3]"/>
          <div className="space-y-3 mt-6">
            {[1,2,3].map((item)=>(
              <div key={item} className="h-14 rounded-[16px] bg-[#eef1ef]"/>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
