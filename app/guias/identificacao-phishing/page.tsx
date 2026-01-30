import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Identificar e Se Proteger de Phishing e Golpes Online";
const description = "Aprenda a detectar emails falsos, sites fraudulentos e mensagens enganosas. Proteja seus dados bancários e senhas contra engenharia social.";
const keywords = ["phishing","golpe internet","email falso","segurança bancária","verificar link"];

export const metadata: Metadata = createGuideMetadata('identificacao-phishing', title, description, keywords);

export default function GuidePage() {
  const contentSections = [

    {
      title: "Anatomia de um Golpe de Phishing",
      content: `
        <p class="mb-4 text-gray-300">Phishing é a tentativa de criminosos de se passarem por instituições confiáveis (Bancos, Receita Federal, Correios) para roubar seus dados.</p>
          <div class="bg-[#1E1E22] p-6 rounded-xl border border-red-500/40 my-4">
            <h3 class="text-red-400 font-bold text-lg mb-4">Sinais de Alerta Vermelho 🚩</h3>
            <ul class="space-y-3 text-gray-300">
              <li class="flex items-start gap-3">
                <span class="text-red-500 font-bold">1.</span>
                <div>
                  <strong>Senso de Urgência:</strong> "Sua conta será bloqueada em 24h", "Boleto vencendo hoje", "Acesso suspeito detectado".
                  <p class="text-sm text-gray-500 mt-1">Eles querem que você aja sem pensar.</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-red-500 font-bold">2.</span>
                <div>
                  <strong>Remetente Estranho:</strong> O nome diz "Suporte Banco", mas o email é <code>suporte@gmail.com</code> ou <code>comunicado@banco-seguranca-web.com</code> (domínios falsos).
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-red-500 font-bold">3.</span>
                <div>
                  <strong>Links Mascarados:</strong> O texto diz "Clique aqui para acessar o site do banco", mas ao passar o mouse, o link real é <code>bit.ly/xyz</code> ou um site estranho.
                </div>
              </li>
            </ul>
          </div>
      `,
      subsections: []
    },

    {
      title: "Técnicas de Verificação",
      content: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-[#171313] p-4 rounded-lg">
              <h4 class="text-blue-400 font-bold mb-2">Teste do Mouseover</h4>
              <p class="text-gray-400 text-sm">Nunca clique direto. Passe o cursor do mouse sobre o link ou botão e olhe no canto inferior esquerdo do navegador. Onde ele realmente leva?</p>
            </div>
            <div class="bg-[#171313] p-4 rounded-lg">
              <h4 class="text-blue-400 font-bold mb-2">HTTPS não é garantia</h4>
              <p class="text-gray-400 text-sm">Cadeado verde significa que a conexão é criptografada, não que o site é legítimo. Hoje, sites de phishing também usam HTTPS. Confie no domínio (ex: itau.com.br), não apenas no cadeado.</p>
            </div>
          </div>
      `,
      subsections: []
    },

    {
      title: "O que fazer se você clicou?",
      content: `
        <div class="bg-gray-800 p-4 rounded-lg border-l-4 border-yellow-500">
            <ol class="list-decimal list-inside space-y-2 text-gray-300">
              <li><strong>Desconecte-se da internet</strong> imediatamente se baixou algum arquivo.</li>
              <li><strong>Altere suas senhas</strong> de outro dispositivo (celular via 4G, por exemplo).</li>
              <li>Avise seu banco se inseriu dados financeiros.</li>
              <li>Execute um escaneamento completo de antivírus/malware.</li>
            </ol>
          </div>
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
      href: "/guias/seguranca-digital",
      title: "Segurança Digital",
      description: "Proteja seus dados."
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
      estimatedTime="15-20 min"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}
