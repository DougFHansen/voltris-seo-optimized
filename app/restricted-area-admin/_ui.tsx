'use client';

/**
 * KIT DE UI DO PAINEL ADMINISTRATIVO — espelha o dashboard do usuário.
 *
 * O painel admin e o dashboard são a MESMA interface em dois níveis de
 * acesso. Antes eles pareciam dois produtos diferentes: o dashboard usava
 * `VoltrisIcon` com ícones coloridos, cards `rounded-2xl bg-slate-900/50`,
 * tabelas com `text-[11px] uppercase tracking-wider` e pílulas de status
 * arredondadas; o admin usava `react-icons/fi` monocromos, cards
 * `rounded-xl bg-slate-900/60` e chips retangulares.
 *
 * Aqui ficam as peças compartilhadas, todas no estilo do dashboard. As abas
 * passam a usar estas funções e o visual fica idêntico.
 */

import React from 'react';
import { motion } from 'framer-motion';
import VoltrisIcon, { VoltrisIconName } from '@/components/dashboard/VoltrisIcon';
import VoltrisIconTile, { DASHBOARD_ACCENT } from '@/components/dashboard/VoltrisIconTile';

export { DASHBOARD_ACCENT };

/* ------------------------------------------------------------------ Card */

export function AdminCard({
    children,
    className = '',
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay, ease: 'easeOut' }}
            className={`rounded-2xl border border-slate-800/80 bg-slate-900/50 shadow-sm ${className}`}
        >
            {children}
        </motion.div>
    );
}

export function AdminCardHeader({
    icon,
    accent = DASHBOARD_ACCENT.brand,
    title,
    subtitle,
    actions,
    iconSize = 10,
}: {
    icon: VoltrisIconName;
    accent?: string;
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    iconSize?: 8 | 9 | 10 | 12 | 14 | 16 | 20;
}) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
                <VoltrisIconTile icon={icon} accent={accent} size={iconSize} />
                <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
                    {subtitle && <p className="text-slate-400 text-xs mt-0.5">{subtitle}</p>}
                </div>
            </div>
            {actions && <div className="flex items-center gap-2.5 flex-wrap">{actions}</div>}
        </div>
    );
}

/* -------------------------------------------------------------- StatCard */

export function AdminStatCard({
    label,
    value,
    hint,
    icon,
    accent = DASHBOARD_ACCENT.brand,
    tone = 'text-white',
    delay = 0,
}: {
    label: string;
    value: React.ReactNode;
    hint?: string;
    icon: VoltrisIconName;
    accent?: string;
    tone?: string;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay, ease: 'easeOut' }}
            className="relative group p-5 sm:p-6 rounded-2xl border border-slate-800/80 bg-slate-900/50 shadow-sm hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-200"
        >
            <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
                <VoltrisIconTile icon={icon} accent={accent} size={9} />
            </div>
            <div className="flex items-baseline justify-between gap-3">
                <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight ${tone}`}>{value}</h3>
            </div>
            {hint && <p className="text-[11px] font-medium text-slate-500 mt-2">{hint}</p>}
        </motion.div>
    );
}

/* ---------------------------------------------------------------- Button */

type BotaoVariante = 'primario' | 'secundario' | 'perigo' | 'fantasma';

export function AdminButton({
    children,
    onClick,
    icon,
    variante = 'secundario',
    disabled,
    type = 'button',
    className = '',
    title,
    'aria-label': ariaLabel,
}: {
    children?: React.ReactNode;
    onClick?: () => void;
    icon?: VoltrisIconName;
    variante?: BotaoVariante;
    disabled?: boolean;
    type?: 'button' | 'submit';
    className?: string;
    title?: string;
    'aria-label'?: string;
}) {
    const estilos: Record<BotaoVariante, string> = {
        primario:
            'bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/20',
        secundario:
            'bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700',
        perigo:
            'bg-rose-600/90 hover:bg-rose-500 text-white font-semibold shadow-md shadow-rose-600/20',
        fantasma:
            'border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            title={title}
            aria-label={ariaLabel}
            className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${estilos[variante]} ${className}`}
        >
            {icon && <VoltrisIcon name={icon} size={14} />}
            {children}
        </button>
    );
}

