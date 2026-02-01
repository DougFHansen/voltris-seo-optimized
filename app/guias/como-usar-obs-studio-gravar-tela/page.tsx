import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "OBS Studio: Como Gravar Tela sem Perder FPS (Tutorial CQP e NVENC)";
const description = "Quer gravar seus jogos sem travar o PC? Esqueça o 'Bitrate'. Aprenda a usar o modo CQP (Qualidade Constante) do OBS e o encoder da placa de vídeo.";
const keywords = ['obs studio gravar tela leve', 'configurar obs pc fraco', 'cqp vs cbr obs', 'nvenc vs x264', 'gravar gameplay sem lag', 'tela preta obs fix'];

export const metadata: Metadata = createGuideMetadata('como-usar-obs-studio-gravar-tela', title, description, keywords);

export default function OBSGuide() {
    const summaryTable = [
        { label: "Modo", value: "CQP (Indistinguível)" },
        { label: "Encoder", value: "NVENC / AMF" },
        { label: "Formato", value: "MKV (Seguro)" },
        { label: "Admin", value: "Obrigatório" }
    ];

    const contentSections = [
        {
            title: "O Erro Comum: Usar CBR para Gravar",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          A maioria dos tutoriais ensina a configurar "Bitrate" (CBR) em 10.000 ou 50.000. Isso é errado para gravação. CBR (Constant Bitrate) é para <strong>Live Stream</strong>, onde a internet oscila.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Para gravar no HD, usamos <strong>CQP (Constant Quantization Parameter)</strong>. O OBS decide sozinho quanto bitrate usar dependendo da complexidade da cena. Se você olhar para o céu (simples), ele usa pouco. Se você entrar numa explosão, ele usa muito. O resultado é qualidade perfeita com arquivo menor.
        </p>
      `,
            subsections: []
        },
        {
            title: "Passo a Passo: Configuração Perfeita",
            content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Abra o OBS Studio como <strong>Administrador</strong> (Isso dá prioridade máxima à GPU, evitando que a gravação trave).</li>
            <li>Vá em Configurações > Saída.</li>
            <li>Mude o "Modo de Saída" para <strong>Avançado</strong>.</li>
            <li>Vá na aba <strong>Gravação</strong>.</li>
            <li><strong>Encoder de Vídeo:</strong>
                <ul class="list-disc list-inside ml-6 text-sm text-green-400">
                    <li>Se tem NVIDIA: <strong>NVIDIA NVENC H.264 (new)</strong>.</li>
                    <li>Se tem AMD: <strong>AMD HW H.264 (AVC)</strong>.</li>
                    <li>Nunca use x264 (Processador) a menos que não tenha placa de vídeo.</li>
                </ul>
            </li>
            <li><strong>Controle de Taxa de Bits:</strong> Selecione <strong>CQP</strong>.</li>
            <li><strong>Nível de CQ:</strong>
                <ul class="list-disc list-inside ml-6 text-sm text-yellow-400">
                    <li>15 a 20: Qualidade Perfeita (Arquivos gigantes).</li>
                    <li>20 a 25: Qualidade Alta (Recomendado).</li>
                    <li>30: Qualidade Média (PC Fraco).</li>
                </ul>
            </li>
            <li><strong>Predefinição (Preset):</strong> P5: Slow ou P4: Medium.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Por que gravar em MKV e não MP4?",
            content: `
        <div class="bg-red-900/20 p-6 rounded-xl border border-red-500">
            <h4 class="text-white font-bold mb-2">O perigo do MP4</h4>
            <p class="text-gray-300 text-sm">
                Se o OBS travar, a luz acabar ou o PC desligar durante uma gravação em MP4, <strong>o arquivo inteiro se perde para sempre</strong>. O MP4 precisa ser "fechado" corretamente.
                <br/><br/>
                O formato <strong>MKV</strong> não tem esse problema. Se o PC explodir, o vídeo fica salvo até o segundo da explosão.
            </p>
        </div>
        <p class="text-gray-300 mt-4">
            "Ah, mas o Premiere/Sony Vegas não aceita MKV".
            <br/>Simples: No OBS, vá em <strong>Arquivo > Converter Gravações (Remux)</strong>. Ele transforma o MKV em MP4 em segundos, sem perder qualidade.
        </p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
