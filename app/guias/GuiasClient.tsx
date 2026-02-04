'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '@/components/AdSenseBanner';
import { motion } from 'framer-motion';
import {
  Monitor,
  Shield,
  Cpu,
  Wifi,
  Clock,
  ArrowRight,
  Search,
  BookOpen,
  Zap,
  LayoutGrid,
  Headphones,
  Gamepad,
  Crosshair,
  AlertTriangle
} from 'lucide-react';

interface GuideCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  guides: Guide[];
}

interface Guide {
  slug: string;
  title: string;
  description: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  time: string;
  isNew?: boolean;
}

export default function GuiasClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const guideCategories: GuideCategory[] = [
    {
      id: 'otimizacao',
      title: 'Otimização & FPS',
      description: 'Aumente o desempenho em jogos competitivos',
      icon: Zap,
      color: '#FFB800',
      guides: [
        { slug: 'aceleracao-hardware-gpu-agendamento', title: 'Agendamento de GPU Acelerado por Hardware (HAGS): Guia Completo 2026', description: 'Aprenda TUDO sobre Hardware-Accelerated GPU Scheduling (HAGS) no Windows 11: como ativar, ganhos reais de FPS, redução de input lag, compatibilidade c...', difficulty: 'Iniciante', time: '35 min' },
        { slug: 'bitlocker-desempenho-jogos-ssd', title: 'BitLocker consome FPS? Impacto em SSDs e Jogos (2026)', description: 'Descubra se a criptografia BitLocker diminui o desempenho do seu SSD e causa quedas de FPS nos seus jogos no Windows 11 em 2026.', difficulty: 'Intermediário', time: '40 min' },
        { slug: 'cs2-melhores-comandos-console-fps', title: 'CS2: Melhores Comandos de Console para FPS (Guia 2026)', description: 'Quer rodar Counter-Strike 2 mais liso? Aprenda os comandos de console e de inicialização para ganhar FPS e reduzir o lag no CS2 em 2026.', difficulty: 'Fácil', time: '10 min' },
        { slug: 'cyberpunk-2077-hdd-mode-otimizacao', title: 'Cyberpunk 2077: Otimização HDD Mode e FPS no Windows 11 (2026)', description: 'Sofrendo com travadas no Cyberpunk 2077? Aprenda a configurar o HDD Mode, DLSS 3.5 e como ganhar frames em Night City em 2026.', difficulty: 'Médio', time: '25 min' },
        { slug: 'discord-otimizar-para-jogos', title: 'Como Otimizar o Discord para Jogos Online (2026)', description: 'O Discord está causando lag nos seus jogos? Aprenda a configurar a aceleração de hardware e a sobreposição para ganhar FPS em 2026.', difficulty: 'Fácil', time: '10 min' },
        { slug: 'euro-truck-simulator-2-otimizacao', title: 'Euro Truck Simulator 2: Melhores Configurações de FPS (2026)', description: 'O ETS2 está travando em cidades grandes? Aprenda como otimizar o Euro Truck Simulator 2 para rodar liso no seu PC em 2026.', difficulty: 'Médio', time: '15 min' },
        { slug: 'gta-v-otimizar-fps-pc-fraco', title: 'GTA V: Melhores Configurações para PC Fraco (Dicas de FPS)', description: 'Seu GTA V trava muito ou roda em câmera lenta? Aprenda as configurações gráficas secretas para ganhar FPS e rodar o jogo fluido em qualquer PC em 2026...', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'hdr-windows-vale-a-pena-jogos', title: 'HDR no Windows: Vale a pena ativar em Jogos? (2026)', description: 'Quer cores mais vibrantes e sombras realistas? Aprenda como configurar o HDR no Windows 11 corretamente e saiba se o seu monitor suporta de verdade.', difficulty: 'Média', time: '15 min' },
        { slug: 'hyper-v-desempenho-jogos', title: 'Hyper-V: Ativar ou Desativar para ganhar Performance em Jogos?', description: 'Descubra se o Hyper-V (VBS) está roubando seus frames! Aprenda como funciona a virtualização do Windows e saiba quando desativar para ganhar FPS em 20...', difficulty: 'Média', time: '15 min' },
        { slug: 'jogos-android-no-pc-melhores-emuladores', title: 'Melhores Emuladores Android para PC em 2026: Qual escolher?', description: 'Quer jogar games de celular no computador? Comparamos os melhores emuladores de Android (BlueStacks, LDPlayer, MEmu e MSI) para te ajudar a escolher o...', difficulty: 'Fácil', time: '20 min' },
        { slug: 'league-of-legends-fps-drop-fix', title: 'League of Legends: Como resolver quedas de FPS e Travadas (2026)', description: 'Seu LoL está travando em lutas de equipe (Teamfights)? Aprenda as melhores configurações para ganhar FPS e remover o lag no League of Legends em 2026.', difficulty: 'Fácil', time: '15 min' },
        { slug: 'limitar-fps-rivatuner-nvidia', title: 'Como Limitar o FPS com RivaTuner e NVIDIA (Frametime Perfeito)', description: 'Quer acabar com o stuttering e ter uma imagem fluida? Aprenda a limitar o seu FPS usando o RivaTuner (RTSS) e o Painel de Controle da NVIDIA em 2026.', difficulty: 'Intermediário', time: '10 min' },
        { slug: 'lineage-2-otimizar-pvp-fps', title: 'Lineage 2: Como aumentar o FPS em PVP e Cidades (2026)', description: 'Sofrendo com 10 FPS nas cidades do Lineage 2? Aprenda a otimizar o motor antigo do L2 para rodar fluido em Mass PVPs e Cercos de Castelo.', difficulty: 'Média', time: '20 min' },
        { slug: 'melhor-dns-jogos-2026', title: 'Melhor DNS para Jogos em 2026: Google, Cloudflare ou Level3?', description: 'Cansado de lag e perda de pacotes? Descubra qual o melhor DNS para reduzir seu ping e estabilizar a conexão em jogos competitivos no Windows em 2026.', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'melhor-dns-para-jogos-google-vs-cloudflare', title: 'Qual o Melhor DNS para Jogos? Google (8.8.8.8) vs Cloudflare (1.1.1.1) (2026)', description: 'Mudar o DNS diminui o ping? Testamos os principais servidores DNS do mundo para descobrir qual resolve rotas mais rápido e melhora a conexão.', difficulty: 'Intermediário', time: '10 min' },
        { slug: 'micro-stuttering-em-jogos-causas', title: 'Micro-Stuttering em Jogos: O que é e como acabar com ele', description: 'Seu jogo marca FPS alto mas parece travado? Aprenda a identificar o Micro-Stuttering e saiba como estabilizar o Frametime para uma fluidez perfeita em...', difficulty: 'Intermediário', time: '20 min' },
        { slug: 'minecraft-aumentar-fps-fabric-sodium', title: 'Minecraft: Como aumentar o FPS com Fabric e Sodium (2026)', description: 'O OptiFine não é mais o rei. Aprenda a instalar o Sodium e o Iris Shader para ter o Minecraft mais fluido e bonito do mundo em 2026.', difficulty: 'Intermediário', time: '20 min' },
        { slug: 'minecraft-lento-como-ganhar-fps', title: 'Minecraft Lento: Como ganhar FPS em qualquer PC em 2026', description: 'Seu Minecraft está rodando como um slide? Aprenda a otimizar o Windows e o Java para rodar o Minecraft liso, mesmo em computadores e notebooks antigos...', difficulty: 'Fácil', time: '15 min' },
        { slug: 'modo-de-jogo-windows-atikvar-ou-nao', title: 'Modo de Jogo do Windows 11: Ativar ou Desativar? (2026)', description: 'Você ganha ou perde FPS com o Modo de Jogo ativado? Descubra como essa função do Windows 11 prioriza seu processador e placa de vídeo em 2026.', difficulty: 'Fácil', time: '5 min' },
        { slug: 'monitor-ips-vs-va-vs-tn-jogos', title: 'Painéis de Monitor: IPS vs VA vs TN (Qual o melhor em 2026?)', description: 'Entenda de uma vez por todas as diferenças entre monitores IPS, VA e TN. Saiba qual painel escolher para jogar, trabalhar ou assistir filmes em 2026.', difficulty: 'Iniciante', time: '15 min' },
        { slug: 'otimizacao-jogos-pc', title: 'Guia de Otimização Extrema para Jogos (FPS Boost 2025)', description: 'Aprenda a configurar Windows, NVIDIA/AMD e hardware para extrair cada gota de performance, reduzir input lag e estabilizar o frametime.', difficulty: 'Intermediário', time: '35 min' },
        { slug: 'otimizacao-performance', title: 'Otimização de Performance: Como deixar seu PC voando em 2026', description: 'Seu Windows está lento? Aprenda as melhores técnicas de otimização de sistema para reduzir o uso de RAM e CPU e ter a máxima performance em jogos e tr...', difficulty: 'Fácil', time: '15 min' },
        { slug: 'otimizacao-registro', title: 'Guia Completo de Otimização do Registro do Windows', description: 'Limpe e otimize o registro do Windows para melhor performance. Técnicas seguras de manutenção preventiva do sistema.', difficulty: 'Intermediário', time: '50 minutos' },
        { slug: 'otimizacao-ssd-windows-11', title: 'Otimização de SSD no Windows 11 para Máxima Performance (2026)', description: 'Seu SSD pode ser mais rápido! Aprenda a configurar o TRIM, desativar indexação e otimizar o Windows 11 para extrair cada MB/s do seu NVMe em 2026.', difficulty: 'Fácil', time: '15 min' },
        { slug: 'overclock-gpu-msi-afterburner', title: 'Overclock de GPU com MSI Afterburner: Guia Seguro (2026)', description: 'Quer ganhar FPS extra de graça? Aprenda como usar o MSI Afterburner para fazer overclock na sua placa de vídeo com segurança total em 2026.', difficulty: 'Intermediário', time: '40 min' },
        { slug: 'project-zomboid-fps-boost', title: 'Project Zomboid: Como aumentar o FPS e alocar mais RAM (2026)', description: 'Sofrendo com lag no Project Zomboid? Aprenda a alocar mais memória RAM e configurar os gráficos para rodar hordas gigantes sem travar em 2026.', difficulty: 'Médio', time: '15 min' },
        { slug: 'qual-melhor-windows-para-jogos', title: 'Qual o melhor Windows para Jogos em 2026? (Comparativo)', description: 'Windows 10, Windows 11 ou Versões Modificadas (Lite)? Descubra qual sistema operacional entrega o melhor FPS e estabilidade em 2026.', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'reduzir-ping-jogos-online', title: 'Como Reduzir o Ping nos Jogos Online: Guia Definitivo 2026', description: 'Cansado de morrer por causa do lag? Aprenda as técnicas reais para diminuir o ping e estabilizar a conexão nos seus jogos favoritos em 2026.', difficulty: 'Iniciante', time: '15 min' },
        { slug: 'reduzir-ping-regedit-cmd-jogos', title: 'Ajustes de Registro (Regedit) para Reduzir o Ping (2026)', description: 'Quer o menor atraso possível? Aprenda a modificar o Registro do Windows e usar comandos CMD para otimizar o TCP/IP e ganhar vantagem nos jogos em 2026...', difficulty: 'Alta', time: '30 min' },
        { slug: 'roblox-fps-unlocker-tutorial', title: 'Roblox FPS Unlocker: Como jogar acima de 60 FPS (2026)', description: 'Cansado de jogar Roblox travado em 60 FPS? Aprenda como usar o FPS Unlocker e as novas funções nativas do Roblox para ter mais fluidez em 2026.', difficulty: 'Fácil', time: '10 min' },
        { slug: 'ssd-nvme-vs-sata-jogos', title: 'SSD NVMe vs SATA: Qual a real diferença em Jogos? (2026)', description: '3500MB/s vs 550MB/s. O NVMe M.2 realmente carrega jogos mais rápido que o SSD SATA comum? Veja comparativos de load time e DirectStorage em 2026.', difficulty: 'Médio (Instalação física)', time: '15 min' },
        { slug: 'unpark-cpu-cores-performance-jogos', title: 'CPU Core Parking: Como desativar para ganhar FPS (2026)', description: 'Seu processador está \'dormindo\' enquanto você joga? Aprenda como desativar o Core Parking no Windows 11 e estabilizar seus frames em 2026.', difficulty: 'Fácil', time: '15 min' },
        { slug: 'vpn-vale-a-pena-jogos', title: 'VPN para Jogos: Vale a pena ou aumenta o Lag? (2026)', description: 'Será que usar VPN realmente diminui o ping nos jogos online? Descubra a verdade sobre VPNs de games e quando elas são úteis em 2026.', difficulty: 'Iniciante', time: '15 min' },
        { slug: 'xbox-app-nao-baixa-jogos-gamepass', title: 'Xbox App não baixa jogos? Como resolver (Guia 2026)', description: 'Seu download no Xbox Game Pass travou em 0% ou dá erro? Aprenda como resetar os Serviços de Jogos e baixar tudo normalmente em 2026.', difficulty: 'Médio', time: '20 min' },
      ]
    },
    {
      id: 'games-fix',
      title: 'Correção de Jogos',
      description: 'Resolva bugs em GTA V, Minecraft, Roblox e mais',
      icon: Gamepad,
      color: '#FF4B6B',
      guides: [
        { slug: 'cod-warzone-melhores-configuracoes-graficas', title: 'COD Warzone: Melhores Configurações de FPS e Visibilidade (2026)', description: 'Quer ganhar vantagem no Warzone? Aprenda as configurações gráficas para 2026 que aumentam o FPS e permitem ver inimigos nas sombras sem travar.', difficulty: 'Médio', time: '20 min' },
        { slug: 'dx11-feature-level-10.0-error-valorant', title: 'Erro DX11 Feature Level 10.0 no Valorant: Como Resolver (2026)', description: 'Seu Valorant não abre com erro de Feature Level 10.0? Aprenda como corrigir erros de DirectX e rodar o jogo no Windows 11 em 2026.', difficulty: 'Médio', time: '15 min' },
        { slug: 'eld-ring-stuttering-fix-dx12', title: 'Elden Ring: Como corrigir Stuttering e Travadas (DX12 Fix 2026)', description: 'Sofrendo com lentidão nas Terras Intermédias? Aprenda a corrigir o stuttering do Elden Ring no DirectX 12 e ganhar estabilidade em 2026.', difficulty: 'Médio', time: '20 min' },
        { slug: 'epic-games-launcher-lento-cpu-fix', title: 'Epic Games Launcher Lento ou Pesando na CPU? Como Fix (2026)', description: 'O launcher da Epic Games está travando seu PC ou consumindo muita CPU em repouso? Aprenda como otimizar o Epic Launcher no Windows 11 em 2026.', difficulty: 'Fácil', time: '10 min' },
        { slug: 'erro-0xc00007b-aplicativo-nao-inicializou', title: 'Como Resolver Erro 0xc00007b: Guia Definitivo (2026)', description: 'Seu jogo ou programa não abre e mostra erro 0xc00007b \'O aplicativo não pôde ser inicializado corretamente\'? Aprenda as 7 soluções definitivas para co...', difficulty: 'Médio', time: '20 min' },
        { slug: 'erro-disco-100-porcento-gerenciador-tarefas', title: 'Como Resolver Erro de Disco 100% no Windows 11 (2026)', description: 'Seu PC está lento e travando com o Disco em 100% no Gerenciador de Tarefas? Aprenda como resolver esse erro de performance em 2026.', difficulty: 'Médio', time: '20 min' },
        { slug: 'fortnite-modo-performance-pc-fraco', title: 'Fortnite Modo Performance: Como ganhar FPS em 2026', description: 'Quer rodar Fortnite a 240 FPS ou em um PC fraco? Aprenda como configurar o Modo Desempenho e otimizar o Windows 11 para o jogo em 2026.', difficulty: 'Fácil', time: '15 min' },
        { slug: 'fortnite-texturas-nao-carregam-streaming', title: 'Fortnite: Texturas não carregam? Veja como resolver (2026)', description: 'Seu Fortnite está com construções invisíveis ou texturas borradas? Aprenda como forçar o carregamento de texturas no guia de 2026.', difficulty: 'Fácil', time: '15 min' },
        { slug: 'genshin-impact-stuttering-fix-pc', title: 'Genshin Impact travando ou com Stuttering? Como resolver no PC', description: 'Seu Genshin Impact sofre com quedas de FPS ao trocar de personagem ou explorar o mapa? Aprenda a otimizar o cache de shaders e as configurações gráfic...', difficulty: 'Fácil', time: '15 min' },
        { slug: 'god-of-war-pc-memory-leak-fix', title: 'God of War PC: Erro de Memória Cheia e Memory Leak Fix', description: 'Seu God of War no PC trava após algumas horas de jogo? Aprenda a corrigir o erro de \'Memória Insuficiente\' e o vazamento de memória (Memory Leak).', difficulty: 'Média', time: '20 min' },
        { slug: 'gta-iv-complete-edition-lag-fix', title: 'GTA IV: Como resolver o Lag e Stuttering (Complete Edition 2026)', description: 'O GTA 4 roda mal no seu PC potente? Aprenda a usar o DXVK e o FusionFix para transformar o port mal otimizado em um jogo fluido e moderno.', difficulty: 'Média', time: '30 min' },
        { slug: 'gta-iv-fix-windows-10-11', title: 'GTA IV Fix: Como rodar liso no Windows 10 e 11 (2026)', description: 'O GTA IV para PC é famoso por ser mal otimizado. Aprenda a instalar o DXVK, FusionFix e corrigir o lag e erros de câmera no Windows moderno.', difficulty: 'Média', time: '20 min' },
        { slug: 'gta-san-andreas-correcao-grafica', title: 'GTA San Andreas: Como corrigir Gráficos e Bugs no Windows 10 e 11', description: 'O GTA San Andreas clássico está bugado no seu PC moderno? Aprenda a instalar o SilentPatch, Widescreen Fix e SkyGfx para ter a melhor experiência defi...', difficulty: 'Média (Modding)', time: '30 min' },
        { slug: 'gta-v-err-gfx-d3d-init-crash', title: 'GTA V: Erro ERR_GFX_D3D_INIT (Como Resolver em 2026)', description: 'Seu GTA V trava com a mensagem \'ERR_GFX_D3D_INIT\'? Aprenda a corrigir este erro clássico resetando o DirectX e limpando os arquivos do jogo.', difficulty: 'Fácil', time: '15 min' },
        { slug: 'gta-v-fix-texturas-sumindo', title: 'GTA V: Como resolver Texturas Sumindo ou Demorando para Carregar', description: 'Seu mapa do GTA V fica invisível ou as texturas demoram a aparecer? Aprenda a resolver o bug de carregamento de assets em 2026 no PC.', difficulty: 'Fácil', time: '10 min' },
        { slug: 'hard-reset-fones-bluetooth-fix', title: 'Fone Bluetooth só funciona um lado? Como fazer Hard Reset', description: 'Seu fone TWS parou de parear ou só sai som de um lado? Aprenda a resetar fones Xiaomi, JBL, Lenovo e QCY para voltarem ao padrão de fábrica.', difficulty: 'Fácil', time: '15 min' },
        { slug: 'hollow-knight-stuttering-fix-mod', title: 'Hollow Knight: Como remover o Stuttering e Micro-travadas', description: 'Sofrendo com pequenas travadas no Hollow Knight mesmo em um PC potente? Aprenda a configurar o V-Sync e usar mods para uma jogabilidade fluida em 2026...', difficulty: 'Fácil', time: '15 min' },
        { slug: 'is-valorant-dying-state-of-game', title: 'O Valorant está morrendo? Uma análise do estado do jogo em 2026', description: 'Será que o Valorant ainda vale a pena? Analisamos os números de jogadores, atualizações de agentes e o cenário competitivo para saber se o jogo da Rio...', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'league-of-legends-tela-preta-carregamento', title: 'LoL: Como resolver a Tela Preta no Carregamento em 2026', description: 'Seu League of Legends fica com a tela preta após a seleção de campeão? Aprenda a corrigir este erro de conexão e firewall para não perder mais PDL.', difficulty: 'Fácil', time: '10 min' },
        { slug: 'minecraft-alocar-mais-ram', title: 'Como Alocar mais Memória RAM no Minecraft (Launcher Original e TLauncher)', description: 'Seu Minecraft está travando ou dando erro de \'Out of Memory\'? Aprenda a alocar mais RAM para o jogo e melhore o carregamento de chunks em 2026.', difficulty: 'Fácil', time: '10 min' },
        { slug: 'minecraft-lag-fix-optifine-fabric', title: 'Minecraft Lag Fix: OptiFine vs Fabric (Sodium) em 2026', description: 'Seu Minecraft está travando? Aprenda a instalar o OptiFine ou o Fabric com Sodium para ganhar muito FPS e rodar Shaders mesmo em PC fraco.', difficulty: 'Fácil', time: '15 min' },
        { slug: 'minecraft-optifine-vs-sodium-fabric', title: 'Sodium vs OptiFine: Qual o melhor para o Minecraft em 2026?', description: 'Ainda usa OptiFine? Descubra por que o Sodium se tornou o padrão para performance no Minecraft e compare os recursos de Shaders entre as duas platafor...', difficulty: 'Médio', time: '20 min' },
        { slug: 'montagem-pc-gamer-erros-comuns', title: 'Montagem de PC Gamer: Os 7 erros que podem queimar tudo', description: 'Vai montar seu primeiro PC? Evite os erros fatais como esquecer o espelho da placa-mãe, ligar cabos errado ou usar a fonte de cabeça para baixo.', difficulty: 'Alta', time: '1 hora' },
        { slug: 'mouse-clique-duplo-falhando-fix', title: 'Mouse com Clique Duplo ou Falhando? Como consertar sem gastar', description: 'Seu mouse está clicando sozinho ou falhando ao arrastar? Aprenda a resolver problemas de \'Double Click\' com software e limpeza física simples.', difficulty: 'Fácil a Média', time: '20 min' },
        { slug: 'perda-de-pacote-packet-loss-fix', title: 'Perda de Pacote (Packet Loss): Como diagnosticar e resolver (2026)', description: 'Seu personagem está \'teletransportando\' ou o jogo trava do nada? Aprenda a resolver a Perda de Pacote e estabilize sua conexão para jogos em 2026.', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'pubg-steam-fix-stuttering-travadas', title: 'PUBG na Steam: Como resolver Travadas e Stuttering (2026)', description: 'Seu PUBG trava na hora da troca de tiro? Aprenda as melhores configurações gráficas e de sistema para rodar PUBG liso na Steam em 2026.', difficulty: 'Médio', time: '20 min' },
        { slug: 'resolver-erros-windows', title: 'Guia resolver-erros-windows', description: 'Descrição não disponível', difficulty: 'Intermediário', time: '20 minutos' },
        { slug: 'roblox-fix-erro-conexao', title: 'Roblox: Como resolver Erro de Conexão (ID 277 / 279)', description: 'Sua partida de Roblox caiu? Aprenda a resolver os erros de conexão 277, 279 e outros problemas de ping no Roblox em 2026.', difficulty: 'Fácil', time: '10 min' },
        { slug: 'roblox-tela-branca-travada-fix', title: 'Roblox Tela Branca: Como resolver o erro de inicialização (2026)', description: 'Seu Roblox abre mas fica travado em uma tela branca ou cinza? Aprenda a resolver problemas de renderização e compatibilidade no Roblox em 2026.', difficulty: 'Iniciante', time: '15 min' },
        { slug: 'stardew-valley-mods-lag-fix', title: 'Stardew Valley com Lag? Como otimizar Mods e o SMAPI (2026)', description: 'Seu Stardew Valley demora para abrir ou trava com muitos mods? Aprenda a otimizar o SMAPI e as configurações de vídeo para uma fazenda sem lag.', difficulty: 'Fácil', time: '20 min' },
        { slug: 'steam-tarda-baixar-lento-fix', title: 'Download Lento na Steam? Como Acelerar ao Máximo sua Conexão (2026)', description: 'Sua internet é de 500 Mega mas a Steam baixa a 2MB/s? O problema pode ser a \'Região de Download\' ou o cache corrompido. Veja como resolver.', difficulty: 'Intermediário', time: '5 min' },
        { slug: 'teclado-notebook-parou-fix', title: 'Teclado do Notebook Parou: Como resolver (Guia 2026)', description: 'Metade do seu teclado não funciona ou ele parou totalmente? Aprenda a diagnosticar problemas de driver, sujeira e hardware no seu notebook em 2026.', difficulty: 'Intermediária', time: '20 min' },
        { slug: 'tela-azul-memory-management-fix', title: 'Tela Azul MEMORY_MANAGEMENT: Como resolver (2026)', description: 'Seu Windows 11 trava com o erro MEMORY MANAGEMENT? Aprenda a testar sua RAM e corrigir erros de sistema para acabar com esse BSOD em 2026.', difficulty: 'Intermediário', time: '35 min' },
        { slug: 'terraria-tmodloader-64bit-fix', title: 'tModLoader 64-bit: Como rodar Terraria com muitos Mods (2026)', description: 'Seu Terraria trava por falta de memória ao usar mods? Aprenda como instalar e configurar o tModLoader 64-bit para usar toda a sua RAM em 2026.', difficulty: 'Média', time: '20 min' },
        { slug: 'valorant-fix-van-9003-secure-boot', title: 'Valorant VAN 9003: Como ativar Secure Boot e TPM (2026)', description: 'Seu Valorant não abre por causa do erro VAN 9003? Aprenda como ativar o Secure Boot e o TPM 2.0 na BIOS para jogar no Windows 11 em 2026.', difficulty: 'Intermediário', time: '25 min' },
        { slug: 'valorant-reduzir-input-lag', title: 'Como Reduzir o Input Lag no Valorant: Guia Completo (2026)', description: 'Sente o mouse pesado no Valorant? Aprenda como reduzir o input lag, configurar o NVIDIA Reflex e otimizar o Windows 11 para máxima resposta em 2026.', difficulty: 'Fácil', time: '15 min' },
        { slug: 'valorant-van-9003-secure-boot-tpm-fix', title: 'Valorant VAN 9003 e TPM 2.0: Guia por Placa-Mãe (2026)', description: 'Saiba como ativar o TPM 2.0 e o Secure Boot em placas ASUS, Gigabyte, MSI e ASRock para resolver o erro VAN 9003 do Valorant em 2026.', difficulty: 'Intermediária', time: '20 min' },
        { slug: 'webcam-piscando-tela-preta-fix', title: 'Webcam Piscando ou com Tela Preta: Como resolver (2026)', description: 'Sua webcam trava, fica preta ou fica piscando durante reuniões? Aprenda a resolver problemas de driver e privacidade no Windows 11 em 2026.', difficulty: 'Fácil', time: '10 min' },
        { slug: 'windows-update-corrigir-erros', title: 'Erro no Windows Update: Como destravar e corrigir (2026)', description: 'Seu Windows Update não baixa atualizações ou trava em uma porcentagem? Aprenda como resetar os serviços de atualização no Windows 11 em 2026.', difficulty: 'Médio', time: '25 min' },
        { slug: 'zonas-mortas-analogico-controle-fix', title: 'Drift no Controle? Como configurar Zonas Mortas (Deadzone) no PC', description: 'Seu personagem anda sozinho ou a câmera mexe sem você tocar no controle? Aprenda a configurar zonas mortas no Windows e na Steam para corrigir o Drift...', difficulty: 'Fácil', time: '15 min' },
      ]
    },
    {
      id: 'windows-erros',
      title: 'Erros do Windows',
      description: 'Solução para telas azuis, DLLs e crashes',
      icon: AlertTriangle,
      color: '#E11D48',
      guides: [
        { slug: 'como-resolver-tela-azul', title: 'Tela Azul no Windows 11: Como Resolver (Guia Completo 2026)', description: 'Seu PC travou na tela azul (BSOD)? Aprenda como identificar os códigos de erro, usar o BlueScreenView, corrigir drivers e resolver travamentos permane...', difficulty: 'Médio', time: '30 min' },
        { slug: 'corrigir-dll-faltando-vcredist-directx', title: 'Como Corrigir DLL Faltando: VCRedist e DirectX (Guia 2026)', description: 'Seu jogo não abre por falta de .dll? Aprenda a instalar corretamente o Visual C++ Redistributable e o DirectX para rodar qualquer jogo em 2026.', difficulty: 'Fácil', time: '15 min' },
        { slug: 'usb-nao-reconhecido-reset-drivers', title: 'Dispositivo USB não reconhecido: Como resolver (2026)', description: 'Seu pendrive, mouse ou teclado parou de funcionar e o Windows diz \'Dispositivo USB Desconhecido\'? Aprenda a resetar os drivers em 2026.', difficulty: 'Médio', time: '15 min' },
        { slug: 'vcruntime140-dll-nao-encontrado', title: 'VCRUNTIME140.dll não encontrado: Como resolver (2026)', description: 'Seu jogo ou programa não abre e diz que falta o VCRUNTIME140.dll ou MSVCP140.dll? Aprenda como instalar os redistribuíveis oficiais em 2026.', difficulty: 'Fácil', time: '10 min' },
      ]
    },
    {
      id: 'hardware',
      title: 'Hardware & Montagem',
      description: 'Escolha peças e monte seu PC',
      icon: Cpu,
      color: '#8B31FF',
      guides: [
        { slug: 'atualizar-bios-seguro', title: 'Como Atualizar a BIOS com Segurança em 2026: Guia Completo e Definitivo', description: 'Tem medo de atualizar a BIOS? Aprenda como fazer o update da placa-mãe de forma segura, o que é Q-Flash, M-Flash, BIOS Flashback, como evitar riscos d...', difficulty: 'Avançado', time: '45 min' },
        { slug: 'diagnostico-hardware', title: 'Diagnóstico de Hardware: Como testar as peças do PC (2026)', description: 'Seu PC está travando ou não liga? Aprenda a fazer um diagnóstico de hardware para testar Memória, SSD, Placa de Vídeo e Processador em 2026.', difficulty: 'Médio', time: '45 min' },
        { slug: 'guia-montagem-pc', title: 'Guia Passo a Passo de Montagem de PC Gamer/Workstation', description: 'Monte seu próprio computador com confiança. Tutorial detalhado cobrindo desde a instalação da CPU até o gerenciamento de cabos e primeiro boot.', difficulty: 'Intermediário', time: '15-20 min' },
        { slug: 'hds-vs-ssd-qual-a-diferenca', title: 'HD vs SSD: Qual a diferença e qual escolher em 2026?', description: 'Ainda vale a pena comprar um HD? Entenda as diferenças de velocidade entre HD, SSD SATA e NVMe e como escolher o melhor para o seu PC Gamer.', difficulty: 'Intermediário', time: '20 min' },
        { slug: 'limpar-memoria-ram-windows', title: 'Como Limpar Memória RAM no Windows 10 e 11 (Sem programas)', description: 'Seu PC está ficando lento com muitas abas abertas? Aprenda a liberar memória RAM de forma segura usando comandos nativos e o ISLC em 2026.', difficulty: 'Fácil', time: '10 min' },
        { slug: 'monitorar-temperatura-pc', title: 'Como Monitorar a Temperatura do PC e Notebook (Guia 2026)', description: 'Seu PC está esquentando demais? Aprenda a monitorar as temperaturas da CPU e GPU, entenda os limites seguros e saiba quando é hora de limpar em 2026.', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'overclock-processador', title: 'Overclock de Processador (CPU): Vale a pena em 2026?', description: 'Aprenda como aumentar a frequência do seu processador Intel ou AMD com segurança. Guia sobre multiplicadores, voltagem e resfriamento em 2026.', difficulty: 'Avançado', time: '60 min' },
        { slug: 'ssd-vs-hd-qual-melhor', title: 'SSD vs HD em 2026: Qual a melhor escolha para o seu PC?', description: 'Ainda vale a pena comprar um Hard Drive (HD)? Veja o comparativo definitivo entre SSD e HD em performance, preço e durabilidade em 2026.', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'ssd-vs-hdd-guia', title: 'SSD vs HDD: Guia Definitivo de Armazenamento', description: 'Entenda as tecnologias, saiba quando usar cada um e aprenda a migrar seu sistema para voar baixo com NVMe.', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'substituicao-ssd', title: 'Como Instalar um SSD e Clonar o Windows (Guia 2026)', description: 'Vai trocar seu HD por um SSD ou fazer upgrade de NVMe? Aprenda como instalar fisicamente e clonar seu Windows sem perder nenhum arquivo em 2026.', difficulty: 'Médio', time: '40 min' },
        { slug: 'testar-fonte-pc-multimetro', title: 'Como Testar Fonte de PC com Multímetro (Guia 2026)', description: 'Seu PC não liga ou desliga do nada? Aprenda como testar as voltagens da sua fonte de alimentação usando um multímetro de forma segura em 2026.', difficulty: 'Alta (Requer cuidado elétrico)', time: '30 min' },
        { slug: 'undervolt-cpu-notebook', title: 'Undervolt de CPU em Notebook: Como reduzir o calor (2026)', description: 'Seu notebook ferve enquanto você joga? Aprenda como fazer undervolt na CPU para reduzir a temperatura em até 10°C sem perder performance em 2026.', difficulty: 'Alta (Requer testes de estabilidade)', time: '45 min' },
        { slug: 'upgrade-memoria-ram', title: 'Upgrade de Memória RAM: Guia de Compatibilidade (2026)', description: 'Quer colocar mais RAM no seu PC ou Notebook? Aprenda como escolher a frequência correta, DDR4 vs DDR5 e como ativar o Dual Channel em 2026.', difficulty: 'Média (Requer abrir o gabinete)', time: '20 min' },
        { slug: 'verificar-saude-hd-ssd-crystaldiskinfo', title: 'Como verificar a Saúde do HD e SSD: CrystalDiskInfo (2026)', description: 'Seu PC está travando ou arquivos sumindo? Aprenda a usar o CrystalDiskInfo para prever falhas no seu HD ou SSD em 2026.', difficulty: 'Fácil', time: '15 min' },
      ]
    },
    {
      id: 'perifericos',
      title: 'Periféricos & Setup',
      description: 'Monitores, mouses e organização',
      icon: Headphones,
      color: '#31A8FF',
      guides: [
        { slug: 'cable-management-organizacao-cabos-pc', title: 'Cable Management: Como organizar os cabos do PC (2026)', description: 'O interior do seu PC parece um ninho de pássaro? Aprenda técnicas de Cable Management para melhorar o visual e o airflow do seu setup em 2026.', difficulty: 'Médio', time: '1 hora' },
        { slug: 'cadeira-gamer-vs-escritorio-ergonomia', title: 'Cadeira Gamer vs Escritório: Qual a melhor para sua coluna? (2026)', description: 'Sofrendo com dor nas costas? Descubra as principais diferenças entre cadeiras gamer e ergonômicas de escritório e qual escolher em 2026.', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'calibrar-cores-monitor', title: 'Como Calibrar as Cores do Monitor em 2026 (Guia Completo)', description: 'Sente que as cores do seu monitor estão \'lavadas\' ou amareladas? Aprenda como calibrar o Windows 11 para ter cores reais e vibrantes em 2026.', difficulty: 'Fácil', time: '20 min' },
        { slug: 'guia-compra-monitores', title: 'Guia de Compra: Como escolher o melhor Monitor Gamer em 2026', description: 'IPS, VA, OLED ou TN? Painel curvo ou plano? Aprenda o que observar (Hertz, Tempo de Resposta e HDR) para não errar na compra do seu monitor.', difficulty: 'Intermediário', time: '25 min' },
        { slug: 'headset-7.1-real-vs-virtual-vale-a-pena', title: 'Headset 7.1 Virtual vs Real: Qual a diferença em 2026?', description: 'Vale a pena pagar mais caro por um headset 7.1? Descubra como funciona o som surround virtual e por que o som estéreo de qualidade ainda é o rei para ...', difficulty: 'Iniciante', time: '20 min' },
        { slug: 'monitoramento-sistema', title: 'Monitoramento de Sistema: Melhores Ferramentas para 2026', description: 'Saiba exatamente o que está acontecendo com o seu PC! Conheça as melhores ferramentas para monitorar FPS, uso de CPU, GPU e temperatura em tempo real.', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'mousepad-speed-vs-control', title: 'Mousepad Speed vs Control: Qual escolher para seu jogo? (2026)', description: 'Você sabia que o seu mousepad pode ser o motivo de você errar tantos tiros? Entenda a diferença entre tecidos Speed, Control e Híbridos em 2026.', difficulty: 'Intermediário', time: '10 min' },
        { slug: 'performance-monitor-v2', title: 'Como Medir a Performance do seu PC: Guia de Benchmarks 2026', description: 'Seu PC está rendendo o que deveria? Aprenda a usar o Cinebench, 3DMark e UserBenchmark para comparar seus resultados com outros usuários e detectar ga...', difficulty: 'Intermediária', time: '30 min' },
        { slug: 'problemas-mouse-gamer-sensor', title: 'Problemas no Sensor do Mouse: Como resolver a Mira \'Pulando\' (2026)', description: 'Seu mouse gamer está dando \'pixel skip\' ou a mira trava do nada? Aprenda a limpar o sensor e configurar o LOD e o Polling Rate em 2026.', difficulty: 'Iniciante', time: '15 min' },
        { slug: 'segundo-monitor-vertical-configurar', title: 'Como configurar um Segundo Monitor na Vertical (2026)', description: 'Quer mais produtividade ou facilitar a leitura do chat na stream? Aprenda como colocar seu segundo monitor na vertical no Windows 11 em 2026.', difficulty: 'Fácil', time: '5 min' },
        { slug: 'teclado-desconfigurado-abnt2-ansi', title: 'Teclado Desconfigurado: Como mudar para ABNT2 ou ANSI (2026)', description: 'Seu teclado está trocando o @ pelo \', difficulty: 'Iniciante', time: '5 min' },
        { slug: 'teclado-mecanico-vs-membrana-qual-o-melhor', title: 'Teclado Mecânico vs Membrana: Qual o melhor em 2026?', description: 'Ainda vale a pena comprar teclado de membrana? Comparamos durabilidade, velocidade e o custo-benefício dos teclados mecânicos em 2026.', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'teclados-mecanicos-guia', title: 'Teclados Mecânicos em 2026: O que saber antes de comprar', description: 'Quer entrar no mundo dos teclados mecânicos? Conheça as novas tecnologias de 2026, como Rapid Trigger, Hall Effect e teclados Hot-swappable.', difficulty: 'Fácil', time: '15 min' },
        { slug: 'teclados-mecanicos-switches-guia', title: 'Switches de Teclado Mecânico: Guia de Cores e Tipos (2026)', description: 'Blue, Red, Brown ou Silver? Aprenda a diferença entre todos os switches de teclado mecânico e escolha o ideal para o seu estilo em 2026.', difficulty: 'Intermediário', time: '20 min' },
      ]
    },
    {
      id: 'software',
      title: 'Software & Utils',
      description: 'Ferramentas essenciais e Windows',
      icon: LayoutGrid,
      color: '#31FF8B',
      guides: [
        { slug: 'atalhos-navegador-produtividade', title: 'Atalhos de Navegador: O Manual Completo de Produtividade 2026', description: 'Você ainda usa o mouse para fechar abas? Aprenda os 50+ atalhos essenciais de teclado para Chrome, Edge, Brave e Firefox que vão TRIPLICAR sua produti...', difficulty: 'Intermediário', time: '35 min' },
        { slug: 'atalhos-produtividade-windows', title: 'Atalhos do Windows: O Manual Completo de Produtividade 2026', description: 'Domine o Windows 11 com os 60+ atalhos de teclado mais úteis para produtividade. Aprenda a gerenciar janelas, áreas de trabalho virtuais, ferramentas ...', difficulty: 'Intermediário', time: '60 min' },
        { slug: 'aumentar-volume-microfone-windows', title: 'Microfone muito Baixo no Windows 11? Como Resolver (2026)', description: 'Seu time não te ouve no Discord? Aprenda a aumentar o volume do microfone, configurar o ganho (boost) e remover ruídos de fundo no Windows 11 em 2026.', difficulty: 'Iniciante', time: '10 min' },
        { slug: 'backup-automatico-nuvem', title: 'Backup Automático na Nuvem: Como configurar em 2026', description: 'Nunca mais perca seus arquivos! Aprenda como configurar o backup automático no Google Drive, OneDrive e iCloud no Windows 11 em 2026.', difficulty: 'Fácil', time: '20 min' },
        { slug: 'backup-dados', title: 'Guia Completo de Backup de Dados: A Regra 3-2-1 (2026)', description: 'Aprenda como fazer backup profissional dos seus dados com a regra 3-2-1. Tutorial completo sobre backup em HD externo, nuvem, imagem do sistema e prot...', difficulty: 'Médio', time: '60 min' },
        { slug: 'bloquear-internet-firewall-windows', title: 'Como Bloquear a Internet de um Programa no Windows (2026)', description: 'Quer impedir que um app se conecte à internet? Aprenda a usar o Firewall do Windows para bloquear o acesso de saída de programas e jogos em 2026.', difficulty: 'Médio', time: '10 min' },
        { slug: 'como-usar-obs-studio-gravar-tela', title: 'Como usar o OBS Studio para Gravar Tela (Tutorial Completo)', description: 'Quer gravar suas partidas ou tutoriais com qualidade profissional? Aprenda a configurar o OBS Studio para gravação de tela leve e sem lags em 2026.', difficulty: 'Média', time: '20 min' },
        { slug: 'criar-ponto-restauracao-windows', title: 'Como Criar um Ponto de Restauração no Windows 11 (2026)', description: 'Vai instalar um driver novo ou mexer no registro? Aprenda como criar um Ponto de Restauração para proteger seu Windows contra erros em 2026.', difficulty: 'Fácil', time: '5 min' },
        { slug: 'debloating-windows-11', title: 'Debloating Windows 11: Guia Definitivo 2026', description: 'O Windows 11 vem cheio de programas que você não usa. Aprenda a fazer o debloat completo usando scripts seguros e libere memória RAM e CPU para jogos ...', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'formatacao-windows', title: 'Como Formatar o Windows 11: Guia Completo Passo a Passo (2026)', description: 'Seu PC está lento, travando ou com vírus? Aprenda como formatar o Windows 11 do zero com instalação limpa via pendrive, particionamento correto e conf...', difficulty: 'Intermediário', time: '60 min' },
        { slug: 'god-mode-windows-11-ativar', title: 'God Mode no Windows 11: Como ativar o painel secreto', description: 'Quer ter acesso a todas as configurações do Windows em uma única pasta? Aprenda a ativar o famoso \'God Mode\' (Modo Deus) no Windows 11 e 10.', difficulty: 'Fácil', time: '5 min' },
        { slug: 'gravação-tela-windows-nativa-dicas', title: 'Como Gravar Tela no Windows sem instalar nada (2026)', description: 'Precisa gravar uma aula, tutorial ou gameplay rápida? Aprenda a usar a Ferramenta de Captura e a Xbox Game Bar nativas do Windows 10 e 11.', difficulty: 'Fácil', time: '10 min' },
        { slug: 'hard-reset-celular-formatar', title: 'Como fazer Hard Reset no Celular: Samsung, Motorola e Xiaomi', description: 'Esqueceu a senha do celular ou ele está travando? Aprenda a fazer o Hard Reset completo pelos botões físicos (Recovery Mode) com segurança.', difficulty: 'Média', time: '30 min' },
        { slug: 'instalacao-windows-11', title: 'Como Instalar o Windows 11: Guia Completo e Requisitos de TPM 2.0', description: 'Quer migrar para o Windows 11? Aprenda a verificar a compatibilidade, ativar o TPM 2.0 na BIOS e como fazer uma instalação limpa para máxima performan...', difficulty: 'Média', time: '45 min' },
        { slug: 'instalar-apps-android-windows-11', title: 'Como rodar Apps de Android no Windows 11 (Sem Emulador)', description: 'Quer usar Instagram, TikTok ou jogos de celular direto no Windows 11? Aprenda a configurar o Subsistema Windows para Android (WSA) e a Amazon Appstore...', difficulty: 'Média', time: '25 min' },
        { slug: 'limpeza-computador', title: 'Limpeza Completa do Computador', description: 'Técnicas profissionais para limpar arquivos temporários, cache, programas desnecessários e otimizar o espaço em disco do seu computador.', difficulty: 'Intermediário', time: '45 minutos' },
        { slug: 'limpeza-disco-profunda-arquivos-temporarios', title: 'Limpeza de Disco Profunda: Como liberar Gigabytes no Windows', description: 'Seu SSD está cheio? Aprenda a fazer uma limpeza profunda no Windows 11 para apagar arquivos temporários, sobras de atualizações e lixo do sistema.', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'limpeza-fisica-pc-gamer', title: 'Como Limpar seu PC Gamer Corretamente (Guia de Limpeza Física)', description: 'Seu PC está cheio de poeira? Aprenda a limpar as ventoinhas, a placa de vídeo e o gabinete com segurança, usando as ferramentas certas para não queima...', difficulty: 'Média', time: '45 min' },
        { slug: 'limpeza-navegadores', title: 'Como Limpar o Cache e Dados dos Navegadores (Chrome, Edge, Firefox)', description: 'Seu navegador está lento ou os sites não carregam direito? Aprenda a limpar o cache e os cookies sem perder suas senhas salvas.', difficulty: 'Fácil', time: '5 min' },
        { slug: 'notion-vs-obsidian-produtividade', title: 'Notion vs Obsidian: Qual o melhor para produtividade em 2026?', description: 'Buscando o segundo cérebro perfeito? Comparamos o Notion e o Obsidian para te ajudar a escolher entre a nuvem colaborativa ou as notas locais ultra rá...', difficulty: 'Fácil', time: '15 min' },
        { slug: 'obs-studio-melhores-configuracoes-stream-2026', title: 'OBS Studio: Melhores Configurações para Live Stream (2026)', description: 'Quer fazer Live na Twitch ou YouTube sem travar? Aprenda a configurar o bitrate, o codificador e a resolução do OBS Studio para uma transmissão profis...', difficulty: 'Média', time: '30 min' },
        { slug: 'pasta-windows-winsxs-gigante-como-limpar', title: 'Pasta WinSxS Gigante: Como limpar e ganhar espaço no Windows 11', description: 'Sua pasta Windows está ocupando muito espaço? Aprenda o que é a pasta WinSxS e qual a forma segura de diminuir seu tamanho sem estragar o sistema em 2...', difficulty: 'Média', time: '20 min' },
        { slug: 'pc-lento-formatar-vs-limpar', title: 'PC Lento: Formatar ou Limpar? Qual a melhor escolha em 2026?', description: 'Seu computador está demorando para ligar ou abrir programas? Descubra se uma limpeza de sistema resolve ou se chegou a hora de formatar seu PC com o g...', difficulty: 'Iniciante', time: '30 min' },
        { slug: 'pesquisar-arquivos-windows-mais-rapido', title: 'Como Pesquisar Arquivos no Windows Mais Rápido (2026)', description: 'A busca do Windows 11 é lenta? Aprenda como usar o Everything e otimizar a indexação para achar qualquer arquivo instantaneamente em 2026.', difficulty: 'Fácil', time: '10 min' },
        { slug: 'pos-instalacao-windows-11', title: 'Setup Pós-Instalação: O que instalar no Windows 11 em 2026', description: 'Acabou de formatar o PC? Veja a lista definitiva com os drivers e programas essenciais que não podem faltar no seu Windows 11 em 2026.', difficulty: 'Iniciante', time: '45 min' },
        { slug: 'privacidade-windows-telemetria', title: 'Privacidade no Windows 11: Como desativar a Telemetria (2026)', description: 'O Windows 11 coleta muitos dados? Aprenda como desativar a telemetria, anúncios e rastreamento da Microsoft para mais privacidade e performance em 202...', difficulty: 'Médio', time: '20 min' },
        { slug: 'programas-essenciais-windows', title: 'Programas Essenciais para Windows 11: O Pack Básico 2026', description: 'Acabou de formatar o PC? Confira a lista definitiva de softwares gratuitos e essenciais para produtividade, segurança e manutenção no Windows 11 em 20...', difficulty: 'Intermediário', time: '20 min' },
        { slug: 'remover-bloatware-windows-powershell', title: 'Remover Bloatware do Windows 11 com PowerShell (2026)', description: 'Cansado de apps inúteis no Windows? Aprenda a usar scripts de PowerShell para remover bloatware e deixar seu sistema muito mais leve e rápido em 2026.', difficulty: 'Intermediário', time: '20 min' },
        { slug: 'som-espacial-windows-configurar', title: 'Som Espacial no Windows 11: Como ativar e configurar (2026)', description: 'Quer ouvir passos com precisão nos jogos? Aprenda como ativar o Windows Sonic, Dolby Atmos e DTS:X para ter som espacial em 2026.', difficulty: 'Fácil', time: '10 min' },
        { slug: 'streamlabs-vs-obs-qual-usar', title: 'Streamlabs vs OBS Studio: Qual usar para Lives em 2026? (Comparativo Real)', description: 'O Streamlabs é bonito, mas pesado. O OBS Studio é feio, mas leve. Veja testes de uso de CPU/RAM e decida qual o melhor para o seu PC.', difficulty: 'Intermediário', time: '10 min' },
        { slug: 'tutorial-discord-instalar-configurar', title: 'Discord: Guia Completo de Instalação e Configuração (2026)', description: 'Quer começar no Discord mas não sabe como configurar? Aprenda a criar servidores, ajustar o áudio para não vazar eco e proteger sua conta com seguranç...', difficulty: 'Fácil', time: '20 min' },
        { slug: 'wifi-desconectando-sozinho-windows', title: 'Wi-Fi Desconectando Sozinho no Windows 11: Como resolver (2026)', description: 'Seu Wi-Fi cai o tempo todo ou desconecta ao jogar? Aprenda como configurar o adaptador de rede para estabilidade máxima no Windows 11 em 2026.', difficulty: 'Médio', time: '15 min' },
        { slug: 'windows-sandbox-testar-virus', title: 'Windows Sandbox: Como testar arquivos suspeitos com segurança (2026)', description: 'Quer abrir um arquivo mas tem medo de vírus? Aprenda como ativar e usar o Windows Sandbox, a área isolada do Windows 11 para testes em 2026.', difficulty: 'Fácil', time: '15 min' },
      ]
    },
    {
      id: 'rede-seguranca',
      title: 'Rede & Segurança',
      description: 'Proteção, Wi-Fi e VPN',
      icon: Shield,
      color: '#8B31FF',
      guides: [
        { slug: 'abrir-portas-roteador-nat-aberto', title: 'Como Abrir Portas do Roteador e Ter NAT Aberto: Guia 2026', description: 'Sofrendo com NAT Restrito no Warzone, GTA, FIFA ou jogos online? Aprenda o passo a passo completo para configurar Port Forwarding, UPnP e DMZ no rotea...', difficulty: 'Avançado', time: '60 min' },
        { slug: 'como-limpar-cache-dns-ip-flushdns', title: 'Como Limpar o Cache do DNS (FlushDNS) no Windows 11 (2026)', description: 'Sites não carregam ou ping alto nos jogos? Aprenda como limpar o cache do DNS e resetar seu IP no Windows 11 usando comandos rápidos em 2026.', difficulty: 'Fácil', time: '5 min' },
        { slug: 'configuracao-roteador-wifi', title: 'Guia de Configuração de Roteador Wi-Fi (2026)', description: 'Sua internet está lenta? Aprenda como configurar seu roteador, mudar o canal do Wi-Fi e colocar uma senha forte para máxima estabilidade em 2026.', difficulty: 'Médio', time: '20 min' },
        { slug: 'firewall-configuracao', title: 'Guia Completo de Configuração do Firewall do Windows (2026)', description: 'Quer proteger seu PC contra invasões? Aprenda como configurar o Firewall do Windows 11 corretamente para jogos e segurança em 2026.', difficulty: 'Médio', time: '15 min' },
        { slug: 'identificacao-phishing', title: 'Phishing: Como identificar sites e e-mails falsos (2026)', description: 'Recebeu uma mensagem estranha do banco ou do Discord? Aprenda a identificar as técnicas de Phishing mais comuns de 2026 e proteja seus dados de hacker...', difficulty: 'Fácil', time: '30 min' },
        { slug: 'instalar-impressora-wifi', title: 'Como instalar Impressora Wi-Fi no PC (Guia Definitivo)', description: 'Comprou uma impressora Wi-Fi e não consegue conectar? Aprenda a configurar impressoras HP, Epson, Canon e Brother na sua rede sem fio passo a passo.', difficulty: 'Fácil', time: '20 min' },
        { slug: 'problemas-conexao-wifi-causa-solucao', title: 'Problemas de Wi-Fi: Como resolver quedas e sinal fraco (2026)', description: 'Seu Wi-Fi vive caindo ou a velocidade está baixa? Aprenda a configurar seu roteador e o Windows 11 para ter uma conexão Wi-Fi estável em 2026.', difficulty: 'Iniciante', time: '15 min' },
        { slug: 'red-dead-redemption-2-melhores-configuracoes-rdr2', title: 'RDR2: Melhores Configurações de Gráficos e FPS (2026)', description: 'Quer rodar Red Dead Redemption 2 com visual incrível e FPS alto? Veja este guia das configurações otimizadas para PC em 2026.', difficulty: 'Fácil', time: '15 min' },
        { slug: 'rede-corporativa', title: 'Guia rede-corporativa', description: 'Descrição não disponível', difficulty: 'Intermediário', time: '45 minutos' },
        { slug: 'rede-domestica', title: 'Guia Completo de Configuração de Rede Doméstica', description: 'Configure roteadores, extensores Wi-Fi, VLANs e segurança de rede residencial. Otimização de cobertura e performance.', difficulty: 'Intermediário', time: '80 minutos' },
        { slug: 'remocao-virus-malware', title: 'Remoção de Vírus e Malware: Guia de Limpeza Profunda (2026)', description: 'Seu PC está agindo estranho? Aprenda como identificar e remover vírus, malwares e spywares de forma profissional e gratuita no Windows 11 em 2026.', difficulty: 'Médio', time: '45 min' },
        { slug: 'seguranca-digital', title: 'Guia de Segurança Digital em 2026: Fuja de Golpes e Invasões', description: 'Saiba como se proteger contra phishing, roubo de contas e golpes comuns no WhatsApp e Redes Sociais em 2026. Guia completo de higiene digital.', difficulty: 'Iniciante', time: '30 min' },
        { slug: 'seguranca-senhas-gerenciadores', title: 'Gerenciadores de Senha: Por que você precisa de um em 2026', description: 'Pare de usar a mesma senha para tudo! Aprenda como usar gerenciadores de senha (Bitwarden, Proton Pass) para blindar suas contas em 2026.', difficulty: 'Iniciante', time: '35 min' },
        { slug: 'seguranca-wifi-avancada', title: 'Segurança Wi-Fi: Como Proteger sua Rede Doméstica de Invasores', description: 'Seu Wi-Fi está seguro? Aprenda a configurar WPA3, desativar WPS, esconder o SSID e criar uma rede de convidados para isolar dispositivos IoT.', difficulty: 'Intermediário', time: '10-15 min' },
        { slug: 'vpn-configuracao', title: 'Guia Completo de Configuração de VPN para Privacidade Online', description: 'Aprenda a configurar VPN profissional para proteger sua privacidade online, acessar conteúdo bloqueado e trabalhar remotamente com segurança.', difficulty: 'Intermediário', time: '60 minutos' },
      ]
    },
    {
      id: 'windows-geral',
      title: 'Windows & Sistema',
      description: 'Manutenção e Instalação',
      icon: Monitor,
      color: '#31A8FF',
      guides: [
        { slug: 'api-ms-win-crt-runtime-missing', title: 'api-ms-win-crt-runtime-l1-1-0.dll Faltando: Guia Definitivo 2026', description: 'Seu programa/jogo não abre e mostra erro \'api-ms-win-crt-runtime-l1-1-0.dll ausente\'? Aprenda as 5 soluções definitivas para corrigir DLL faltando, in...', difficulty: 'Fácil', time: '30 min' },
        { slug: 'atualizacao-drivers-video', title: 'Como Atualizar Drivers de Vídeo (NVIDIA, AMD e Intel) em 2026: Guia Completo', description: 'Seu jogo está travando, com artefatos gráficos ou baixo FPS? Aprenda as 7 formas definitivas de manter seus drivers de vídeo (NVIDIA, AMD, Intel Arc) ...', difficulty: 'Intermediário', time: '45 min' },
        { slug: 'autenticacao-dois-fatores', title: 'Autenticação de Dois Fatores (2FA): O Guia Definitivo (2026)', description: 'Sua senha não é mais suficiente! Aprenda como usar o 2FA para proteger suas contas do Insta, Google e Discord contra hackers em 2026.', difficulty: 'Fácil', time: '25 min' },
        { slug: 'automacao-tarefas', title: 'Automação de Tarefas no Windows 11 (2026)', description: 'Pare de fazer trabalho repetitivo! Aprenda a usar o Power Automate, Agendador de Tarefas e Scripts para automatizar seu PC em 2026.', difficulty: 'Médio', time: '25 min' },
        { slug: 'bluestacks-vs-ldplayer-qual-mais-leve', title: 'BlueStacks vs LDPlayer: Qual o Emulador mais leve? (2026)', description: 'Quer jogar Free Fire ou apps de Android no PC? Veja o comparativo de performance entre BlueStacks e LDPlayer em 2026 e descubra qual é o melhor para P...', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'calibrar-bateria-notebook', title: 'Como Calibrar a Bateria do Notebook em 2026 (Fix Porcentagem)', description: 'Seu notebook desliga do nada mesmo marcando 20%? Aprenda a calibrar a bateria para ter uma leitura precisa de quanto tempo de carga você ainda tem.', difficulty: 'Médio', time: '6 horas' },
        { slug: 'clash-royale-clash-of-clans-pc-oficial', title: 'Como rodar Clash Royale e Clash of Clans no PC Oficialmente (2026)', description: 'Chega de emuladores lentos! Aprenda como jogar Clash Royale e Clash of Clans no seu computador usando o Google Play Games oficial em 2026.', difficulty: 'Fácil', time: '15 min' },
        { slug: 'como-escolher-placa-de-video', title: 'Como Escolher a Placa de Vídeo Ideal em 2026', description: 'RTX, RX ou Arc? Aprenda como escolher a melhor placa de vídeo para o seu orçamento, monitor e objetivos no PC Gamer em 2026.', difficulty: 'Médio', time: '25 min' },
        { slug: 'como-escolher-processador-2026', title: 'Como Escolher o Processador (CPU) em 2026: Guia Gamer', description: 'Ryzen ou Intel? Saiba como escolher o melhor processador para jogos e produtividade em 2026, evitando gargalos no seu PC Gamer.', difficulty: 'Intermediário', time: '20 min' },
        { slug: 'como-usar-ddu-driver-uninstaller', title: 'Como usar o DDU (Display Driver Uninstaller) com Segurança', description: 'Problemas com drivers de vídeo? Aprenda como usar o DDU para fazer uma limpeza profunda e remover drivers da NVIDIA e AMD em 2026.', difficulty: 'Avançado', time: '20 min' },
        { slug: 'compartilhamento-impressoras', title: 'Como Compartilhar Impressoras na Rede Windows (2026)', description: 'Quer imprimir de qualquer PC da casa? Aprenda como configurar o compartilhamento de impressoras no Windows 11 de forma simples e segura em 2026.', difficulty: 'Médio', time: '15 min' },
        { slug: 'criar-pendrive-bootavel', title: 'Como Criar um Pendrive Bootável do Windows 11 (2026)', description: 'Precisa formatar o PC? Aprenda a criar um pendrive bootável oficial do Windows 11 usando a ferramenta da Microsoft ou o Rufus em 2026.', difficulty: 'Intermediário', time: '30 min' },
        { slug: 'criptografia-dados', title: 'Criptografia de Dados: Como Proteger seus Arquivos em 2026', description: 'Quer manter seus documentos privados a salvo de olhares curiosos? Aprenda as melhores ferramentas de criptografia para Windows 11 em 2026.', difficulty: 'Médio', time: '40 min' },
        { slug: 'dpc-watchdog-violation-como-resolver', title: 'Como Resolver Erro DPC_WATCHDOG_VIOLATION (2026)', description: 'Seu Windows 11 travou com o erro de tela azul DPC Watchdog? Aprenda a identificar as causas e como consertar em 2026.', difficulty: 'Avançado', time: '25 min' },
        { slug: 'excluir-conta-instagram-definitivamente', title: 'Como Excluir sua Conta do Instagram Definitivamente (2026)', description: 'Cansado do Reels? Aprenda como excluir ou desativar temporariamente sua conta do Instagram pelo celular ou PC no guia atualizado de 2026.', difficulty: 'Fácil', time: '10 min' },
        { slug: 'exitlag-vale-a-pena-ou-enganacao', title: 'ExitLag Vale a Pena em 2026? Analisando o Ping e Rota', description: 'Sofrendo com lag e ping alto no Warzone ou Valorant? Descubra se o ExitLag realmente funciona ou se é apenas marketing no guia de 2026.', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'extensoes-produtividade-chrome', title: 'Melhores Extensões de Produtividade para Chrome e Edge em 2026', description: 'Quer turbinar seu navegador? Conheça as melhores extensões de 2026 para bloquear anúncios, gerenciar senhas e aumentar sua produtividade online.', difficulty: 'Fácil', time: '15 min' },
        { slug: 'formatfactory-vs-handbrake-converter-video', title: 'FormatFactory vs Handbrake: Qual o melhor conversor? (2026)', description: 'Quer converter vídeos sem perder qualidade? Comparamos o FormatFactory e o Handbrake para descobrir qual o melhor em 2026.', difficulty: 'Fácil (FF) / Médio (HB)', time: '15 min' },
        { slug: 'free-fire-pc-fraco-smartgaga', title: 'Free Fire em PC Fraco: Como configurar o SmartGaGa (2026)', description: 'Quer jogar Free Fire sem travamentos no seu PC ou Notebook com 2GB ou 4GB de RAM? Aprenda a configurar o SmartGaGa, o emulador mais leve do mercado.', difficulty: 'Fácil', time: '20 min' },
        { slug: 'gabinete-gamer-airflow-importancia', title: 'Airflow no Gabinete: Como gelar seu PC e evitar o Thermal Throttling', description: 'Seu PC está esquentando demais e perdendo FPS? Aprenda a configurar o fluxo de ar (Airflow) correto com ventoinhas, pressão positiva e exaustão.', difficulty: 'Fácil', time: '20 min' },
        { slug: 'geometry-dash-4gb-patch-lag', title: 'Geometry Dash: Como usar o 4GB Patch para acabar com o Lag', description: 'Seu Geometry Dash trava em níveis com muitos objetos? Aprenda a aplicar o patch de 4GB para permitir que o jogo use mais RAM e rode liso sem crashar.', difficulty: 'Fácil', time: '10 min' },
        { slug: 'gestao-pacotes', title: 'Gestão de Pacotes no Windows: Como usar o Winget (Passo a Passo)', description: 'Cansado de entrar em 10 sites para baixar programas? Aprenda a usar o Winget, o gerenciador de pacotes oficial da Microsoft, para instalar e atualizar...', difficulty: 'Fácil', time: '15 min' },
        { slug: 'gestao-servicos', title: 'Gestão de Serviços do Windows: O que desativar com segurança', description: 'Seu Windows tem centenas de serviços rodando sem necessidade. Aprenda a gerenciar o services.msc para liberar memória RAM e CPU sem quebrar o sistema.', difficulty: 'Intermediária', time: '30 min' },
        { slug: 'google-play-games-pc-beta-vale-a-pena', title: 'Google Play Games no PC: Vale a pena em 2026? (Review)', description: 'Descubra se o Google Play Games oficial para PC é melhor que emuladores como o BlueStacks para jogar no Windows 11 em 2026. Review completo.', difficulty: 'Intermediário', time: '10 min' },
        { slug: 'hdmi-2.1-vs-displayport-1.4-diferencas', title: 'HDMI 2.1 vs DisplayPort 2.1: Qual usar no seu Monitor em 2026?', description: 'Confuso sobre qual cabo usar? Aprenda as diferenças reais entre HDMI e DisplayPort para atingir 144Hz, 240Hz ou 4K no seu PC gamer em 2026.', difficulty: 'Intermediário', time: '10 min' },
        { slug: 'hibernacao-vs-suspensao-qual-o-melhor', title: 'Hibernação vs Suspensão: Qual o melhor para o seu PC? (2026)', description: 'Você desliga o PC toda noite ou apenas fecha a tampa? Aprenda a diferença entre Hibernar e Suspender e descubra qual modo preserva mais o seu hardware...', difficulty: 'Fácil', time: '10 min' },
        { slug: 'importancia-pasta-termica-pc', title: 'Pasta Térmica: Tudo o que você precisa saber (Guia 2026)', description: 'Seu PC está se desligando sozinho? Saiba quando trocar a pasta térmica, qual a melhor marca e como aplicar corretamente para reduzir a temperatura.', difficulty: 'Média', time: '30 min' },
        { slug: 'instalacao-drivers', title: 'Como Instalar Drivers no Windows - Instalação e Atualização Passo a Passo', description: 'Aprenda como instalar driver e atualizar drivers no Windows 10/11: placa de vídeo, áudio, rede. Guia completo para instalar drivers com segurança e co...', difficulty: 'Intermediário', time: '45 minutos' },
        { slug: 'instalacao-limpa-drivers-nvidia-amd', title: 'Instalação Limpa de Drivers: Como fazer do jeito certo (2026)', description: 'Seu driver de vídeo está travando ou com performance baixa? Aprenda a fazer uma instalação limpa dos drivers NVIDIA e AMD sem deixar restos no sistema...', difficulty: 'Iniciante', time: '20 min' },
        { slug: 'limpar-cache-navegador-chrome-edge', title: 'Como Limpar o Cache do Navegador (Chrome, Edge e Firefox)', description: 'Seus sites estão demorando para carregar ou aparecendo com erro? Aprenda a limpar o cache e os cookies do seu navegador para navegar mais rápido.', difficulty: 'Fácil', time: '5 min' },
        { slug: 'manutencao-preventiva', title: 'Manutenção Preventiva de Computadores', description: 'Rotinas de manutenção que você pode fazer regularmente para manter seu computador funcionando perfeitamente e evitar problemas futuros.', difficulty: 'Intermediário', time: '45 minutos' },
        { slug: 'manutencao-preventiva-computador', title: 'Manutenção Preventiva de Computador: Como evitar gastos no futuro', description: 'Aprenda a rotina ideal de manutenção preventiva para o seu PC ou Notebook. Saiba o que fazer a cada mês para garantir que seu computador dure 10 anos ...', difficulty: 'Fácil', time: '20 min' },
        { slug: 'melhores-drivers-nvidia-antigos', title: 'Drivers Antigos da NVIDIA: Quando vale a pena fazer o Rollback?', description: 'Seu FPS caiu depois de atualizar o driver da NVIDIA? Descubra quais são as versões mais estáveis e aprenda a voltar para um driver antigo com seguranç...', difficulty: 'Intermediária', time: '25 min' },
        { slug: 'melhores-navegadores-custo-beneficio', title: 'Melhores Navegadores em 2026: Chrome, Brave ou Edge?', description: 'Cansado do navegador lento e cheio de anúncios? Comparamos os melhores navegadores de 2026 focados em performance, privacidade e economia de RAM.', difficulty: 'Fácil', time: '15 min' },
        { slug: 'mu-online-reduzir-lag-muvoltris', title: 'Mu Online: Como tirar o Lag e aumentar o FPS em 2026', description: 'Sofrendo com travadas no Mu Online? Aprenda a otimizar o motor clássico do Mu para rodar liso em invasões e castelos, mesmo em PCs fracos.', difficulty: 'Fácil', time: '15 min' },
        { slug: 'nvidia-refelx-on-vs-boost-diferenca', title: 'NVIDIA Reflex: Qual a diferença entre ON e ON + BOOST? (2026)', description: 'Quer reduzir o atraso dos seus comandos? Aprenda como configurar o NVIDIA Reflex corretamente e saiba quando usar o modo Boost em 2026.', difficulty: 'Intermediário', time: '10 min' },
        { slug: 'nvme-vs-sata-vale-a-pena-upgrade', title: 'NVMe vs SATA: Vale a pena o upgrade para Jogos e Trabalho?', description: 'Entenda se a velocidade de 7.000 MB/s de um SSD NVMe realmente faz diferença na prática ou se um SSD SATA ainda é suficiente para você em 2026.', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'onde-baixar-planilhas-excel-gratis', title: 'Onde baixar Planilhas Excel Grátis: Controle Financeiro e Gestão', description: 'Procurando modelos prontos de Excel para se organizar? Listamos os melhores sites para baixar planilhas gratuitas de gastos, estoques e cronogramas em...', difficulty: 'Intermediário', time: '10 min' },
        { slug: 'otimizacoes-para-notebook-gamer', title: 'Otimização para Notebook Gamer: Mais FPS e Frieza (2026)', description: 'Seu notebook gamer esquenta muito ou trava em jogos? Aprenda técnicas de undervolt, limpeza e configurações de energia para 2026.', difficulty: 'Médio', time: '20 min' },
        { slug: 'pc-gamer-barato-custo-beneficio-2026', title: 'PC Gamer Barato em 2026: Guia de Peças Custo-Benefício', description: 'Quer montar um PC para rodar tudo sem gastar uma fortuna? Veja nossa lista de peças recomendadas (CPU, GPU, RAM) para o melhor custo-benefício em 2026...', difficulty: 'Intermediário', time: '30 min' },
        { slug: 'pc-liga-sem-video-diagnostico', title: 'PC Liga mas não dá Vídeo: Guia de Diagnóstico 2026', description: 'Seu computador liga, as ventoinhas giram, mas a tela continua preta? Aprenda a diagnosticar e resolver problemas de hardware sem gastar dinheiro em 20...', difficulty: 'Média', time: '30 min' },
        { slug: 'perifericos-gamer-vale-a-pena', title: 'Periféricos Gamer em 2026: Quando vale a pena investir?', description: 'Mouse, Teclado, Headset: O que realmente muda sua gameplay e o que é puro marketing? Guia completo sobre periféricos de alto desempenho em 2026.', difficulty: 'Fácil', time: '15 min' },
        { slug: 'perifericos-gamer-vale-a-pena-marcas', title: 'Marcas de Periféricos Gamer: Quais valem a pena em 2026?', description: 'Logitech, Razer, Corsair ou marcas chinesas? Descubra quais são as marcas de periféricos que entregam durabilidade e performance real em 2026.', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'pobreza-digital-pc-fraco-produtividade', title: 'Pobreza Digital: Como ser Produtivo com um PC Fraco em 2026', description: 'Você não precisa do PC mais caro para estudar ou trabalhar. Aprenda as técnicas de otimização extrema e softwares leves para vencer a pobreza digital ...', difficulty: 'Fácil', time: '20 min' },
        { slug: 'processadores-2026-analise', title: 'Processadores em 2026: Guia Completo e Análise de Performance', description: 'Ryzen ou Intel? Entenda as novas arquiteturas de processadores de 2026 e saiba como escolher a melhor CPU para jogos e trabalho multitarefa.', difficulty: 'Intermediário', time: '25 min' },
        { slug: 'protecao-dados-privacidade', title: 'Privacidade Digital: Como proteger seus dados em 2026', description: 'Você está sendo rastreado? Saiba como proteger sua privacidade online, configurar redes sociais e evitar vazamentos de dados pessoais em 2026.', difficulty: 'Fácil', time: '35 min' },
        { slug: 'protecao-ransomware', title: 'Proteção contra Ransomware: Como blindar seu PC em 2026', description: 'Seus arquivos foram sequestrados? Aprenda como se proteger de Ransomwares, ativar a proteção nativa do Windows 11 e fazer backups seguros em 2026.', difficulty: 'Médio', time: '45 min' },
        { slug: 're-size-bar-ativar-pc-gamer', title: 'Como ativar o Re-Size BAR para ganhar FPS no PC Gamer (2026)', description: 'Quer mais performance na sua RTX ou RX? Aprenda como ativar o Resizable BAR na BIOS e no Windows para tirar o gargalo da sua GPU em 2026.', difficulty: 'Avançado', time: '20 min' },
        { slug: 'recuperacao-dados', title: 'Recuperação de Dados: Como recuperar arquivos deletados (2026)', description: 'Apagou algo importante sem querer? Aprenda as técnicas profissionais de recuperação de dados em HDs, SSDs e pendrives com o guia atualizado para 2026.', difficulty: 'Média', time: '40 min' },
        { slug: 'recuperacao-dados-hd-corrompido', title: 'Recuperação de Dados: Como salvar arquivos de um HD Corrompido', description: 'Seu HD parou de aparecer no Windows ou pede para formatar? Aprenda as técnicas de recuperação de fotos e documentos usando ferramentas profissionais (...', difficulty: 'Alta', time: '2 horas' },
        { slug: 'recuperacao-sistema', title: 'Guia Completo de Recuperação do Sistema Windows', description: 'Aprenda a recuperar seu sistema Windows após falhas, corrupção ou problemas graves. Restaure seu computador para estado funcional com métodos profissi...', difficulty: 'Intermediário', time: '90 minutos' },
        { slug: 'rtx-4060-vale-a-pena-2026', title: 'RTX 4060 Vale a Pena em 2026? Análise de Performance', description: 'Ainda compensa comprar a RTX 4060 em 2026? Veja o desempenho em jogos atuais, o impacto do DLSS 3.5 e se os 8GB de VRAM são suficientes.', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'saude-bateria-notebook', title: 'Como verificar e aumentar a Saúde da Bateria do Notebook (2026)', description: 'Sua bateria dura pouco? Aprenda como gerar o relatório oficial de bateria do Windows 11 e dicas para fazer ela durar muito mais em 2026.', difficulty: 'Fácil', time: '15 min' },
        { slug: 'smart-delivery-xbox-pc-como-funciona', title: 'Smart Delivery Xbox: Como funciona no PC e Console (2026)', description: 'Entenda o que é o Smart Delivery da Microsoft e como ele garante que você sempre tenha a melhor versão do jogo no seu PC ou Xbox em 2026.', difficulty: 'Fácil', time: '10 min' },
        { slug: 'solucao-problemas-audio', title: 'Como Resolver Problemas de Áudio no Windows (2026)', description: 'Seu PC está sem som ou com som chiando? Aprenda como diagnosticar e resolver erros de áudio no Windows 11 com este guia passo a passo em 2026.', difficulty: 'Fácil', time: '15 min' },
        { slug: 'solucao-problemas-bluetooth', title: 'Problemas de Bluetooth no Windows 11: Guia de Correção (2026)', description: 'Seu controle ou fone bluetooth não conecta ou fica desconectando? Aprenda como resolver erros de bluetooth no Windows 11 em 2026.', difficulty: 'Médio', time: '15 min' },
        { slug: 'sync-vertical-g-sync-free-sync-explicacao', title: 'G-Sync vs FreeSync vs V-Sync: Qual usar em 2026?', description: 'Entenda as diferenças entre V-Sync, G-Sync e FreeSync. Saiba como acabar com o Screen Tearing (tela rasgando) e reduzir o input lag em 2026.', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'teste-velocidade-internet', title: 'Teste de Velocidade de Internet: Como ler os resultados (2026)', description: 'Sua internet está entregando o que você paga? Aprenda a fazer o teste de velocidade corretamente e entenda o que é Ping, Jitter e Megas em 2026.', difficulty: 'Iniciante', time: '10 min' },
        { slug: 'the-witcher-3-next-gen-performance', title: 'The Witcher 3 Next Gen: Guia de Performance PC (2026)', description: 'Quer rodar The Witcher 3 com Ray Tracing e FPS estável? Aprenda as melhores configurações para a versão Next Gen e como evitar o stuttering em 2026.', difficulty: 'Média', time: '25 min' },
        { slug: 'tlauncher-viring-falso-positivo', title: 'TLauncher é seguro? Review e Segurança em 2026', description: 'Descubra se o TLauncher ainda é confiável em 2026. Analisamos as polêmicas de spyware, vírus e quais as melhores alternativas seguras para jogar Minec...', difficulty: 'Fácil', time: '15 min' },
        { slug: 'troubleshooting-internet', title: 'Internet Lenta ou Caindo? Guia de Troubleshooting 2026', description: 'Sua internet não está funcionando como deveria? Aprenda o passo a passo para diagnosticar e resolver problemas de conexão no Windows 11 em 2026.', difficulty: 'Iniciante', time: '20 min' },
        { slug: 'upgrade-pc-antigo-vale-a-pena', title: 'Upgrade em PC Antigo: Ainda vale a pena em 2026?', description: 'Seu PC de 5 anos atrás está lento? Descubra quais componentes valem o upgrade e quando é melhor economizar para um computador novo em 2026.', difficulty: 'Intermediário', time: '20 min' },
        { slug: 'vbs-memory-integrity-performance', title: 'VBS e Integridade da Memória: Desativar para ganhar FPS? (2026)', description: 'Descubra se desativar o VBS (Virtualization-Based Security) no Windows 11 realmente aumenta o desempenho em jogos em 2026.', difficulty: 'Fácil', time: '10 min' },
        { slug: 'virtualizacao-vmware', title: 'Virtualização no PC: Como ativar e usar VMWare (2026)', description: 'Quer rodar outros sistemas dentro do seu Windows? Aprenda como ativar a virtualização na BIOS e configurar o VMWare Workstation em 2026.', difficulty: 'Médio', time: '25 min' },
        { slug: 'vlc-media-player-vs-potplayer', title: 'VLC vs PotPlayer: Qual o melhor player de vídeo em 2026?', description: 'Procurando o melhor player de vídeo para o Windows 11? Comparamos o clássico VLC com o ultra-customizável PotPlayer em 2026.', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'water-cooler-vs-air-cooler-qual-escolher', title: 'Water Cooler vs Air Cooler: Qual escolher em 2026?', description: 'Seu processador está esquentando muito? Comparamos a eficiência, barulho e durabilidade dos Water Coolers e Air Coolers em 2026.', difficulty: 'Médio', time: '20 min' },
        { slug: 'winrar-vs-7zip-qual-melhor', title: 'WinRAR vs 7-Zip: Qual o melhor compressor em 2026?', description: 'Ainda usa WinRAR? Descubra se o 7-Zip ou o novo NanaZip são opções melhores para comprimir e extrair arquivos no Windows 11 em 2026.', difficulty: 'Intermediário', time: '10 min' },
        { slug: 'xbox-game-pass-pc-vale-a-pena', title: 'Xbox Game Pass para PC: Vale a pena em 2026? (Análise)', description: 'Será que o Xbox Game Pass ainda é o melhor custo-benefício para gamers em 2026? Analisamos o catálogo, preço e as vantagens do serviço.', difficulty: 'Intermediário', time: '15 min' },
        { slug: 'z-index-css-explicacao', title: 'z-index no CSS: Guia Definitivo e Empilhamento (2026)', description: 'Entenda de uma vez por todas como funciona o z-index no CSS, por que ele \'ignora\' alguns elementos e como dominar o Stacking Context em 2026.', difficulty: 'Médio', time: '15 min' },
      ]
    }
  ];

  const filteredGuides = guideCategories
    .filter(category => selectedCategory === 'all' || category.id === selectedCategory)
    .map(category => ({
      ...category,
      guides: category.guides.filter(guide =>
        guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(category => category.guides.length > 0);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Iniciante': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Intermediário': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Avançado': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#050510] font-sans selection:bg-[#31A8FF]/30">

        {/* --- HERO SECTION --- */}
        <section className="min-h-screen flex flex-col items-center justify-center relative px-4 overflow-hidden border-b border-white/5 pt-20">
          <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-50"></div>
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#31A8FF]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#8B31FF]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>

          <div className="relative max-w-5xl mx-auto text-center z-10 flex-grow flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 text-xs font-medium text-slate-400"
            >
              <BookOpen className="w-3 h-3 text-[#31A8FF]" />
              <span>Base de Conhecimento v2.0</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
            >
              Guias Técnicos Especializados
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
            >
              Acervo atualizado diariamente com soluções para Windows, Jogos, Hardware e Redes.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-2xl mx-auto"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                <div className="relative bg-[#0A0A0F] rounded-2xl">
                  <input
                    type="text"
                    placeholder="Pesquise por erro, jogo ou componente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-5 bg-transparent border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-[#31A8FF]/50 text-lg transition-all"
                  />
                  <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-500 group-hover:text-[#31A8FF] transition-colors" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll Down Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer text-slate-500 hover:text-white transition-colors"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#31A8FF] to-transparent"></div>
          </motion.div>
        </section>

        {/* --- CONTENT SECTION --- */}
        <section id="content-section" className="py-12 px-4 bg-[#050510] relative z-10">
          <div className="max-w-7xl mx-auto">

            {/* Category Filter Cards */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${selectedCategory === 'all'
                  ? 'bg-white text-black border-white hover:bg-slate-200'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:border-white/10 hover:text-white'
                  }`}
              >
                Todos
              </button>
              {guideCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 border ${selectedCategory === category.id
                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                    : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:border-white/10 hover:text-white'
                    }`}
                >
                  <category.icon className={`w-4 h-4 ${selectedCategory === category.id ? 'text-black' : ''}`} />
                  {category.title}
                </button>
              ))}
            </div>

            {filteredGuides.length === 0 ? (
              <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/5">
                <Search className="w-16 h-16 text-slate-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">Nenhum guia encontrado</h3>
                <p className="text-slate-400 mb-8 max-w-sm mx-auto">Não encontramos guias compatíveis com sua busca. Tente palavras-chaves diferentes.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="px-8 py-3 bg-[#31A8FF] text-white font-bold rounded-xl hover:bg-[#2b93df] transition-all hover:shadow-[0_0_30px_rgba(49,168,255,0.3)]"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <div className="space-y-24">
                {filteredGuides.map((category) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
                      <div className={`p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/5`}>
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{category.title}</h2>
                        <p className="text-slate-500 text-sm mt-1">{category.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.guides.map((guide) => (
                        <motion.div
                          key={guide.slug}
                          whileHover={{ y: -5 }}
                          className="group relative h-full"
                        >
                          <Link href={`/guias/${guide.slug}`} className="block h-full relative z-20 focus:outline-none">
                            <div className="h-full bg-[#0A0A0F] hover:bg-[#0F0F16] rounded-2xl border border-white/5 hover:border-[#31A8FF]/30 p-8 transition-all duration-300 relative overflow-hidden flex flex-col">

                              {/* Subtle Glow Effect on Hover */}
                              <div className="absolute top-0 right-0 w-32 h-32 bg-[#31A8FF]/5 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                              <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getDifficultyColor(guide.difficulty)}`}>
                                  {guide.difficulty}
                                </div>
                              </div>

                              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#31A8FF] transition-colors leading-tight relative z-10">
                                {guide.title}
                              </h3>

                              <p className="text-slate-400 text-sm mb-8 leading-relaxed line-clamp-2 flex-grow relative z-10">
                                {guide.description}
                              </p>

                              <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto relative z-10">
                                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                                  <Clock className="w-4 h-4" />
                                  {guide.time}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#31A8FF] group-hover:text-white transition-all text-slate-500">
                                  <ArrowRight className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050510] to-[#0A0A0F]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#31A8FF]/5 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Precisa de Ajuda Profissional?</h2>
            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Tentou resolver e não conseguiu? Nossos especialistas podem acessar seu PC remotamente e corrigir o problema para você.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link
                href="/todos-os-servicos"
                className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:scale-105"
              >
                Ver Serviços Especializados
              </Link>
              <Link
                href="https://wa.me/5511996716235?text=Olá!%20Li%20os%20guias%20mas%20preciso%20de%20ajuda%20especializada."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/5 text-white border border-white/10 font-bold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Falar com Especialista
              </Link>
            </div>
          </div>
        </section>
      </main>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-xs text-slate-600 mb-2 uppercase tracking-wider">Publicidade</p>
        <AdSenseBanner />
      </div>
      <Footer />
    </>
  );
}