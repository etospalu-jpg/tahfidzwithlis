'use client';

import { useFormStatus } from 'react-dom';
import { Save } from 'lucide-react';

export function SubmitButton({ label='Simpan Setoran' }: { label?:string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn-primary w-full sm:w-auto min-w-[180px]" type="submit" disabled={pending}>
      <Save size={17}/>
      {pending ? 'Menyimpan…' : label}
    </button>
  );
}
