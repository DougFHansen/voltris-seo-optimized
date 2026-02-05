import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'seguranca-wifi-avancada',
  title: "Segurança Wi-Fi: Como Proteger sua Rede Doméstica de Invasores",
  description: "Seu Wi-Fi está seguro? Aprenda a configurar WPA3, desativar WPS, esconder o SSID e criar uma rede de convidados para isolar dispositivos IoT.",
  category: 'rede-seguranca',
  difficulty: 'Intermediário',
  time: '10-15 min'
};

const title = "Segurança Wi-Fi: Como Proteger sua Rede Doméstica de Invasores";
const description = "Seu Wi-Fi está seguro? Aprenda a configurar WPA3, desativar WPS, esconder o SSID e criar uma rede de convidados para isolar dispositivos IoT.";
const keywords = ["segurança wifi","wpa2 vs wpa3","configurar roteador seguro","desativar wps","rede convidados"];

export const metadata: Metadata = createGuideMetadata('seguranca-wifi-avancada', title, description, keywords);

export default function GuidePage() {
  const contentSections = [

    {
      title: "Configurações Críticas no Roteador",
      content: `
        <p class="mb-4 text-gray-300">Acesse seu roteador (geralmente 192.168.0.1 ou 192.168.1.1) e verifique:</p>
          <div class="space-y-4">
            <div class="border-l-4 border-red-500 pl-4">
              <h4 class="text-white font-bold">Desative o WPS (Wi-Fi Protected Setup)</h4>
              <p class="text-gray-400 text-sm">O WPS é uma falha de segurança enorme. Permite que invasores descubram sua senha em minutos via força bruta no PIN.</p>
            </div>
            <div class="border-l-4 border-green-500 pl-4">
              <h4 class="text-white font-bold">Use WPA3 ou WPA2-AES</h4>
              <p class="text-gray-400 text-sm">Nunca use WEP ou WPA-TKIP (são obsoletos e inseguros). Se seu roteador suporta WPA3, ative-o.</p>
            </div>
          </div>
      `,
      subsections: []
    },

    {
      title: "Rede de Convidados e IoT",
      content: `
        <p class="mb-4 text-gray-300">Dispositivos inteligentes (lâmpadas, alexa, geladeiras) têm segurança fraca. Se um hacker invadir sua lâmpada, ele pode acessar seu PC?</p>
          <p class="text-gray-300">Sim, se estiverem na mesma rede. <strong>A Solução:</strong></p>
          <ul class="list-disc list-inside text-gray-400">
            <li>Crie uma <strong>Rede de Convidados (Guest Network)</strong> no roteador.</li>
            <li>Conecte todas as visitas e dispositivos IoT nessa rede.</li>
            <li>A maioria dos roteadores isola a rede de convidados da rede principal ("AP Isolation").</li>
          </ul>
      `,
      subsections: []
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/otimizacao-performance",
      title: "Otimização de Performance",
      description: "Dicas para deixar seu PC mais rápido."
    },
    {
      href: "/guias/rede-domestica",
      title: "Redes Domésticas",
      description: "Melhore sua conexão WiFi."
    },
    {
      href: "/guias/manutencao-preventiva",
      title: "Manutenção Preventiva",
      description: "Cuidados essenciais com o hardware."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="10-15 min"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}
