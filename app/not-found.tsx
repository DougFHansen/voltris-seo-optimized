import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-4 py-16 text-center">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center gap-4">
          <span className="text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-[#38bdf8] via-[#6366f1] to-[#a21caf] bg-clip-text text-transparent select-none drop-shadow-lg">404</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Página não encontrada</h1>
          <p className="text-lg text-slate-300 mb-6">Ops! O endereço que você tentou acessar não existe ou foi removido.<br/>Que tal voltar para a página inicial?</p>
          <Link href="/" className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-[#38bdf8] via-[#6366f1] to-[#a21caf] text-white font-semibold shadow-lg hover:scale-105 transition-transform">Voltar para Home</Link>
        </div>
        <div className="mt-10 flex justify-center">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="56" stroke="#38bdf8" strokeWidth="4" fill="#1e293b" />
            <path d="M40 80 Q60 100 80 80" stroke="#6366f1" strokeWidth="4" fill="none" />
            <circle cx="50" cy="55" r="6" fill="#38bdf8" />
            <circle cx="70" cy="55" r="6" fill="#a21caf" />
          </svg>
        </div>
      </div>
    </div>
  );
} 