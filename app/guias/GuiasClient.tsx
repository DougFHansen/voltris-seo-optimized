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
        { slug: 'valorant-reduzir-input-lag', title: 'Valorant: Reduzir Input Lag e Latência', description: 'Configurações NVIDIA Reflex e Raw Input Buffer.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'cs2-melhores-comandos-console-fps', title: 'CS2: Comandos de Console para FPS', description: 'Melhore a visibilidade e frames no Counter-Strike 2.', difficulty: 'Intermediário', time: '10 min', isNew: true },
        { slug: 'fortnite-modo-performance-pc-fraco', title: 'Fortnite: Ativar Modo Performance', description: 'Dobre seu FPS em PCs fracos removendo efeitos visuais.', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'cod-warzone-melhores-configuracoes-graficas', title: 'Warzone: Config Competitiva', description: 'Melhor visibilidade e FPS em Call of Duty.', difficulty: 'Intermediário', time: '15 min', isNew: true },
        { slug: 'league-of-legends-fps-drop-fix', title: 'LoL: Correção de Queda de FPS', description: 'Estabilize o FPS nas teamfights.', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'reduzir-ping-jogos-online', title: 'Como Reduzir o Ping em Jogos', description: 'Otimizações de rede e TCP para latência baixa.', difficulty: 'Avançado', time: '20 min', isNew: true },
        { slug: 'limitar-fps-rivatuner-nvidia', title: 'Limitar FPS (RivaTuner/NVIDIA)', description: 'Frametime liso e menos aquecimento.', difficulty: 'Intermediário', time: '5 min', isNew: true },
        { slug: 'otimizacao-jogos-pc', title: 'Otimização de Hardware para Jogos', description: 'Extraindo o máximo de FPS da sua GPU/CPU.', difficulty: 'Intermediário', time: '30 min' },
        { slug: 'pubg-steam-fix-stuttering-travadas', title: 'PUBG: Fix Stuttering e DX11', description: 'Resolva travadas de mira no PUBG.', difficulty: 'Intermediário', time: '10 min', isNew: true },
        { slug: 'aceleracao-hardware-gpu-agendamento', title: 'HAGS: Agendamento de GPU', description: 'Melhorar FPS e ativar Frame Gen no Windows.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'melhores-drivers-nvidia-antigos', title: 'Melhores Drivers NVIDIA Antigos', description: 'Lista de drivers estáveis para CS2 e Valorant.', difficulty: 'Avançado', time: '15 min', isNew: true },
        { slug: 'nvidia-refelx-on-vs-boost-diferenca', title: 'NVIDIA Reflex: On vs Boost', description: 'Entenda como diminuir o input lag corretamente.', difficulty: 'Intermediário', time: '5 min', isNew: true },
        { slug: 'como-usar-ddu-driver-uninstaller', title: 'Como Usar o DDU (Guia)', description: 'Remova drivers de vídeo corrompidos com segurança.', difficulty: 'Avançado', time: '15 min', isNew: true },
        { slug: 'modo-de-jogo-windows-atikvar-ou-nao', title: 'Game Mode: Ativar ou Não?', description: 'A verdade sobre o Modo de Jogo do Windows 11.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'cyberpunk-2077-hdd-mode-otimizacao', title: 'Cyberpunk 2077: Otimização HDD', description: 'Ganhando FPS desligando Crowd Density.', difficulty: 'Iniciante', time: '15 min', isNew: true },
        { slug: 'red-dead-redemption-2-melhores-configuracoes-rdr2', title: 'RDR2: Configurações Otimizadas', description: 'Equilíbrio perfeito entre gráfico e performance.', difficulty: 'Intermediário', time: '15 min', isNew: true },
        { slug: 'the-witcher-3-next-gen-performance', title: 'Witcher 3 Next-Gen: DX11 vs DX12', description: 'Resolvendo stutters da atualização nova.', difficulty: 'Iniciante', time: '10 min', isNew: true }
      ]
    },
    {
      id: 'games-fix',
      title: 'Correção de Jogos',
      description: 'Resolva bugs em GTA V, Minecraft, Roblox e mais',
      icon: Gamepad,
      color: '#FF4B6B',
      guides: [
        { slug: 'gta-v-otimizar-fps-pc-fraco', title: 'GTA V: Otimização para PC Fraco', description: 'Editando o settings.xml para rodar liso.', difficulty: 'Intermediário', time: '20 min', isNew: true },
        { slug: 'gta-v-fix-texturas-sumindo', title: 'GTA V: Texturas Sumindo (Fix)', description: 'Resolva o bug do chão invisível.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'minecraft-aumentar-fps-fabric-sodium', title: 'Minecraft: Fabric + Sodium (FPS Boost)', description: 'A alternativa moderna e superior ao Optifine.', difficulty: 'Intermediário', time: '15 min', isNew: true },
        { slug: 'minecraft-alocar-mais-ram', title: 'Minecraft: Alocar Mais RAM', description: 'Evite crash "Out of Memory" em modpacks.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'roblox-fps-unlocker-tutorial', title: 'Roblox FPS Unlocker', description: 'Como jogar Roblox acima de 60 FPS.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'valorant-fix-van-9003-secure-boot', title: 'Valorant: Erro VAN 9003', description: 'Ativando Secure Boot e TPM 2.0 na BIOS.', difficulty: 'Intermediário', time: '10 min', isNew: true },
        { slug: 'gta-iv-fix-windows-10-11', title: 'GTA IV: Fix para Windows 10/11', description: 'Jogando sem Games for Windows Live.', difficulty: 'Intermediário', time: '15 min', isNew: true },
        { slug: 'mu-online-reduzir-lag-muvoltris', title: 'Mu Online: Otimização e Antilag', description: 'Melhore o ping no MuVoltris e reduza efeitos.', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'gta-san-andreas-correcao-grafica', title: 'GTA San Andreas: SilentPatch', description: 'Corrija mouse e resolução quebrada.', difficulty: 'Intermediário', time: '10 min', isNew: true },
        { slug: 'lineage-2-otimizar-pvp-fps', title: 'Lineage 2: Critical Error Fix', description: 'Otimizando o l2.ini para Sieges.', difficulty: 'Avançado', time: '15 min', isNew: true },
        { slug: 'euro-truck-simulator-2-otimizacao', title: 'Euro Truck Simulator 2: Lag Fix', description: 'Aumentando buffer de memória em cidades.', difficulty: 'Intermediário', time: '15 min', isNew: true },
        { slug: 'roblox-fix-erro-conexao', title: 'Roblox: Fix Erro de Conexão', description: 'Resolva problemas de desconexão e lag.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'minecraft-optifine-vs-sodium-fabric', title: 'Minecraft: OptiFine vs Sodium', description: 'Qual mod dá mais FPS em PCs fracos?', difficulty: 'Intermediário', time: '15 min', isNew: true },
        { slug: 'free-fire-pc-fraco-smartgaga', title: 'Free Fire em PC Fraco (2GB)', description: 'SmartGaGa modificado para rodar liso.', difficulty: 'Intermediário', time: '15 min', isNew: true },
        { slug: 'genshin-impact-stuttering-fix-pc', title: 'Genshin Impact: Stutter Fix', description: 'Corrigindo travadas de compilação de shader.', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'clash-royale-clash-of-clans-pc-oficial', title: 'Clash Royale PC Oficial', description: 'Como jogar sem emulador travando.', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'god-of-war-pc-memory-leak-fix', title: 'God of War: Memory Leak Fix', description: 'Evite o estouro de VRAM após tempo jogando.', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'eld-ring-stuttering-fix-dx12', title: 'Elden Ring: Stuttering Fix', description: 'Modo Offline e Cache Shader Ilimitado.', difficulty: 'Avançado', time: '15 min', isNew: true },
        { slug: 'valorant-van-9003-secure-boot-tpm-fix', title: 'Valorant: VAN 9003 e TPM 2.0', description: 'Ativando Secure Boot na BIOS (Gigabyte/Asus).', difficulty: 'Avançado', time: '20 min', isNew: true },
        { slug: 'roblox-tela-branca-travada-fix', title: 'Roblox: Tela Branca/Crash', description: 'Limpando cache e conflitos de Overlay.', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'fortnite-texturas-nao-carregam-streaming', title: 'Fortnite: Texturas Borradas', description: 'Corrija o bug de não carregamento de skins.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'league-of-legends-tela-preta-carregamento', title: 'LoL: Tela Preta no Loading', description: 'Resolvendo bloqueios de Firewall.', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'gta-v-err-gfx-d3d-init-crash', title: 'GTA V: Erro ERR_GFX_D3D_INIT', description: 'Correção de crash por overclock de GPU.', difficulty: 'Intermediário', time: '15 min', isNew: true },
        { slug: 'hollow-knight-stuttering-fix-mod', title: 'Hollow Knight: HK Fix Mod', description: 'Removendo o lag da Unity Engine.', difficulty: 'Intermediário', time: '10 min', isNew: true },
        { slug: 'stardew-valley-mods-lag-fix', title: 'Stardew Valley: Lag de Mods', description: 'SpriteMaster e otimização do SMAPI.', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'terraria-tmodloader-64bit-fix', title: 'Terraria: Correção 4GB RAM', description: 'Usando tModLoader 64-bit para evitar crash.', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'geometry-dash-4gb-patch-lag', title: 'Geometry Dash: 4GB Patch', description: 'Rode níveis pesados sem lag.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'project-zomboid-fps-boost', title: 'Project Zomboid: FPS Boost', description: 'Remova sangue e aumente a RAM alocada.', difficulty: 'Intermediário', time: '15 min', isNew: true }
      ]
    },
    {
      id: 'windows-erros',
      title: 'Erros do Windows',
      description: 'Solução para telas azuis, DLLs e crashes',
      icon: AlertTriangle,
      color: '#E11D48',
      guides: [
        { slug: 'erro-0xc00007b-aplicativo-nao-inicializou', title: 'Erro 0xc00007b (Fix Definitivo)', description: 'Resolva o erro "Aplicativo não inicializou corretamente".', difficulty: 'Intermediário', time: '15 min', isNew: true },
        { slug: 'corrigir-dll-faltando-vcredist-directx', title: 'DLLs Faltando (MSVCP/DirectX)', description: 'Instale todos os runtimes C++ e DirectX necessários.', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'como-resolver-tela-azul', title: 'Tela Azul (BSOD): Guia de Diagnóstico', description: 'Descubra quem causou o crash com BlueScreenView.', difficulty: 'Intermediário', time: '20 min', isNew: true },
        { slug: 'erro-disco-100-porcento-gerenciador-tarefas', title: 'Disco 100% no Gerenciador', description: 'Desative SysMain e Telemetria para destravar o HD.', difficulty: 'Intermediário', time: '15 min', isNew: true },
        { slug: 'windows-update-corrigir-erros', title: 'Windows Update Travado', description: 'Scripts para resetar o serviço de atualização.', difficulty: 'Avançado', time: '15 min', isNew: true },
        { slug: 'pc-liga-sem-video-diagnostico', title: 'PC Liga mas Não Dá Vídeo', description: 'Diagnóstico de Memória RAM e BIOS.', difficulty: 'Intermediário', time: '30 min', isNew: true },
        { slug: 'usb-nao-reconhecido-reset-drivers', title: 'USB Não Reconhecido (Código 43)', description: 'Resetando os controladores USB Root Hub.', difficulty: 'Intermediário', time: '10 min', isNew: true },
        { slug: 'resolver-erros-windows', title: 'Troubleshooting Geral', description: 'Checklist para crashes aleatórios.', difficulty: 'Iniciante', time: '20 min' }
      ]
    },
    {
      id: 'hardware',
      title: 'Hardware & Montagem',
      description: 'Escolha peças e monte seu PC',
      icon: Cpu,
      color: '#8B31FF',
      guides: [
        { slug: 'guia-montagem-pc', title: 'Guia Completo de Montagem', description: 'Do zero ao boot: montando seu PC Gamer.', difficulty: 'Avançado', time: '120 min', isNew: true },
        { slug: 'como-escolher-processador-2026', title: 'Guia de Processadores 2026', description: 'Intel Core Ultra vs AMD Ryzen 9000.', difficulty: 'Iniciante', time: '20 min', isNew: true },
        { slug: 'como-escolher-placa-de-video', title: 'Guia de Placas de Vídeo (GPU)', description: 'VRAM, Ray Tracing e gargalo explicados.', difficulty: 'Iniciante', time: '20 min', isNew: true },
        { slug: 'testar-fonte-pc-multimetro', title: 'Como Testar Fonte (Teste do Clipe)', description: 'Descubra se sua fonte queimou com um clipe de papel.', difficulty: 'Avançado', time: '30 min', isNew: true },
        { slug: 'water-cooler-vs-air-cooler-qual-escolher', title: 'Water Cooler vs Air Cooler', description: 'Qual refrigera melhor e dura mais?', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'gabinete-gamer-airflow-importancia', title: 'Airflow: Ventilação de Gabinete', description: 'Posicionamento correto de fans e pressão positiva.', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'ssd-nvme-vs-sata-jogos', title: 'SSD NVMe vs SATA em Jogos', description: 'Vale a pena pagar mais pela velocidade?', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'monitorar-temperatura-pc', title: 'Monitorar Temperatura (OSD)', description: 'Veja a temperatura da CPU/GPU dentro do jogo.', difficulty: 'Iniciante', time: '15 min', isNew: true },
        { slug: 'atualizar-bios-seguro', title: 'Atualizar BIOS com Segurança', description: 'Evite brickar sua placa-mãe.', difficulty: 'Avançado', time: '20 min', isNew: true },
        { slug: 'undervolt-cpu-notebook', title: 'Undervolt em Notebooks', description: 'Reduza a temperatura do processador.', difficulty: 'Avançado', time: '25 min', isNew: true },
        { slug: 'overclock-gpu-msi-afterburner', title: 'Overclock Seguro de GPU', description: 'Ganhando FPS grátis com Afterburner.', difficulty: 'Intermediário', time: '20 min', isNew: true },
        { slug: 'limpeza-fisica-pc-gamer', title: 'Limpeza Física do PC', description: 'Como limpar sem queimar componentes.', difficulty: 'Iniciante', time: '30 min', isNew: true },
        { slug: 'calibrar-bateria-notebook', title: 'Calibrar Bateria de Notebook', description: 'Restaure a duração da bateria viciada.', difficulty: 'Iniciante', time: '15 min', isNew: true },
        { slug: 'verificar-saude-hd-ssd-crystaldiskinfo', title: 'Verificar Saúde HD/SSD', description: 'Interpretando erros SMART com CrystalDiskInfo.', difficulty: 'Iniciante', time: '5 min', isNew: true }
      ]
    },
    {
      id: 'perifericos',
      title: 'Periféricos & Setup',
      description: 'Monitores, mouses e organização',
      icon: Headphones,
      color: '#31A8FF',
      guides: [
        { slug: 'monitor-ips-vs-va-vs-tn-jogos', title: 'Monitor IPS vs VA vs TN', description: 'Qual painel tem as melhores cores e velocidade?', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'calibrar-cores-monitor', title: 'Calibrar Cores do Monitor', description: 'Melhore a imagem sem gastar nada.', difficulty: 'Iniciante', time: '15 min', isNew: true },
        { slug: 'hdmi-2.1-vs-displayport-1.4-diferencas', title: 'HDMI 2.1 vs DisplayPort 1.4', description: 'Qual cabo usar para 144Hz e G-Sync?', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'mousepad-speed-vs-control', title: 'Mousepad Speed vs Control', description: 'Escolhendo a superfície certa para sua mira.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'teclados-mecanicos-switches-guia', title: 'Switches de Teclado Mecânico', description: 'Blue, Red, Brown: qual escolher?', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'mouse-clique-duplo-falhando-fix', title: 'Mouse com Clique Duplo (Fix)', description: 'Conserte falhas de clique (Double Click).', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'cadeira-gamer-vs-escritorio-ergonomia', title: 'Cadeira Gamer vs Escritório', description: 'Ergonomia e durabilidade comparadas.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'cable-management-organizacao-cabos-pc', title: 'Organização de Cabos (Basico)', description: 'Esconda os fios do seu setup.', difficulty: 'Iniciante', time: '20 min', isNew: true },
        { slug: 'segundo-monitor-vertical-configurar', title: 'Segundo Monitor na Vertical', description: 'Configuração para produtividade e stream.', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'webcam-piscando-tela-preta-fix', title: 'Webcam Piscando (Fix)', description: 'Ajuste de 50Hz/60Hz e drivers.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'aumentar-volume-microfone-windows', title: 'Aumentar Volume Microfone', description: 'Ativando o Microphone Boost +20dB.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'teclado-desconfigurado-abnt2-ansi', title: 'Teclado Desconfigurado (Ç)', description: 'ABNT2 vs ANSI: Qual layout usar?', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'headset-7.1-real-vs-virtual-vale-a-pena', title: 'Headset 7.1 vs Estéreo', description: 'Mito ou verdade sobre som surround.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'corrigir-audio-chiado-windows', title: 'Corrigir Áudio Chiando', description: 'Resolva problemas de estática e sample rate.', difficulty: 'Intermediário', time: '10 min', isNew: true }
      ]
    },
    {
      id: 'software',
      title: 'Software & Utils',
      description: 'Ferramentas essenciais e Windows',
      icon: LayoutGrid,
      color: '#31FF8B',
      guides: [
        { slug: 'formatacao-windows', title: 'Formatação Limpa Windows 10/11', description: 'O guia clássico e definitivo.', difficulty: 'Intermediário', time: '60 min' },
        { slug: 'debloating-windows-11', title: 'Windows 11 Debloat', description: 'Remova apps inúteis e ganhe performance.', difficulty: 'Avançado', time: '20 min', isNew: true },
        { slug: 'god-mode-windows-11-ativar', title: 'God Mode (Modo de Deus)', description: 'Todas as configs do Windows numa pasta.', difficulty: 'Iniciante', time: '2 min', isNew: true },
        { slug: 'windows-sandbox-testar-virus', title: 'Windows Sandbox', description: 'Teste arquivos suspeitos com segurança total.', difficulty: 'Intermediário', time: '10 min', isNew: true },
        { slug: 'como-usar-obs-studio-gravar-tela', title: 'Gravar Tela com OBS Studio', description: 'Configuração leve para gravar gameplay.', difficulty: 'Intermediário', time: '20 min', isNew: true },
        { slug: 'streamlabs-vs-obs-qual-usar', title: 'OBS Studio vs Streamlabs', description: 'Qual pesa menos no PC fraco?', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'winrar-vs-7zip-qual-melhor', title: 'WinRAR vs 7-Zip', description: 'Por que o 7-Zip é superior.', difficulty: 'Iniciante', time: '2 min', isNew: true },
        { slug: 'discord-otimizar-para-jogos', title: 'Otimizar Discord para Jogos', description: 'Desative aceleração de hardware e overlay.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'atalhos-navegador-produtividade', title: '50 Atalhos de Navegador', description: 'Dobre sua produtividade na web.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'criar-ponto-restauracao-windows', title: 'Criar Ponto de Restauração', description: 'Salva-vidas antes de instalar drivers.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'formatfactory-vs-handbrake-converter-video', title: 'FormatFactory vs Handbrake', description: 'Melhor conversor de vídeos gratuito.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'hdr-windows-vale-a-pena-jogos', title: 'HDR no Windows 11', description: 'Corrija as cores lavadas em jogos HDR.', difficulty: 'Intermediário', time: '10 min', isNew: true },
        { slug: 'recuperacao-sistema', title: 'Recuperação de Sistema', description: 'Guia antigo mas funcional.', difficulty: 'Iniciante', time: '10 min' },
        { slug: 'limpeza-computador', title: 'Limpeza de Disco', description: 'Remova lixo do sistema.', difficulty: 'Iniciante', time: '15 min' },
        { slug: 'bluestacks-vs-ldplayer-qual-mais-leve', title: 'BlueStacks vs LDPlayer', description: 'Qual emulador Android pesa menos?', difficulty: 'Iniciante', time: '15 min', isNew: true },
        { slug: 'tlauncher-viring-falso-positivo', title: 'TLauncher tem Vírus?', description: 'Analise de segurança e alternativas seguras.', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'steam-tarda-baixar-lento-fix', title: 'Steam: Download Lento', description: 'Mude a região para acelerar downloads.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'epic-games-launcher-lento-cpu-fix', title: 'Epic Launcher: Uso de CPU', description: 'Deixe a Epic leve como a Steam.', difficulty: 'Intermediário', time: '10 min', isNew: true },
        { slug: 'google-play-games-pc-beta-vale-a-pena', title: 'Google Play Games PC Beta', description: 'Vale a pena usar o emulador oficial?', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'xbox-app-nao-baixa-jogos-gamepass', title: 'Xbox App Não Baixa Jogos', description: 'Fix Game Pass (Erro 0x80070001).', difficulty: 'Iniciante', time: '10 min', isNew: true }
      ]
    },
    {
      id: 'rede-seguranca',
      title: 'Rede & Segurança',
      description: 'Proteção, Wi-Fi e VPN',
      icon: Shield,
      color: '#8B31FF',
      guides: [
        { slug: 'melhor-dns-jogos-2026', title: 'Melhor DNS para Jogos 2026', description: 'Cloudflare vs Google: Teste de latência.', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'wifi-desconectando-sozinho-windows', title: 'Wi-Fi Caindo Sozinho (Fix)', description: 'Desative a economia de energia do adaptador.', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'bloquear-internet-firewall-windows', title: 'Bloquear Internet no Firewall', description: 'Impedir programas de acessar a rede.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'configurar-vpn-windows-11', title: 'VPN Nativa no Windows', description: 'Configurar IKEv2 sem instalar programas.', difficulty: 'Intermediário', time: '10 min', isNew: true },
        { slug: 'backup-automatico-nuvem', title: 'Backup Automático na Nuvem', description: 'A regra 3-2-1 para nunca perder dados.', difficulty: 'Iniciante', time: '15 min', isNew: true },
        { slug: 'bitlocker-desempenho-jogos-ssd', title: 'BitLocker Cai Performance?', description: 'Mito ou verdade sobre criptografia em jogos.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'instalar-impressora-wifi', title: 'Instalar Impressora Wi-Fi', description: 'Resolva problemas de conectividade.', difficulty: 'Iniciante', time: '15 min', isNew: true },
        { slug: 'seguranca-wifi-avancada', title: 'Segurança Wi-Fi', description: 'Proteja sua rede doméstica.', difficulty: 'Intermediário', time: '20 min' },
        { slug: 'remocao-virus-malware', title: 'Remoção de Vírus', description: 'Limpeza profunda de malware.', difficulty: 'Intermediário', time: '45 min' },
        { slug: 'seguranca-wifi-wpa3', title: 'Segurança Wi-Fi WPA3', description: 'O novo padrão de proteção para sua rede.', difficulty: 'Intermediário', time: '10 min', isNew: true },
        { slug: 'melhor-dns-para-jogos-google-vs-cloudflare', title: 'Melhor DNS: Google vs Cloudflare', description: 'Benchmarking de latência e estabilidade.', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'exitlag-vale-a-pena-ou-enganacao', title: 'ExitLag Vale a Pena?', description: 'Quando pagar por redutor de ping ajuda.', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'reduzir-ping-regedit-cmd-jogos', title: 'Reduzir Ping: Regedit & CMD', description: 'Desativando Nagle Algorithm (TcpAckFrequency).', difficulty: 'Avançado', time: '15 min', isNew: true },
        { slug: 'perda-de-pacote-packet-loss-fix', title: 'Packet Loss: Como Resolver', description: 'Diagnóstico de perda de pacotes e cabos.', difficulty: 'Intermediário', time: '15 min', isNew: true },
        { slug: 'abrir-portas-roteador-nat-aberto', title: 'Abrir Portas (NAT Aberto)', description: 'UPnP vs Port Forwarding para host.', difficulty: 'Avançado', time: '15 min', isNew: true },
        { slug: 'como-limpar-cache-dns-ip-flushdns', title: 'CMD: Limpar Cache DNS', description: 'Comandos para restaurar conexão caída.', difficulty: 'Iniciante', time: '5 min', isNew: true }
      ]
    },
    {
      id: 'windows-geral',
      title: 'Windows & Sistema',
      description: 'Manutenção e Instalação',
      icon: Monitor,
      color: '#31A8FF',
      guides: [
        { slug: 'instalacao-windows-11', title: 'Instalação do Windows 11', description: 'Guia passo a passo.', difficulty: 'Iniciante', time: '45 min' },
        { slug: 'otimizacao-performance', title: 'Otimização Extrema', description: 'Para PCs muito fracos.', difficulty: 'Avançado', time: '40 min' },
        { slug: 'manutencao-preventiva', title: 'Manutenção Preventiva', description: 'Cuide do seu PC.', difficulty: 'Iniciante', time: '20 min' },
        { slug: 'gestao-servicos', title: 'Gestão de Serviços', description: 'Desative serviços inúteis.', difficulty: 'Avançado', time: '15 min' },
        { slug: 'otimizacao-ssd-windows-11', title: 'Otimização de SSD', description: 'Configurações para máxima velocidade do disco.', difficulty: 'Intermediário', time: '10 min', isNew: true },
        { slug: 'limpar-memoria-ram-windows', title: 'Limpar Memória RAM (ISLC)', description: 'Libere RAM para jogos pesados.', difficulty: 'Iniciante', time: '5 min', isNew: true },
        { slug: 'remover-bloatware-windows-powershell', title: 'Remover Bloatware (PowerShell)', description: 'Script para desinstalar lixo do Windows.', difficulty: 'Intermediário', time: '10 min', isNew: true },
        { slug: 'limpeza-disco-profunda-arquivos-temporarios', title: 'Limpeza de Disco Profunda', description: 'Além do %temp% (Prefetch/SoftwareDistribution).', difficulty: 'Iniciante', time: '10 min', isNew: true },
        { slug: 'pasta-windows-winsxs-gigante-como-limpar', title: 'Limpar Pasta WinSxS', description: 'Comando DISM para liberar 10GB+.', difficulty: 'Avançado', time: '15 min', isNew: true }
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
                                {guide.isNew && (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#FF4B6B] animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B6B]"></span>
                                    NOVO
                                  </span>
                                )}
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