export default function TechFloatingElements() {
  return (
    <>
      {/* Elementos tech flutuando */}
      <svg className="absolute left-2 top-2 w-8 h-8 opacity-40 animate-tech-float pointer-events-none z-0" viewBox="0 0 24 24" fill="none" style={{ maxWidth: '100%' }}>
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#31A8FF" strokeWidth="2"/>
      </svg>
      <svg className="absolute right-4 bottom-8 w-6 h-6 opacity-30 animate-tech-float2 pointer-events-none z-0" viewBox="0 0 24 24" fill="none" style={{ maxWidth: '100%' }}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#FF4B6B"/>
        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="#8B31FF"/>
      </svg>
      <svg className="absolute left-10 bottom-2 w-5 h-5 opacity-20 animate-tech-float3 pointer-events-none z-0" viewBox="0 0 24 24" fill="none" style={{ maxWidth: '100%' }}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" stroke="#31A8FF" strokeWidth="2"/>
        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" stroke="#8B31FF" strokeWidth="2"/>
      </svg>
    </>
  );
} 