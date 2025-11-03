import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181b] via-[#23232b] to-[#18181b] flex flex-col">
      <Header />
      <div className="flex-1 w-full">
        {/* Espaçamento superior ainda maior entre o header e o painel */}
        <div className="max-w-[1440px] mx-auto px-8 pt-12 pb-12 mt-20">
          {/* Painel administrativo com aparência premium */}
          <main className="bg-[#18181b] rounded-2xl shadow-lg border border-gray-800/50 p-8 w-full">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
} 