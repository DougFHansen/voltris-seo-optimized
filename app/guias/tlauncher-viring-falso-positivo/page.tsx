import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'tlauncher-viring-falso-positivo',
    title: "TLauncher é Seguro? O Dossiê Definitivo 2026: Spyware, Riscos e Alternativas",
    description: "Investigação massiva sobre o TLauncher. Análise de código, conexões russas, roubo de propriedade intelectual e o guia final de migração para Prism Launcher e SKLauncher.",
    category: 'seguranca-digital',
    difficulty: 'Iniciante',
    time: '45 min'
};

const title = "TLauncher é Seguro? O Dossiê Definitivo 2026: Spyware, Riscos e Alternativas";
const description = "Investigação massiva sobre o TLauncher. Análise de código, conexões russas, roubo de propriedade intelectual e o guia final de migração para Prism Launcher e SKLauncher.";
const keywords = [
    'tlauncher virus ou falso positivo 2026',
    'analise tecnica tlauncher spyware russia',
    'como remover tlauncher completamente regedit',
    'prism launcher tutorial completo baixar',
    'sklauncher é confiavel review 2026',
    'melhores launchers minecraft pirata sem virus',
    'riscos tlauncher contas bancarias',
    'java runtime environment modificado malware'
];

export const metadata: Metadata = createGuideMetadata('tlauncher-viring-falso-positivo', title, description, keywords);

