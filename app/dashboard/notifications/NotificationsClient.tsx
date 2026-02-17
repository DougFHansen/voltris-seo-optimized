'use client';

import { useNotificationContext } from '@/components/notifications/NotificationContext';
import { useAuth } from '@/app/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiPackage, FiMessageSquare, FiInfo, FiCheckCircle, FiAlertTriangle, FiClock } from 'react-icons/fi';

export default function NotificationsClient() {
    const { notifications, markAsRead } = useNotificationContext();
    const { isAdmin } = useAuth();

    // Filtragem conforme lógica original
    const filteredNotifications = notifications.filter(n => isAdmin || (n.type !== 'newsletter' && n.type !== 'comment'));

    const getIcon = (type: string) => {
        switch (type) {
            case 'order': return FiPackage;
            case 'ticket': return FiMessageSquare;
            case 'success': return FiCheckCircle;
            case 'warning': return FiAlertTriangle;
            default: return FiInfo;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'order': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'ticket': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
            case 'success': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'warning': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-0 overflow-y-auto custom-scrollbar-modern">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-2 sm:gap-3 flex-wrap">
                        Notificações <span className="bg-[#8B31FF] text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full">{filteredNotifications.filter(n => !n.read).length} Novas</span>
                    </h1>
                    <p className="text-sm sm:text-base text-slate-400">Fique por dentro das atualizações da sua conta.</p>
                </div>

                {filteredNotifications.length > 0 && (
                    <button className="text-xs sm:text-sm text-[#31A8FF] hover:text-[#31A8FF]/80 font-medium transition-colors min-h-[44px] px-4">
                        Marcar todas como lidas
                    </button>
                )}
            </div>

            {/* Timeline List */}
            <div className="space-y-3 sm:space-y-4 relative">
                {/* Vertical Line decoration (optional) */}
                <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent hidden md:block"></div>

                <AnimatePresence>
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notif, index) => {
                            const Icon = getIcon(notif.type);
                            const colorClasses = getColor(notif.type);

                            return (
                                <motion.div
                                    key={notif.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`relative pl-0 md:pl-16 group`}
                                >
                                    {/* Connector Dot for Desktop */}
                                    <div className={`hidden md:flex absolute left-[21px] top-6 w-2.5 h-2.5 rounded-full border-2 border-[#0A0A0F] z-10 ${notif.read ? 'bg-slate-600' : 'bg-[#31A8FF] shadow-[0_0_10px_#31A8FF]'}`}></div>

                                    <div
                                        className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-300 relative overflow-hidden ${notif.read
                                            ? 'bg-[#121218]/40 border-white/5 opacity-70 hover:opacity-100'
                                            : 'bg-[#16161E] border-white/10 shadow-lg shadow-black/20 hover:border-[#31A8FF]/30'
                                            }`}
                                        onClick={() => markAsRead(notif.id)}
                                    >
                                        {/* Unread Indicator */}
                                        {!notif.read && (
                                            <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-bl from-[#31A8FF]/20 to-transparent pointer-events-none"></div>
                                        )}

                                        <div className="flex gap-3 sm:gap-4 items-start">
                                            <div className={`p-2.5 sm:p-3 rounded-xl border flex-shrink-0 ${colorClasses}`}>
                                                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-3 sm:gap-4 mb-1">
                                                    <h3 className={`font-bold text-sm sm:text-base ${notif.read ? 'text-slate-300' : 'text-white'} break-words`}>{notif.title}</h3>
                                                    <span className="text-[10px] sm:text-xs text-slate-500 whitespace-nowrap flex items-center gap-1 flex-shrink-0">
                                                        <FiClock className="w-3 h-3" />
                                                        {new Date(notif.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed break-words">{notif.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/10">
                                <FiBell className="w-8 h-8 text-slate-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Tudo limpo por aqui!</h3>
                            <p className="text-slate-400">Você não tem novas notificações no momento.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
