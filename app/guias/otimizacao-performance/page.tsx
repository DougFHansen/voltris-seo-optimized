'use client';

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSenseBanner from '../../components/AdSenseBanner';
import Link from 'next/link';

export default function OtimizacaoPerformanceGuide() {
  return (
    <>
      <Header />
      <main className="bg-[#171313] min-h-screen pt-24">
        {/* Breadcrumbs */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/guias" className="hover:text-white transition-colors">Guias</Link>
            <span>/</span>
            <span className="text-white">Otimização de Performance</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#31A8FF]/30 to-[#8B31FF]/30 text-white mb-4">
                Otimização
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
                Como Otimizar a Performance do Seu PC
              </h1>
              <p className="text-gray-400 text-lg mb-4">
                <strong className="text-white">Tempo de leitura:</strong> 12 minutos | <strong className="text-white">Dificuldade:</strong> Intermediário
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Descubra técnicas profissionais para acelerar seu computador, liberar espaço em disco, otimizar a inicialização e melhorar significativamente o desempenho geral do sistema sem precisar formatar.
              </p>
            </div>
          </div>
        </section>

        <AdSenseBanner />

        {/* Main Content */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Introdução */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#8B31FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Por Que Otimizar Seu Computador?</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Com o tempo, o uso normal do computador resulta em acúmulo de arquivos temporários, fragmentação de disco, programas desnecessários na inicialização, e configurações que não estão otimizadas. Esses fatores combinados fazem com que seu computador fique progressivamente mais lento.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                A otimização regular do sistema pode restaurar significativamente a velocidade original do seu computador sem a necessidade de formatar. Este processo é menos invasivo, preserva todos os seus dados e programas, e pode ser feito periodicamente para manter o desempenho sempre no máximo.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Este guia apresenta técnicas testadas e comprovadas que são utilizadas por profissionais de suporte técnico para melhorar o desempenho de computadores. Seguindo estas dicas, você pode esperar melhorias de 30% a 50% na velocidade geral do sistema.
              </p>
            </div>

            {/* Limpeza de Arquivos Temporários */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#FF4B6B]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Passo 1: Limpeza Profunda de Arquivos Temporários</h2>
              
              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Usando a Ferramenta de Limpeza de Disco do Windows</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                O Windows inclui uma ferramenta poderosa para limpar arquivos temporários:
              </p>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Pressione <kbd className="bg-[#2a2a2e] px-2 py-1 rounded">Windows + R</kbd> para abrir o Executar</li>
                <li>Digite <code className="bg-[#2a2a2e] px-2 py-1 rounded">cleanmgr</code> e pressione Enter</li>
                <li>Selecione a unidade C: (ou a unidade principal onde o Windows está instalado)</li>
                <li>Aguarde o Windows calcular o espaço que pode ser liberado</li>
                <li>Na janela de limpeza, marque todas as opções disponíveis</li>
                <li>Clique em "Limpar arquivos do sistema" (pode pedir permissão de administrador)</li>
                <li>Aguarde o processo de limpeza (pode levar de 10 a 30 minutos)</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Limpeza Manual de Pastas Temporárias</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Para uma limpeza mais profunda, você pode limpar manualmente as pastas de arquivos temporários:
              </p>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-4">
                <li>Pressione <kbd className="bg-[#2a2a2e] px-2 py-1 rounded">Windows + R</kbd></li>
                <li>Digite <code className="bg-[#2a2a2e] px-2 py-1 rounded">%temp%</code> e pressione Enter</li>
                <li>Selecione todos os arquivos (Ctrl + A) e exclua (Delete)</li>
                <li>Repita o processo para <code className="bg-[#2a2a2e] px-2 py-1 rounded">C:\Windows\Temp</code></li>
                <li>Repita para <code className="bg-[#2a2a2e] px-2 py-1 rounded">C:\Users\[SeuUsuário]\AppData\Local\Temp</code></li>
              </ol>

              <div className="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30 mt-4">
                <p className="text-white font-semibold mb-2">⚠️ Atenção:</p>
                <p className="text-gray-300 leading-relaxed">
                  Alguns arquivos podem estar em uso e não poderão ser excluídos. Isso é normal - apenas ignore e continue. Não force a exclusão de arquivos que não podem ser removidos.
                </p>
              </div>
            </div>

            {/* Otimização de Inicialização */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#31A8FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Passo 2: Otimização de Programas na Inicialização</h2>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                Programas que iniciam automaticamente com o Windows são uma das principais causas de lentidão na inicialização e consumo excessivo de recursos. Muitos programas se instalam automaticamente na inicialização sem você perceber.
              </p>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Gerenciar Programas de Inicialização</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Pressione <kbd className="bg-[#2a2a2e] px-2 py-1 rounded">Ctrl + Shift + Esc</kbd> para abrir o Gerenciador de Tarefas</li>
                <li>Clique na aba "Inicialização"</li>
                <li>Você verá uma lista de todos os programas que iniciam com o Windows</li>
                <li>Clique em "Impacto na inicialização" para ordenar (coloque primeiro os que têm maior impacto)</li>
                <li>Para cada programa desnecessário, clique com botão direito e selecione "Desabilitar"</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Programas Que Geralmente Podem Ser Desabilitados</h3>
              <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                <li>Clientes de mensageiros (Skype, Discord) - a menos que você precise deles sempre abertos</li>
                <li>Software de atualização de drivers (pode verificar atualizações manualmente)</li>
                <li>Ferramentas de sincronização em nuvem (se não precisar sempre sincronizado)</li>
                <li>Programas de assistente virtual</li>
                <li>Utilitários de hardware que você não usa regularmente</li>
              </ul>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Programas Que Devem Permanecer Ativados</h3>
              <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                <li>Antivírus (essencial para segurança)</li>
                <li>Drivers importantes de hardware</li>
                <li>Software de segurança e firewall</li>
              </ul>

              <div className="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30 mt-4">
                <p className="text-white font-semibold mb-2">💡 Dica Profissional:</p>
                <p className="text-gray-300 leading-relaxed">
                  Se você não tem certeza sobre um programa, faça uma busca rápida na internet sobre o nome do programa. Se for importante para o funcionamento do sistema, mantenha ativado. Quando em dúvida, é melhor ser conservador e manter ativado.
                </p>
              </div>
            </div>

            {/* Otimização de Memória RAM */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#8B31FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Passo 3: Otimização de Memória RAM</h2>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                A memória RAM é um componente crítico para o desempenho. Quando ela está quase cheia, o Windows usa o disco rígido como memória virtual (swap), o que é extremamente mais lento.
              </p>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Verificar Uso de Memória</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Abra o Gerenciador de Tarefas (Ctrl + Shift + Esc)</li>
                <li>Vá na aba "Desempenho"</li>
                <li>Clique em "Memória" para ver o uso detalhado</li>
                <li>Verifique a porcentagem de uso - se estiver constantemente acima de 80%, há problema</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Fechar Programas Não Utilizados</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Programas que você não está usando mas estão abertos consomem memória RAM. Fechar programas desnecessários libera memória imediatamente:
              </p>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-4">
                <li>Na aba "Processos" do Gerenciador de Tarefas, ordene por "Memória"</li>
                <li>Identifique programas que estão consumindo muita memória</li>
                <li>Feche programas que você não está usando</li>
                <li>Navegadores com muitas abas abertas consomem muita memória - feche abas desnecessárias</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Desativar Serviços Desnecessários</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Alguns serviços do Windows executam em segundo plano e consomem memória mesmo quando não são necessários:
              </p>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-4">
                <li>Pressione <kbd className="bg-[#2a2a2e] px-2 py-1 rounded">Windows + R</kbd></li>
                <li>Digite <code className="bg-[#2a2a2e] px-2 py-1 rounded">services.msc</code> e pressione Enter</li>
                <li>Você verá uma lista de todos os serviços do sistema</li>
                <li>Pesquise sobre serviços antes de desabilitar - alguns são essenciais</li>
                <li>Serviços geralmente seguros para desabilitar incluem: Windows Search (se não usar busca), Telemetria, alguns serviços de impressão (se não tiver impressora)</li>
                  <li>Clique com botão direito no serviço &gt; Propriedades &gt; Tipo de inicialização: Desabilitado</li>
              </ol>
            </div>

            {/* Otimização de Disco */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#FF4B6B]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Passo 4: Otimização do Disco Rígido</h2>
              
              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Desfragmentação de Disco (HDD)</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Se você tem um disco rígido tradicional (HDD), não SSD, a desfragmentação pode melhorar significativamente o desempenho:
              </p>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Pressione <kbd className="bg-[#2a2a2e] px-2 py-1 rounded">Windows + R</kbd></li>
                <li>Digite <code className="bg-[#2a2a2e] px-2 py-1 rounded">dfrgui</code> e pressione Enter</li>
                <li>Selecione a unidade que deseja otimizar</li>
                <li>Clique em "Otimizar"</li>
                <li>O processo pode levar várias horas dependendo do tamanho e fragmentação do disco</li>
              </ol>

              <div className="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30 mb-4">
                <p className="text-white font-semibold mb-2">⚠️ IMPORTANTE:</p>
                <p className="text-gray-300 leading-relaxed">
                  <strong>NÃO desfragmente SSDs (Solid State Drives)</strong>. SSDs não precisam de desfragmentação e o processo pode reduzir sua vida útil. Para SSDs, o Windows usa otimização automática diferente (TRIM).
                </p>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Verificação de Erros no Disco</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Erros no disco podem causar lentidão e instabilidade. Verificar e corrigir erros periodicamente é importante:
              </p>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-4">
                <li>Abra o Explorador de Arquivos</li>
                <li>Clique com botão direito na unidade C: (ou unidade principal)</li>
                <li>Vá em Propriedades > Aba Ferramentas</li>
                <li>Clique em "Verificar" em Verificação de erros</li>
                <li>O Windows pode pedir para agendar a verificação na próxima reinicialização</li>
                <li>Aceite e reinicie o computador para executar a verificação</li>
              </ol>
            </div>

            {/* Otimização de Registro */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#31A8FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Passo 5: Otimização do Registro do Windows</h2>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                O registro do Windows é uma base de dados que armazena configurações do sistema e programas. Com o tempo, ele pode acumular entradas inválidas, duplicadas ou órfãs de programas desinstalados, o que pode causar lentidão.
              </p>

              <div className="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30 mb-4">
                <p className="text-white font-semibold mb-2">⚠️ AVISO CRÍTICO:</p>
                <p className="text-gray-300 leading-relaxed">
                  A manipulação incorreta do registro do Windows pode causar problemas graves no sistema. Sempre faça backup do registro antes de fazer qualquer alteração. Se não se sentir confiante, é melhor usar ferramentas confiáveis de limpeza de registro ou deixar este passo para um profissional.
                </p>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Fazer Backup do Registro</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Pressione <kbd className="bg-[#2a2a2e] px-2 py-1 rounded">Windows + R</kbd></li>
                <li>Digite <code className="bg-[#2a2a2e] px-2 py-1 rounded">regedit</code> e pressione Enter</li>
                <li>No Editor de Registro, clique em Arquivo > Exportar</li>
                <li>Escolha um local seguro e salve com um nome descritivo (ex: "backup-registro-antes-otimizacao.reg")</li>
                <li>Aguarde o backup ser concluído</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Ferramentas de Limpeza de Registro</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Para usuários menos experientes, recomenda-se usar ferramentas profissionais e confiáveis de limpeza de registro. Algumas opções populares e seguras incluem CCleaner, Wise Registry Cleaner, ou Auslogics Registry Cleaner. Sempre baixe de fontes oficiais e faça backup antes de usar.
              </p>
            </div>

            {/* Otimização de Rede */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#8B31FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Passo 6: Otimização de Rede</h2>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                Configurações de rede otimizadas podem melhorar significativamente a velocidade de navegação e downloads:
              </p>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Ajustar Configurações TCP/IP</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Abra o Prompt de Comando como Administrador (clique com botão direito no menu Iniciar > Prompt de Comando (Admin))</li>
                <li>Execute os seguintes comandos um por vez:
                  <ul className="mt-2 space-y-1 ml-6">
                    <li><code className="bg-[#2a2a2e] px-2 py-1 rounded">netsh int tcp set global autotuninglevel=normal</code></li>
                    <li><code className="bg-[#2a2a2e] px-2 py-1 rounded">netsh int tcp set global chimney=enabled</code></li>
                    <li><code className="bg-[#2a2a2e] px-2 py-1 rounded">netsh int tcp set global rss=enabled</code></li>
                  </ul>
                </li>
                <li>Reinicie o computador para aplicar as alterações</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Limpar Cache DNS</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                O cache DNS armazena informações sobre sites visitados. Limpar periodicamente pode resolver problemas de conectividade:
              </p>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-4">
                <li>Abra o Prompt de Comando como Administrador</li>
                <li>Execute: <code className="bg-[#2a2a2e] px-2 py-1 rounded">ipconfig /flushdns</code></li>
                <li>Aguarde a confirmação de que o cache foi limpo</li>
              </ol>
            </div>

            {/* Conclusão */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#8B31FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Conclusão</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Seguindo este guia de otimização, você deve notar melhorias significativas no desempenho do seu computador. A chave para manter o desempenho é realizar essas otimizações regularmente - recomenda-se fazer uma limpeza e otimização a cada 2-3 meses.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Se após realizar todas essas otimizações o computador ainda estiver lento, pode ser necessário considerar formatação ou verificação de hardware (possível necessidade de mais RAM ou substituição do disco rígido por SSD).
              </p>
              <div className="bg-[#171313] p-6 rounded-lg border border-[#31A8FF]/30 mt-6">
                <p className="text-white font-semibold mb-3 text-lg">Precisa de Ajuda Profissional?</p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Se preferir que nossos especialistas otimizem seu computador profissionalmente, oferecemos serviços de otimização remota completos e seguros.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/otimizacao-pc"
                    className="px-6 py-3 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 text-center"
                  >
                    Ver Planos de Otimização
                    </Link>
                  <Link 
                    href="https://wa.me/5511996716235?text=Olá!%20Gostaria%20de%20falar%20sobre%20otimização%20de%20PC."
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

        {/* Related Guides */}
        <section className="py-12 px-4 bg-[#1D1919]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Guias Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/guias/limpeza-computador" className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-xl border border-[#8B31FF]/10 hover:border-[#FF4B6B]/30 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-2">Limpeza Completa do Computador</h3>
                <p className="text-gray-400 text-sm">Técnicas avançadas para limpar seu computador profundamente.</p>
              </Link>
              <Link href="/guias/manutencao-preventiva" className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-xl border border-[#31A8FF]/10 hover:border-[#FF4B6B]/30 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-2">Manutenção Preventiva</h3>
                <p className="text-gray-400 text-sm">Mantenha seu computador otimizado com rotinas regulares.</p>
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