export default function TLauncherSecurityGuide() {
    const summaryTable = [
        { label: "Veredito de Segurança", value: "CRÍTICO (Spyware Confirmado)" },
        { label: "Principal Risco", value: "Interceptação de HTTPS e JVM Modificada" },
        { label: "Origem do Código", value: "Roubado (TL Legacy) e Adulterado" },
        { label: "Detecções AV", value: "Adware.FileTour / Trojan.Spy" },
        { label: "Melhor Alternativa FOSS", value: "Prism Launcher (GitHub)" },
        { label: "Melhor Design", value: "SKLauncher (Clean UI)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Fim da Inocência no Minecraft",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Por quase uma década, o nome <strong>TLauncher</strong> foi sinônimo de acesso democrático ao Minecraft. Para milhões de jogadores brasileiros que não podiam pagar pelo jogo original, ele era a porta de entrada para um mundo de criatividade. No entanto, o cenário digital de 2026 não permite mais ingenuidade. O software que você tem instalado no seu PC hoje não é apenas um "lançador pirata"; é uma ferramenta de coleta de dados sofisticada, operada por uma empresa com práticas comerciais predatórias e conexões obscuras.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Neste dossiê investigativo, não vamos apenas dizer "é perigoso". Vamos abrir a caixa preta. Você vai entender como o código foi modificado, para onde seus dados estão indo e, mais importante, vamos apresentar um roteiro completo para você continuar jogando seus mundos favoritos em plataformas auditadas pela comunidade, seguras e gratuitas.
        </p>
      `
        },
        {
            title: "Parte 1: A História do Roubo (TL Legacy vs TLauncher Inc)",
            content: `
        <div class="space-y-8">
            <div>
                <h4 class="text-white font-bold text-xl mb-3">O Nascimento (2013-2016)</h4>
                <p class="text-gray-300 text-md">
                    O projeto original nasceu das mãos de um desenvolvedor russo conhecido como <strong>Turq</strong>. Sua intenção era criar um launcher leve, simples e funcional para a comunidade russa. Esse software ganhou tração mundial por sua eficiência. Ele não tinha anúncios intrusivos, não instalava barras de pesquisa e respeitava o usuário.
                </p>
            </div>
            
            <div class="bg-gray-900 border-l-4 border-red-500 p-6 rounded-r-lg">
                <h4 class="text-red-400 font-bold text-xl mb-3">O Golpe Corporativo (2016-Presente)</h4>
                <p class="text-gray-300 text-md leading-relaxed">
                    Percebendo a popularidade massiva do software, uma empresa terceira (que chamaremos de TLauncher Inc.) registrou a marca "TLauncher" na Rússia antes que o criador original pudesse fazê-lo.
                    <br/><br/>
                    Armados com a marca registrada, eles iniciaram uma campanha agressiva de <strong>DMCA Takedowns</strong> (notificações de direitos autorais), derrubando o site original do Turq e removendo os links de download legítimos do ar. Em seguida, eles lançaram sua própria versão — visualmente idêntica, mas com o código "envenenado" por sistemas de rastreamento e monetização.
                </p>
            </div>

            <div>
                <h4 class="text-white font-bold text-xl mb-3">O Estado Atual em 2026</h4>
                <p class="text-gray-300 text-md">
                    Hoje, quando você digita "Baixar Minecraft" no Google, os primeiros resultados são dominados pela versão impostora. O criador original continua mantendo seu projeto sob o nome de <strong>TL Legacy</strong> (ou RuLauncher), mas ele é muito menos conhecido. A ironia é cruel: a versão "falsa" se tornou a "oficial" na mente do público.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Parte 2: Análise Forense (Por que é Spyware?)",
            content: `
        <p class="mb-6 text-gray-300 text-lg">
            Vamos aprofundar na parte técnica. O que exatamente o TLauncher faz que o classifica como Spyware em análise forense?
        </p>

        <div class="space-y-8">
            <!-- Ponto 1 -->
            <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h4 class="text-red-400 font-bold text-xl mb-3">1. JVM Hijacking (Sequestro da Máquina Virtual Java)</h4>
                <p class="text-gray-300 text-md mb-4">
                    O Minecraft é executado sobre a Java Virtual Machine (JVM). Um launcher ético usa a JVM instalada no seu sistema (OpenJDK, Oracle, Microsoft) ou baixa a versão original oficial.
                </p>
                <p class="text-gray-300 text-md mb-4">
                    O TLauncher força o download de uma JVM proprietária, hospedada em seus próprios servidores. Ao analisar os arquivos binários (` + "`java.dll`, `jvm.dll`" + `) dessa versão, especialistas encontraram discrepâncias de hash MD5 em comparação com os originais.
                </p>
                <p class="text-yellow-400 font-bold text-sm bg-yellow-900/20 p-3 rounded">
                    ⚠️ O Perigo: Uma JVM modificada tem acesso irrestrito ("Root") a tudo que o jogo faz. Ela pode ler o que você digita no chat, interceptar senhas digitadas e ler arquivos do seu disco rígido sem que o antivírus perceba, pois o antivírus confia no processo "Java".
                </p>
            </div>

            <!-- Ponto 2 -->
            <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h4 class="text-red-400 font-bold text-xl mb-3">2. Quebra de Criptografia SSL (Man-in-the-Middle)</h4>
                <p class="text-gray-300 text-md mb-4">
                    Para que suas skins (capas) funcionem em servidores piratas, o TLauncher precisa redirecionar as chamadas de textura do jogo. Em vez de ir para ` + "`skins.minecraft.net`" + `, o jogo vai para ` + "`tlauncher.org/skins`" + `.
                </p>
                <p class="text-gray-300 text-md">
                    Para fazer isso via HTTPS, eles precisam instalar um certificado raiz próprio ou modificar as bibliotecas de segurança do Java (` + "`authlib`" + `). Isso cria uma vulnerabilidade clássica de <em>Man-in-the-Middle</em>. Se os servidores deles forem atacados (ou se eles quiserem), podem injetar código malicioso diretamente na memória do seu jogo sob o disfarce de uma "textura".
                </p>
            </div>

            <!-- Ponto 3 -->
            <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h4 class="text-red-400 font-bold text-xl mb-3">3. Telemetria e Conexões Suspeitas</h4>
                <p class="text-gray-300 text-md mb-4">
                    Análises de tráfego de rede (Wireshark) mostram pacotes de dados sendo enviados para IPs na Rússia, Ucrânia e Chipre assim que o launcher é aberto. Os dados incluem:
                </p>
                <ul class="list-disc list-inside text-gray-400 space-y-2 ml-4 mb-4">
                    <li>Lista de todos os softwares instalados no seu PC.</li>
                    <li>Specs detalhadas de hardware (CPU, GPU, RAM, Discos).</li>
                    <li>Endereço MAC e IP (Identificadores únicos).</li>
                    <li>Histórico de falhas e logs do sistema.</li>
                </ul>
                <p class="text-gray-300 text-md">
                    Isso é um comportamento típico de <strong>Data Mining</strong> comercial. Seus dados são o produto que paga pelo desenvolvimento do software "grátis".
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Parte 3: Análise de VirusTotal e Falsos Positivos",
            content: `
        <p class="mb-4 text-gray-300">
            "Ah, mas meu antivírus não detectou nada!" ou "É só um falso positivo porque é crack!". Vamos desmistificar isso agora.
        </p>

        <div class="space-y-6">
            <div>
                <h4 class="text-white font-bold text-lg mb-2">O que o VirusTotal diz em 2026?</h4>
                <p class="text-gray-300 text-sm mb-2">
                    Ao enviar o instalador do TLauncher para o VirusTotal, vemos detecções consistentes de motores importantes (Sophos, Malwarebytes, Kaspersky):
                </p>
                <ul class="list-disc list-inside bg-gray-900/50 p-4 rounded text-red-300 font-mono text-sm">
                    <li>PUP.Optional.TLauncher (Programa Potencialmente Indesejado)</li>
                    <li>Adware.FileTour (Instalador de Bloatware)</li>
                    <li>Trojan.Downloader.JavaGeneric</li>
                </ul>
            </div>

            <div>
                <h4 class="text-white font-bold text-lg mb-2">A Verdade sobre "Falso Positivo"</h4>
                <p class="text-gray-300 text-sm">
                    Um falso positivo legítimo ocorre quando um software usa uma técnica de ofuscação de código para proteger sua propriedade intelectual, e o antivírus se confunde.
                    <br/><br/>
                    No caso do TLauncher, as detecções <strong>NÃO SÃO</strong> falsos positivos. Elas são classificações precisas de comportamento indesejado (PUP). O software *realmente* tenta instalar o navegador Opera GX com links de afiliado, tenta mudar sua página inicial e coleta dados sem consentimento claro (GDPR/LGPD).
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Parte 4: As Melhores Alternativas Seguras (Review Completo)",
            content: `
        <p class="mb-6 text-gray-300 text-lg">
            Você decidiu sair do TLauncher. Parabéns! Mas para onde ir? Em 2026, temos opções incríveis.
        </p>

        <div class="grid gap-8">
            <!-- Prism Launcher -->
            <div class="bg-gray-800 p-6 rounded-xl border-l-4 border-green-500">
                <h3 class="text-2xl font-bold text-white mb-2">1. Prism Launcher (A Escolha do Especialista)</h3>
                <p class="text-green-400 font-bold text-xs uppercase tracking-widest mb-4">Melhor Performance • Open Source</p>
                <p class="text-gray-300 mb-4">
                    O Prism (fork do antigo MultiMC e PolyMC) é o padrão ouro. Ele é leve, não precisa de instalação (portátil) e tem zero gordura.
                </p>
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <h5 class="text-white font-bold mb-2">Vantagens:</h5>
                        <ul class="list-disc list-inside text-gray-300 text-sm space-y-1">
                            <li>Código 100% auditável no GitHub.</li>
                            <li>Baixa mods (CurseForge/Modrinth) direto da interface.</li>
                            <li>Gerencia múltiplas instâncias isoladas (uma para Vanilla, uma para Pixelmon, etc).</li>
                            <li>Suporta Contas Microsoft Oficiais e Modo Offline.</li>
                        </ul>
                    </div>
                    <div>
                        <h5 class="text-white font-bold mb-2">Para quem é?</h5>
                        <p class="text-gray-400 text-sm">
                            Para quem quer FPS máximo, joga com muitos mods ou quer controle total sobre o jogo. Pode parecer "feio" para iniciantes, mas é imbatível na técnica.
                        </p>
                    </div>
                </div>
            </div>

            <!-- SKLauncher -->
            <div class="bg-gray-800 p-6 rounded-xl border-l-4 border-blue-500">
                <h3 class="text-2xl font-bold text-white mb-2">2. SKLauncher (O Sucessor Espiritual)</h3>
                <p class="text-blue-400 font-bold text-xs uppercase tracking-widest mb-4">Melhor Visual • Fácil de Usar</p>
                <p class="text-gray-300 mb-4">
                    Se você gosta da simplicidade do TLauncher (instalar, por nick, jogar), o SK é para você. Ele passou por uma reescrita completa em 2024 e agora é super seguro.
                </p>
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <h5 class="text-white font-bold mb-2">Vantagens:</h5>
                        <ul class="list-disc list-inside text-gray-300 text-sm space-y-1">
                            <li>Interface moderna (Material Design).</li>
                            <li>Sistema de Skins próprio (visível para outros usuários SK).</li>
                            <li>Criador de Modpacks integrado.</li>
                            <li>Limpo de Adwares e Spywares.</li>
                        </ul>
                    </div>
                    <div>
                        <h5 class="text-white font-bold mb-2">Para quem é?</h5>
                        <p class="text-gray-400 text-sm">
                            Para o jogador casual que quer clicar e jogar, sem configurar Java ou pastas. É a experiência "TLauncher" feita do jeito certo e honesto.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Outras Opções -->
            <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 class="text-xl font-bold text-white mb-2">Menções Honrosas</h3>
                <ul class="space-y-4">
                    <li>
                        <strong class="text-purple-400">TL Legacy:</strong> O verdadeiro clássico. Feio, antigo, mas seguro e nostálgico. Use se seu PC for realmente muito, muito fraco.
                    </li>
                    <li>
                        <strong class="text-yellow-400">ATLauncher:</strong> Excelente para modpacks pesados, com ferramentas de servidor automático.
                    </li>
                    <li>
                        <strong class="text-red-400">Evite:</strong> Lunar Client, Badlion (versões crackeadas não oficiais), TLaunsh (clones de clones).
                    </li>
                </ul>
            </div>
        </div>
      `
        },
        {
            title: "Parte 5: Guia Definitivo de Migração (Passo a Passo)",
            content: `
        <p class="mb-4 text-gray-300">
            Vamos mover sua vida do Minecraft para o Prism Launcher sem perder nenhum bloco construído.
        </p>

        <div class="space-y-8 mt-8">
            <div class="border-l-2 border-gray-600 pl-6">
                <h4 class="text-white font-bold text-xl mb-2">Fase 1: O Backup Cirúrgico</h4>
                <p class="text-gray-400 text-sm mb-4">Não copie a pasta `.minecraft` inteira, pois ela pode conter arquivos infectados. Vamos copiar apenas o essencial.</p>
                <ol class="list-decimal list-inside text-gray-300 space-y-3">
                    <li>Crie uma pasta na Área de Trabalho chamada "Backup MC".</li>
                    <li>Aperte <code>Win + R</code>, digite <code>%appdata%</code> e entre em <code>.minecraft</code>.</li>
                    <li>Copie as seguintes pastas para o seu Backup:
                        <ul class="list-none ml-6 mt-2 space-y-1 font-mono text-sm text-green-400">
                            <li>/saves (Seus mundos)</li>
                            <li>/screenshots (Suas prints)</li>
                            <li>/resourcepacks (Suas texturas)</li>
                            <li>/shaderpacks (Seus shaders)</li>
                            <li>/config (Configurações de mods, se tiver)</li>
                            <li>options.txt (Sensibilidade, FOV, volumes)</li>
                        </ul>
                    </li>
                </ol>
            </div>

            <div class="border-l-2 border-gray-600 pl-6">
                <h4 class="text-white font-bold text-xl mb-2">Fase 2: Limpeza Total (Exorcismo)</h4>
                <p class="text-gray-400 text-sm mb-4">Removendo o malware pela raiz.</p>
                <ol class="list-decimal list-inside text-gray-300 space-y-3">
                    <li>Desinstale o TLauncher pelo Painel de Controle.</li>
                    <li>Vá em <code>%appdata%</code> e <strong>DELETE</strong> as pastas <code>.minecraft</code> e <code>.tlauncher</code>.</li>
                    <li>Vá em <code>C:\\Usuários\\SeuNome\\</code> e verifique se sobrou alguma pasta "TLauncher". Delete.</li>
                    <li>(Opcional Avançado) Abra o <code>regedit</code>, busque por "TLauncher" e apague as chaves encontradas em <code>HKEY_CURRENT_USER\\Software</code>.</li>
                    <li>Reinicie o computador.</li>
                </ol>
            </div>

            <div class="border-l-2 border-gray-600 pl-6">
                <h4 class="text-white font-bold text-xl mb-2">Fase 3: Casa Nova (Prism Launcher)</h4>
                <p class="text-gray-400 text-sm mb-4">Configurando o ambiente seguro.</p>
                <ol class="list-decimal list-inside text-gray-300 space-y-3">
                    <li>Baixe o <strong>Prism Launcher</strong> (Zip ou Instalador do GitHub/Site Oficial).</li>
                    <li>Instale o Java (o Prism baixará para você ou instale o Java 17/21 da Adoptium).</li>
                    <li>Abra o Prism. No canto superior direito, clique em <strong>Contas > Gerenciar Contas</strong>.</li>
                    <li>Clique em <strong>Adicionar Offline</strong>. Coloque seu Nick exato.</li>
                    <li>Crie uma Instância (Botão "Adicionar Instância"). Escolha a versão (ex: 1.20.1).</li>
                    <li>Clique com botão direito na instância > <strong>Pasta Minecraft</strong>.</li>
                    <li>Cole seus arquivos de Backup (saves, options.txt, etc) lá dentro.</li>
                    <li>Dê dois cliques na instância e jogue!</li>
                </ol>
            </div>
        </div>
      `
        },
        {
            title: "FAQ Expandido e Perguntas da Comunidade",
            content: `
        <div class="grid gap-6">
            <div class="bg-gray-900/40 p-5 rounded-lg">
                <h5 class="text-white font-bold text-md mb-2">❓ Meus FPS vão aumentar mudando de launcher?</h5>
                <p class="text-gray-300 text-sm">
                    <strong>Sim, provavelmente.</strong> O TLauncher consome recursos em segundo plano. O Prism Launcher é extremamente leve. Além disso, o Prism facilita muito a instalação do mod <strong>Sodium</strong> (Fabric), que pode triplicar seus FPS comparado ao Minecraft padrão.
                </p>
            </div>

            <div class="bg-gray-900/40 p-5 rounded-lg">
                <h5 class="text-white font-bold text-md mb-2">❓ Como colocar Skin no Prism Launcher (Modo Offline)?</h5>
                <p class="text-gray-300 text-sm">
                    Nativamente, não dá. Mas você pode adicionar o mod <strong>"SkinRestorer"</strong> ou <strong>"Fabric Tailor"</strong> na sua instância. Eles permitem que você use o comando <code>/skin url</code> dentro do jogo para carregar qualquer skin da internet.
                </p>
            </div>

            <div class="bg-gray-900/40 p-5 rounded-lg">
                <h5 class="text-white font-bold text-md mb-2">❓ O TLauncher pode roubar minha conta Bancária?</h5>
                <p class="text-gray-300 text-sm">
                    Diretamente? Improvável. Indiretamente? Possível. Se o malware capturar suas senhas salvas no navegador ou monitorar seu teclado (keylogger), qualquer conta acessada no PC comprometido está em risco. Por precaução, após a limpeza, mude senhas importantes.
                </p>
            </div>

            <div class="bg-gray-900/40 p-5 rounded-lg">
                <h5 class="text-white font-bold text-md mb-2">❓ O que é o "TLauncher para Smartphones"?</h5>
                <p class="text-gray-300 text-sm">
                    O app de mobile (PE/Bedrock) geralmente é apenas um agregador de mods e skins cheio de anúncios. Não recomendamos. Use o app oficial ou buscadores de mods confiáveis como o Modrinth/CurseForge na web.
                </p>
            </div>
        </div>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/minecraft-lento-como-ganhar-fps",
            title: "Guia: Minecraft a 300 FPS",
            description: "O tutorial definitivo de otimização com Sodium, Lithium e EntityCulling."
        },
        {
            href: "/guias/remocao-virus-malware",
            title: "Guia: Remoção de Vírus",
            description: "Aprenda a usar TronScript e ferramentas profissionais de limpeza."
        },
        {
            href: "/guias/melhor-dns-jogos-2026",
            title: "Guia: Reduzir Ping (DNS)",
            description: "Melhore sua conexão com servidores internacionais."
        },
        {
            href: "/guias/java-instalacao-correta-minecraft",
            title: "Guia: Java para Minecraft",
            description: "Qual versão do Java (8, 16, 17, 21) usar para cada versão do jogo?"
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="45 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
