import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'hard-reset-celular-formatar',
  title: "Como fazer Hard Reset no Celular: Samsung, Motorola e Xiaomi",
  description: "Esqueceu a senha do celular ou ele está travando? Aprenda a fazer o Hard Reset completo pelos botões físicos (Recovery Mode) com segurança.",
  category: 'software',
  difficulty: 'Intermediário',
  time: '30 min'
};

const title = "Como fazer Hard Reset no Celular: Samsung, Motorola e Xiaomi";
const description = "Esqueceu a senha do celular ou ele está travando? Aprenda a fazer o Hard Reset completo pelos botões físicos (Recovery Mode) com segurança.";
const keywords = [
    'como fazer hard reset celular samsung tutorial 2026',
    'formatar motorola pelos botoes passo a passo',
    'redefinir xiaomi modo recovery 2026',
    'hard reset apaga tudo do celular sim',
    'como remover conta google após hard reset aviso'
];

export const metadata: Metadata = createGuideMetadata('hard-reset-celular-formatar', title, description, keywords);

export default function HardResetGuide() {
    const summaryTable = [
        { label: "O que apaga", value: "Fotos, Contatos, Apps e Senhas" },
        { label: "Bateria Mínima", value: "60% (Recomendado)" },
        { label: "Aviso Vital", value: "Lembre-se do seu e-mail/senha da Conta Google" },
        { label: "Dificuldade", value: "Média" }
    ];

    const contentSections = [
        {
            title: "O que é o Hard Reset?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **Hard Reset** é uma formatação forçada que limpa o sistema operacional do celular através de um menu "escondido" (Recovery Mode). É a solução definitiva para quando o celular não liga, está em loop infinito (logomarca piscando) ou quando você esqueceu o padrão de desenho/senha da tela.
        </p>
      `
        },
        {
            title: "1. Preparação (O bloqueio FRP)",
            content: `
        <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/30">
            <h4 class="text-red-400 font-bold mb-2">Cuidado com a Conta Google!</h4>
            <p class="text-sm text-gray-300">
                Se você formatar o celular sem remover a conta Google antes (nas configurações), o sistema entrará no bloqueio FRP. Após ligar, ele exigirá o e-mail e senha que estavam nele antes por segurança. Se você não souber esses dados, o celular ficará inutilizável. 
                <br/><strong>Recomendação:</strong> Se o celular liga, vá em Configurações > Contas > Remova as contas do Google/Samsung/Xiaomi antes de formatar.
            </p>
        </div>
      `
        },
        {
            title: "2. Passo a Passo Geral (Botões)",
            content: `
        <p class="mb-4 text-gray-300">O processo varia pouco entre as marcas:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Desligue o celular completamente.</li>
            <li>Segure <strong>Botão Power + Volume Cima</strong> (Samsung/Xiaomi) ou <strong>Volume Baixo</strong> (Motorola) por 10 segundos.</li>
            <li>Quando aparecer o robozinho ou um menu de texto, solte os botões.</li>
            <li>Use as teclas de volume para navegar até <strong>'Wipe Data/Factory Reset'</strong>.</li>
            <li>Aperte Power para selecionar. Escolha 'Yes' ou 'Factory Data Reset'.</li>
            <li>Após terminar, selecione <strong>'Reboot System Now'</strong>.</li>
        </ol>
      `
        },
        {
            title: "3. O que fazer se o Hard Reset falhar?",
            content: `
        <p class="mb-4 text-gray-300">
            Se o celular continuar travado no logo mesmo após o reset, o problema pode ser o **Firmware corrompido**. 
            <br/>Nesse caso, você precisará usar programas específicos no PC (Odin para Samsung, MiFlash para Xiaomi ou RSA para Motorola) para reinstalar o sistema inteiro do zero via cabo USB.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/backup-dados",
            title: "Guia de Backup",
            description: "Como salvar suas fotos antes do reset."
        },
        {
            href: "/guias/autenticacao-dois-fatores",
            title: "Segurança de Conta",
            description: "Não perca o acesso ao seu 2FA após o reset."
        },
        {
            href: "/guias/calibrar-bateria-notebook",
            title: "Cuidados Bateria",
            description: "Mantenha seu celular sempre carregado."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
