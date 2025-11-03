import React from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileTabs from '@/components/dashboard/MobileTabs'
import ClientNotificationModal from './ClientNotificationModal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171313] via-[#1E1E1E] to-[#171313] flex flex-col overflow-x-hidden">
      <Header />
      <div className="flex flex-1 pt-16 md:pt-24 pb-8 justify-center items-stretch w-full">
        <div className="w-full max-w-full px-4 md:px-6 lg:px-8 flex gap-6 min-h-[calc(100vh-8rem)]">
          <div className="hidden md:block w-72 flex-shrink-0 h-full">
            <div className="h-full sticky top-20 flex flex-col">
              <Sidebar />
            </div>
          </div>
          <div className="flex-1 min-w-0 flex flex-col h-full">
            {/* Mobile Tabs - posicionadas logo abaixo do header com espaçamento premium */}
            <div className="md:hidden mt-4 mb-6 sticky top-16 z-40 w-full">
              <MobileTabs />
            </div>
            <main className="bg-[#1E1E1E]/40 backdrop-blur-xl rounded-2xl border border-gray-800/30 shadow-xl shadow-black/20 p-4 md:p-6 w-full flex-1 flex flex-col">
              {children}
            </main>
          </div>
        </div>
      </div>
      <Footer />
      <ClientNotificationModal />
    </div>
  )
}