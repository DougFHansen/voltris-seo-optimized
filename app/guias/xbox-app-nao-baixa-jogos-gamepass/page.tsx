import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Xbox App Não Baixa Jogos (Game Pass)? Corrija o Erro 0x80070001 (2026)";
const description = "O app do Xbox trava em 'Preparando' ou dá erro de download? Veja como resetar os Serviços de Jogos (Gaming Services) e limpar o cache da Store.";
const keywords = ['xbox app nao baixa jogos pc', 'erro 0x80070001 game pass', 'gaming services repair tool', 'xbox app travado preparando', 'reinstalar servicos de jogos powershell', 'wsreset comando'];

export const metadata: Metadata = createGuideMetadata('xbox-app-nao-baixa-jogos-gamepass', title, description, keywords);

export default function XboxAppGuide() {
    const summaryTable = [
        { label: "Erro", value: "Download Travado" },
        { label: "Culpado", value: "Serviços de Jogos" },
        { label: "Solução", value: "PowerShell Reset" },
        { label: "Ferramenta", value: "Repair Tool" }
    ];

    const contentSections = [
        {
            title: "O Problema dos 'Serviços de Jogos'",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          O App Xbox no PC não baixa os jogos sozinho. Ele usa um serviço oculto do Windows chamado <strong>Gaming Services</strong>. Esse serviço vive corrompendo, fazendo o botão "Instalar" ficar cinza ou o download ficar em 0%.
        </p>
      `,
            subsections: []
        },
        {
            title: "Passo 1: Gaming Services Repair Tool (Oficial)",
            content: `
        <p class="mb-4 text-gray-300">
            A Microsoft lançou uma ferramenta que conserta isso automaticamente.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 mb-6">
            <li>Abra o app <strong>Xbox</strong> no PC.</li>
            <li>Clique no seu ícone de perfil > <strong>Suporte</strong>.</li>
            <li>Clique em <strong>Ferramenta de Reparo de Serviços de Jogos</strong>.</li>
            <li>Clique em <strong>Iniciar Solução de Problemas</strong>.</li>
            <li>Ele vai reinstalar os serviços. Reinicie o PC.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Passo 2: Método PowerShell (Se a ferramenta falhar)",
            content: `
        <p class="mb-4 text-gray-300">
            Vamos arrancar o serviço à força e instalar de novo.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Abra o <strong>PowerShell como Administrador</strong>.</li>
            <li>Cole este comando para remover:</li>
        </ol>
        <div class="bg-black border border-gray-700 p-4 rounded-lg mt-2 mb-4 font-mono text-red-400 text-sm break-all">
            get-appxpackage Microsoft.GamingServices | remove-appxpackage -allusers
        </div>
        <ol start="3" class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Agora cole este para reinstalar:</li>
        </ol>
        <div class="bg-black border border-gray-700 p-4 rounded-lg mt-2 mb-4 font-mono text-green-400 text-sm break-all">
            start ms-windows-store://pdp/?productid=9MWPM2CQNLHN
        </div>
        <p class="text-gray-300">
            Isso vai abrir a Microsoft Store na página do Gaming Services. Clique em <strong>Instalar</strong>.
        </p>
      `,
            subsections: []
        },
        {
            title: "Passo 3: Hora e Região",
            content: `
        <p class="text-gray-300">
            Parece bobo, mas verifique se a <strong>Hora do Windows</strong> está sincronizada (Configurações > Hora e Idioma > Sincronizar Agora). Se o relógio estiver errado, o servidor de segurança da Microsoft recusa o download.
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
