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
            default: return 'text-white/40 bg-white/5 border-white/10';
        }
    };

    return (
        <div className="flex flex-col gap-10 max-w-5xl mx-auto w-full">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-8 bg-gradient-to-b from-[#31A8FF] to-[#8B31FF] rounded-full"></div>
                     <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Neural <span className="text-[#31A8FF] not-italic">Feed</span></h2>
                   </div>
                   <p className="text-white/40 font-bold text-xs uppercase tracking-[0.2em] pl-5 font-mono">System event logs and synchronization pings</p>
                </div>

                <div className="flex items-center gap-4">
                   <div className="px-5 py-2 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${unreadCount > 0 ? 'bg-[#31A8FF] animate-pulse' : 'bg-white/10'}`}></div>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{unreadCount} UNREAD EVENTS</span>
                   </div>
                   {unreadCount > 0 && (
                      <button className="text-[10px] font-black text-[#31A8FF] uppercase tracking-widest hover:text-white transition-colors">
                        Clear Frequency
                      </button>
                   )}
                </div>
            </div>

            {/* Notifications Stream */}
            <div className="flex flex-col gap-6 relative">
                {/* Visual Timeline Line */}
                <div className="absolute left-10 top-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent hidden md:block"></div>

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
                                       <div className={`w-20 h-[1px] ${notif.read ? 'bg-white/10' : 'bg-[#31A8FF]/40'} absolute right-0 top-[2.75rem] -mr-10`}></div>
                                       <div className={`w-2.5 h-2.5 rounded-full border-2 ${transparencyMode ? 'border-[#0A0A15]' : 'border-[#12121A]'} z-20 transition-all duration-500 scale-125
                                          ${notif.read ? 'bg-white/10' : 'bg-[#31A8FF] shadow-[0_0_15px_rgba(49,168,255,0.8)]'}
                                       `}></div>
                                    </div>

                                    {/* Notification Card */}
                                    <div className={`flex-1 p-8 rounded-[3rem] border transition-all duration-500 relative overflow-hidden cursor-pointer
                                       ${notif.read 
                                         ? 'bg-white/[0.02] border-white/5 opacity-40 hover:opacity-100' 
                                         : `${transparencyMode ? 'voltris-glass' : 'bg-[#12121A] border-white/10 shadow-3xl'} hover:border-[#31A8FF]/40 hover:-translate-y-1`
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
                                                    <h3 className={`text-xl font-black italic uppercase tracking-tighter ${notif.read ? 'text-white/40' : 'text-white'}`}>{notif.title}</h3>
                                                    <div className="flex flex-col items-end shrink-0">
                                                       <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-widest font-mono">
                                                          <FiClock className="w-3 h-3" />
                                                          {new Date(notif.created_at).toLocaleDateString()}
                                                       </div>
                                                       <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.2em] font-mono">{notif.type.toUpperCase()} TRANSMISSION</span>
                                                    </div>
                                                </div>
                                                <p className={`text-xs font-bold leading-relaxed uppercase tracking-wider ${notif.read ? 'text-white/20' : 'text-white/40'}`}>
                                                  {notif.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className={`py-40 flex flex-col items-center justify-center text-center gap-10 rounded-[4rem] border border-white/5 ${transparencyMode ? 'voltris-glass' : 'bg-[#0A0A10]'}`}>
                            <div className="relative">
                               <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                 <FiBell className="w-12 h-12 text-white/10" />
                               </div>
                               <FiCheckCircle className="absolute -bottom-2 -right-2 w-10 h-10 text-[#00FF88] bg-[#0A0A10] rounded-full p-2 border border-white/10" />
                            </div>
                            <div className="space-y-4">
                              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Frequency Silent</h3>
                              <p className="text-white/20 font-bold text-[10px] uppercase tracking-[0.3em] max-w-sm">Neural nodes are functioning within normal parameters. No recent disruptions detected.</p>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
