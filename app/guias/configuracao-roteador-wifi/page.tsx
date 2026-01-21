import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia de Segurança e Performance para Wi-Fi Doméstico";
const description = "Deixe sua internet mais rápida e segura configurando canais, largura de banda, DNS e criptografia WPA3 corretamente.";
const keywords = ["configurar roteador","melhorar wifi","mudar senha wifi","dns mais rapido","segurança rede"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução e Visão Geral",
      content: `
        <p class="mb-4 text-lg text-gray-300 leading-relaxed">Seu roteador é a porta de entrada da sua casa digital. Configurações padrão (de fábrica) são inseguras e lentas. Vamos otimizar isso.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div class="bg-[#171313] p-6 rounded-xl border border-[#31A8FF]/30 hover:border-[#31A8FF]/50 transition-colors">
            <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span class="text-[#31A8FF]">✓</span> Benefícios
            </h3>
            <ul class="text-gray-300 space-y-2">
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Fim de conexões caindo</li><li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Maior alcance de sinal</li><li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Proteção contra vizinhos roubando Wi-Fi</li><li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Ping menor em jogos</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-6 rounded-xl border border-[#FF4B6B]/30 hover:border-[#FF4B6B]/50 transition-colors">
            <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span class="text-[#FF4B6B]">⚠</span> Requisitos
            </h3>
            <ul class="text-gray-300 space-y-2">
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>Acesso ao roteador (IP 192.168.0.1 ou 192.168.1.1)</li><li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>Senha de admin (está na etiqueta embaixo do aparelho)</li>
            </ul>
          </div>
        </div>
      `,
    },
    
    {
      title: "Segurança Fundamental",
      content: `<p class="mb-4 text-gray-300 leading-relaxed">O primeiro passo é trancar a porta.</p>`,
      subsections: [
        
        {
          subtitle: "Alterando a Senha de Admin",
          content: `
            <div class="prose prose-invert max-w-none">
              
              <p class="text-red-400 font-bold mb-2">Jamais deixe a senha como 'admin'!</p>
              <p>Acesse a interface web do roteador. Procure por "System Tools" ou "Administration". Mude a senha de acesso ao PAINEL (não é a senha do Wi-Fi). Isso impede que malwares locais alterem seu DNS.</p>
            </div>
          `
        },
        
        {
          subtitle: "Criptografia WPA2/WPA3",
          content: `
            <div class="prose prose-invert max-w-none">
              
              <p>Na aba Wireless Security:</p>
              <ul class="list-disc list-inside">
                <li>Selecione <strong>WPA2-AES</strong> (Padrão) ou <strong>WPA3</strong> (Se dispositivos suportarem).</li>
                <li>Nunca use WEP ou WPA-TKIP (são quebráveis em minutos).</li>
                <li>Desative o <strong>WPS</strong> (Wi-Fi Protected Setup). É a maior brecha de segurança em roteadores domésticos.</li>
              </ul>
            </div>
          `
        }
      ]
    },
    
    {
      title: "Otimização de Sinal e Velocidade",
      content: `<p class="mb-4 text-gray-300 leading-relaxed">Melhorando a física da conexão.</p>`,
      subsections: [
        
        {
          subtitle: "Escolha de Canal (2.4GHz)",
          content: `
            <div class="prose prose-invert max-w-none">
              
              <p>Instale o app "WiFi Analyzer" no celular. Veja qual canal está menos lotado. Use APENAS canais <strong>1, 6 ou 11</strong>. Usar canais intermediários (como 3 ou 9) causa interferência em você e nos vizinhos.</p>
            </div>
          `
        },
        
        {
          subtitle: "5GHz vs 2.4GHz",
          content: `
            <div class="prose prose-invert max-w-none">
              
              <p><strong>Use 5GHz para:</strong> TV 4K, PC Gamer, Celular perto do roteador. (Alta velocidade, baixo alcance).</p>
              <p><strong>Use 2.4GHz para:</strong> Impressoras, Smart Home, Quarto longe. (Baixa velocidade, atravessa paredes).</p>
            </div>
          `
        }
      ]
    }
    ,
    {
      title: "Solução de Problemas Comuns (Troubleshooting)",
      content: `
        <div class="space-y-6">
          
          <div class="bg-[#1E1E22] p-5 rounded-lg border-l-4 border-[#8B31FF]">
            <h4 class="text-white font-bold text-lg mb-2">Wi-Fi conecta mas 'Sem Internet'</h4>
            <div class="text-gray-300 text-sm pl-4 border-l border-gray-700">
              <p class="mb-2"><strong class="text-[#8B31FF]">Solução:</strong> Problema de DNS ou IP.</p>
              <ul class="list-disc list-inside text-gray-400 mt-2">
                <li>No roteador, em WAN Settings, altere os DNS para: Primário 1.1.1.1 (Cloudflare) e Secundário 8.8.8.8 (Google).</li><li>Reinicie o modem da operadora e o seu roteador.</li>
              </ul>
            </div>
          </div>
          
        </div>
      `
    },
    {
      title: "Conclusão Profissional",
      content: `
        <div class="bg-gradient-to-r from-[#1E1E22] to-[#171313] p-6 rounded-xl border border-gray-800">
          <p class="mb-4 text-gray-300 leading-relaxed">
            Dominar <strong>Guia de Segurança e Performance para Wi-Fi Doméstico</strong> é fundamental para garantir um ambiente digital seguro, rápido e eficiente. 
            Seguindo este guia, você aplicou configurações de nível profissional que otimizam seu fluxo de trabalho e protegem seu hardware.
          </p>
          <p class="text-gray-400 italic border-l-2 border-[#31A8FF] pl-4">
            Lembre-se: A tecnologia evolui rapidamente. Recomendamos revisar estas configurações a cada 6 meses ou sempre que houver grandes atualizações de sistema.
          </p>
        </div>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/manutencao-preventiva",
      title: "Manutenção Preventiva",
      description: "Guia completo de manutenção."
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Otimização Avançada",
      description: "Técnicas de otimização de sistema."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="20 min"
      difficultyLevel="Básico"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}
