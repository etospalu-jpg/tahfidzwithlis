'use client';

import { useEffect } from 'react';

export function PwaRegister(){
  useEffect(()=>{
    if(!('serviceWorker' in navigator)) return;

    const register = () => {
      navigator.serviceWorker
        .register('/sw.js', { updateViaCache: 'none' })
        .catch(()=>{});
    };

    if(document.readyState === 'complete'){
      if('requestIdleCallback' in window){
        (window as any).requestIdleCallback(register, { timeout: 1500 });
      } else {
        setTimeout(register, 300);
      }
      return;
    }

    window.addEventListener('load', register, { once:true });
    return () => window.removeEventListener('load', register);
  },[]);

  return null;
}
