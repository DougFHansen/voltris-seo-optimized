import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Bloquear o Acesso de um Programa à Internet (Firewall) - Voltris";
const description = "Seu jogo craqueado fica tentando conectar e para de funcionar? Ou quer economizar dados? Aprenda a bloquear qualquer .exe no Firewall do Windows.";
const keywords = ['bloquear firewall windows', 'impedir programa conectar internet', 'bloquear exe firewall', 'firewall windows defender regra', 'bloquear atualizacao automatica'];

export const metadata: Metadata = createGuideMetadata('bloquear-internet-firewall-windows', title, description, keywords);

export default function FirewallGuide() {
    const contentSections = [
        {
            title: "Passo a Passo Rápido",
            content: `
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
            <li>Pesquise por <strong>Windows Defender Firewall com Segurança Avançada</strong>.</li>
            <li>Clique em <strong>Regras de Saída</strong> (no menu esquerdo).</li>
            <li>No menu direito, clique em <strong>Nova Regra</strong>.</li>
            <li>Selecione "Programa" > Avançar.</li>
            <li>Procure o arquivo .exe que quer bloquear.</li>
            <li>Marque <strong>Bloquear a conexão</strong>.</li>
            <li>Dê um nome (ex: Bloqueio Jogo X) e Concluir.</li>
            <li>Pronto, esse programa nunca mais acessa a rede.</li>
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
            estimatedTime="5 minutos"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
        />
    );
}
