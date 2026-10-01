'use client';

import { useFormStatus } from 'react-dom';
import { LoaderCircle, Save } from 'lucide-react';

export function SubmitButton({ label='Simpan Setoran' }: { label?:string }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="btn-primary w-full sm:w-auto sm:min-w-[168px]"
      type="submit"
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? (
        <LoaderCircle size={17} className="animate-spin"/>
      ) : (
        <Save size={17}/>
      )}
      {pending ? 'Menyimpan…' : label}
    </button>
  );
}
