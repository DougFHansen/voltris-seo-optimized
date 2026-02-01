import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "FormatFactory vs HandBrake: Qual o Melhor Conversor de Vídeo Grátis? (2026)";
const description = "Precisa diminuir o tamanho de um vídeo? Veja por que o HandBrake é superior tecnicamente ao FormatFactory e como usar o codec H.265 para economizar 50% de espaço.";
const keywords = ['formatfactory vs handbrake', 'diminuir tamanho video sem perder qualidade', 'converter mkv para mp4', 'handbrake h265 nvenc', 'formatfactory virus', 'melhor conversor video pc'];

export const metadata: Metadata = createGuideMetadata('formatfactory-vs-handbrake-converter-video', title, description, keywords);

export default function ConverterGuide() {
    const summaryTable = [
        { label: "Qualidade", value: "HandBrake" },
        { label: "Facilidade", value: "FormatFactory" },
        { label: "Segurança", value: "HandBrake" },
        { label: "Formatos", value: "FormatFactory" }
    ];

    const contentSections = [
        {
            title: "O Ponto Crítico da Segurança",
            content: `
        <div class="bg-red-900/20 p-6 rounded-xl border border-red-500 mb-6">
            <h4 class="text-white font-bold mb-2">Cuidado com o FormatFactory</h4>
            <p class="text-gray-300 text-sm">
                O FormatFactory já foi o rei das Lan Houses. Porém, nos últimos anos, o instalador dele vem lotado de "Bundleware" (aqueles programas chatos que instalam barra de pesquisa, antivírus fake e mudam sua página inicial). Se você for instalar, precisa clicar em "Declinar" umas 5 vezes.
            </p>
        </div>
        <div class="bg-green-900/20 p-6 rounded-xl border border-green-500 mb-6">
            <h4 class="text-white font-bold mb-2">HandBrake (Open Source)</h4>
            <p class="text-gray-300 text-sm">
                O HandBrake é código aberto, livre e usado por profissionais. Ele não tem vírus, não tem propaganda e usa as bibliotecas FFmpeg mais modernas. É a escolha segura e ética.
            </p>
        </div>
      `,
            subsections: []
        },
        {
            title: "Como diminuir vídeo em 80% (Tutorial HandBrake)",
            content: `
        <p class="text-gray-300 mb-4">
            Se você gravou uma gameplay de 50GB e quer mandar pro YouTube/WhatsApp.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Abra o HandBrake e arraste o vídeo.</li>
            <li>Na aba <strong>Video</strong>, escolha o "Video Encoder".
                <br/>- Se quiser rapidez: <strong>H.264 (NVENC)</strong> our <strong>AMD VCE</strong>.
                <br/>- Se quiser compactação máxima: <strong>H.265 (x265)</strong> (Demora mais, mas o arquivo fica minúsculo).
            </li>
            <li>No slider "Quality" (RF):
                <br/>- Padrão é 22.
                <br/>- Aumente para <strong>28 a 30</strong>. (Quanto maior o número, menor a qualidade e menor o arquivo). 28 é ótimo para WhatsApp.
            </li>
            <li>Clique em <strong>Start Encode</strong>.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Quando usar o FormatFactory?",
            content: `
        <p class="text-gray-300 mb-4">
            O FormatFactory ainda é útil para coisas bizarras. Ele converte TUDO: Imagem, Áudio, PDF, ISO. Se você precisa transformar um arquivo de áudio japonês obscuro (.act) para MP3, ou juntar PDFs, ele é um canivete suíço.
        </p>
        <p class="text-gray-300">
            Mas, para vídeo sério, a qualidade de imagem dele (pixelização) é visivelmente pior que o HandBrake.
        </p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
