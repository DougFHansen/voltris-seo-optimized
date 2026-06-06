import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

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
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#18181b] via-[#23232b] to-[#18181b] text-white">
      {children}
    </div>
  )
}
