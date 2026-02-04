import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Criptografia de Dados: Como Proteger seus Arquivos em 2026";
const description = "Quer manter seus documentos privados a salvo de olhares curiosos? Aprenda as melhores ferramentas de criptografia para Windows 11 em 2026.";
const keywords = [
  'como criptografar arquivos e pastas windows 11 2026',
  'melhores programas de criptografia gratuita tutorial',
  'veracrypt tutorial passo a passo 2026 guia',
  'criptografar pendrive com senha tutorial completo',
  'proteger documentos sensiveis no pc guia 2026'
];

export const metadata: Metadata = createGuideMetadata('criptografia-dados', title, description, keywords);

export default function EncryptionGuide() {
  const summaryTable = [
    { label: "Nível Básico", value: "Criptografia Diferencial do Windows (EFS)" },
    { label: "Nível Médio", value: "BitLocker (Versões Pro do Windows)" },
    { label: "Nível Avançado", value: "VeraCrypt (Open Source / Máxima Segurança)" },
    { label: "Dificuldade", value: "Médio" }
  ];

  const contentSections = [
    {
      title: "Privacidade na Era Digital de 2026",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, salvar seus arquivos sem proteção é um risco enorme. Se o seu notebook for roubado, quem estiver com ele poderá acessar suas fotos, senhas salvas em navegadores e documentos bancários bastando apenas conectar o seu HD em outro computador. A **criptografia** transforma seus dados em um código ilegível que só pode ser decifrado por quem tiver a senha mestra.
        </p>
      `
    },
    {
      title: "1. VeraCrypt: O sucessor do TrueCrypt",
      content: `
        <p class="mb-4 text-gray-300">A ferramenta preferida de especialistas em 2026:</p>
        <p class="text-sm text-gray-300">
            O <strong>VeraCrypt</strong> é um software de código aberto que permite criar "contêineres" criptografados. Imagine um arquivo que, quando aberto com o VeraCrypt e a senha correta, aparece no Windows como um novo disco (ex: Disco Z:). <br/><br/>
            - <strong>Vantagem:</strong> É imune a acessos até de agências de inteligência se a senha for forte. <br/>
            - <strong>Uso no Pendrive:</strong> Você pode criptografar um pendrive inteiro, garantindo que se ele for perdido, ninguém verá o conteúdo.
        </p>
      `
    },
    {
      title: "2. Criptografia Nativa do Windows (EFS)",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Proteção Rápida de Pastas:</h4>
            <p class="text-sm text-gray-300">
                1. Clique com o botão direito numa pasta e vá em **Propriedades**. <br/>
                2. Clique em **Avançados**. <br/>
                3. Marque a caixa <strong>'Criptografar o conteúdo para proteger os dados'</strong>. <br/><br/>
                Diferente do BitLocker, isso protege apenas os arquivos selecionados. **Cuidado:** Se você formatar o Windows e não tiver feito backup da sua chave de segurança do EFS, você nunca mais conseguirá abrir esses arquivos.
            </p>
        </div>
      `
    },
    {
      title: "3. Boas Práticas de Senhas em 2026",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>O elo mais fraco:</strong> 
            <br/><br/>A criptografia mais forte do mundo não serve de nada se a sua senha for "123456". Em 2026, com o uso de IA para quebrar senhas (brute force), use frases longas no lugar de palavras curtas. <br/><br/>
            Exemplo: <i>"Meu_Gato_Preto_Comeu_2_Peixes_Em_2026"</i> é infinitamente mais difícil de quebrar do que uma senha complexa curta como <i>"G@to2026!"</i>.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/seguranca-senhas-gerenciadores",
      title: "Gerenciar Senhas",
      description: "Armazene suas chaves de criptografia com segurança."
    },
    {
      href: "/guias/bitlocker-desempenho-jogos-ssd",
      title: "Impacto do BitLocker",
      description: "Entenda o custo de performance da criptografia."
    },
    {
      href: "/guias/autenticacao-dois-fatores",
      title: "Proteção 2FA",
      description: "Adicione mais camadas às suas contas."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="20 min"
      difficultyLevel="Médio"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}