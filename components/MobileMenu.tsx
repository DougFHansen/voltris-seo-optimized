'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiLayout, FiLogOut, FiUser, FiChevronRight } from 'react-icons/fi';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  mainLinks: { name: string; path: string }[];
  serviceLinks: { name: string; path: string; desc: string }[];
}

export default function MobileMenu({
  isOpen,
  onClose,
  user,
  isAdmin,
  signOut,
  mainLinks,
  serviceLinks
}: MobileMenuProps) {
  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[120] lg:hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                  V
                </div>
                <span className="font-bold text-gray-900 tracking-tight">VOLTRIS</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-gray-50 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* User Section */}
              {user ? (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <FiUser className="text-xl" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-900 truncate">
                        {user.email?.split('@')[0]}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                        {isAdmin ? 'Administrador' : 'Cliente'}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/dashboard"
                      onClick={onClose}
                      className="flex items-center justify-center gap-2 py-2 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      <FiLayout /> Painel
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 py-2 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all"
                    >
                      <FiLogOut /> Sair
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="flex items-center justify-center py-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-700"
                  >
                    LOGIN
                  </Link>
                  <Link
                    href="/contato"
                    onClick={onClose}
                    className="flex items-center justify-center py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-xs font-bold text-white shadow-md shadow-blue-200"
                  >
                    CONTRATAR
                  </Link>
                </div>
              )}

              {/* Navigation */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Menu Principal</div>
                {mainLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-blue-600 font-medium transition-all group"
                  >
                    {link.name}
                    <FiChevronRight className="text-gray-300 group-hover:text-blue-400 transition-colors" />
                  </Link>
                ))}
              </div>

              {/* Services */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Soluções</div>
                {serviceLinks.map((service) => (
                  <Link
                    key={service.path}
                    href={service.path}
                    onClick={onClose}
                    className="block p-3 rounded-xl hover:bg-gray-50 transition-all group"
                  >
                    <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {service.name}
                    </div>
                    <div className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                      {service.desc}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <p className="text-[10px] text-center text-gray-400">
                &copy; 2026 Voltris Tech. Todos os direitos reservados.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
