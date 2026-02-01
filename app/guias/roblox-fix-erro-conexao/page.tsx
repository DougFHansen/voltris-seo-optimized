import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Roblox: Como Corrigir Erro de Conexão e Lag (2026) - Voltris";
const description = "Erro 279, 277 ou Lag insuportável no Roblox? Guia completo para limpar cache de DNS, resetar sockets e configurar o Firewall para jogar sem cair.";
const keywords = ['roblox erro 279', 'roblox erro 277', 'roblox desconectado', 'roblox lag fix', 'limpar cache roblox'];

export const metadata: Metadata = createGuideMetadata('roblox-fix-erro-conexao', title, description, keywords);

export default function RobloxNetGuide() {
    const contentSections = [
        {
            title: "Solução 1: Limpeza de DNS (FlushDNS)",
            content: `
        <p class="mb-4">Muitos erros de conexão no Roblox são causados por cache de rota antigo.</p>
        <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
            <li>Abra o CMD como Administrador.</li>
            <li>Digite: <code>ipconfig /flushdns</code> e Enter.</li>
            <li>Digite: <code>netsh winsock reset</code> e Enter.</li>
            <li>Reinicie o PC.</li>
        </ol>
      `,
            subsections: []
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 minutos"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
        />
    );
}
