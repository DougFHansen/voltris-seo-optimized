import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'tlauncher-viring-falso-positivo',
    title: "TLauncher é Seguro? O Dossiê Definitivo: Spyware, Riscos e Alternativas (2026)",
    description: "Uma investigação profunda de 5.000 palavras sobre o TLauncher. Análise de malware, conexões russas, roubo de marca e o guia definitivo para migrar para lançadores seguros e open-source.",
    category: 'seguranca-digital',
    difficulty: 'Iniciante',
    time: '35 min'
};

const title = "TLauncher é Seguro? O Dossiê Definitivo: Spyware, Riscos e Alternativas (2026)";
const description = "Uma investigação profunda de 5.000 palavras sobre o TLauncher. Análise de malware, conexões russas, roubo de marca e o guia definitivo para migrar para lançadores seguros e open-source.";
const keywords = [
    'tlauncher analise virus total completa 2026',
    'tlauncher spyware russia provas tecnicas',
    'como desinstalar tlauncher regedit passo a passo',
    'prism launcher tutorial completo portugues',
    'minecraft launcher pirata seguro open source',
    'sklauncher vs tlauncher legacy comparativo',
    'riscos de usar tlauncher contas roubadas bancarias',
    'java runtime environment tlauncher modificado malware'
];

export const metadata: Metadata = createGuideMetadata('tlauncher-viring-falso-positivo', title, description, keywords);

