import { redirect } from 'next/navigation';

/**
 * Redirecionamento server-side para página de sucesso
 * Evita problemas de client-side routing
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const preferenceId = searchParams.get('preference_id');
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  
  // Validar parâmetros obrigatórios
  if (!preferenceId) {
    return new Response('Parâmetro preference_id é obrigatório', { status: 400 });
  }
  
  // Construir URL de destino - usando versão simplificada
  const destinationUrl = `/pagina-sucesso-simples?preference_id=${preferenceId}${paymentId ? `&payment_id=${paymentId}` : ''}${status ? `&status=${status}` : ''}`;
  
  console.log(`[REDIRECT SUCCESS] Redirecionando para: ${destinationUrl}`);
  
  // Redirecionar server-side
  redirect(destinationUrl);
}