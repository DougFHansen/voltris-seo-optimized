'use client';

import { useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import VoltrisIcon, { type VoltrisIconName } from '@/components/dashboard/VoltrisIcon';
import VoltrisIconTile, { DASHBOARD_ACCENT } from '@/components/dashboard/VoltrisIconTile';

import type { Order } from '@/types/order';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';
import AuthGuard from '@/components/AuthGuard';
import MyComputerPage from './MyComputerPage';
import SecurityPage from './SecurityPage';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useDashboard } from '@/app/context/DashboardContext';
import { notifyPageView } from '@/utils/notifications';
import { resolveDashboardTab } from '@/components/dashboard/dashboardTabs';
import { LICENSE_CATALOG, LICENSE_PLANS, SERVICE_CATALOG } from '@/lib/license-catalog';


// ============================================================================
// Estados reais da licença (missão §6).
//
// Rótulo e acento vêm do SERVIDOR: /api/v1/license/me aplica resolveLicenseState
// sobre licenses + payments + subscriptions. O navegador não re-deriva nada —
// aqui só existe o mapeamento visual do estado já resolvido.
// ============================================================================
interface LicenseStateVisual {
  icon: VoltrisIconName;
  accent: string;
  chip: string;
  hint: string;
}

const LICENSE_STATE_STYLE: Record<string, LicenseStateVisual> = {
  ATIVA: {
    icon: 'check',
    accent: DASHBOARD_ACCENT.success,
    chip: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    hint: 'Acesso liberado durante todo o período pago.',
  },
  CANCELAMENTO_AGENDADO: {
    icon: 'clock',
    accent: DASHBOARD_ACCENT.info,
    chip: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    hint: 'A renovação automática está desligada, mas o acesso segue válido até a data de expiração — cancelamento agendado não é expiração imediata.',
  },
  FALHA_NO_PAGAMENTO: {
    icon: 'alertTriangle',
    accent: DASHBOARD_ACCENT.warning,
    chip: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    hint: 'A cobrança recorrente falhou. Você mantém o acesso do período já pago; regularize o cartão no Portal Stripe para não perder a renovação.',
  },
  PAGAMENTO_PENDENTE: {
    icon: 'processing',
    accent: DASHBOARD_ACCENT.warning,
    chip: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
    hint: 'Pagamento ainda não confirmado pela Stripe. O acesso só é liberado depois da confirmação — nada é antecipado.',
  },
  EXPIRADA: {
    icon: 'alertCircle',
    accent: DASHBOARD_ACCENT.brandPink,
    chip: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    hint: 'O período pago terminou. Renove para reativar o PRO no mesmo computador, sem reinstalar o aplicativo.',
  },
  REVOGADA: {
    icon: 'lock',
    accent: DASHBOARD_ACCENT.danger,
    chip: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    hint: 'Licença revogada (estorno, chargeback ou decisão de suporte). Seus dados não foram apagados — fale com a gente para entender o caso.',
  },
};

const STATE_STYLE_FALLBACK: LicenseStateVisual = {
  icon: 'info',
  accent: DASHBOARD_ACCENT.brandBlue,
  chip: 'bg-slate-500/10 text-slate-300 border-slate-600/40',
  hint: '',
};

const SUBSCRIPTION_STATUS_LABEL: Record<string, string> = {
  ACTIVE: 'Ativa',
  CANCEL_SCHEDULED: 'Cancelamento agendado',
  CANCELED: 'Cancelada',
  PAST_DUE: 'Cobrança atrasada',
  TRIALING: 'Período de teste',
  INCOMPLETE: 'Cadastro incompleto',
  INCOMPLETE_EXPIRED: 'Cadastro expirado',
  UNPAID: 'Sem pagamento',
  PAUSED: 'Pausada',
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  approved: 'Aprovado',
  paid: 'Pago',
  pending: 'Pendente',
  processing: 'Processando',
  open: 'Aguardando',
  unpaid: 'Não pago',
  failed: 'Recusado',
  payment_failed: 'Recusado',
  declined: 'Recusado',
  past_due: 'Cobrança atrasada',
  refunded: 'Estornado',
  charged_back: 'Chargeback',
  canceled: 'Cancelado',
};

// Polling com limite + timeout (missão §6): em vez de um setInterval eterno,
// consulta a cada 15 s por no máximo 40 tentativas (~10 min) enquanto houver
// pagamento pendente e para sozinho com aviso honesto.
const LICENSE_POLL_INTERVAL_MS = 15_000;
const LICENSE_POLL_MAX_ATTEMPTS = 40;

/**
 * Timeout do download da fatura (missão §5: "O carregamento deve ter tratamento
 * de timeout, erro, recuperação e tentativa novamente" e "nunca exiba um estado
 * de carregamento infinito"). 25 s é folgado para geração de PDF em serverless
 * frio e curto o bastante para o usuário não achar que travou.
 */
const INVOICE_TIMEOUT_MS = 25_000;

/** Fases possíveis do documento, todas VERDADEIRAS (nunca "carregando..." eterno). */
type InvoicePhase = 'idle' | 'preparing' | 'ready' | 'error' | 'unavailable';

interface InvoiceUiState {
  phase: InvoicePhase;
  message: string;
}

/**
 * Texto do rodapé da fatura por fase. A missão é explícita: nada de
 * "Verificando pagamento com a Stripe..." nesse espaço — o que aparece aqui é o
 * estado real do DOCUMENTO.
 */
const INVOICE_PHASE_TEXT: Record<InvoicePhase, string> = {
  idle: '',
  preparing: 'Preparando sua fatura…',
  ready: 'Fatura disponível para download.',
  error: 'Não foi possível preparar a fatura. Tentar novamente.',
  unavailable: 'Fatura indisponível: aguardando confirmação do pagamento.',
};

/** Nome do produto vem do catálogo do backend, nunca de texto solto no cliente. */
function productLabel(planType?: string | null, billingPeriod?: string | null): string {
  const period = (billingPeriod ?? '').toLowerCase().startsWith('y') ? 'year' : 'month';
  const fromCatalog = LICENSE_CATALOG[planType as keyof typeof LICENSE_CATALOG]?.[period as 'month' | 'year'];
  if (fromCatalog) return fromCatalog.name;
  const service = SERVICE_CATALOG[(planType ?? '').toLowerCase()];
  if (service) return service.name;
  const plan = LICENSE_PLANS[planType as keyof typeof LICENSE_PLANS];
  return plan ? plan.displayName : (planType || 'Produto');
}

/**
 * A chave de licença é o segredo de ativação: aparece mascarada e só é revelada
 * sob ação explícita (print de tela e compartilhamento eram riscos reais).
 */
function maskLicenseKey(key?: string | null): string {
  if (!key) return '— — — —';
  const parts = key.split('-');
  if (parts.length < 3) return `${key.slice(0, 3)}${'•'.repeat(Math.max(6, key.length - 3))}`;
  const tail = parts[parts.length - 1];
  const hiddenTail = tail.length > 4 ? `${'•'.repeat(tail.length - 4)}${tail.slice(-4)}` : tail;
  return `${parts.slice(0, 2).join('-')}-${'•'.repeat(Math.max(3, parts[2].length))}-${'•'.repeat(6)}-${hiddenTail}`;
}

