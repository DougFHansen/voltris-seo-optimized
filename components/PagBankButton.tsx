'use client';

import { useState } from 'react';
import { FiLock, FiCreditCard } from 'react-icons/fi';

interface PagBankButtonProps {
    items: Array<{ id: string; name: string; price: number; quantity?: number }>;
    customer: {
        name: string;
        email: string;
        tax_id: string; // CPF
        phone_area: string;
        phone_number: string;
    };
    className?: string;
}

export default function PagBankButton({ items, customer, className }: PagBankButtonProps) {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/pagamento/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items,
                    customer
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || 'Erro ao iniciar pagamento');
            }

            if (data.checkout_url) {
                // Redireciona para o ambiente seguro do PagSeguro
                window.location.href = data.checkout_url;
            } else {
                alert('URL de pagamento não gerada.');
            }

        } catch (error: any) {
            console.error('Erro:', error);
            alert(`Erro: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className={`flex items-center justify-center gap-2 px-6 py-4 bg-[#00DDA6] hover:bg-[#00c492] text-[#0A0A0F] font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(0,221,166,0.2)] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
            ) : (
                <>
                    <FiLock className="w-5 h-5" />
                    <span className="tracking-wide">Pagar com PagSeguro</span>
                    <FiCreditCard className="ml-1 w-5 h-5 opacity-75" />
                </>
            )}
        </button>
    );
}
