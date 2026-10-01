'use client';

import { useActionState } from 'react';
import { KeyRound, Save, ShieldCheck } from 'lucide-react';
import { changePinAction, type PinState } from '@/app/settings/actions';

export function ChangePinForm() {
  const [state, action, pending] = useActionState<PinState | null, FormData>(
    changePinAction,
    null
  );

  return (
    <form action={action} className="shell-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="icon-box icon-box-gold">
          <KeyRound size={19}/>
        </div>
        <div>
          <span className="gold-kicker">Keamanan</span>
          <h2 className="section-title">Ganti PIN admin</h2>
          <p className="section-subtitle mt-1">Gunakan enam digit yang tidak mudah ditebak.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-5">
        <PinField name="current_pin" label="PIN saat ini" />
        <PinField name="new_pin" label="PIN baru" />
        <PinField name="confirm_pin" label="Ulangi PIN baru" />
      </div>

      {state?.error && (
        <div className="mt-4 rounded-[14px] border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="mt-4 flex items-center gap-2 rounded-[14px] border border-[#12372A]/10 bg-[#edf3ef] px-4 py-3 text-sm font-bold text-[#1b4a39]">
          <ShieldCheck size={17}/>
          {state.success}
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <button className="btn-primary w-full sm:w-auto" type="submit" disabled={pending}>
          <Save size={17}/>
          {pending ? 'Memperbarui…' : 'Perbarui PIN'}
        </button>
      </div>
    </form>
  );
}

function PinField({name,label}:{name:string;label:string}) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        className="field text-center tracking-[.28em] font-extrabold"
        type="password"
        inputMode="numeric"
        pattern="[0-9]*"
        minLength={6}
        maxLength={6}
        autoComplete="off"
        placeholder="••••••"
        required
      />
    </div>
  );
}
