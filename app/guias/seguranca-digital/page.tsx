import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia de Segurança Digital em 2026: Fuja de Golpes e Invasões";
const description = "Saiba como se proteger contra phishing, roubo de contas e golpes comuns no WhatsApp e Redes Sociais em 2026. Guia completo de higiene digital.";
const keywords = [
  'segurança digital como se proteger 2026 guia',
  'como evitar phishing e golpes online tutorial 2026',
  'proteger whatsapp contra clonagem guia 2026',
  'higiene digital para iniciantes guia completo 2026',
  'segurança cibernética pessoal o que voce precisa saber 2026'
];

export const metadata: Metadata = createGuideMetadata('seguranca-digital', title, description, keywords);

export default function DigitalSecurityGuide() {
  const summaryTable = [
    { label: "O Elo mais fraco", value: "O Usuário (Engenharia Social)" },
    { label: "Medida Vital", value: "Autenticação em Duas Etapas (2FA)" },
    { label: "Higiene", value: "Senhas únicas para cada serviço" },
    { label: "Dificuldade", value: "Iniciante" }
  ];

  const contentSections = [
    {
      title: "O cenário das ameaças em 2026",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, os ataques cibernéticos se tornaram muito mais inteligentes. Com o uso de **Deepfakes** e IAs que clonam vozes, um golpe pode vir através de uma ligação que parece ser do seu gerente de banco ou de um familiar. A segurança digital hoje vai além de um simples antivírus; ela exige um estado de alerta constante e processos de verificação que impeçam o erro humano.
        </p>
      `
    },
    {
      title: "1. O Golpe do Phishing e as IAs",
      content: `
        <p class="mb-4 text-gray-300">Antigamente, e-mails de phishing tinham erros de português óbvios. Em 2026:</p>
        <p class="text-sm text-gray-300">
            Os criminosos usam IAs para escrever mensagens perfeitas, simulando comunicados oficiais de bancos ou da Receita Federal. <br/><br/>
            <strong>A Regra de Ouro:</strong> Nunca clique em links de SMS ou E-mail que pedem 'atualização imediata de dados' ou 'bloqueio de conta'. Se tiver dúvida, abra o aplicativo oficial do banco ou acesse o site digitando o endereço diretamente no navegador.
        </p>
      `
    },
    {
      title: "2. Blindando o WhatsApp e Redes Sociais",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Pare a Clonagem:</h4>
            <p class="text-sm text-gray-300">
                1. No WhatsApp, vá em Configurações > Conta > <strong>Confirmação em duas etapas</strong>. Crie um PIN. <br/>
                2. Nunca entregue códigos que chegarem por SMS sob nenhum pretexto. <br/>
                3. Oculte sua foto de perfil para quem não está nos seus contatos; isso impede que golpistas usem sua imagem para criar um perfil falso e pedir dinheiro para seus parentes.
            </p>
        </div>
      `
    },
    {
      title: "3. Redes Wi-Fi Públicas",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>O Perigo do Wi-Fi Grátis:</strong> 
            <br/><br/>Ao usar o Wi-Fi de aeroportos ou cafeterias, lembre-se que qualquer pessoa na mesma rede pode (tecnicamente) monitorar o tráfego não criptografado. Evite acessar contas bancárias nesses locais. Se precisar trabalhar em redes públicas, o uso de uma **VPN** é obrigatório para criar um túnel seguro de dados entre o seu computador e a internet.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/seguranca-senhas-gerenciadores",
      title: "Gerenciar Senhas",
      description: "A base da proteção de contas em 2026."
    },
    {
      href: "/guias/autenticacao-dois-fatores",
      title: "Guia de 2FA",
      description: "Aprenda a usar autenticadores de app."
    },
    {
      href: "/guias/identificacao-phishing",
      title: "Detalhes de Phishing",
      description: "Como analisar a URL de um site suspeito."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="20 min"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}
