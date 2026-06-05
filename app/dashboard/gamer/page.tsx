import { Suspense } from 'react';
import GamerClient from './GamerClient';

// Forçar renderização dinâmica para evitar erro de CSR Bailout durante o build estático
export const dynamic = 'force-dynamic';

export default function GamerPage() {
  return (
    <Suspense fallback={
       <div className="flex flex-col items-center justify-center py-40 gap-6 opacity-30">
        <div className="w-16 h-16 border-t-4 border-r-4 border-[#8B31FF] rounded-full animate-spin"></div>
        <p className="font-black uppercase tracking-[0.3em] text-[10px]">Iniciando Protocolo Gamer...</p>
      </div>
    }>
      <GamerClient />
    </Suspense>
  );
}
