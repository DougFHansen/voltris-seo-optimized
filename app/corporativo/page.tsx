"use client";

import CorporateClient from './CorporateClient';
import Header from '@/components/Header';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#050510] font-sans selection:bg-[#31A8FF]/30">
      <Header />
      <main>
        <h1 className="sr-only">Suporte de TI Corporativo B2B - VOLTRIS</h1>
        <CorporateClient />
      </main>
    </div>
  );
}
