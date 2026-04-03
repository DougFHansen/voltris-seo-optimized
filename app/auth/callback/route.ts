import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { TelegramService } from '@/services/telegramService';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  // 'next' pode vir como query param (OAuth Google passa via redirectTo) ou como parâmetro direto
  const next = searchParams.get('next') || '/';

  console.log('🔍 [OAuth Callback] Iniciando callback');
  console.log('🔍 [OAuth Callback] Código:', code ? 'SIM' : 'NÃO');
  console.log('🔍 [OAuth Callback] Erro:', error);
  console.log('🔍 [OAuth Callback] Descrição do erro:', errorDescription);

  // Se há erro na URL, redirecionar com mensagem clara
  if (error) {
    console.error('❌ [OAuth Callback] Erro na URL:', error, errorDescription);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(`Erro OAuth: ${errorDescription || error}`)}`);
  }

  if (code) {
    try {
      console.log('🔍 [OAuth Callback] Criando cliente Supabase...');
      const supabase = await createClient();
      console.log('✅ [OAuth Callback] Cliente Supabase criado');
      
      console.log('🔍 [OAuth Callback] Trocando código por sessão...');
      const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (authError) {
        console.error('❌ [OAuth Callback] Erro ao trocar código por sessão:', authError);
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(`Erro de autenticação: ${authError.message}`)}`);
      }
      
      console.log('✅ [OAuth Callback] Sessão criada com sucesso para usuário:', data.user?.id);
      console.log('🔍 [OAuth Callback] Dados do usuário:', {
        id: data.user?.id,
        email: data.user?.email,
        metadata: data.user?.user_metadata
      });
      
      if (data.user) {
        // Verificar se o perfil existe
        console.log('🔍 [OAuth Callback] Verificando perfil do usuário...');
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('❌ [OAuth Callback] Erro ao buscar perfil:', profileError);
          
          // Se o perfil não existe, tentar criar manualmente
          if (profileError.code === 'PGRST116') {
            console.log('🔍 [OAuth Callback] Perfil não encontrado, tentando criar manualmente...');
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                full_name: data.user.user_metadata?.full_name || data.user.email || 'Usuário',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
              
            if (insertError) {
              console.error('❌ [OAuth Callback] Erro ao criar perfil manualmente:', insertError);
              console.log('🔍 [OAuth Callback] Tentando inserção mínima...');
              
              // Tentar inserção mínima
              const { error: minInsertError } = await supabase
                .from('profiles')
                .insert({
                  id: data.user.id,
                  full_name: 'Usuário'
                });
                
              if (minInsertError) {
                console.error('❌ [OAuth Callback] Erro na inserção mínima:', minInsertError);
                return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Erro ao criar perfil do usuário')}`);
              } else {
                console.log('✅ [OAuth Callback] Perfil criado com inserção mínima');
              }
            } else {
              console.log('✅ [OAuth Callback] Perfil criado manualmente com sucesso');
              
              // Notificar Sucesso no Telegram (Novo Cadastro via Google)
              try {
                await TelegramService.notifyPageView(
                  `Novo Cadastro Realizado: ${data.user.email} (Via Google)`, 
                  `${origin}/login`
                );
              } catch (err) {
                console.error('Erro ao notificar Telegram no callback:', err);
              }
            }
            
            return NextResponse.redirect(`${origin}/perfil?completar=1&google=1&redirect=${encodeURIComponent(next)}`);
          }
          
          return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Erro ao buscar perfil do usuário')}`);
        }

        console.log('✅ [OAuth Callback] Perfil encontrado:', profile);

        // Se campos obrigatórios estão faltando, redirecionar para completar cadastro
        const missingFields = !profile?.phone || !profile?.city || !profile?.state || !profile?.cep;
        
        if (missingFields) {
          console.log('🔍 [OAuth Callback] Perfil incompleto, redirecionando para completar cadastro');
          return NextResponse.redirect(`${origin}/perfil?completar=1&google=1&redirect=${encodeURIComponent(next)}`);
        } else {
          console.log('✅ [OAuth Callback] Perfil completo, redirecionando para:', next);
          // Se next é '/', redirecionar para dashboard como fallback
          const finalDestination = next === '/' ? '/dashboard' : next;
          return NextResponse.redirect(`${origin}${finalDestination}`);
        }
      }
    } catch (error) {
      console.error('❌ [OAuth Callback] Erro inesperado no callback:', error);
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Erro inesperado durante autenticação')}`);
    }
  }

  console.log('❌ [OAuth Callback] Código não fornecido, redirecionando para login');
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Código de autenticação inválido')}`);
} 