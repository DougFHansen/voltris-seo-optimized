import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'guia-montagem-pc',
  title: "Guia Definitivo de Montagem de PC (2026): Do Zero ao Windows",
  description: "O tutorial mais completo da internet. Aprenda a instalar CPU, aplicar pasta térmica, conectar o painel frontal e fazer o Cable Management profissional.",
  category: 'hardware',
  difficulty: 'Avançado',
  time: '2 horas'
};

const title = "Guia Definitivo de Montagem de PC (2026): Do Zero ao Windows";
const description = "O tutorial mais completo da internet. Aprenda a instalar CPU, aplicar pasta térmica, conectar o painel frontal e fazer o Cable Management profissional.";

const keywords = [
  "como montar pc gamer passo a passo 2026",
  "instalar processador intel vs amd am5",
  "como conectar painel frontal f_panel",
  "onde conectar fans na placa mae sys_fan",
  "primeiro boot pc novo o que fazer",
  "cable management dicas profissional"
];

export const metadata: Metadata = createGuideMetadata('guia-montagem-pc', title, description, keywords);

export default function AssembleGuide() {
  const summaryTable = [
    { label: "Ferramenta #1", value: "Chave Philips #2 (Longa e Magnética)" },
    { label: "Item Crítico", value: "Pendrive com Windows (Crie ANTES)" },
    { label: "Erro Comum", value: "Esquecer o Espelho (IO Shield)" },
    { label: "Risco", value: "Pinos Tortos no Socket (Cuidado Extremo)" },
    { label: "RAM", value: "Slots 2 e 4 (Dual Channel)" },
    { label: "Pasta Térmica", value: "Grão de Ervilha (no centro)" }
  ];

  const contentSections = [
    {
      title: "Fase 0: A Bancada de Testes (Opcional mas Recomendado)",
      content: `
        <p class="mb-4 text-gray-300">
            Antes de colocar tudo dentro do gabinete apertado, monte a placa-mãe em cima da caixa dela (papelão não conduz energia). Instale CPU, RAM e Cooler. Ligue a fonte e faça um curto nos pinos 'Power SW' com a chave de fenda para ligar.
            <br/><br/>
            <strong>Por que fazer isso?</strong> Se uma peça veio com defeito, é muito mais fácil trocar agora do que depois de ter parafusado tudo e organizado os cabos.
        </p>
      `
    },
    {
      title: "Fase 1: Preparando a Placa-Mãe",
      content: `
        <div class="space-y-6">
            <div class="bg-[#1E1E22] p-5 rounded-lg border-l-4 border-yellow-500">
              <h4 class="text-white font-bold mb-2">1. Instalação da CPU (O Coração)</h4>
              <p class="text-gray-400 text-sm mb-2">
                <strong>Intel (LGA 1700/1851):</strong> Levante a alavanca. Alinhe os chanfros (cortes) laterais da CPU com os pinos do socket. Solte suavemente. Baixe a alavanca (vai parecer que vai quebrar, é normal fazer força).
                <br/><br/>
                <strong>AMD (AM5):</strong> Igual à Intel. Alinhe o triângulo dourado.
                <br/><br/>
                <span class="text-red-500 font-bold">PERIGO:</span> Jamais toque nos pinos do socket da placa-mãe. Se entortar um, game over.
              </p>
            </div>

            <div class="bg-[#1E1E22] p-5 rounded-lg border-l-4 border-green-500">
              <h4 class="text-white font-bold mb-2">2. Memória RAM (Dual Channel)</h4>
              <p class="text-gray-400 text-sm">
                Sua placa provavelmente tem 4 slots. Você deve usar o <strong>SEGUNDO</strong> e o <strong>QUARTO</strong> slot (contando a partir do processador) para ativar o Dual Channel.
                <br/>Se usar slot 1 e 2, você perde 50% de performance.
                <br/>Empurre até ouvir um *CLACK* satisfatório.
              </p>
            </div>

            <div class="bg-[#1E1E22] p-5 rounded-lg border-l-4 border-blue-500">
              <h4 class="text-white font-bold mb-2">3. SSD M.2 (Armazenamento)</h4>
              <p class="text-gray-400 text-sm">
                Remova o dissipador (heatsink) da placa-mãe. Remova o plástico azul do thermal pad. Insira o SSD em 45 graus. Parafuse com o parafuso minúsculo (cuidado para não cair dentro da fonte). Recoloque o dissipador.
              </p>
            </div>
          </div>
      `
    },
    {
      title: "Fase 2: O Gabinete e a Fonte",
      content: `
        <div class="space-y-4">
            <p class="text-gray-300">
                <strong>1. IO Shield (Espelho):</strong> Se sua placa-mãe não tem espelho pré-instalado, coloque-o AGORA no buraco retangular traseiro do gabinete. Tem que fazer 'click' nas 4 pontas. Se esquecer, terá que desmontar tudo.
            </p>
            <p class="text-gray-300">
                <strong>2. Standoffs (Espaçadores):</strong> São os elevadores dourados/pretos onde a placa-mãe senta. Verifique se eles estão na posição correta para o tamanho da sua placa (ATX, Micro-ATX).
                <br/><span class="text-red-400 font-bold">AVISO:</span> Se tiver um standoff sobrando embaixo da placa-mãe encostando no circuito, vai dar curto-circuito.
            </p>
            <p class="text-gray-300">
                <strong>3. Fonte (PSU):</strong> Instale a fonte. Se o gabinete tem filtro de poeira embaixo, o ventilador da fonte deve ficar virado para BAIXO (para pegar ar frio de fora).
            </p>
        </div>
      `
    }
  ];

  const advancedContentSections = [
    {
      title: "Fase 3: O Pesadelo dos Cabos (Conexões)",
      content: `
        <ul class="space-y-4 text-gray-300">
            <li class="bg-gray-900 p-4 rounded border border-gray-700">
                <strong class="text-[#31A8FF] block mb-1">EPS 8-pin (CPU)</strong>
                Geralmente no canto superior esquerdo. Conecte ANTES de parafusar a placa-mãe se o gabinete for pequeno (sua mão não vai caber depois). Às vezes divide em 4+4.
            </li>
            <li class="bg-gray-900 p-4 rounded border border-gray-700">
                <strong class="text-[#31A8FF] block mb-1">24-pin (Placa-mãe)</strong>
                O cabo mais grosso, na direita. Requer força bruta para entrar totalmente.
            </li>
            <li class="bg-gray-900 p-4 rounded border border-gray-700">
                <strong class="text-[#31A8FF] block mb-1">PCIe 6+2 (Placa de Vídeo)</strong>
                Não confunda com o da CPU! O da GPU se divide em 6+2. O da CPU se divide em 4+4.
            </li>
            <li class="bg-gray-900 p-4 rounded border-l-4 border-red-500">
                <strong class="text-red-400 block mb-1">Painel Frontal (F_PANEL)</strong>
                Esses pinos minúsculos ligam o botão Power do gabinete.
                <br/>Consulte o manual, mas o padrão JFP1 é:
                <br/>- Topo Esquerda: Power LED +
                <br/>- Topo Direita: Power SW (Botão Ligar)
                <br/>- Baixo Esquerda: HDD LED
                <br/>- Baixo Direita: Reset SW
                <br/><span class="text-xs italic">Dica: A escrita no conector geralmente deve ficar virada para fora (para baixo na fileira de baixo, para cima na fileira de cima).</span>
            </li>
        </ul>
      `
    },
    {
      title: "Fase 4: Finalização e Boot",
      content: `
          <div class="space-y-4">
            <p class="text-gray-300">
                1. Instale a Placa de Vídeo no primeiro slot PCIe (o reforçado com metal). Parafuse no gabinete.
                <br/>2. Conecte o monitor na <strong>PLACA DE VÍDEO</strong>, não na placa-mãe (erro clássico).
                <br/>3. Ligue a chave da fonte (atrás).
                <br/>4. Aperte o botão Power.
            </p>
            <div class="bg-emerald-900/20 p-4 rounded border border-emerald-500/30">
                <h4 class="text-emerald-400 font-bold mb-2">Deu vídeo? Sucesso!</h4>
                <p class="text-gray-300 text-sm">
                    Agora entre na BIOS (fique apertando DEL):
                    <br/>1. Ative o <strong>XMP / DOCP / EXPO</strong> para sua memória rodar na velocidade certa (ex: 6000MHz). Sem isso ela roda lenta (4800MHz).
                    <br/>2. Ative o <strong>Re-Size BAR</strong>.
                    <br/>3. Configure a ordem de Boot para o seu Pendrive com Windows.
                </p>
            </div>
          </div>
        `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/criar-pendrive-bootavel",
      title: "Instalar Windows",
      description: "Como criar o pendrive para formatar o PC."
    },
    {
      href: "/guias/cable-management-organizacao-cabos-pc",
      title: "Organização de Cabos",
      description: "Deixe seu PC bonito e melhore o fluxo de ar."
    },
    {
      href: "/guias/como-escolher-fonte-pc-gamer",
      title: "Fonte de Alimentação",
      description: "Garanta que conectou os cabos modulares certos."
    }
  ];

  const faqItems = [
    {
      question: "PC liga, ventoinhas giram, mas sem imagem.",
      answer: "O clássico 'No Post'. 1. Espere (DDR5 demora até 3 minutos no primeiro boot para 'treinar' a memória). 2. Verifique se o cabo HDMI está na GPU. 3. Tire e coloque as memórias RAM. 4. Verifique os cabos de energia."
    },
    {
      question: "Preciso de luva antiestática?",
      answer: "Não. Apenas não monte o PC em cima de um tapete felpudo e toque numa parte metálica do gabinete de vez em quando para descarregar."
    },
    {
      question: "Quanta pasta térmica colocar?",
      answer: "Uma gota do tamanho de uma ervilha no centro do processador é suficiente. A pressão do cooler vai espalhar sozinha. Não use cartão para espalhar (cria bolhas de ar)."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="2 horas"
      difficultyLevel="Avançado"
      contentSections={contentSections}
      advancedContentSections={advancedContentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
      faqItems={faqItems}
    />
  );
}
