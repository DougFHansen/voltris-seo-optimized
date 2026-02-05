import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'wifi-desconectando-sozinho-windows',
  title: "Wi-Fi Desconectando Sozinho no Windows 11: Como resolver (2026)",
  description: "Seu Wi-Fi cai o tempo todo ou desconecta ao jogar? Aprenda como configurar o adaptador de rede para estabilidade máxima no Windows 11 em 2026.",
  category: 'software',
  difficulty: 'Intermediário',
  time: '15 min'
};

const title = "Wi-Fi Desconectando Sozinho no Windows 11: Como resolver (2026)";
const description = "Seu Wi-Fi cai o tempo todo ou desconecta ao jogar? Aprenda como configurar o adaptador de rede para estabilidade máxima no Windows 11 em 2026.";
const keywords = [
    'wifi desconectando sozinho windows 11 como resolver 2026',
    'rede wifi caindo toda hora notebook tutorial guia',
    'desativar modo economia energia wifi windows 11 tutorial',
    'estabilizar wifi para jogos online guia 2026',
    'resetar driver wifi windows 11 tutorial passo a passo'
];

export const metadata: Metadata = createGuideMetadata('wifi-desconectando-sozinho-windows', title, description, keywords);

export default function WiFiFixGuide() {
    const summaryTable = [
        { label: "Causa Principal", value: "Gerenciamento de Energia do Adaptador" },
        { label: "Solução Rápida", value: "Resetar Pilha TCP/IP no CMD" },
        { label: "Check de Hardware", value: "Verificar antenas do Notebook" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "O mistério da queda de sinal",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Não há nada mais frustrante do que estar em uma partida importante ou em uma reunião e o Wi-Fi desconectar sem motivo aparente. Em 2026, com o Wi-Fi 6E e o Wi-Fi 7 se tornando populares, o Windows 11 tenta economizar bateria desligando o sinal quando ele acha que você não está usando ativamente. Além disso, conflitos de canais entre os vizinhos podem derrubar sua conexão no Windows 11 constantemente.
        </p>
      `
        },
        {
            title: "1. Desativando a Economia de Energia do Adaptador",
            content: `
        <p class="mb-4 text-gray-300">Este é o ajuste nº 1 para estabilidade:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Aperte Win+X e vá em <strong>Gerenciador de Dispositivos</strong>.</li>
            <li>Expanda 'Adaptadores de rede' e clique duas vezes na sua placa Wi-Fi (ex: Intel Wi-Fi 6E).</li>
            <li>Vá na aba <strong>Gerenciamento de Energia</strong>.</li>
            <li>Desmarque a caixa <strong>'O computador pode desligar o dispositivo para economizar energia'</strong>.</li>
            <li>Se a aba não aparecer, você precisará mudar o plano de energia do Windows para 'Alto Desempenho'.</li>
        </ol>
      `
        },
        {
            title: "2. Resetando a Pilha de Rede (TCP/IP)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Comandos de Recuperação:</h4>
            <p class="text-sm text-gray-300">
                Se o Wi-Fi desconecta e trava o ícone de rede, use estes comandos no CMD (Admin) para limpar erros de 2026: <br/><br/>
                - <code>netsh winsock reset</code> <br/>
                - <code>netsh int ip reset</code> <br/>
                - <code>ipconfig /flushdns</code> <br/>
                Esses comandos forçam o Windows a esquecer configurações de rede corrompidas e buscar um novo endereço IP limpo do roteador.
            </p>
        </div>
      `
        },
        {
            title: "3. Interferência e Canais de 5GHz/6GHz",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Dica de 2026:</strong> Se você mora em apartamento, o sinal 2.4GHz está saturado. 
            <br/><br/>Tente forçar seu PC a usar apenas a frequência de <strong>5GHz ou 6GHz</strong>. No Gerenciador de Dispositivos, nas propriedades avançadas da sua placa Wi-Fi, procure por 'Preferred Band' e selecione 'Prefer 5GHz'. Isso evita que o Windows fique alternando entre as bandas, o que é a causa de 50% das quedas repentinas durante o uso.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/problemas-conexao-wifi-causa-solucao",
            title: "Guia Geral Wi-Fi",
            description: "Dicas para sinal fraco e alcance."
        },
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "Reduzir Ping",
            description: "Melhore a resposta da sua rede sem fio."
        },
        {
            href: "/guias/troubleshooting-internet",
            title: "Diagnóstico de Rede",
            description: "O que fazer se nada funcionar."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
