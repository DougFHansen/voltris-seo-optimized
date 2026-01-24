'use client';

import PagBankButton from '@/components/PagBankButton';

export default function TestePagamentoPage() {
    // Dados simulados de um produto
    const produtoTeste = [
        {
            id: 'TESTE-001',
            name: 'Plano Otimização Gamer (Teste)',
            price: 1.00, // Valor simbólico de R$ 1,00 para teste
            quantity: 1
        }
    ];

    // Dados simulados de um cliente (Em um caso real, viria do Login)
    const clienteTeste = {
        name: "Comprador de Testes",
        email: "comprador_externo@sandbox.pagseguro.com.br", // E-mail DIFERENTE do vendedor para evitar erro "comprar da própria loja"
        tax_id: "38927560029", // CPF Válido gerado para teste
        phone_area: "11",
        phone_number: "999999999"
    };

    return (
        <div className="min-h-screen bg-[#050510] text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#0A0A0F] border border-white/10 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-2xl font-bold text-center mb-2 text-[#00DDA6]">
                    Área de Teste PagBank
                </h1>
                <p className="text-slate-400 text-center text-sm mb-8">
                    Ambiente Sandbox - Nenhuma cobrança real será feita.
                </p>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                        <div>
                            <p className="font-bold text-white">{produtoTeste[0].name}</p>
                            <p className="text-xs text-slate-500">ID: {produtoTeste[0].id}</p>
                        </div>
                        <p className="font-bold text-[#00DDA6]">
                            R$ {produtoTeste[0].price.toFixed(2).replace('.', ',')}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <PagBankButton
                        items={produtoTeste}
                        customer={clienteTeste}
                        className="w-full"
                    />
                    <p className="text-xs text-center text-slate-600 mt-4">
                        Ao clicar, você será redirecionado para o checkout seguro do PagBank.
                    </p>
                </div>
            </div>
        </div>
    );
}