const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('pt-BR') : '—';

const fmtDateTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const fmtTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—';

const InfoCell = ({ label, value, tone = 'text-slate-200' }: { label: string; value: ReactNode; tone?: string }) => (
  <div className="flex flex-col gap-0.5 min-w-0">
    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
    <span className={`text-xs font-semibold ${tone} truncate`}>{value}</span>
  </div>
);

// Componente de Card de Estatística - Estilo Executivo
const StatCard = ({ title, value, icon, delay, description }: {
  title: string;
  value: number;
  icon: VoltrisIconName;
  delay: number;
  description?: string;
}) => {
  const { transparencyMode } = useDashboard();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={`relative group p-5 sm:p-6 rounded-2xl border transition-all duration-200
        ${transparencyMode ? 'voltris-glass' : 'bg-slate-900/50 border-slate-800/80 shadow-sm'}
        hover:border-slate-700 hover:bg-slate-900/80
      `}
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <VoltrisIconTile icon={icon} accent={DASHBOARD_ACCENT.brand} size={9} />
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{value}</h3>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Ativo</span>
        </div>
      </div>
      {description && (
        <p className="text-[11px] font-medium text-slate-500 mt-2">{description}</p>
      )}
    </motion.div>
  );
};

/**
 * Rotulo e estado do botao de reembolso.
 *
 * O botao tem que contar a historia real do pedido:
 *   nenhum      -> "Solicitar Reembolso (7 Dias)"
 *   solicitado  -> "Reembolso solicitado" (aguardando a equipe)
 *   processing  -> "Reembolso em processamento"
 *   applied     -> "Reembolso aplicado com sucesso"
 *   rejected    -> "Reembolso recusado" (com o motivo)
 */
function ROTULO_REEMBOLSO(estado?: string | null): string {
    switch (estado) {
        case 'requested': return 'Reembolso solicitado';
        case 'processing': return 'Reembolso em processamento';
        case 'applied': return 'Reembolso aplicado com sucesso';
        case 'rejected': return 'Reembolso recusado';
        default: return 'Solicitar Reembolso (7 Dias)';
    }
}

function ESTILO_REEMBOLSO(estado?: string | null): string {
    if (estado === 'applied') {
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    }
    if (estado === 'requested' || estado === 'processing') {
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
    }
    if (estado === 'rejected') {
        return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
    }
    return 'bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-400';
}

