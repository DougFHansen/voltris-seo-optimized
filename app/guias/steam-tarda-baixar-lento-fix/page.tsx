import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Download Lento na Steam? Como Acelerar ao Máximo sua Conexão (2026)";
const description = "Sua internet é de 500 Mega mas a Steam baixa a 2MB/s? O problema pode ser a 'Região de Download' ou o cache corrompido. Veja como resolver.";
const keywords = ['steam download lento', 'aumentar velocidade download steam', 'limpar cache steam', 'mudar regiao download steam', 'steam limitando banda', 'steam download cai para 0'];

export const metadata: Metadata = createGuideMetadata('steam-tarda-baixar-lento-fix', title, description, keywords);

export default function SteamLagGuide() {
    const summaryTable = [
        { label: "Problema", value: "Servidor Lotado" },
        { label: "Solução 1", value: "Mudar Região" },
        { label: "Solução 2", value: "Limpar Cache" },
        { label: "Dica", value: "Tirar Limite" }
    ];

    const contentSections = [
        {
            title: "Por que a Steam limita meu download?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          A Steam não baixa arquivos "simples". Ela baixa pedaços comprimidos e criptografados que seu processador precisa descompactar em tempo real. Se o seu download para e o uso de disco sobe, é o seu processador sofrendo, não a internet.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
           Mas se o disco está tranquilo e a velocidade está baixa, o servidor da sua cidade pode estar congestionado.
        </p>
      `,
            subsections: []
        },
        {
            title: "Truque 1: Mudar a Região de Download",
            content: `
        <p class="mb-4 text-gray-300">
            Se você mora em São Paulo e todo mundo em SP está baixando o GTA VI ao mesmo tempo, o servidor "Brazil - Sao Paulo" fica lento. Mude para um servidor menos usado.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 mb-6">
            <li>Abra a Steam > Configurações (Settings).</li>
            <li>Vá na aba <strong>Downloads</strong>.</li>
            <li>Em "Região de Download", mude para:
                <br/>- <strong>Brazil - Brasilia</strong> (Geralmente vazio).
                <br/>- <strong>Argentina</strong> ou <strong>US - Miami</strong> (Às vezes roteiam melhor).
            </li>
            <li>Reinicie a Steam e teste.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Truque 2: Limpar Cache de Download",
            content: `
        <p class="mb-4 text-gray-300">
            Às vezes um arquivo parcial trava a fila inteira.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li>Ainda na aba <strong>Downloads</strong>.</li>
            <li>Clique no botão <strong>"Limpar Cache de Download" (Clear Download Cache)</strong>.</li>
            <li>A Steam vai reiniciar e pedir seu login de novo. Isso costuma destravar downloads que ficam caindo para 0 bytes/s.</li>
        </ul>
      `
        },
        {
            title: "Truque 3: Desativar 'Limitar banda em stream'",
            content: `
        <p class="text-gray-300">
            Verifique se a caixa "Limitar banda de download enquanto transmite" está desmarcada. Às vezes o Windows acha que você está transmitindo algo e capa a velocidade.
        </p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="5 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
