import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { cep } = await req.json();
        
        if (!cep || cep.length < 8) {
            return NextResponse.json({ valid: false, error: 'CEP inválido.' });
        }

        const cleanCep = cep.replace(/\D/g, '');
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
            next: { revalidate: 3600 } // Cache opcional
        });

        if (!response.ok) {
            return NextResponse.json({ valid: false, error: 'Serviço de CEP indisponível no momento.' });
        }

        const data = await response.json();

        if (data.erro) {
            return NextResponse.json({ valid: false, error: 'CEP inexistente na base dos Correios.' });
        }

        return NextResponse.json({ 
            valid: true, 
            data: {
                street: data.logradouro,
                neighborhood: data.bairro,
                city: data.localidade,
                state: data.uf
            } 
        });

    } catch (error) {
        console.error('[CEP VALIDATION ERROR]', error);
        return NextResponse.json({ valid: false, error: 'Erro ao validar CEP internamente.' });
    }
}
