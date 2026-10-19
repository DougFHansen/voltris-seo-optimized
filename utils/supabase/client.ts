import { createBrowserClient } from '@supabase/ssr'
import { pareceLinkDeRecuperacao, readLocationParts } from '@/lib/password-recovery'

let client: ReturnType<typeof createBrowserClient> | undefined;

/**
 * Cliente do Supabase para o navegador.
 *
 * DETALHE QUE FAZ A DIFERENÇA NO LINK DE RECUPERAÇÃO:
 *
 * O `supabase-js` abre sessão automaticamente a partir do fragmento da URL
 * (`detectSessionInUrl`, ligado por padrão). O link de redefinição de senha
 * chega com `#access_token=…&type=recovery` — e, com essa opção ligada, o
 * usuário entra LOGADO no site apenas por clicar no link. Foi o relato real:
 * "do nada loga na minha conta que eu pedi para redefinir a senha".
 *
 * Num link de recuperação a sessão serve para TROCAR a senha, não para
 * entrar no site. Então, quando a URL é de recuperação, o cliente é criado
 * com `detectSessionInUrl: false` — quem troca a senha é a página
 * `/reset-password`, que faz a troca de token de propósito.
 */
function opcoesDoCliente() {
  if (typeof window === 'undefined') {
    return { auth: { detectSessionInUrl: true, persistSession: true } }
  }
  const linkDeRecuperacao = pareceLinkDeRecuperacao(readLocationParts(), window.location.pathname)
  return {
    auth: {
      // Link de recuperação: NÃO abre sessão sozinho.
      detectSessionInUrl: !linkDeRecuperacao,
      // A sessão da recuperação precisa sobreviver à troca de senha (é ela
      // que autoriza o `updateUser`) e ao redirect final.
      persistSession: true,
    },
  }
}

export const createClient = () => {
  if (typeof window === 'undefined') {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      opcoesDoCliente()
    )
  }

  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      opcoesDoCliente()
    )
  }

  return client;
}
