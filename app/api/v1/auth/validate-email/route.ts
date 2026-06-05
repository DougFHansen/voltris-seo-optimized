import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns/promises';

// Lista compacta de provedores de email descartáveis comuns
const BURNER_DOMAINS = [
  'mailinator.com', 'yopmail.com', 'guerrillamail.com', 'tempmail.com', 
  'dispostable.com', 'getnada.com', 'sharklasers.com', '10minutemail.com'
];

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        
        if (!email || !email.includes('@')) {
            return NextResponse.json({ valid: false, error: 'Formato inválido.' });
        }

        const domain = email.split('@')[1];

        // 1. Verificar se é um provedor descartável conhecido
        if (BURNER_DOMAINS.includes(domain.toLowerCase())) {
            return NextResponse.json({ 
                valid: false, 
                error: 'E-mails temporários ou descartáveis não são permitidos.' 
            });
        }

        // 2. Verificar se o domínio possui registros MX (Mail Exchange)
        // Isso garante que o domínio de fato pode receber e-mails.
        const commonTLDs = ['com', 'br', 'net', 'org', 'gov', 'me', 'io', 'co', 'app', 'dev', 'edu'];
        const tld = domain.split('.').pop()?.toLowerCase();
        if (tld && tld.length < 2) {
             return NextResponse.json({ valid: false, error: 'O domínio do e-mail é inválido.' });
        }

        try {
            const mxRecords = await dns.resolveMx(domain);
            if (!mxRecords || mxRecords.length === 0) {
                return NextResponse.json({ 
                    valid: false, 
                    error: 'Este domínio de e-mail parece ser inválido ou não pode receber mensagens.' 
                });
            }
        } catch (dnsErr) {
            return NextResponse.json({ 
                valid: false, 
                error: 'O domínio do e-mail não existe ou está inacessível.' 
            });
        }

        return NextResponse.json({ valid: true });

    } catch (error: any) {
        console.error('[EMAIL VALIDATION ERROR]', error);
        return NextResponse.json({ 
            valid: false, 
            error: 'O domínio do e-mail não existe ou está inacessível.' 
        });
    }
}
