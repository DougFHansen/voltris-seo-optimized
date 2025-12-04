"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Garante que o banner só aparece se o consentimento não foi dado
    if (typeof window !== "undefined") {
      const accepted = localStorage.getItem("cookie_consent");
      if (!accepted) setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cookie_consent", "true");
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center items-end pointer-events-none">
      <div className="m-4 w-full max-w-2xl bg-gradient-to-r from-[#1c1c1e] via-[#8B31FF] to-[#31A8FF] text-white rounded-2xl shadow-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 pointer-events-auto border border-white/10 backdrop-blur-md animate-fadeIn">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="bg-white/10 rounded-lg p-2 flex items-center justify-center">
            <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" /></svg>
          </span>
          <div className="flex-1 min-w-0">
            <span className="block font-semibold text-base whitespace-normal">Este site utiliza cookies</span>
            <span className="block text-sm text-white/80 whitespace-normal break-words">Usamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa <Link href='/politica-privacidade' className='underline hover:text-white transition'>Política de Privacidade</Link>.</span>
          </div>
        </div>
        <button
          onClick={acceptCookies}
          className="bg-white text-[#1c1c1e] font-bold px-5 py-2 rounded-lg shadow hover:bg-white/90 transition-colors text-sm min-w-[100px] border border-[#8B31FF] focus:outline-none focus:ring-2 focus:ring-[#8B31FF]"
        >
          Aceitar
        </button>
      </div>
    </div>
  );
} 