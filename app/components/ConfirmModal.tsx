'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    details?: string[];
    confirmText?: string;
    cancelText?: string;
    icon?: React.ReactNode;
    confirmColor?: 'blue' | 'green' | 'red' | 'orange' | 'purple';
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    details,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    icon,
    confirmColor = 'blue'
}: ConfirmModalProps) {
    const colorClasses = {
        blue: 'from-[#31A8FF] to-[#8B31FF]',
        green: 'from-emerald-500 to-teal-500',
        red: 'from-red-500 to-red-600',
        orange: 'from-orange-500 to-orange-600',
        purple: 'from-purple-500 to-pink-500'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', duration: 0.3 }}
                        className="relative w-full max-w-md bg-[#0A0A0F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header com gradiente */}
                        <div className="relative p-6 pb-4 border-b border-white/10">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#31A8FF]/10 to-[#8B31FF]/10"></div>
                            
                            <div className="relative flex items-start gap-4">
                                {/* Ícone */}
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#31A8FF]/20 to-[#8B31FF]/20 border border-[#31A8FF]/30 rounded-xl flex items-center justify-center">
                                    {icon || <FiAlertTriangle className="w-6 h-6 text-[#31A8FF]" />}
                                </div>
                                
                                {/* Título */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
                                    <p className="text-sm text-slate-400">{message}</p>
                                </div>
                                
                                {/* Botão fechar */}
                                <button
                                    onClick={onClose}
                                    className="flex-shrink-0 p-2 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <FiX className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Conteúdo */}
                        {details && details.length > 0 && (
                            <div className="p-6 space-y-2">
                                {details.map((detail, index) => (
                                    <div key={index} className="flex items-start gap-2 text-sm text-slate-300">
                                        <span className="text-[#31A8FF] mt-0.5">•</span>
                                        <span>{detail}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Footer com botões */}
                        <div className="p-6 pt-4 flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors border border-white/10"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`flex-1 px-4 py-3 bg-gradient-to-r ${colorClasses[confirmColor]} text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
