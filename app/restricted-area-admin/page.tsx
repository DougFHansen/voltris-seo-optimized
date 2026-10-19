'use client';

import { useAuth } from '@/app/hooks/useAuth';
import AuthGuard from '@/components/AuthGuard';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import VoltrisIcon, { VoltrisIconName } from '@/components/dashboard/VoltrisIcon';
import { useNotificationContext } from '@/components/notifications/NotificationContext';
import AdminOrdersTab from './orders/AdminOrdersTab';
import AdminTicketsTab from './tickets/AdminTicketsTab';
import AdminNewsletterTab from './newsletter/AdminNewsletterTab';
import AdminUsersTab from './users/AdminUsersTab';
import AdminEmailsTab from './emails/AdminEmailsTab';
import AdminOverviewTab from './overview/AdminOverviewTab';
import AdminClientsTab from './clients/AdminClientsTab';
import AdminPurchasesTab from './purchases/AdminPurchasesTab';
import AdminReconcileTab from './reconcile/AdminReconcileTab';
import AdminNotificationsTab from './notifications/AdminNotificationsTab';

/**
 * PAINEL ADMINISTRATIVO — mesmo visual do dashboard do usuário.
 *
 * O painel e o dashboard são a MESMA interface em dois níveis de acesso.
 * Aqui a sidebar usa o mesmo sistema de menu do dashboard (`.vtab` + ícones
 * coloridos do `VoltrisIcon`), o mesmo fundo e o mesmo cartão de perfil.
 */

const tabs: { label: string; value: string; icon: VoltrisIconName; color: string }[] = [
    { label: 'Visão Geral',   value: 'overview',     icon: 'home',       color: '#31A8FF' },
    { label: 'Clientes',      value: 'clients',      icon: 'users',      color: '#00D4FF' },
    { label: 'Compras',       value: 'purchases',    icon: 'creditCard', color: '#00FF94' },
    { label: 'Pedidos',       value: 'orders',       icon: 'package',    color: '#9146FF' },
    { label: 'Conciliar',     value: 'reconcile',    icon: 'activity',   color: '#F59E0B' },
    { label: 'Tickets',       value: 'tickets',      icon: 'support',    color: '#EC4899' },
    { label: 'Newsletter',    value: 'newsletter',   icon: 'mail',       color: '#10B981' },
    { label: 'E-mails',       value: 'emails',       icon: 'send',       color: '#6366F1' },
    { label: 'Usuários',      value: 'users',        icon: 'person',     color: '#8B31FF' },
    { label: 'Notificações',  value: 'notifications', icon: 'bell',       color: '#31A8FF' },
];

