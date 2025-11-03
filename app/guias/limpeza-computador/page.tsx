'use client';

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSenseBanner from '../../components/AdSenseBanner';
import Link from 'next/link';

export default function LimpezaComputadorGuide() {
  return (
    <>
      <Header />
      <main className="bg-[#171313] min-h-screen pt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/guias" className="hover:text-white transition-colors">Guias</Link>
            <span>/</span>
            <span className="text-white">Limpeza de Computador</span>
          </nav>
        </div>

        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#8B31FF]/30 to-[#FF4B6B]/30 text-white mb-4">
              Limpeza
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
              Limpeza Completa do Computador
            </h1>
            <p className="text-gray-400 text-lg mb-4">
              <strong className="text-white">Tempo de leitura:</strong> 11 minutos | <strong className="text-white">Dificuldade:</strong> Básico
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Técnicas profissionais para limpar arquivos temporários, cache, programas desnecessários e otimizar o espaço em disco do seu computador. Guia completo sobre limpeza de sistema, navegadores, programas e otimização de espaço de armazenamento.
            </p>
          </div>
        </section>

        <AdSenseBanner />

        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#8B31FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Por Que Fazer Limpeza Regular?</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Com o tempo, seu computador acumula arquivos temporários, cache, logs, arquivos antigos e programas que não são mais necessários. Esses arquivos ocupam espaço em disco, podem causar lentidão e tornar o sistema mais difícil de navegar e gerenciar.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Uma limpeza regular pode liberar gigabytes de espaço em disco, melhorar a velocidade do sistema e tornar seu computador mais organizado. Além disso, remove arquivos que podem conter informações desnecessárias ou até mesmo problemas de privacidade (como cache de navegação).
              </p>
              <p className="text-gray-300 leading-relaxed">
                Este guia apresenta uma limpeza completa passo a passo, cobrindo todos os aspectos do sistema, navegadores e programas instalados. Fazer essa limpeza a cada 2-3 meses mantém seu computador funcionando de forma otimizada.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#FF4B6B]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Passo 1: Limpeza de Arquivos Temporários do Windows</h2>
              
              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Usando Limpeza de Disco</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                O Windows inclui uma ferramenta poderosa para limpar arquivos temporários:
              </p>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Pressione <kbd className="bg-[#2a2a2e] px-2 py-1 rounded">Windows + R</kbd></li>
                <li>Digite <code className="bg-[#2a2a2e] px-2 py-1 rounded">cleanmgr</code> e pressione Enter</li>
                <li>Selecione a unidade C: (ou unidade principal)</li>
                <li>Aguarde o Windows calcular o espaço que pode ser liberado</li>
                <li>Na lista, marque TODAS as opções disponíveis:
                  <ul className="mt-2 space-y-1 ml-6">
                    <li>Arquivos temporários</li>
                    <li>Logs do Windows</li>
                    <li>Lixeira</li>
                    <li>Miniaturas</li>
                    <li>Arquivos de internet temporários</li>
                    <li>Arquivos de otimização de entrega</li>
                  </ul>
                </li>
                <li>Clique em "Limpar arquivos do sistema" (pode pedir permissão de administrador)</li>
                <li>Marque todas as opções novamente na nova tela</li>
                <li>Clique em "OK" e aguarde a limpeza (pode levar 10-30 minutos)</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Limpeza Manual de Pastas Temporárias</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Para limpeza mais profunda, limpe manualmente as pastas temporárias:
              </p>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-4">
                <li>Pressione <kbd className="bg-[#2a2a2e] px-2 py-1 rounded">Windows + R</kbd></li>
                <li>Digite <code className="bg-[#2a2a2e] px-2 py-1 rounded">%temp%</code> e pressione Enter</li>
                <li>Selecione todos os arquivos (Ctrl + A)</li>
                <li>Tente excluir (Delete) - alguns arquivos em uso não serão excluídos, ignore</li>
                <li>Repita para <code className="bg-[#2a2a2e] px-2 py-1 rounded">C:\Windows\Temp</code></li>
                <li>Repita para <code className="bg-[#2a2a2e] px-2 py-1 rounded">C:\Users\[SeuUsuário]\AppData\Local\Temp</code></li>
              </ol>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#31A8FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Passo 2: Limpeza de Cache de Navegadores</h2>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                Navegadores acumulam muito cache e dados que podem ser limpos:
              </p>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Google Chrome</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Abra o Chrome</li>
                <li>Pressione <kbd className="bg-[#2a2a2e] px-2 py-1 rounded">Ctrl + Shift + Delete</kbd></li>
                <li>Escolha "Todo o período" no intervalo de tempo</li>
                <li>Marque: Histórico de navegação, Cookies e dados de sites, Imagens e arquivos em cache</li>
                <li>Clique em "Limpar dados"</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Microsoft Edge</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Abra o Edge</li>
                <li>Pressione <kbd className="bg-[#2a2a2e] px-2 py-1 rounded">Ctrl + Shift + Delete</kbd></li>
                <li>Escolha "Todo o período"</li>
                <li>Marque as mesmas opções do Chrome</li>
                <li>Clique em "Limpar agora"</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Mozilla Firefox</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-4">
                <li>Abra o Firefox</li>
                <li>Pressione <kbd className="bg-[#2a2a2e] px-2 py-1 rounded">Ctrl + Shift + Delete</kbd></li>
                <li>Escolha "Tudo" no intervalo</li>
                <li>Marque as opções de cache e dados</li>
                <li>Clique em "Limpar agora"</li>
              </ol>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#8B31FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Passo 3: Desinstalar Programas Não Utilizados</h2>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                Programas instalados ocupam espaço e podem ter arquivos residuais mesmo após desinstalação:
              </p>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Desinstalar Programas</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Vá em Configurações &gt; Aplicativos &gt; Aplicativos e recursos</li>
                <li>Revise a lista de programas instalados</li>
                <li>Ordenar por tamanho para ver programas que ocupam mais espaço</li>
                <li>Para cada programa que você não usa mais:
                  <ul className="mt-2 space-y-1 ml-6">
                    <li>Clique no programa</li>
                    <li>Clique em "Desinstalar"</li>
                    <li>Siga o processo de desinstalação</li>
                  </ul>
                </li>
                <li>Reinicie o computador após desinstalar vários programas</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Programas Comuns que Podem Ser Removidos</h3>
              <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                <li>Programas de avaliação/trial que expiraram</li>
                <li>Jogos que você não joga mais</li>
                <li>Utilitários antigos não utilizados</li>
                <li>Múltiplos navegadores (mantenha apenas 1-2)</li>
                <li>Programas pré-instalados pelo fabricante que você não usa</li>
                <li>Ferramentas antigas de software</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#FF4B6B]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Passo 4: Limpar Arquivos de Sistema e Logs</h2>
              
              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Limpar Logs do Windows</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Logs do Windows podem acumular muito espaço ao longo do tempo:
              </p>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Pressione <kbd className="bg-[#2a2a2e] px-2 py-1 rounded">Windows + R</kbd></li>
                <li>Digite <code className="bg-[#2a2a2e] px-2 py-1 rounded">eventvwr.msc</code> e pressione Enter</li>
                <li>No Visualizador de Eventos, expanda "Logs do Windows"</li>
                <li>Para cada log (Aplicativo, Sistema, Segurança):
                  <ul className="mt-2 space-y-1 ml-6">
                    <li>Clique com botão direito no log</li>
                    <li>Escolha "Limpar log"</li>
                    <li>Salve o log atual se solicitado</li>
                    <li>Confirme a limpeza</li>
                  </ul>
                </li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Limpar Arquivos de Atualização Antigos</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                O Windows mantém arquivos de atualizações antigas que podem ser removidos:
              </p>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-4">
                <li>Use a Limpeza de Disco (cleanmgr) novamente</li>
                <li>Clique em "Limpar arquivos do sistema"</li>
                <li>Marque "Arquivos de atualização anteriores do Windows" (se disponível)</li>
                <li>Isso pode liberar vários GB de espaço</li>
              </ol>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#31A8FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Passo 5: Limpar Downloads e Arquivos Grandes</h2>
              
              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Analisar Espaço em Disco</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Abra o Explorador de Arquivos</li>
                <li>Clique com botão direito na unidade C: &gt; Propriedades</li>
                <li>Use a ferramenta de "Limpeza de disco" ou ferramentas como WinDirStat para ver o que ocupa espaço</li>
                <li>Identifique pastas grandes que podem ser limpas</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Limpar Pasta de Downloads</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                A pasta Downloads frequentemente acumula muitos arquivos:
              </p>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Navegue até a pasta Downloads</li>
                <li>Ordene arquivos por data ou tamanho</li>
                <li>Delete arquivos antigos ou que você não precisa mais:
                  <ul className="mt-2 space-y-1 ml-6">
                    <li>Instaladores antigos de programas já instalados</li>
                    <li>Arquivos temporários baixados</li>
                    <li>Documentos antigos que já foram arquivados</li>
                  </ul>
                </li>
                <li>Mova arquivos importantes para outra pasta antes de deletar</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Encontrar Arquivos Duplicados</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Arquivos duplicados ocupam espaço desnecessário:
              </p>
              <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                <li>Use ferramentas como Duplicate Cleaner ou similares</li>
                <li>Ou procure manualmente em pastas onde você sabe que pode haver duplicatas</li>
                <li>Cuidado ao deletar - certifique-se de que são realmente duplicatas</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#8B31FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Passo 6: Limpar Cache de Programas</h2>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                Muitos programas criam cache que pode ser limpo:
              </p>

              <ul className="space-y-3 text-gray-300 list-disc list-inside ml-4 mb-6">
                <li><strong className="text-white">Spotify, Discord, Steam:</strong> Esses programas criam cache grande. Procure nas configurações de cada programa opções para limpar cache</li>
                <li><strong className="text-white">Adobe Creative Cloud:</strong> Pode acumular muito cache</li>
                <li><strong className="text-white">Office:</strong> Limpe cache do Office nas configurações</li>
                <li><strong className="text-white">Jogos:</strong> Muitos jogos criam cache de texturas e dados</li>
              </ul>

              <div className="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30 mb-4">
                <p className="text-white font-semibold mb-2">💡 Dica:</p>
                <p className="text-gray-300 leading-relaxed">
                  Para encontrar pastas de cache de programas, procure em <code className="bg-[#2a2a2e] px-2 py-1 rounded">C:\Users\[SeuUsuário]\AppData\Local</code> e <code className="bg-[#2a2a2e] px-2 py-1 rounded">AppData\Roaming</code>. Tenha cuidado - deletar cache errado pode fazer programas perderem configurações.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#FF4B6B]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Checklist de Limpeza Completa</h2>
              
              <div className="bg-[#171313] p-6 rounded-lg border border-[#FF4B6B]/30 mb-4">
                <h3 className="text-xl font-bold text-white mb-4">Limpeza Básica (Mensal)</h3>
                <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4">
                  <li>☐ Limpeza de Disco do Windows</li>
                  <li>☐ Limpar cache de navegadores</li>
                  <li>☐ Limpar pasta Downloads</li>
                  <li>☐ Desinstalar programas não usados</li>
                </ul>
              </div>

              <div className="bg-[#171313] p-6 rounded-lg border border-[#31A8FF]/30 mb-4">
                <h3 className="text-xl font-bold text-white mb-4">Limpeza Profunda (Trimestral)</h3>
                <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4">
                  <li>☐ Limpar pastas temporárias manualmente</li>
                  <li>☐ Limpar logs do Windows</li>
                  <li>☐ Remover arquivos de atualização antigos</li>
                  <li>☐ Limpar cache de todos os programas</li>
                  <li>☐ Procurar e remover arquivos duplicados</li>
                  <li>☐ Analisar e limpar arquivos grandes não utilizados</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#31A8FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Conclusão</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Uma limpeza completa regular mantém seu computador funcionando de forma otimizada, libera espaço em disco e pode melhorar significativamente a velocidade do sistema. A frequência ideal depende do uso - computadores usados intensivamente podem precisar de limpeza mais frequente.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Sempre tenha cuidado ao deletar arquivos. Se você não tiver certeza sobre um arquivo, é melhor pesquisar antes de deletar. Arquivos importantes devem estar em backup antes de qualquer limpeza mais agressiva.
              </p>
              <div className="bg-[#171313] p-6 rounded-lg border border-[#31A8FF]/30 mt-6">
                <p className="text-white font-semibold mb-3 text-lg">Limpeza Profissional Disponível</p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Se você prefere que nossa equipe faça uma limpeza completa e profissional do seu computador, oferecemos serviços de limpeza remota segura e eficiente.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/otimizacao-pc"
                    className="px-6 py-3 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 text-center"
                  >
                    Ver Serviços de Limpeza
                  </Link>
                  <Link 
                    href="https://wa.me/5511996716235?text=Olá!%20Gostaria%20de%20falar%20sobre%20limpeza%20de%20computador."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 border-2 border-[#31A8FF] text-[#31A8FF] font-bold rounded-xl hover:bg-[#31A8FF] hover:text-white transition-all duration-300 text-center"
                  >
                    Falar com Especialista
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-[#1D1919]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Guias Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/guias/otimizacao-performance" className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-xl border border-[#8B31FF]/10 hover:border-[#FF4B6B]/30 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-2">Otimização de Performance</h3>
                <p className="text-gray-400 text-sm">Complete a limpeza com otimização profissional.</p>
              </Link>
              <Link href="/guias/manutencao-preventiva" className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-xl border border-[#31A8FF]/10 hover:border-[#FF4B6B]/30 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-2">Manutenção Preventiva</h3>
                <p className="text-gray-400 text-sm">Mantenha seu computador limpo com rotinas regulares.</p>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <AdSenseBanner />
      <Footer />
    </>
  );
}

