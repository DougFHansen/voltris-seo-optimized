import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  // Verificar autenticação no servidor
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login?next=/restricted-area-admin')
  }

  // Verificar se é admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181b] via-[#23232b] to-[#18181b] flex flex-col">
      <Header />
      <div className="flex-1 w-full">
        <div className="max-w-[1440px] mx-auto px-8 pt-12 pb-12 mt-20">
          <main className="bg-[#18181b] rounded-2xl shadow-lg border border-gray-800/50 p-8 w-full">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
