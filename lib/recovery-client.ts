'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * CLIENTE DE RECUPERAÇÃO DE SENHA — fluxo IMPLÍCITO, de propósito.
 *
 * O projeto usa `@supabase/ssr`, que trabalha com **PKCE**. No PKCE, o
 * pedido de redefinição guarda o "verificador do código" (o `code_challenge`
 * que o cliente envia) e o link de e-mail volta com um `?code=` que precisa
 * ser trocado de volta com esse verificador.
 *
 * O verificador fica guardado num COOKIE do site onde o pedido foi feito.
 * O link do Supabase, porém, passa por uma cadeia de redirecionamento
 * (http://voltris.com.br → https://voltris.com.br → https://www.voltris.com.br)
 * e o cookie não sobrevive a ela — o verificador simplesmente não existe mais
 * quando o link chega. O erro é:
 *
 *     invalid flow state, no valid flow state found
 *
 * e a pessoa é avisada de que precisa "abrir no mesmo navegador", mesmo
 * estando no mesmo navegador (o cookie de Strict/Lax não atravessa a
 * navegação vinda do cliente de e-mail).
 *
 * COM O FLUXO IMPLÍCITO o link volta com o token no FRAGMENTO
 * (`#access_token=…&type=recovery`): não existe verificador, não existe
 * cookie, e o link funciona em QUALQUER navegador, em QUALQUER aparelho e
 * depois de limpar os dados do site. É o que um sistema profissional precisa:
 * o link precisa funcionar para quem o recebe, não só para quem o pediu.
 */
let cliente: SupabaseClient | null = null;

export function clienteDeRecuperacao(): SupabaseClient {
    if (cliente) return cliente;
    cliente = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                flowType: 'implicit',
                // O cliente é de uso único: não guarda sessão nem fica lendo a URL.
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
            },
        }
    );
    return cliente;
}
