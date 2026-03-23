import { Suspense } from 'react';
import DevicesClient from './DevicesClient';

// Forçar renderização dinâmica para evitar erro de CSR Bailout durante o build estático
export const dynamic = 'force-dynamic';

export default function DevicesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-40 gap-6 opacity-30">
        <div className="w-16 h-16 border-t-4 border-r-4 border-[#31A8FF] rounded-full animate-spin"></div>
        <p className="font-black uppercase tracking-[0.3em] text-[10px]">Sincronizando Frota...</p>
      </div>
    }>
      <DevicesClient />
    </Suspense>
  );
}