export default function DashboardClient() {
  return (
    <Suspense fallback={
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 border-t-4 border-l-4 border-b-4 border-transparent border-r-4 border-r-[#31A8FF] rounded-full animate-spin"></div>
          <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Iniciando Terminal...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const { user, profile, loading } = useAuth();
  const { transparencyMode } = useDashboard();
  const searchParams = useSearchParams();
  // Mesma função que o menu lateral usa (components/dashboard/dashboardTabs.ts):
  // o CONTEÚDO e a NAVEGAÇÃO nunca podem discordar sobre qual aba está aberta.
  // `?checkout_success=true` (volta da Stripe) = "Minhas Licenças".
  const activeTab = resolveDashboardTab(searchParams) || 'overview';

  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [pendingPurchases, setPendingPurchases] = useState<any[]>([]);
  const [hasPending, setHasPending] = useState(false);
  const [serverTime, setServerTime] = useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
  const [isPolling, setIsPolling] = useState(false);
  const [pollAttempt, setPollAttempt] = useState(0);
  const [installationsCount, setInstallationsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelAction, setCancelAction] = useState<'cancel' | 'resume'>('cancel');
  const [isSyncing, setIsSyncing] = useState(false);
  const [invoiceUi, setInvoiceUi] = useState<Record<string, InvoiceUiState>>({});
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [refundTarget, setRefundTarget] = useState<{ paymentId: string | null; scope: 'latest' | 'initial' } | null>(null);
  /** Fatos de faturamento da conta, resolvidos no servidor (§3). */
  const [billing, setBilling] = useState<any>(null);
  const supabase = useMemo(() => createClient(), []);

  const fetchData = useCallback(async (showLoading = true) => {
    if (!user) return;
    try {
      if (showLoading) setIsLoading(true);

      const [ordersRes, licensesJson, installationsRes, paymentsRes] = await Promise.all([
        supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        // Licencas vem da rota canonica (service_role + filtro por sessao).
        // A query direta usava `.eq('email', ...)` e colunas nao-canonicas
        // (license_type/is_active/devices_in_use/id) que nao existem em
        // public.licenses — o painel ficava vazio/breakado.
        fetch('/api/v1/license/me', { credentials: 'same-origin' })
          .then(async (r) => (r.ok ? r.json() : { error: `HTTP ${r.status}` })),
        supabase.from('installations').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('payments').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      ]);

      if (ordersRes.error) throw ordersRes.error;
      setOrders(ordersRes.data || []);
      setPayments(paymentsRes.data || []);

      if (licensesJson?.error) {
        console.error('Erro ao buscar licencas:', licensesJson.error);
        setLicenses([]);
        setPendingPurchases([]);
        setHasPending(false);
      } else {
        // Contrato canônico da rota: licenses[] já traz state/stateLabel/hasAccess
        // resolvidos no servidor, mais pendingPurchases/hasPending/server_time.
        setLicenses(licensesJson?.licenses || []);
        setPendingPurchases(licensesJson?.pendingPurchases || []);
        setHasPending(licensesJson?.hasPending === true);
        setServerTime(licensesJson?.server_time ?? null);
        // Situação real da assinatura/renovação, resolvida no servidor.
        setBilling(licensesJson?.billing ?? null);
      }

      setInstallationsCount(installationsRes.count || 0);

    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao atualizar dashboard');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [user?.id, user?.email, supabase]); // Depende apenas do ID e email, não do objeto user inteiro

  const handleManageBilling = async () => {
    const toastId = toast.loading('Conectando ao processador de pagamentos...');
    try {
      const response = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      toast.error(data.error || 'Não foi possível abrir o portal de pagamentos.', { id: toastId });
    } catch {
      toast.error('Não foi possível abrir o portal de pagamentos.', { id: toastId });
    } finally {
      toast.dismiss(toastId);
    }
  };

  /**
   * "Sincronizar Agora" — reconcilia o espelho local com a Stripe (missão §9).
   *
   * A versão antiga chamava `fetchData()`, que só relia o Supabase: se o
   * webhook tivesse atrasado, a tela continuava mostrando o estado velho e o
   * usuário concluía que a Stripe estava errada. Agora a rota autenticada
   * consulta a Stripe de verdade e só devolve sucesso depois de reconciliar.
   */
  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    const toastId = toast.loading('Conferindo com o processador de pagamentos...');
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20_000);
      const response = await fetch('/api/stripe/sync', {
        method: 'POST',
        signal: controller.signal,
        credentials: 'same-origin',
      }).finally(() => clearTimeout(timer));

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível sincronizar agora.');
      }

      await fetchData(false);

      const changed = Array.isArray(data.subscriptions)
        ? data.subscriptions.filter((s: any) => s?.changed).length
        : 0;

      if (data.ok) {
        toast.success(
          changed > 0
            ? `Sincronização concluída — ${changed} atualização(ões) aplicada(s).`
            : (data.message || 'Sincronização concluída. Tudo já estava atualizado.'),
          { id: toastId }
        );
      } else {
        toast(data.message || 'Sincronização parcial: confira os avisos.', { id: toastId, icon: '⚠️' });
      }
    } catch (err: any) {
      toast.error(
        err?.name === 'AbortError'
          ? 'A sincronização demorou demais e foi cancelada. Tente novamente.'
          : (err?.message || 'Erro ao sincronizar.'),
        { id: toastId }
      );
    } finally {
      setIsSyncing(false);
      toast.dismiss(toastId);
    }
  };

  /**
   * Download da fatura PDF (missão §5 e §6).
   *
   * Estados verdadeiros em todas as etapas, com timeout explícito:
   *   preparing -> ready | error | unavailable
   * Nunca fica em "carregando" para sempre: o AbortController garante isso.
   */
  const handleDownloadInvoice = async (licenseKey: string, paymentId: string | null) => {
    if (!paymentId) {
      setInvoiceUi((prev) => ({
        ...prev,
        [licenseKey]: { phase: 'unavailable', message: INVOICE_PHASE_TEXT.unavailable },
      }));
      return;
    }

    setInvoiceUi((prev) => ({
      ...prev,
      [licenseKey]: { phase: 'preparing', message: INVOICE_PHASE_TEXT.preparing },
    }));

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), INVOICE_TIMEOUT_MS);

    try {
      const response = await fetch(`/api/billing/invoice?payment_id=${encodeURIComponent(paymentId)}`, {
        credentials: 'same-origin',
        signal: controller.signal,
      });

      if (response.status === 409) {
        const body = await response.json().catch(() => ({}));
        const message = body.error || INVOICE_PHASE_TEXT.unavailable;
        setInvoiceUi((prev) => ({ ...prev, [licenseKey]: { phase: 'unavailable', message } }));
        toast.error(message);
        return;
      }

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || INVOICE_PHASE_TEXT.error);
      }

      const blob = await response.blob();

      // Nome do arquivo vem do Content-Disposition do servidor (nunca montado
      // aqui com dados do usuário).
      const disposition = response.headers.get('Content-Disposition') ?? '';
      const match = /filename="([^"]+)"/i.exec(disposition);
      const fileName = match?.[1] ?? `VOLTRIS-fatura-${paymentId.slice(0, 8)}.pdf`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setInvoiceUi((prev) => ({
        ...prev,
        [licenseKey]: { phase: 'ready', message: INVOICE_PHASE_TEXT.ready },
      }));
    } catch (err: any) {
      const timedOut = err?.name === 'AbortError';
      const message = timedOut
        ? 'A geração do documento demorou demais. Tentar novamente.'
        : (err?.message || INVOICE_PHASE_TEXT.error);
      setInvoiceUi((prev) => ({ ...prev, [licenseKey]: { phase: 'error', message } }));
      toast.error(message);
    } finally {
      clearTimeout(timer);
    }
  };

  /**
   * Reembolso (missão §8). O botão só aparece quando existe ação real; a
   * elegibilidade (7 dias corridos) é decidida no servidor, e a resposta diz
   * exatamente o que aconteceu — reembolso confirmado, em processamento ou
   * solicitação em análise. Nunca "sucesso" sem operação real.
   */
  const handleRequestRefund = async (paymentId: string | null, scope: 'latest' | 'initial' = 'latest') => {
    if (isRefunding) return;

    setIsRefundModalOpen(true);
    setRefundTarget({ paymentId, scope });
  };

  const confirmRefund = async () => {
    if (!refundTarget || isRefunding) return;
    setIsRefunding(true);
    const toastId = toast.loading('Processando solicitação de reembolso...');
    try {
      const response = await fetch('/api/stripe/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          payment_id: refundTarget.paymentId ?? undefined,
          scope: refundTarget.scope,
          confirm: true,
          reason: refundReason.trim() || undefined,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível processar a solicitação.');
      }

      // 202 = registrado para análise; 200 = reembolso executado.
      if (data.status === 'requested') {
        toast('Solicitação registrada. Nossa equipe vai analisar e entrará em contato.', {
          id: toastId, icon: '📋', duration: 8000,
        });
      } else if (data.status === 'processing') {
        toast.success(data.message || 'Reembolso em processamento.', { id: toastId });
      } else {
        toast.success(data.message || 'Reembolso confirmado.', { id: toastId });
      }

      setIsRefundModalOpen(false);
      setRefundReason('');
      await fetchData(false);
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao processar a solicitação de reembolso.', { id: toastId });
    } finally {
      setIsRefunding(false);
      toast.dismiss(toastId);
    }
  };

  /**
   * Cancelar / reativar a renovação (missão §7).
   *
   * O modal mostra até quando o acesso permanece — informação que vem do
   * servidor (`billing.endsAt`), não de cálculo do navegador. A confirmação só
   * aparece depois que a Stripe responde; falha é mostrada como falha.
   */
  const handleConfirmCancel = async () => {
    if (isCancelling) return;
    setIsCancelling(true);
    const toastId = toast.loading('Atualizando a renovação na Stripe...');
    try {
      const response = await fetch('/api/stripe/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          action: cancelAction,
          subscription_id: billing?.subscriptionId ?? undefined,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível alterar a renovação.');
      }

      toast.success(
        data.message || (cancelAction === 'cancel'
          ? 'Renovação desligada. Você continua com acesso até o fim do período pago.'
          : 'Renovação reativada.'),
        { id: toastId, duration: 7000 }
      );

      setIsCancelModalOpen(false);
      await fetchData(false);
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao cancelar a renovação.', { id: toastId });
    } finally {
      setIsCancelling(false);
      toast.dismiss(toastId);
    }
  };

  // Carregar dados apenas na montagem e quando o ID do usuário mudar de fato
  const userIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    // Se o auth terminou de carregar e não temos usuário, paramos o loading local
    // para permitir que o AuthGuard execute o redirecionamento.
    if (!loading && !user) {
      setIsLoading(false);
      return;
    }

    if (!user?.id) return;

    // Só buscar se o ID mudou (evita refetch em token refresh que recria o objeto user)
    if (userIdRef.current === user.id) return;
    userIdRef.current = user.id;
    fetchData();
  }, [user?.id, loading, fetchData]);

  // Notificar visualização da aba de licenças no Dashboard
  useEffect(() => {
    if (activeTab === 'licenses') {
      notifyPageView("Aba de Licenças (Dashboard Interno)");
    }
  }, [activeTab]);

  useEffect(() => {
    const success = searchParams.get('checkout_success');
    if (success !== 'true' || loading) return;

    const type = searchParams.get('type');
    const successMsg = type === 'service' ? 'Serviço adquirido com sucesso!' : 'Pedido confirmado! Processando sua licença...';
    const successIcon = type === 'service' ? '🛠️' : '💎';

    toast.success(successMsg, {
      duration: 6000,
      position: 'top-center',
      icon: successIcon,
      style: {
        background: 'rgba(10, 10, 15, 0.9)',
        color: '#fff',
        border: '1px solid rgba(49, 168, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        fontWeight: 'bold'
      },
    });

    fetchData(false);
    const timer = setTimeout(() => fetchData(false), 5000);
    return () => clearTimeout(timer);
  }, [searchParams, loading, fetchData]);

  // Polling LIMITADO de pagamento pendente (missão §6): antes o painel só
  // atualizava no F5, então quem pagava via o checkout ficava olhando uma tela
  // "sem licença" para sempre. Aqui reconsulta sozinho, com teto de tentativas.
  useEffect(() => {
    if (!user?.id || !hasPending) {
      setIsPolling(false);
      setPollAttempt(0);
      return;
    }

    setIsPolling(true);
    setPollAttempt(0);

    let attempts = 0;
    const id = setInterval(() => {
      attempts += 1;
      if (attempts > LICENSE_POLL_MAX_ATTEMPTS) {
        clearInterval(id);
        setIsPolling(false);
        toast('O pagamento ainda não foi confirmado pela Stripe. Assim que for aprovado, a chave aparece aqui — use “Verificar agora” para não esperar.', {
          icon: '⏳',
          id: 'voltris-poll-limite',
          duration: 9000,
        });
        return;
      }
      setPollAttempt(attempts);
      void fetchData(false);
    }, LICENSE_POLL_INTERVAL_MS);

    return () => clearInterval(id);
  }, [user?.id, hasPending, fetchData]);

  // Copia segura: a chave vai para a área de transferência sob ação explícita.
  // Se o navegador bloquear (contexto não seguro), revela a chave em vez de
  // falhar em silêncio.
  const handleCopyKey = async (key: string) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard indisponível');
      await navigator.clipboard.writeText(key);
      toast.success('Chave copiada. Ela dá acesso ao seu plano — trate como uma senha.');
    } catch {
      setRevealedKeys((prev) => ({ ...prev, [key]: true }));
      toast.error('Seu navegador bloqueou a cópia automática. A chave foi revelada abaixo — copie manualmente.', { duration: 8000 });
    }
  };

  const toggleRevealKey = (key: string) =>
    setRevealedKeys((prev) => ({ ...prev, [key]: !prev[key] }));

  const stats = {
    totalOrders: orders.length + payments.length,
    // "Ativas" = acesso real segundo o servidor (inclui cancelamento agendado e
    // falha de cobrança dentro do período já pago). isActive puro não reflete isso.
    activeLicenses: licenses.filter(l => l.hasAccess ?? l.isActive).length,
    computers: installationsCount
  };

  const hardwareIDProtection = stats.activeLicenses > 0;

  return (
    <AuthGuard>
      {isLoading ? (
        <div className="h-full w-full flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-r-4 border-[#31A8FF] rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-20 h-20 border-t-4 border-[#8B31FF] rounded-full animate-spin-slow"></div>
            </div>
            <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Sincronizando com Supabase Cloud...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full max-w-full h-full min-h-0">
          {/* Dashboard Header - Executive Style */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Painel de Controle
                </h2>

                {/* Hardware ID Protection Status Badge */}
                <div className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-colors
                 ${hardwareIDProtection
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}
               `}>
                  <div className={`w-1.5 h-1.5 rounded-full ${hardwareIDProtection ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                  <span>
                    Proteção HID: {hardwareIDProtection ? 'Ativa' : 'Offline'}
                  </span>
                </div>
              </div>
              <p className="text-slate-400 text-xs font-normal">
                Bem-vindo de volta, <span className="text-slate-200 font-medium">{profile?.full_name || user?.email?.split('@')[0] || 'Usuário'}</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link 
                href="/" 
                className="px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 transition-all text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 shadow-sm"
              >
                <VoltrisIcon name="arrowLeft" size={14} className="text-slate-400" />
                <span>Voltar ao Site</span>
              </Link>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsRefreshing(true);
                  fetchData(false)
                    .then(() => toast.success('Dados atualizados!'))
                    .finally(() => setIsRefreshing(false));
                }}
                className={`p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all ${isRefreshing ? 'opacity-50' : ''}`}
                title="Atualizar dados"
              >
                <VoltrisIcon name="processing" size={16} className={isRefreshing ? 'animate-spin' : ''} />
              </motion.button>
              <Link href="/servicos">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-colors"
                >
                  <VoltrisIcon name="plus" size={16} />
                  <span>Novo Pedido</span>
                </motion.button>
              </Link>
            </div>
          </header>

          {/* Tab Content Rendering */}
          <div className="flex-1 min-h-0 relative">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  <StatCard title="Serviços Adquiridos" value={stats.totalOrders} icon="package" delay={0.05} description="Total de pedidos e serviços" />
                  <StatCard title="Licenças Ativas" value={stats.activeLicenses} icon="success" delay={0.1} description="Disponíveis para uso imediato" />
                  <StatCard title="Computadores Vinculados" value={stats.computers} icon="display" delay={0.15} description="Máquinas com uplink ativo" />
                  
                  {/* Action Cards Grid */}
                  <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-5 mt-2">
                    
                    {/* App Download Card */}
                    <div className={`p-6 sm:p-7 rounded-2xl border transition-all ${transparencyMode ? 'voltris-glass' : 'bg-slate-900/40 border-slate-800/80'} flex flex-col justify-between gap-6`}>
                      <div className="space-y-3">
                        <VoltrisIconTile icon="download" accent={DASHBOARD_ACCENT.brand} size={10} />
                        <h3 className="text-lg font-bold text-white tracking-tight">Voltris Optimizer Desktop</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          Baixe o aplicativo para aplicar otimizações de baixa latência, telemetria de hardware e gerenciamento de comandos remotos.
                        </p>
                      </div>
                      <div className="pt-2">
                        <Link href="/voltrisoptimizer" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs rounded-xl transition-all shadow-sm">
                          <VoltrisIcon name="download" size={16} />
                          <span>Baixar Voltris Optimizer</span>
                        </Link>
                      </div>
                    </div>

                    {/* Billing Hub Card */}
                    <div className={`p-6 sm:p-7 rounded-2xl border transition-all ${transparencyMode ? 'voltris-glass' : 'bg-slate-900/40 border-slate-800/80'} flex flex-col justify-between gap-6`}>
                      <div className="space-y-3">
                        <VoltrisIconTile icon="creditCard" accent={DASHBOARD_ACCENT.brand} size={10} />
                        <h3 className="text-lg font-bold text-white tracking-tight">Faturamento & Assinatura</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          Baixe a fatura comercial em PDF, confira o estado real da sua assinatura,
                          desligue a renovação automática ou solicite reembolso de garantia.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          onClick={handleSync}
                          disabled={isSyncing}
                          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          <VoltrisIcon name="processing" size={14} className={isSyncing ? 'animate-spin' : ''} />
                          {isSyncing ? 'Sincronizando…' : 'Sincronizar Agora'}
                        </button>
                        {billing?.hasSubscription && billing?.state !== 'ENDED' ? (
                          <button
                            onClick={() => {
                              setCancelAction(billing?.canResumeRenewal ? 'resume' : 'cancel');
                              setIsCancelModalOpen(true);
                            }}
                            disabled={!billing?.canCancelRenewal && !billing?.canResumeRenewal}
                            className="px-4 py-2.5 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-xs rounded-xl transition-all disabled:opacity-40"
                          >
                            {billing?.canResumeRenewal ? 'Reativar Renovação' : 'Cancelar Renovação'}
                          </button>
                        ) : null}
                        <button
                          onClick={() => handleRequestRefund(
                            licenses.find((l: any) => l?.invoice?.available)?.invoice?.paymentId ?? null
                          )}
                          disabled={!billing?.canRequestRefund || isRefunding || (billing?.refundState && billing.refundState !== 'none')}
                          className={`px-4 py-2.5 ${ESTILO_REEMBOLSO(billing?.refundState)} font-medium text-xs rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                          {ROTULO_REEMBOLSO(billing?.refundState)}
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {activeTab === 'licenses' && (
                <motion.div
                  key="licenses"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Gestão de Licenças & Faturamento (§9) — os botões refletem a situação
                      REAL do cliente: nada de "cancelar" em assinatura encerrada
                      nem "reembolso" em compra já devolvida. */}
                  <div className={`flex flex-col gap-4 p-5 sm:p-6 rounded-2xl border ${transparencyMode ? 'voltris-glass' : 'bg-slate-900/40 border-slate-800/80'}`}>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <VoltrisIconTile
                        icon={billing?.hasSubscription ? 'creditCard' : 'security'}
                        accent={billing?.hasSubscription ? DASHBOARD_ACCENT.brand : DASHBOARD_ACCENT.info}
                        size={10}
                      />
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-semibold text-slate-200 text-sm">Gestão de Licenças & Faturamento</h4>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {billing?.hasSubscription
                            ? (billing.hint || 'Confira o estado real da sua assinatura.')
                            : 'Você não possui assinatura recorrente — compras avulsas não geram renovação.'}
                        </p>
                      </div>
                      <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
                      >
                        <VoltrisIcon name="processing" size={13} className={isSyncing ? 'animate-spin' : ''} />
                        {isSyncing ? 'Sincronizando…' : 'Sincronizar Agora'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800/60">
                      {/* Cancelar / Reativar renovação — só quando a operação
                          realmente existe para o estado atual (§7 e §9). */}
                      {billing?.hasSubscription && billing?.state !== 'ENDED' && billing?.state !== 'REFUNDED' ? (
                        <button
                          onClick={() => {
                            setCancelAction(billing?.canResumeRenewal ? 'resume' : 'cancel');
                            setIsCancelModalOpen(true);
                          }}
                          disabled={!billing?.canCancelRenewal && !billing?.canResumeRenewal}
                          title={
                            !billing?.canCancelRenewal && !billing?.canResumeRenewal
                              ? 'Nenhuma alteração de renovação disponível agora.'
                              : undefined
                          }
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-xs rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900"
                        >
                          <VoltrisIcon name={billing?.canResumeRenewal ? 'recovery' : 'close'} size={14} />
                          {billing?.canResumeRenewal
                            ? 'Reativar Renovação Automática'
                            : 'Cancelar Renovação Automática'}
                        </button>
                      ) : (
                        <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900/40 border border-slate-800/60 text-slate-500 font-medium text-xs rounded-xl">
                          <VoltrisIcon name="check" size={14} />
                          {billing?.state === 'ENDED' ? 'Assinatura encerrada' : 'Sem assinatura recorrente'}
                        </div>
                      )}

                      {/* Reembolso — elegibilidade real na palavra e no botão (§8). */}
                      <button
                        onClick={() => handleRequestRefund(
                          licenses.find((l: any) => l?.invoice?.available)?.invoice?.paymentId ?? null
                        )}
                        disabled={!billing?.canRequestRefund || isRefunding || (billing?.refundState && billing.refundState !== 'none')}
                        title={billing?.refundState && billing.refundState !== 'none'
                          ? (billing?.refundMessage || 'Este pedido de reembolso ja foi registrado.')
                          : (!billing?.canRequestRefund
                            ? 'Este pagamento não está elegível para reembolso.'
                            : 'Solicitar reembolso da sua compra mais recente (7 dias corridos).')}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 ${ESTILO_REEMBOLSO(billing?.refundState)} font-medium text-xs rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        <VoltrisIcon
                          name={billing?.refundState === 'applied' ? 'check' : (billing?.refundState === 'requested' || billing?.refundState === 'processing' ? 'clock' : 'processing')}
                          size={14}
                        />
                        {billing?.refundState && billing.refundState !== 'none'
                          ? ROTULO_REEMBOLSO(billing.refundState)
                          : (billing?.canRequestRefund ? 'Solicitar Reembolso (7 Dias)' : 'Reembolso indisponível')}
                      </button>
                    </div>

                    {/* Linha de estado: fonte da verdade é o servidor */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] text-slate-500">
                      <span>
                        Estado: <span className="text-slate-300 font-medium">{billing?.stateLabel || '—'}</span>
                      </span>
                      <span>
                        Renovação:{' '}
                        <span className={`font-semibold ${billing?.renewalEnabled ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {billing?.renewalEnabled ? 'Ativada' : 'Desligada'}
                        </span>
                      </span>
                      {billing?.nextBillingAt && (
                        <span>Próxima cobrança: <span className="text-slate-300 font-medium">{fmtDate(billing.nextBillingAt)}</span></span>
                      )}
                      {billing?.endsAt && (
                        <span>Acesso até: <span className="text-slate-300 font-medium">{fmtDate(billing.endsAt)}</span></span>
                      )}
                    </div>
                  </div>

                  {/* Compras aguardando confirmacao da Stripe. A licença ainda
                      não é liberada (missão §6): o bloco vem de
                      /api/v1/license/me -> pendingPurchases, não é suposição. */}
                  {pendingPurchases.length > 0 && (
                    <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/[0.06] border border-amber-500/25 flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <VoltrisIconTile icon="processing" accent={DASHBOARD_ACCENT.warning} size={10} />
                          <div>
                            <h4 className="text-sm font-semibold text-amber-200">
                              {pendingPurchases.length === 1
                                ? 'Pagamento aguardando confirmação'
                                : `${pendingPurchases.length} pagamentos aguardando confirmação`}
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {isPolling
                                ? `Consultando a Stripe automaticamente — tentativa ${pollAttempt} de ${LICENSE_POLL_MAX_ATTEMPTS}.`
                                : 'A chave de ativação aparece aqui assim que o pagamento for aprovado.'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => fetchData(true)}
                          className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-medium transition-all"
                        >
                          Verificar agora
                        </button>
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {pendingPurchases.map((p) => (
                          <li key={p.payment_id} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-semibold text-slate-200 truncate">{productLabel(p.type, p.billingPeriod)}</span>
                              <span className="text-[10px] text-slate-500">Criado em {fmtDateTime(p.createdAt)}</span>
                            </div>
                            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                              {PAYMENT_STATUS_LABEL[String(p.status ?? '').toLowerCase()] ?? String(p.status ?? '—')}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                    {licenses.length > 0 ? (
                      licenses.map((lic, i) => {
                        const stateStyle = LICENSE_STATE_STYLE[lic.state] ?? STATE_STYLE_FALLBACK;
                        const revealed = revealedKeys[String(lic.license_key)] === true;
                        const maxDevices = lic.maxDevices ?? 1;
                        const devicesFull = (lic.devicesInUse ?? 0) >= maxDevices && maxDevices < 9999;
                        // Estado real do documento desta compra (ver INVOICE_PHASE_TEXT).
                        const invoiceState: InvoiceUiState = invoiceUi[String(lic.license_key)] ?? {
                          phase: 'idle',
                          message: '',
                        };
                        const invoicePhase: InvoicePhase = invoiceState.phase;
                        return (
                        <motion.div
                          key={lic.license_key}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`group relative p-6 rounded-2xl border transition-all duration-200 ${transparencyMode ? 'voltris-glass' : 'bg-slate-900/50 border-slate-800/80 shadow-sm'} hover:border-slate-700`}
                        >
                          <div className="relative z-10 flex flex-col gap-5">
                            {/* Card Top: estado CANONICO resolvido no servidor */}
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <VoltrisIconTile icon={stateStyle.icon} accent={stateStyle.accent} size={10} />
                                <div className="flex flex-col">
                                  <h4 className="text-base font-bold text-white tracking-tight">{lic.displayName || productLabel(lic.type, lic.billingPeriod)}</h4>
                                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider w-fit mt-0.5 border ${stateStyle.chip}`}>
                                    {lic.stateLabel ?? '—'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                  {lic.hasAccess ? 'Acesso até' : 'Validade'}
                                </span>
                                <span className="text-xs font-semibold text-slate-200 mt-0.5">{fmtDate(lic.expiresAt)}</span>
                                {typeof lic.daysLeft === 'number' && lic.hasAccess && (
                                  <span className={`text-[10px] font-semibold mt-0.5 ${lic.expiringSoon ? 'text-amber-400' : 'text-slate-500'}`}>
                                    {lic.daysLeft > 0 ? `faltam ${lic.daysLeft} dia${lic.daysLeft === 1 ? '' : 's'}` : 'expira hoje'}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Por que este estado? (sem jargão, sem placebo) */}
                            {stateStyle.hint && (
                              <p className="text-[11px] leading-relaxed text-slate-400 -mt-1">{stateStyle.hint}</p>
                            )}

                            {/* Key Section: mascarada por padrão */}
                            <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800/80 flex flex-col gap-1.5">
                              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Chave de Ativação</span>
                              <div className="flex items-center justify-between gap-3">
                                <code className="flex-1 font-mono text-xs font-semibold text-slate-200 tracking-wide truncate select-all">
                                  {revealed ? lic.license_key : maskLicenseKey(lic.license_key)}
                                </code>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => toggleRevealKey(lic.license_key)}
                                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/80"
                                    title={revealed ? 'Ocultar chave' : 'Revelar chave'}
                                  >
                                    <VoltrisIcon name={revealed ? 'lock' : 'key'} size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleCopyKey(lic.license_key)}
                                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/80"
                                    title="Copiar Chave"
                                  >
                                    <VoltrisIcon name="copy" size={14} />
                                  </button>
                                  <Link href={`/dashboard?tab=pc`} className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 transition-all border border-indigo-500/25" title="Ver em Meu Computador">
                                    <VoltrisIcon name="externalLink" size={14} />
                                  </Link>
                                </div>
                              </div>
                            </div>

                            {/* Detalhes reais: plano, período, ativação, dispositivos, assinatura */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              <InfoCell label="Plano" value={productLabel(lic.type, lic.billingPeriod)} />
                              <InfoCell label="Período" value={lic.billingPeriodLabel ?? 'Mensal'} />
                              <InfoCell
                                label="Dispositivos"
                                value={`${lic.devicesInUse ?? 0}/${maxDevices >= 9999 ? 'ilimitado' : maxDevices}`}
                                tone={devicesFull ? 'text-amber-400' : 'text-white'}
                              />
                              <InfoCell
                                label="Ativada em"
                                value={lic.activatedAt ? fmtDateTime(lic.activatedAt) : 'ainda não ativada'}
                                tone={lic.activatedAt ? 'text-slate-200' : 'text-slate-500'}
                              />
                              <InfoCell
                                label="Pagamento"
                                value={
                                  lic.paymentStatus
                                    ? PAYMENT_STATUS_LABEL[String(lic.paymentStatus).toLowerCase()] ?? String(lic.paymentStatus)
                                    : 'sem registro'
                                }
                                tone={
                                  lic.paymentStatus === 'approved' || lic.paymentStatus === 'paid'
                                    ? 'text-emerald-400'
                                    : lic.paymentStatus === 'failed' || lic.paymentStatus === 'unpaid' || lic.paymentStatus === 'refunded' || lic.paymentStatus === 'chargeback'
                                      ? 'text-rose-400'
                                      : 'text-amber-400'
                                }
                              />
                              <InfoCell
                                label="Assinatura"
                                value={SUBSCRIPTION_STATUS_LABEL[String(lic.subscriptionStatus ?? '').toUpperCase()] ?? 'sem assinatura'}
                              />
                              {/* Renovação: ATIVADA/DESLIGADA só quando o servidor confirma (§3) */}
                              <InfoCell
                                label="Renovação"
                                value={
                                  lic.billingState === 'ONE_TIME' ? 'sem recorrência'
                                    : lic.billingState === 'ENDED' ? 'assinatura encerrada'
                                      : lic.renewalEnabled
                                        ? `ativada${lic.nextBillingAt ? ` · ${fmtDate(lic.nextBillingAt)}` : ''}`
                                        : lic.billingState === 'CANCEL_SCHEDULED'
                                          ? `desligada · acesso até ${fmtDate(lic.endsAt || lic.expiresAt)}`
                                          : (lic.billingLabel || '—').toLowerCase()
                                }
                                tone={
                                  lic.renewalEnabled ? 'text-emerald-400'
                                    : lic.billingState === 'CANCEL_SCHEDULED' ? 'text-cyan-400'
                                      : lic.billingState === 'ENDED' ? 'text-rose-400'
                                        : 'text-slate-300'
                                }
                              />
                            </div>

                            {/* Rodapé: estado real do documento + acoes proprias do estado */}
                            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/60 pt-4 text-xs">
                              <div className="flex items-center gap-2 text-slate-500">
                                <VoltrisIcon
                                  name={invoicePhase === 'preparing' ? 'processing' : invoicePhase === 'error' ? 'alertCircle' : 'receipt'}
                                  size={12}
                                  className={invoicePhase === 'preparing' ? 'animate-spin' : ''}
                                />
                                <span className={invoicePhase === 'error' ? 'text-rose-400' : invoicePhase === 'ready' ? 'text-emerald-400' : ''}>
                                  {invoicePhase === 'idle'
                                    ? lic.invoice?.available
                                      ? `Dados sincronizados às ${fmtTime(serverTime)}`
                                      : `Dados sincronizados às ${fmtTime(serverTime)}`
                                    : invoiceState.message || INVOICE_PHASE_TEXT[invoicePhase]}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                {(lic.state === 'EXPIRADA' || lic.state === 'PAGAMENTO_PENDENTE') && (
                                  <Link href="/adquirir-licenca" className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] transition-colors">
                                    Renovar acesso
                                  </Link>
                                )}
                                {/* O Portal da Stripe sai daqui e só aparece onde é
                                    realmente necessário: cobrança recusada, onde o
                                    cliente precisa atualizar o cartão. Em todos os
                                    outros casos a fatura PDF substitui (§5). */}
                                {lic.state === 'FALHA_NO_PAGAMENTO' && (
                                  <button
                                    onClick={handleManageBilling}
                                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-300 font-medium text-[11px] transition-all"
                                  >
                                    Atualizar cartão de pagamento
                                  </button>
                                )}
                                {/* Substitui "Gerenciar no Portal Stripe" (missão §5).
                                    O estado do documento é o do botão: nada de
                                    sucesso falso nem carregamento infinito. */}
                                <button
                                  onClick={() => handleDownloadInvoice(lic.license_key, lic.invoice?.paymentId ?? lic.paymentId ?? null)}
                                  disabled={!lic.invoice?.available || invoicePhase === 'preparing'}
                                  title={lic.invoice?.available
                                    ? 'Baixar a fatura comercial em PDF desta compra'
                                    : (lic.invoice?.unavailableReason ?? INVOICE_PHASE_TEXT.unavailable)}
                                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium text-[11px] transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-800"
                                >
                                  <VoltrisIcon name={invoicePhase === 'preparing' ? 'processing' : 'receipt'} size={12} className={invoicePhase === 'preparing' ? 'animate-spin' : ''} />
                                  {invoicePhase === 'preparing'
                                    ? 'Gerando PDF…'
                                    : invoicePhase === 'ready'
                                      ? 'Baixar novamente'
                                      : 'Baixar Fatura (PDF)'}
                                </button>
                                <Link href="/voltrisoptimizer" className="px-3 py-1.5 rounded-lg text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors">
                                  Baixar App <VoltrisIcon name="download" size={12} />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                        );
                      })
                    ) : (
                      <div className={`col-span-1 xl:col-span-2 p-12 sm:p-16 rounded-2xl text-center border border-slate-800/80 flex flex-col items-center gap-4 ${transparencyMode ? 'voltris-glass' : 'bg-slate-900/30'}`}>
                        <VoltrisIconTile icon="security" accent={DASHBOARD_ACCENT.brand} size={14} />
                        <div className="space-y-1.5 max-w-md">
                          <h3 className="text-lg font-bold text-white tracking-tight">Nenhuma licença ativa</h3>
                          <p className="text-slate-400 text-xs leading-relaxed">Você ainda não possui licenças ativas vinculadas a este e-mail. Adquira uma licença para desbloquear o Optimizer PRO.</p>
                        </div>
                        <Link href="/adquirir-licenca" className="mt-2">
                          <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/20">
                            Explorar Planos PRO
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className={`p-6 sm:p-7 rounded-2xl border ${transparencyMode ? 'voltris-glass' : 'bg-slate-900/50 border-slate-800/80 shadow-sm'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
                      <div className="flex items-center gap-3">
                        <VoltrisIconTile icon="package" accent={DASHBOARD_ACCENT.brand} size={10} />
                        <div>
                          <h2 className="text-lg font-bold text-white tracking-tight">Histórico de Pedidos</h2>
                          <p className="text-slate-400 text-xs mt-0.5">Acompanhe todos os seus serviços contratados e licenças</p>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-800/80">
                            <th className="pb-3 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Item / Serviço</th>
                            <th className="pb-3 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Data</th>
                            <th className="pb-3 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Valor</th>
                            <th className="pb-3 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {/* Mesclagem de Pedidos e Pagamentos */}
                          {[
                            ...orders.map(o => ({ ...o, display_type: 'SERVICE_LEGACY', display_name: o.service_name, display_plan: o.plan_type, amount: o.total || o.final_price })),
                            ...payments.map(p => {
                              const isService = ['formatacao', 'otimizacao', 'correcao', 'impressora', 'virus', 'recuperacao'].some(key => p.plan_type?.includes(key));
                              return {
                                ...p,
                                display_type: isService ? 'SERVICE' : 'LICENSE',
                                display_name: isService ? (p.plan_type?.replace(/_/g, ' ').toUpperCase() || 'SERVIÇO') : `LICENÇA: ${p.plan_type?.toUpperCase()}`,
                                display_plan: isService ? 'SERVIÇO PROFISSIONAL' : 'SUPORTE PRIORITÁRIO',
                                amount: p.amount
                              };
                            })
                          ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).length > 0 ? (
                            [
                              ...orders.map(o => ({ ...o, display_type: 'SERVICE_LEGACY', display_name: o.service_name, display_plan: o.plan_type, amount: o.total || o.final_price })),
                              ...payments.map(p => {
                                const isService = ['formatacao', 'otimizacao', 'correcao', 'impressora', 'virus', 'recuperacao'].some(key => p.plan_type?.includes(key));
                                return {
                                  ...p,
                                  display_type: isService ? 'SERVICE' : 'LICENSE',
                                  display_name: isService ? (p.plan_type?.replace(/_/g, ' ').toUpperCase() || 'SERVIÇO') : `LICENÇA: ${p.plan_type?.toUpperCase()}`,
                                  display_plan: isService ? 'SERVIÇO PROFISSIONAL' : 'SUPORTE PRIORITÁRIO',
                                  amount: p.amount
                                };
                              })
                            ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((item, idx) => (
                              <tr key={item.id + idx} className="group hover:bg-slate-800/30 transition-colors">
                                <td className="py-4 px-3">
                                  <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-white tracking-tight">{item.display_name}</span>
                                    <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                                      {item.display_type === 'LICENSE' ? (
                                        <span className="text-indigo-400">Produto Digital</span>
                                      ) : item.display_type === 'SERVICE' ? (
                                        <span className="text-blue-400">Serviço Especializado</span>
                                      ) : (
                                        item.display_plan || 'Personalizado'
                                      )}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 px-3 hidden sm:table-cell">
                                  <span className="text-xs font-medium text-slate-400">
                                    {new Date(item.created_at).toLocaleDateString('pt-BR')}
                                  </span>
                                </td>
                                <td className="py-4 px-3">
                                  <span className="text-xs font-semibold text-slate-200">
                                    R$ {(item.amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </span>
                                </td>
                                <td className="py-4 px-3">
                                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium
                                  ${(['completed', 'approved', 'paid', 'active'].includes(item.status?.toLowerCase())) ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                      (['cancelled', 'rejected', 'declined', 'canceled', 'refunded'].includes(item.status?.toLowerCase())) ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                                        'bg-amber-500/10 border-amber-500/20 text-amber-400'}
                                `}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${(['completed', 'approved', 'paid', 'active'].includes(item.status?.toLowerCase())) ? 'bg-emerald-400' : (['cancelled', 'rejected', 'declined', 'canceled', 'refunded'].includes(item.status?.toLowerCase())) ? 'bg-rose-400' : 'bg-amber-400'}`}></div>
                                    <span>
                                      {(['completed', 'approved', 'paid', 'active', 'succeeded', 'ativo'].includes(String(item.status).trim().toLowerCase())) ? 'Aprovado' :
                                        (['cancelled', 'rejected', 'declined', 'canceled', 'refunded', 'cancelado'].includes(String(item.status).trim().toLowerCase())) ? 'Cancelado' :
                                          'Pendente'}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="py-12 text-center">
                                <p className="text-slate-400 text-xs">Nenhum pedido ou pagamento registrado até o momento.</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'pc' && (
                <motion.div
                  key="pc"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="h-full"
                >
                  <MyComputerPage userId={user?.id || ''} />
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="h-full"
                >
                  <SecurityPage />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* --- MODAL DE CANCELAMENTO PROFISSIONAL (missão §7) --- */}
      <AnimatePresence>
        {isCancelModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isCancelling && setIsCancelModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cancel-modal-title"
              className="relative w-full max-w-md bg-slate-900 rounded-2xl p-7 shadow-2xl border border-slate-800 overflow-hidden"
            >
              <div className="relative z-10 flex flex-col items-center text-center">
                <VoltrisIconTile
                  icon={cancelAction === 'cancel' ? 'alertTriangle' : 'recovery'}
                  accent={cancelAction === 'cancel' ? DASHBOARD_ACCENT.danger : DASHBOARD_ACCENT.success}
                  size={12}
                  className="mb-5"
                />

                <h3 id="cancel-modal-title" className="text-lg font-bold text-white tracking-tight mb-2">
                  {cancelAction === 'cancel' ? 'Desligar renovação automática?' : 'Reativar renovação automática?'}
                </h3>

                <p className="text-slate-400 text-xs leading-relaxed mb-5">
                  {cancelAction === 'cancel'
                    ? 'A próxima cobrança programada será removida. Você não paga nada a mais e continua com todos os recursos até o fim do período já pago.'
                    : 'A renovação automática voltará a ser cobrada no próximo ciclo, no valor e na data que já estavam contratados.'}
                </p>

                {/* Informação que o cliente tem direito de saber ANTES de confirmar */}
                <div className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-4 py-3 mb-6 text-left space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-400">Assinatura</span>
                    <span className="text-slate-200 font-medium">{billing?.stateLabel || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-400">
                      {cancelAction === 'cancel' ? 'Acesso até' : 'Próxima cobrança'}
                    </span>
                    <span className="text-slate-200 font-medium">
                      {fmtDate(cancelAction === 'cancel'
                        ? (billing?.endsAt || billing?.nextBillingAt)
                        : billing?.nextBillingAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-400">Multa por cancelamento</span>
                    <span className="text-emerald-400 font-medium">Não há</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 w-full">
                  <button
                    onClick={handleConfirmCancel}
                    disabled={isCancelling}
                    className={`w-full py-2.5 font-semibold text-xs rounded-xl transition-all shadow-sm disabled:opacity-50 ${
                      cancelAction === 'cancel'
                        ? 'bg-rose-500 hover:bg-rose-600 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {isCancelling
                      ? 'Confirmando com o processador...'
                      : cancelAction === 'cancel'
                        ? 'Confirmar Cancelamento'
                        : 'Confirmar Reativação'}
                  </button>
                  <button
                    onClick={() => setIsCancelModalOpen(false)}
                    disabled={isCancelling}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/70 text-slate-300 font-medium text-xs rounded-xl transition-all disabled:opacity-50"
                  >
                    {cancelAction === 'cancel' ? 'Manter minha assinatura' : 'Cancelar operação'}
                  </button>
                </div>

                <p className="mt-4 text-[10px] text-slate-500 leading-relaxed">
                  A alteração é registrada no processador de pagamentos. Nada muda aqui até
                  que ele confirme a operação.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL DE REEMBOLSO (missão §8) --- */}
      <AnimatePresence>
        {isRefundModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isRefunding && setIsRefundModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="refund-modal-title"
              className="relative w-full max-w-md bg-slate-900 rounded-2xl p-7 shadow-2xl border border-slate-800 overflow-hidden"
            >
              <div className="relative z-10 flex flex-col items-center text-center">
                <VoltrisIconTile icon="processing" accent={DASHBOARD_ACCENT.warning} size={12} className="mb-5" />

                <h3 id="refund-modal-title" className="text-lg font-bold text-white tracking-tight mb-2">
                  Solicitar reembolso
                </h3>

                <p className="text-slate-400 text-xs leading-relaxed mb-5">
                  Você tem direito a reembolso integral em até 7 dias corridos após a
                  contratação, sem necessidade de justificativa (art. 49 do Código de Defesa
                  do Consumidor). Depois desse prazo, sua solicitação passa por análise.
                </p>

                <div className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-4 py-3 mb-4 text-left space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-400">Compra</span>
                    <span className="text-slate-200 font-medium">
                      {refundTarget?.paymentId
                        ? `#${refundTarget.paymentId.slice(0, 8)}`
                        : 'sua compra mais recente'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-400">Efeito no acesso</span>
                    <span className="text-slate-200 font-medium">
                      {billing?.canCancelRenewal ? 'recorrência será encerrada' : 'apenas o período reembolsado'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-400">Prazo do estorno</span>
                    <span className="text-slate-200 font-medium">1 a 2 faturas</span>
                  </div>
                </div>

                <label className="w-full text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Motivo (opcional)
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  maxLength={1000}
                  rows={3}
                  placeholder="Conte rapidamente o que houve (ajuda nossa análise)."
                  className="w-full px-3 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
                />

                <div className="flex flex-col gap-2.5 w-full mt-5">
                  <button
                    onClick={confirmRefund}
                    disabled={isRefunding}
                    className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-all shadow-sm"
                  >
                    {isRefunding ? 'Processando com o processador...' : 'Confirmar Solicitação'}
                  </button>
                  <button
                    onClick={() => setIsRefundModalOpen(false)}
                    disabled={isRefunding}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/70 text-slate-300 font-medium text-xs rounded-xl transition-all disabled:opacity-50"
                  >
                    Voltar
                  </button>
                </div>

                <p className="mt-4 text-[10px] text-slate-500 leading-relaxed">
                  Você só recebe a confirmação de conclusão depois que o processador de
                  pagamentos estornar o valor de verdade.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AuthGuard>
  );
}

