'use client';

import { useNotificationContext } from '@/components/notifications/NotificationContext';
import { useAuth } from '@/app/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBell, FiPackage, FiMessageSquare, FiInfo, 
  FiCheckCircle, FiAlertTriangle, FiClock, FiShield,
  FiTerminal, FiActivity, FiZap
} from 'react-icons/fi';
import { useDashboard } from '@/app/context/DashboardContext';

export default function NotificationsClient() {
    const { transparencyMode } = useDashboard();
    const { notifications, markAsRead } = useNotificationContext();
    const { isAdmin } = useAuth();

    // Filtragem conforme lógica original
    const filteredNotifications = notifications.filter(n => isAdmin || (n.type !== 'newsletter' && n.type !== 'comment'));
    const unreadCount = filteredNotifications.filter(n => !n.read).length;

    const getIcon = (type: string) => {
        switch (type) {
            case 'order': return FiPackage;
            case 'ticket': return FiMessageSquare;
            case 'success': return FiCheckCircle;
            case 'warning': return FiAlertTriangle;
            default: return FiBell;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'order': return 'text-[#31A8FF] bg-[#31A8FF]/10 border-[#31A8FF]/20';
            case 'ticket': return 'text-[#8B31FF] bg-[#8B31FF]/10 border-[#8B31FF]/20';
            case 'success': return 'text-[#00FF88] bg-[#00FF88]/10 border-[#00FF88]/20';
            case 'warning': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            default: return 'text-gray-500 bg-gray-100 border-gray-200';
        }
    };

    return (
        <div className="flex flex-col gap-10 max-w-5xl mx-auto w-full">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-8 bg-gradient-to-b from-[#31A8FF] to-[#8B31FF] rounded-full"></div>
                     <h2 className="text-4xl font-black text-gray-900 italic uppercase tracking-tighter">Feed <span className="text-[#31A8FF] not-italic">Neural</span></h2>
                   </div>
                   <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.2em] pl-5 font-mono">Logs de eventos do sistema e pings de sincronização</p>
                </div>

                <div className="flex items-center gap-4">
                   <div className="px-5 py-2 rounded-2xl bg-gray-100 border border-gray-200 flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${unreadCount > 0 ? 'bg-[#31A8FF] animate-pulse' : 'bg-gray-300'}`}></div>
                      <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{unreadCount} EVENTOS NÃO LIDOS</span>
                   </div>
                   {unreadCount > 0 && (
                      <button className="text-[10px] font-black text-[#31A8FF] uppercase tracking-widest hover:text-gray-900 transition-colors">
                        Limpar Frequência
                      </button>
                   )}
                </div>
            </div>

            {/* Notifications Stream */}
            <div className="flex flex-col gap-6 relative">
                {/* Visual Timeline Line */}
                <div className="absolute left-10 top-0 bottom-0 w-px bg-gradient-to-b from-gray-200 via-gray-100 to-transparent hidden md:block"></div>

                <AnimatePresence mode="popLayout">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notif, i) => {
                            const Icon = getIcon(notif.type);
                            const colorClasses = getColor(notif.type);

                            return (
                                <motion.div
                                    key={notif.id}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="relative flex items-start gap-10 group"
                                    onClick={() => markAsRead(notif.id)}
                                >
                                    {/* Timeline Marker */}
                                    <div className="hidden md:flex flex-col items-center pt-8 relative z-10 shrink-0">
                                       <div className={`w-20 h-[1px] ${notif.read ? 'bg-gray-200' : 'bg-[#31A8FF]/40'} absolute right-0 top-[2.75rem] -mr-10`}></div>
                                       <div className={`w-2.5 h-2.5 rounded-full border-2 ${transparencyMode ? 'border-gray-200' : 'border-gray-200'} z-20 transition-all duration-500 scale-125
                                          ${notif.read ? 'bg-gray-300' : 'bg-[#31A8FF] shadow-[0_0_15px_rgba(49,168,255,0.8)]'}`}></div>
                                    </div>

                                    {/* Notification Card */}
                                    <div className={`flex-1 p-8 rounded-[3rem] border transition-all duration-500 relative overflow-hidden cursor-pointer
                                       ${notif.read 
                                         ? 'bg-gray-50 border-gray-200 opacity-40 hover:opacity-100' 
                                         : `${transparencyMode ? 'voltris-glass' : 'bg-white border-gray-200 shadow-xl'} hover:border-[#31A8FF]/40 hover:-translate-y-1`
                                       }
                                    `}>
                                        {/* Unread Visual Accent */}
                                        {!notif.read && (
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#31A8FF]/10 to-transparent pointer-events-none"></div>
                                        )}

                                        <div className="flex gap-8 items-start relative z-10">
                                            <div className={`p-5 rounded-2xl border flex-shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3 ${colorClasses}`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-3">
                                                <div className="flex justify-between items-start gap-4">
                                                    <h3 className={`text-xl font-black italic uppercase tracking-tighter ${notif.read ? 'text-gray-400' : 'text-gray-900'}`}>{notif.title}</h3>
                                                    <div className="flex flex-col items-end shrink-0">
                                                       <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest font-mono">
                                                          <FiClock className="w-3 h-3" />
                                                          {new Date(notif.created_at).toLocaleDateString()}
                                                       </div>
                                                       <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em] font-mono">TRANSMISSÃO {notif.type.toUpperCase()}</span>
                                                    </div>
                                                </div>
                                                <p className={`text-xs font-bold leading-relaxed uppercase tracking-wider ${notif.read ? 'text-gray-300' : 'text-gray-500'}`}>
                                                  {notif.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className={`py-40 flex flex-col items-center justify-center text-center gap-10 rounded-[4rem] border border-gray-200 ${transparencyMode ? 'voltris-glass' : 'bg-gray-50 shadow-xl'}`}>
                            <div className="relative">
                               <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                 <FiBell className="w-12 h-12 text-gray-300" />
                               </div>
                               <FiCheckCircle className="absolute -bottom-2 -right-2 w-10 h-10 text-[#00FF88] bg-white rounded-full p-2 border border-gray-200" />
                            </div>
                            <div className="space-y-4">
                              <h3 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Frequência Silenciosa</h3>
                              <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.3em] max-w-sm">Os nós neurais estão funcionando dentro dos parâmetros normais. Nenhuma interrupção recente detectada.</p>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