/* ------------------------------------------------------------------ Chip */

export function AdminChip({
    children,
    tone = 'neutro',
    ponto = true,
}: {
    children: React.ReactNode;
    tone?: 'ok' | 'aviso' | 'perigo' | 'info' | 'neutro';
    ponto?: boolean;
}) {
    const mapa = {
        ok: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        aviso: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        perigo: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
        info: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
        neutro: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
    } as const;
    const cores = {
        ok: 'bg-emerald-400',
        aviso: 'bg-amber-400',
        perigo: 'bg-rose-400',
        info: 'bg-indigo-400',
        neutro: 'bg-slate-400',
    } as const;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${mapa[tone]}`}
        >
            {ponto && <span className={`w-1.5 h-1.5 rounded-full ${cores[tone]}`} />}
            {children}
        </span>
    );
}

/* ----------------------------------------------------------------- Table */

export function AdminTable({
    children,
    minWidth = 860,
}: {
    children: React.ReactNode;
    minWidth?: number;
}) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth }}>
                {children}
            </table>
        </div>
    );
}

export function AdminTh({
    children,
    className = '',
}: {
    children?: React.ReactNode;
    className?: string;
}) {
    return (
        <th
            className={`pb-3 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap ${className}`}
        >
            {children}
        </th>
    );
}

export function AdminTd({
    children,
    className = '',
    colSpan,
}: {
    children?: React.ReactNode;
    className?: string;
    colSpan?: number;
}) {
    return (
        <td colSpan={colSpan} className={`py-4 px-3 text-xs text-slate-300 ${className}`}>
            {children}
        </td>
    );
}

/* ------------------------------------------------------------- Filtros */

export function AdminFilterBar({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 lg:flex-row lg:items-center lg:justify-between">
            {children}
        </div>
    );
}

export function AdminSearch({
    value,
    onChange,
    placeholder = 'Buscar…',
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}) {
    return (
        <div className="relative flex-1 min-w-[200px]">
            <VoltrisIcon
                name="search"
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pl-9 pr-3 text-xs text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500 transition-colors"
            />
        </div>
    );
}

export function AdminSegmented<T extends string>({
    value,
    options,
    onChange,
}: {
    value: T;
    options: { value: T; label: string }[];
    onChange: (v: T) => void;
}) {
    return (
        <div className="flex flex-wrap items-center gap-1.5">
            {options.map((o) => (
                <button
                    key={o.value}
                    onClick={() => onChange(o.value)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                        value === o.value
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}

/* ------------------------------------------------------- Estados vazios */

export function AdminEmptyState({
    icon = 'inbox',
    title,
    description,
    children,
}: {
    icon?: VoltrisIconName;
    title: string;
    description?: string;
    children?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-14 px-6 text-center">
            <VoltrisIconTile icon={icon} accent={DASHBOARD_ACCENT.brand} size={12} />
            <p className="text-sm font-semibold text-slate-200">{title}</p>
            {description && <p className="text-xs text-slate-500 max-w-md">{description}</p>}
            {children}
        </div>
    );
}

export function AdminErrorState({
    title = 'Não foi possível carregar',
    message,
    onRetry,
}: {
    title?: string;
    message: string;
    onRetry?: () => void;
}) {
    return (
        <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4"
        >
            <VoltrisIcon name="alertCircle" size={20} className="mt-0.5 shrink-0 text-rose-400" />
            <div className="text-sm">
                <p className="font-semibold text-rose-300">{title}</p>
                <p className="text-rose-200/80 text-xs mt-0.5">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-2 text-xs font-semibold text-rose-300 underline"
                    >
                        Tentar de novo
                    </button>
                )}
            </div>
        </div>
    );
}

export function AdminLoading({ label = 'Carregando…' }: { label?: string }) {
    return (
        <div className="flex items-center justify-center gap-3 py-16 text-slate-500">
            <VoltrisIcon name="processing" size={18} className="animate-spin" />
            <span className="text-xs font-medium uppercase tracking-widest">{label}</span>
        </div>
    );
}
