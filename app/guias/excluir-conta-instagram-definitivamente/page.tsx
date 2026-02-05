import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'excluir-conta-instagram-definitivamente',
  title: "Como Excluir sua Conta do Instagram Definitivamente (2026)",
  description: "Cansado do Reels? Aprenda como excluir ou desativar temporariamente sua conta do Instagram pelo celular ou PC no guia atualizado de 2026.",
  category: 'windows-geral',
  difficulty: 'Iniciante',
  time: '10 min'
};

const title = "Como Excluir sua Conta do Instagram Definitivamente (2026)";
const description = "Cansado do Reels? Aprenda como excluir ou desativar temporariamente sua conta do Instagram pelo celular ou PC no guia atualizado de 2026.";
const keywords = [
    'como excluir conta instagram definitivo 2026',
    'desativar instagram temporariamente tutorial passo a passo',
    'excluir conta do instagram pelo celular guia 2026',
    'apagar instagram permanentemente tutorial completo',
    'como recuperar instagram desativado tutorial 2026'
];

export const metadata: Metadata = createGuideMetadata('excluir-conta-instagram-definitivamente', title, description, keywords);

export default function InstagramDeleteGuide() {
    const summaryTable = [
        { label: "Tempo de Espera", value: "30 dias para exclusão total" },
        { label: "Opção Reversível", value: "Desativação Temporária" },
        { label: "Download de Dados", value: "Recomendado antes de apagar" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O processo de despedida em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, com as novas leis de privacidade e a integração total da Meta, o processo para excluir o Instagram ficou um pouco mais escondido dentro da "Central de Contas". Seja para fazer um detox digital ou por questões de segurança, você tem o direito garantido de apagar todos os seus dados. Mas atenção: uma vez apagada, você perderá todas as suas fotos, seguidores e mensagens para sempre.
        </p>
      `
        },
        {
            title: "1. Salvando suas memórias primeiro",
            content: `
        <p class="mb-4 text-gray-300">Antes de deletar, baixe uma cópia de tudo o que você postou:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Vá no seu Perfil > Menu (três linhas) > Sua Atividade.</li>
            <li>Role até o final e clique em <strong>'Baixar suas informações'</strong>.</li>
            <li>O Instagram enviará um link para o seu e-mail com todas as suas fotos e vídeos em alta qualidade.</li>
        </ol>
      `
        },
        {
            title: "2. Passo a Passo da Exclusão (Central de Contas)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Pelo Celular ou PC:</h4>
            <p class="text-sm text-gray-300">
                1. Acesse as Configurações e vá em **Central de Contas**. <br/>
                2. Clique em **Dados Pessoais** > **Propriedade e controle da conta**. <br/>
                3. Selecione 'Desativação ou exclusão'. <br/>
                4. Escolha 'Excluir conta' para remover permanentemente ou 'Desativar' para ela apenas sumir até que você faça login de novo. <br/>
                5. Digite sua senha para confirmar.
            </p>
        </div>
      `
        },
        {
            title: "3. O Período de Arrependimento",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Não suma do nada:</strong> 
            <br/><br/>Após pedir a exclusão, sua conta ficará invisível, mas o Instagram leva **30 dias** para deletar os arquivos dos servidores dele. Se você se arrepender nesse período, basta entrar no aplicativo com sua senha e clicar em 'Manter conta'. Se passar de 30 dias, nem mesmo o suporte da Meta conseguirá recuperar o seu nome de usuário ou fotos em 2026.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/autenticacao-dois-fatores",
            title: "Proteger Contas",
            description: "Mantenha seu acesso seguro enquanto decide."
        },
        {
            href: "/guias/protecao-dados-privacidade",
            title: "Privacidade Digital",
            description: "Como as redes sociais usam seus dados em 2026."
        },
        {
            href: "/guias/seguranca-digital",
            title: "Segurança Online",
            description: "Dicas extras para evitar hackers."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Fácil"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
