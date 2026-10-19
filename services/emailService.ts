/**
 * SERVICE DE E-MAIL — OBSOLETO. NÃO USE.
 * =========================================================
 *
 * SUBSTITUÍDO PELO SERVIÇO CENTRALIZADO:
 *   - `lib/resend-client.ts`    → único ponto de saída para a Resend (timeout,
 *                                 classificação de erro, sem vazamento de chave)
 *   - `lib/email-templates.ts`  → único lugar que gera HTML de e-mail
 *   - `lib/email-outbox.ts`     → fila transacional (idempotência, retry,
 *                                 backoff, recuperação)
 *   - `lib/email-notifier.ts`   → ponto de disparo por evento de negócio
 *     (compra, renovação, cancelamento, reembolso, falha de pagamento)
 *
 * -------------------------------------------------------------------------
 * POR QUE ESTE ARQUIVO FOI ESVAZIADO
 * -------------------------------------------------------------------------
 * A implementação anterior era um caminho paralelo e NÃO FUNCIONAL. Os
 * defeitos encontrados na auditoria (2026-10-19) foram:
 *
 *  1. NENHUMA chamada no projeto. `sendLicenseEmail` não é chamada em lugar
 *     nenhum do código — portanto nenhum e-mail de licença era enviado.
 *
 *  2. RETORNOVA `true` SEM TER ENVIADO NADA. Havia três caminhos que
 *     devolviam sucesso:
 *       - SMTP: imprimia "implementação pendente" e devolvia `true`;
 *       - fila: gravava em `email_queue`, tabela que NÃO EXISTE no banco (o
 *         insert falhava, o erro era engolido e a execução caía no caminho
 *         seguinte);
 *       - Resend: usava um remetente fixo `naoresponda@voltris.com.br`, que
 *         não é o remetente verificado do domínio.
 *     Um chamador que checasse o retorno receberia "enviado" com a
 *     licença nunca entregue ao cliente.
 *
 *  3. NÃO TINHA FILA DE VERDADE. Retry, idempotência e recuperação não
 *     existiam: uma indisponibilidade da Resend significava e-mail perdido.
 *
 *  4. LOGAVA DADOS SENSÍVEIS em texto puro: endereço do cliente e prefixo da
 *     chave de licença.
 *
 *  5. FORMATAVA DINHEIRO COM SEPARADOR DECIMAL AMERICANO ("R$ 15.00").
 *
 * -------------------------------------------------------------------------
 * COMO MIGRAR
 * -------------------------------------------------------------------------
 * Antes (isto aqui, nunca funcionou):
 *
 *     await sendLicenseEmail({ email, licenseKey, licenseType, ... });
 *
 * Depois (serviço central, com a fatura em PDF anexada):
 *
 *     import { notifyPurchaseConfirmed } from '@/lib/email-notifier';
 *     await notifyPurchaseConfirmed({ paymentId, userId });
 *
 * `notifyPurchaseConfirmed` NUNCA lança: uma falha de e-mail não desfaz a
 * compra nem a emissão da licença — a intenção fica na fila e o worker tenta
 * de novo. Este é o contrato que substitui o antigo retorno `true`.
 */

export interface LegacyLicenseEmailData {
    email: string;
    licenseKey: string;
    licenseType: string;
    maxDevices: number;
    expiresAt: string;
    amountPaid: number;
    paymentMethod?: string;
    fullName?: string;
}

/**
 * Lança sempre.
 *
 * Existe apenas para que qualquer código que ainda importe este símbolo
 * quebre de forma OBVIA em vez de silenciosamente receber um `true` que não
 * corresponde a nenhum e-mail enviado.
 */
export async function sendLicenseEmail(data: LegacyLicenseEmailData): Promise<boolean> {
    // A assinatura é mantida para que o erro de compilação aponte o arquivo.
    void data;
    throw new Error(
        'sendLicenseEmail foi descontinuado. Use `notifyPurchaseConfirmed` de ' +
        "'@/lib/email-notifier' (envia a fatura em PDF e garante idempotência). " +
        'Ver services/emailService.ts para a justificativa.'
    );
}