export default function AdminDashboard() {
    const { user, loading, error, signOut } = useAuth();
    const { unreadCount } = useNotificationContext();

    // Deep link: /restricted-area-admin?tab=compras abre direto na aba.
    //
    // Existia uma SEGUNDA página em /restricted-area-admin/orders que duplicava
    // a aba Pedidos — duas interfaces para a mesma coisa, e a notificação de
    // pedido apontava para ela. Com ?tab= o painel tem UMA porta só e o link
    // antigo continua funcionando, porque a aba correspondente já existe.
    useEffect(() => {
        const alvo = new URLSearchParams(window.location.search).get('tab');
        if (alvo && tabs.some((t) => t.value === alvo)) {
            setActiveTab(alvo);
        }
    }, []);

    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0f] text-white">
                <div className="text-center space-y-4">
                    <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Verificando acesso…</p>
                </div>
            </div>
        );
    }

    const handleLogout = async () => {
        await signOut();
        window.location.href = '/login';
    };

    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className={`h-full flex flex-col ${!isMobile && sidebarCollapsed ? 'items-center px-3' : 'px-5'} py-6 relative`}>
            {/* Logo */}
            <div className={`flex items-center gap-2.5 mb-8 ${!isMobile && sidebarCollapsed ? 'justify-center' : ''}`}>
                <div className="w-10 h-10 flex-shrink-0 object-contain">
                    <Image src="/logo.png" alt="Voltris" width={40} height={40} className="w-full h-full object-contain" />
                </div>
                {(!sidebarCollapsed || isMobile) && (
                    <div className="flex flex-col leading-none">
                        <span className="font-bold text-xs tracking-wider uppercase text-white">Voltris</span>
                        <span className="text-[10px] font-medium text-indigo-400 uppercase tracking-widest leading-tight mt-0.5">Admin</span>
                    </div>
                )}
            </div>

            {/* Collapse Toggle */}
            {!isMobile && (
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    aria-label="Recolher menu"
                    className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-slate-900 hover:bg-indigo-600 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-white transition-all z-50"
                >
                    <VoltrisIcon name="chevronRight" size={12} className={sidebarCollapsed ? '' : 'rotate-180'} />
                </button>
            )}

            {/* Admin Profile */}
            <div className={`mb-6 ${!isMobile && sidebarCollapsed ? 'w-10 mx-auto' : 'w-full'}`}>
                <div className={`flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 ${!isMobile && sidebarCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/70 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-indigo-300">{user?.email?.[0]?.toUpperCase() || 'A'}</span>
                    </div>
                    {(!sidebarCollapsed || isMobile) && (
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-200 truncate">System Admin</p>
                            <p className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">Nível Supremo</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Nav — mesmo sistema de menu do dashboard (.vtab + ícone colorido) */}
            <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar relative z-10">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.value;
                    const isRail = !isMobile && sidebarCollapsed;
                    return (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => { setActiveTab(tab.value); setMobileMenuOpen(false); }}
                            aria-current={isActive ? 'page' : undefined}
                            title={isRail ? tab.label : ''}
                            style={{ '--vtab-color': tab.color } as React.CSSProperties}
                            className={`vtab w-full text-left border-0 bg-transparent ${isRail ? 'vtab--rail p-3' : 'px-3.5 py-2.5'}`}
                        >
                            <VoltrisIcon name={tab.icon} className="vtab__ico" />
                            {!isRail && <span className="vtab__label truncate">{tab.label}</span>}
                            {!isRail && tab.value === 'notifications' && unreadCount > 0 && (
                                <span className="relative z-10 ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="pt-4 mt-4 border-t border-white/5 flex-shrink-0 space-y-1">
                <Link
                    href="/dashboard"
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all ${!isMobile && sidebarCollapsed ? 'justify-center' : ''}`}
                >
                    <VoltrisIcon name="orders" size={16} className="text-amber-500" />
                    {(!sidebarCollapsed || isMobile) && <span className="text-xs font-semibold">Painel Usuário</span>}
                </Link>
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all ${!isMobile && sidebarCollapsed ? 'justify-center' : ''}`}
                >
                    <VoltrisIcon name="logout" size={16} />
                    {(!sidebarCollapsed || isMobile) && <span className="text-xs font-semibold">Sair</span>}
                </button>
            </div>
        </div>
    );

    const currentTab = tabs.find((t) => t.value === activeTab);

    return (
        <AuthGuard requireAdmin={true}>
            <div className="flex h-screen w-screen overflow-hidden font-sans bg-[#0a0a0f] text-white selection:bg-[#8B31FF]/30">

                {/* BACKGROUND LAYER — igual ao dashboard */}
                <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(255,255,255,0))]" />
                    <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-indigo-950/20 rounded-full blur-[100px]" />
                    <div
                        className="absolute inset-0 opacity-[0.015]"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                            backgroundSize: '60px 60px',
                        }}
                    />
                </div>

                {/* Desktop Sidebar */}
                <aside
                    className={`hidden lg:flex flex-col h-full transition-all duration-500 ease-in-out border-r border-white/5 z-50 flex-shrink-0 ${sidebarCollapsed ? 'w-24' : 'w-72 xl:w-80'} bg-[#12121A]`}
                >
                    <SidebarContent />
                </aside>

                {/* Mobile Drawer */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <div className="fixed inset-0 z-[150] lg:hidden">
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                                onClick={() => setMobileMenuOpen(false)}
                            />
                            <motion.div
                                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                                className="absolute top-0 left-0 h-full w-[85%] max-w-sm bg-[#0a0a0f] border-r border-white/5 shadow-2xl"
                            >
                                <SidebarContent isMobile />
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Main Area */}
                <div className="flex flex-1 flex-col overflow-hidden min-w-0">

                    {/* Top Header */}
                    <header className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl z-40 flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                aria-label="Abrir menu"
                                className="lg:hidden p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white transition"
                            >
                                <VoltrisIcon name="menu" size={16} />
                            </button>
                            <div>
                                <h2 className="text-sm font-bold text-white leading-none">Centro de Operações</h2>
                                <p className="text-[10px] text-slate-500 font-medium mt-0.5 uppercase tracking-widest">
                                    {currentTab?.label}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab('notifications')}
                                aria-label="Notificações"
                                className="relative p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                            >
                                <VoltrisIcon name="bell" size={16} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </button>
                            <Link
                                href="/"
                                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:bg-slate-800 transition text-xs font-medium text-slate-300"
                            >
                                <VoltrisIcon name="arrowLeft" size={13} />
                                <span className="hidden sm:inline">Voltar ao site</span>
                            </Link>
                            <button
                                onClick={() => window.location.reload()}
                                aria-label="Recarregar"
                                className="p-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition"
                                title="Recarregar"
                            >
                                <VoltrisIcon name="processing" size={16} />
                            </button>
                        </div>
                    </header>

                    {/* Scrollable Content */}
                    <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 sm:px-8 py-6 relative z-10">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 120, duration: 0.3 }}
                            className="max-w-[1400px] mx-auto w-full pb-10"
                        >
                            {error && (
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 mb-5 flex items-center gap-3">
                                    <VoltrisIcon name="warning" size={16} className="text-amber-400 flex-shrink-0" />
                                    <p className="text-amber-300/90 text-xs">{error}</p>
                                </div>
                            )}

                            {activeTab === 'orders'     && <AdminOrdersTab />}
                            {activeTab === 'tickets'    && <AdminTicketsTab />}
                            {activeTab === 'overview'     && <AdminOverviewTab />}
                            {activeTab === 'clients'      && <AdminClientsTab />}
                            {activeTab === 'purchases'    && <AdminPurchasesTab />}
                            {activeTab === 'reconcile'    && <AdminReconcileTab />}
                            {activeTab === 'newsletter'   && <AdminNewsletterTab />}
                            {activeTab === 'emails'     && <AdminEmailsTab />}
                            {activeTab === 'users'      && <AdminUsersTab />}
                            {activeTab === 'notifications' && <AdminNotificationsTab />}
                        </motion.div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
