import { Suspense } from 'react';
import NewOrderClient from './NewOrderClient';

// Forçar renderização dinâmica para evitar erro de CSR Bailout durante o build estático
export const dynamic = 'force-dynamic';

export default function NewOrderPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-[#FF4B6B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <NewOrderClient />
    </Suspense>
  );
}