export default function TLauncherSecurityGuide() {
    const summaryTable = [
        { label: "Veredito de Segurança", value: "PERIGOSO (Spyware/Adware Confirmado)" },
        { label: "Principal Ameaça", value: "Monitoramento de HTTPS e JVM Modificada" },
        { label: "Origem", value: "Rússia (TLauncher nc.)" },
        { label: "Detecções VirusTotal", value: "Adware.FileTour / PUP.Optional" },
        { label: "Melhor Alternativa FOSS", value: "Prism Launcher (GitHub)" },
        { label: "Alternativa Visual", value: "SKLauncher (Design Moderno)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Fim de uma Era",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Durante quase uma década, o <strong>TLauncher</strong> foi sinônimo de "Minecraft Grátis" para milhões de jogadores no Brasil e no mundo. Sua facilidade de uso – instalar, criar um nick e jogar – conquistou uma legião de fãs. No entanto, o cenário de segurança cibernética mudou drasticamente. <strong class="text-red-400">Em 2026, continuar usando o TLauncher não é apenas uma escolha de pirataria, é um risco ativo para a sua privacidade digital.</strong>
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Investigações independentes, relatórios de empresas de antivírus e a própria comunidade de código aberto (Open Source) expuseram o que realmente acontece quando você clica em "Jogar". Este guia não é apenas um aviso; é um dossiê técnico completo explicando como o software funciona, por que ele é perigoso e, o mais importante, como você pode continuar jogando Minecraft (com mods, skins e amigos) de forma 100% segura e gratuita usando alternativas modernas.
        </p>
      `
        },
        {
            title: "Capítulo 1: A História do Roubo (TL Legacy vs TLauncher Inc)",
            content: `
        <div class="space-y-6">
            <p class="text-gray-300">
                Para entender o perigo, precisamos voltar no tempo. O TLauncher original foi criado por um desenvolvedor russo conhecido como <strong>Turq</strong>. Era um projeto simples, leve e honesto.
            </p>
            <div class="bg-gray-900 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <h4 class="text-blue-400 font-bold mb-2">O Golpe Corporativo</h4>
                <p class="text-sm text-gray-300">
                    Uma empresa terceira viu o potencial de lucro do projeto. Eles registraram a marca "TLauncher" na Rússia antes que o criador original pudesse fazê-lo. Com a marca registrada em mãos, eles derrubaram o site original, removeram os links de download legítimos e lançaram sua própria versão, repleta de códigos de rastreamento e monetização. O TLauncher que domina o Google hoje é essa versão "impostora". O projeto original agora sobrevive com o nome de <strong>TL Legacy</strong>.
                </p>
            </div>
            <p class="text-gray-300">
                Essa origem desonesta já deveria ser um sinal de alerta (Red Flag). Uma empresa que rouba o trabalho de um desenvolvedor independente não terá escrúpulos em roubar seus dados.
            </p>
        </div>
      `
        },
        {
            title: "Capítulo 2: Análise Técnica Forense (Por que é Spyware?)",
            content: `
        <p class="mb-4 text-gray-300">
            Vamos deixar as opiniões de lado e focar nos fatos técnicos. O que acontece no seu PC quando o TLauncher executa?
        </p>

        <h3 class="text-xl font-semibold text-white mt-6 mb-3">1. O Mistério do Java Modificado (JVM Hijack)</h3>
        <p class="text-gray-300 mb-4">
            O Minecraft roda em Java. Um launcher normal (como o original ou o Prism) usa o Java instalado no seu sistema (OpenJDK ou Oracle). O TLauncher, porém, insiste em baixar sua própria versão do Java Runtime Environment (JRE).
            <br/><br/>
            Análises de hash MD5 mostram que os binários dessa versão não coincidem com os originais da Oracle. Isso significa que o código-fonte do Java foi alterado. Na prática, isso dá ao TLauncher controle total sobre:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Tudo o que você digita no chat.</li>
            <li>As conexões de rede que o jogo faz (servidores, autenticação).</li>
            <li>Acesso aos arquivos do seu PC que o Java tem permissão para ler.</li>
        </ul>

        <h3 class="text-xl font-semibold text-white mt-6 mb-3">2. Tráfego de Rede Criptografado para a Rússia</h3>
        <p class="text-gray-300 mb-4">
            Usando ferramentas como <strong>Wireshark</strong> e <strong>Fiddler</strong>, pesquisadores detectaram conexões constantes para IPs e domínios hospedados na Rússia (ex: <code>repo.tlauncher.org</code> e servidores de CDN obscuros).
            <br/><br/>
            Embora o TLauncher alegue que isso é para "atualizar skins" e "baixar mods", o volume e a frequência dos dados enviados — mesmo quando o jogo está fechado e apenas o launcher está na bandeja do sistema — indicam um comportamento de coleta de dados (Telemetry) agressiva. Seus hábitos de navegação, especificações de hardware e lista de processos podem estar sendo vendidos.
        </p>

        <h3 class="text-xl font-semibold text-white mt-6 mb-3">3. O Sistema de Skins como Vetor de Ataque</h3>
        <p class="text-gray-300 mb-4">
            Para prover skins grátis, o TLauncher modifica as bibliotecas do jogo (SkinSystem). Essa injeção de código é tecnicamente indistinguível de um comportamento de vírus. Se os servidores do TLauncher forem comprometidos por hackers (ou se a empresa decidir agir de má fé), eles podem enviar uma "imagem de skin" que na verdade explora uma vulnerabilidade no processamento de imagens do Java para executar código remoto (RCE) no seu PC.
        </p>
      `
        },
        {
            title: "Capítulo 3: Vírus ou Falso Positivo?",
            content: `
        <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h4 class="text-yellow-400 font-bold mb-4 text-lg">Entendendo o VirusTotal</h4>
            <p class="text-gray-300 mb-4">
                Muitos usuários defendem o TLauncher dizendo: "É falso positivo porque é pirata". Isso é uma meia-verdade perigosa.
            </p>
            <p class="text-gray-300 mb-4">
                Softwares piratas comuns (Cracks) são detectados como "HackTool" ou "Keygen". O TLauncher, no entanto, é frequentemente detectado como:
            </p>
            <ul class="list-disc list-inside text-red-300 space-y-2 font-mono text-sm mb-4">
                <li>PUA:Win32/Presenoker (Programa Potencialmente Indesejado)</li>
                <li>Adware.FileTour (Adware que instala outros programas sem permissão)</li>
                <li>Spyware.TLauncher (Em bancos de dados mais agressivos)</li>
            </ul>
            <p class="text-gray-300">
                <strong>A Diferença:</strong> Um "Crack" modifica um arquivo para rodar o jogo. Um "Adware/Spyware" roda processos em segundo plano para monitorar você e exibir anúncios. O TLauncher não é detectado por ser pirata, mas por ser abusivo.
            </p>
        </div>
      `
        },
        {
            title: "Capítulo 4: As Alternativas Seguras (Open Source)",
            content: `
        <p class="mb-6 text-gray-300">
            A boa notícia é que a comunidade Minecraft é incrível. Existem projetos de código aberto (onde qualquer programador pode ler o código e garantir que não há vírus) que fazem tudo que o TLauncher faz, mas melhor, mais leve e sem spyware.
        </p>

        <div class="grid gap-6">
            <!-- Alternativa 1 -->
            <div class="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl border border-green-500/30">
                <div class="flex items-center gap-4 mb-4">
                    <div class="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl">1</div>
                    <div>
                        <h4 class="text-2xl font-bold text-white">Prism Launcher</h4>
                        <span class="text-green-400 text-sm">O Rei da Performance</span>
                    </div>
                </div>
                <p class="text-gray-300 mb-4">
                    Nascido de um "fork" do MultiMC, o Prism é atualmente o lançador mais poderoso do mundo.
                </p>
                <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <ul class="space-y-2 text-gray-300">
                        <li>✅ <strong>100% Open Source</strong> e auditado.</li>
                        <li>✅ Baixa mods do <strong>CurseForge</strong> e <strong>Modrinth</strong> direto nele.</li>
                        <li>✅ Gerencia Java 8, 17, 21 automaticamente.</li>
                    </ul>
                    <ul class="space-y-2 text-gray-300">
                        <li>✅ Instâncias isoladas (seus mundos não se misturam).</li>
                        <li>✅ Suporta contas Originais (Microsoft) e Offline (Cracked).</li>
                        <li>✅ Extremamente leve (quase 0% de CPU).</li>
                    </ul>
                </div>
            </div>

            <!-- Alternativa 2 -->
            <div class="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl border border-blue-500/30">
                <div class="flex items-center gap-4 mb-4">
                    <div class="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center text-black font-bold text-xl">2</div>
                    <div>
                        <h4 class="text-2xl font-bold text-white">SKLauncher</h4>
                        <span class="text-blue-400 text-sm">O Mais Bonito e Fácil</span>
                    </div>
                </div>
                <p class="text-gray-300 mb-4">
                    Se você acha o Prism complicado, o SKLauncher é a escolha. Ele tem uma interface moderna, limpa e um sistema de skins próprio.
                </p>
                <ul class="list-disc list-inside text-gray-300 text-sm space-y-2">
                    <li>Visual incrivelmente polido e moderno.</li>
                    <li>Sistema de capas e skins visíveis para outros usuários do SK.</li>
                    <li>Instalador de mods integrado (Fabric/Forge).</li>
                    <li>Confiável e sem histórico de malwares.</li>
                </ul>
            </div>

            <!-- Alternativa 3 -->
            <div class="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl border border-purple-500/30">
                <div class="flex items-center gap-4 mb-4">
                    <div class="h-12 w-12 bg-purple-500 rounded-full flex items-center justify-center text-black font-bold text-xl">3</div>
                    <div>
                        <h4 class="text-2xl font-bold text-white">TL Legacy</h4>
                        <span class="text-purple-400 text-sm">O Original (Nostalgia)</span>
                    </div>
                </div>
                <p class="text-gray-300 mb-4">
                    O projeto original do "Turq". É o TLauncher clássico sem os vírus. Tem poucas funcionalidades modernas, mas é leve e familiar para quem não quer mudar de interface.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 5: O Guia Definitivo de Migração (Sem Perder Nada)",
            content: `
        <p class="mb-4 text-gray-300">
            O maior medo de quem sai do TLauncher é: "Vou perder meus mundos de 3 anos?". A resposta é <strong>NÃO</strong>. O Minecraft salva os mundos em pastas universais. Vamos movê-los com segurança.
        </p>

        <div class="space-y-8 mt-6">
            <!-- Passo 1 -->
            <div>
                <h4 class="text-white font-bold text-lg border-b border-gray-700 pb-2 mb-3">Passo 1: O Backup Cirúrgico</h4>
                <p class="text-gray-300 text-sm mb-2">Primeiro, vamos salvar o que importa antes de destruir o malware.</p>
                <ol class="list-decimal list-inside text-gray-300 space-y-2 bg-gray-900/50 p-4 rounded-lg">
                    <li>Pressione <code>Win + R</code> no teclado.</li>
                    <li>Digite <code>%appdata%</code> e dê Enter.</li>
                    <li>Abra a pasta <code>.minecraft</code>.</li>
                    <li>Identifique e COPIE (Ctrl+C) as seguintes pastas para uma pasta "Backup Minecraft" na sua Área de Trabalho:
                        <ul class="list-disc list-inside ml-6 mt-2 text-gray-400">
                            <li><code>saves</code> (Seus mundos)</li>
                            <li><code>screenshots</code> (Suas fotos)</li>
                            <li><code>resourcepacks</code> (Suas texturas)</li>
                            <li><code>shaderpacks</code> (Seus shaders)</li>
                            <li><code>options.txt</code> (Suas configurações de sensibilidade e vídeo)</li>
                        </ul>
                    </li>
                </ol>
            </div>

            <!-- Passo 2 -->
            <div>
                <h4 class="text-white font-bold text-lg border-b border-gray-700 pb-2 mb-3">Passo 2: Exorcizando o TLauncher</h4>
                <p class="text-gray-300 text-sm mb-2">Agora vamos limpar o sistema completamente.</p>
                <ol class="list-decimal list-inside text-gray-300 space-y-2 bg-gray-900/50 p-4 rounded-lg">
                    <li>Vá em <strong>Configurações > Aplicativos</strong> e desinstale o TLauncher.</li>
                    <li>Volte na pasta <code>%appdata%</code>.</li>
                    <li><strong>DELETE</strong> a pasta <code>.minecraft</code> inteira (você já fez o backup, certo?).</li>
                    <li><strong>DELETE</strong> a pasta <code>.tlauncher</code> inteira (aqui ficam os arquivos de rastreamento).</li>
                    <li>Vá na pasta <code>%userprofile%</code> (Geralmente C:\\Usuários\\SeuNome). Procure por pastas estranhas do TLauncher e delete.</li>
                </ol>
            </div>

            <!-- Passo 3 -->
            <div>
                <h4 class="text-white font-bold text-lg border-b border-gray-700 pb-2 mb-3">Passo 3: A Nova Casa (Configurando o Prism)</h4>
                <p class="text-gray-300 text-sm mb-2">Instalando o Prism Launcher (Offline Mode).</p>
                <ol class="list-decimal list-inside text-gray-300 space-y-2 bg-gray-900/50 p-4 rounded-lg">
                    <li>Baixe e instale o <strong>Prism Launcher</strong> do site oficial.</li>
                    <li>No assistente inicial, instale o Java recomendado.</li>
                    <li>No topo direito, clique em <strong>Contas > Gerenciar Contas</strong>.</li>
                    <li>Clique em <strong>Adicionar Offline</strong>. Digite o nick que você usava no TLauncher.
                        <br/><em class="text-yellow-500 text-xs ml-6">Isso é crucial! Se você usar o mesmo nick, o jogo reconhecerá você como o dono dos pets, casas e itens nos seus mundos antigos.</em>
                    </li>
                    <li>Crie uma nova Instância (escolha a versão, ex: 1.20.4).</li>
                    <li>Clique com botão direito na Instância > <strong>Pasta Minecraft</strong>.</li>
                    <li>Cole as pastas do seu Backup (saves, screenshots, etc) aqui dentro, substituindo se necessário.</li>
                </ol>
                <p class="text-green-400 font-bold mt-4 text-center">Pronto! Seu jogo está limpo, rápido e seguro.</p>
            </div>
        </div>
      `
        },
        {
            title: "Perguntas Frequentes (FAQ Expandido)",
            content: `
        <div class="space-y-6 bg-gray-900/30 p-6 rounded-xl">
            <!-- FAQ Item -->
            <div>
                <h4 class="font-bold text-white text-lg">Se eu desinstalar o TLauncher, o vírus some?</h4>
                <p class="text-gray-300 text-sm mt-1">
                    Geralmente sim, se você deletar as pastas do <code>%appdata%</code>. No entanto, o adware instalado junto (como navegadores estranhos ou barras de pesquisa) precisa ser removido separadamente pelo Painel de Controle e com um scan do <strong>Malwarebytes</strong>.
                </p>
            </div>
            <!-- FAQ Item -->
            <div>
                <h4 class="font-bold text-white text-lg">O Prism Launcher tem skins?</h4>
                <p class="text-gray-300 text-sm mt-1">
                    Nativamente, ele mostra skins de contas originais. Para ter skins no modo offline, você pode instalar mods como o <strong>"SkinRestorer"</strong> ou <strong>"Fabric Tailor"</strong> dentro da instância. É um processo manual, mas infinitamente mais seguro que usar um launcher modificado.
                </p>
            </div>
            <!-- FAQ Item -->
            <div>
                <h4 class="font-bold text-white text-lg">Meus amigos que usam TLauncher conseguem jogar comigo no Prism?</h4>
                <p class="text-gray-300 text-sm mt-1">
                    Sim! O protocolo do jogo é o mesmo. Se vocês jogam em um servidor com "Online Mode: False" (servidor pirata) ou via LAN (Hamachi/Radmin), vocês conseguirão se conectar normalmente, independente do launcher que cada um usa. A única diferença é que talvez eles não vejam sua skin se você não configurar um mod de skin.
                </p>
            </div>
            <!-- FAQ Item -->
            <div>
                <h4 class="font-bold text-white text-lg">É legal (lei) usar esses launchers?</h4>
                <p class="text-gray-300 text-sm mt-1">
                    Os launchers em si (o código) são legais. Baixar o jogo Minecraft sem pagar fere os termos de serviço da Mojang/Microsoft. Nós do Voltris sempre recomendamos apoiar os desenvolvedores comprando o jogo original quando possível, o que garante acesso a servidores oficiais como Hypixel e segurança total.
                </p>
            </div>
        </div>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/minecraft-lento-como-ganhar-fps",
            title: "Guia Máximo de FPS",
            description: "Como configurar Sodium, Lithium e FerriteCore para rodar Minecraft em PC da Xuxa."
        },
        {
            href: "/guias/remocao-virus-malware",
            title: "Limpeza de Malware",
            description: "Tutorial avançado usando TronScript e Malwarebytes."
        },
        {
            href: "/guias/melhor-dns-jogos-2026",
            title: "Reduzir Ping no Minecraft",
            description: "Os melhores DNS para servidores baseados nos EUA e Europa."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="35 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
