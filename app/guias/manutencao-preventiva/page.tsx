'use client';

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSenseBanner from '../../components/AdSenseBanner';
import Link from 'next/link';

export default function ManutencaoPreventivaGuide() {
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
            <span className="text-white">Manutenção Preventiva</span>
          </nav>
        </div>

        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#8B31FF]/30 to-[#31A8FF]/30 text-white mb-4">
              Manutenção
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
              Manutenção Preventiva de Computadores
            </h1>
            <p className="text-gray-400 text-lg mb-4">
              <strong className="text-white">Tempo de leitura:</strong> 14 minutos | <strong className="text-white">Dificuldade:</strong> Intermediário
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Rotinas de manutenção que você pode fazer regularmente para manter seu computador funcionando perfeitamente e evitar problemas futuros. Aprenda sobre limpeza física, atualizações, verificações de sistema e outras práticas que prolongam a vida útil do seu PC.
            </p>
          </div>
        </section>

        <AdSenseBanner />

        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#8B31FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Por Que Manutenção Preventiva É Essencial?</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Assim como um carro precisa de manutenção regular para funcionar bem, um computador também precisa de cuidados periódicos. A manutenção preventiva é muito mais fácil, rápida e barata do que resolver problemas depois que eles aparecem. Um computador bem mantido funciona melhor, dura mais tempo e é menos propenso a falhas inesperadas.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Problemas que começam pequenos podem se tornar grandes e caros se não forem tratados. Por exemplo, um disco rígido com erros pode falhar completamente, causando perda total de dados. Acúmulo de poeira pode causar superaquecimento e danos permanentes aos componentes. Software desatualizado pode ter vulnerabilidades de segurança exploradas por hackers.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Este guia apresenta uma rotina completa de manutenção preventiva que você pode seguir mensalmente ou trimestralmente. Seguindo estas práticas, você manterá seu computador funcionando de forma otimizada e evitará muitos problemas comuns.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#FF4B6B]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Manutenção Semanal (15 minutos)</h2>
              
              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Verificação Rápida de Antivírus</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Verifique se o antivírus está ativo e atualizado</li>
                <li>Execute uma verificação rápida do sistema</li>
                <li>Verifique se não há ameaças detectadas</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Limpeza Rápida de Arquivos Temporários</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Use a ferramenta de Limpeza de Disco do Windows (<code className="bg-[#2a2a2e] px-2 py-1 rounded">cleanmgr</code>)</li>
                <li>Remova arquivos temporários acumulados</li>
                <li>Limpe cache de navegadores se necessário</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Verificar Espaço em Disco</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Monitore regularmente o espaço disponível no disco:
              </p>
              <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                <li>Disco com menos de 10% de espaço livre pode causar lentidão</li>
                <li>Mantenha pelo menos 15-20% de espaço livre</li>
                <li>Use a ferramenta de Análise de Disco para ver o que está ocupando espaço</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#31A8FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Manutenção Mensal (30-60 minutos)</h2>
              
              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Verificação Completa de Antivírus</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Execute verificação completa do sistema (pode levar 1-2 horas)</li>
                <li>Verifique atualizações do banco de dados de vírus</li>
                <li>Revise configurações de proteção em tempo real</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Atualizações do Sistema</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Verifique atualizações do Windows</li>
                <li>Instale todas as atualizações pendentes</li>
                <li>Reinicie o computador se necessário</li>
                <li>Verifique atualizações de programas críticos</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Verificação de Erros no Disco</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Abra Propriedades da unidade C:</li>
                <li>Vá em Ferramentas &gt; Verificar</li>
                <li>Agende verificação na próxima reinicialização</li>
                <li>Reinicie o computador para executar a verificação</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Desfragmentação (Apenas HDD)</h3>
              <div className="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30 mb-4">
                <p className="text-white font-semibold mb-2">⚠️ Lembrete:</p>
                <p className="text-gray-300 leading-relaxed">
                  <strong>NÃO desfragmente SSDs.</strong> SSDs não precisam de desfragmentação e o processo pode reduzir sua vida útil. Para SSDs, o Windows otimiza automaticamente com TRIM.
                </p>
              </div>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-4">
                <li>Se você tem HDD tradicional, execute desfragmentação mensalmente</li>
                <li>Use a ferramenta de Otimização de Unidades do Windows</li>
                <li>O processo pode levar várias horas</li>
              </ol>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#8B31FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Manutenção Trimestral (2-3 horas)</h2>
              
              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Limpeza Física do Computador</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Acúmulo de poeira pode causar superaquecimento e danos aos componentes:
              </p>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li><strong className="text-white">Desligue completamente o computador</strong> e desconecte da energia</li>
                <li>Abra o gabinete (se for desktop) ou remova a tampa traseira (se for notebook)</li>
                <li>Use ar comprimido ou aspirador de pó com cuidado para remover poeira</li>
                <li>Limpe ventiladores, dissipadores de calor e componentes</li>
                <li>Tenha cuidado para não danificar componentes sensíveis</li>
                <li>Se não se sentir confiante, contrate um profissional</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Verificação de Hardware</h3>
              <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-6">
                <li>Verifique se todos os cabos estão bem conectados</li>
                <li>Teste todas as portas USB</li>
                <li>Verifique se os ventiladores estão funcionando</li>
                <li>Monitore temperaturas do processador e GPU</li>
                <li>Verifique integridade de cabos internos</li>
              </ul>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Backup Completo</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-4">
                <li>Execute backup completo de todos os dados importantes</li>
                <li>Teste restauração de alguns arquivos do backup</li>
                <li>Verifique integridade do backup</li>
              </ol>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#FF4B6B]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Manutenção de Software</h2>
              
              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Revisar Programas Instalados</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Vá em Configurações &gt; Aplicativos &gt; Aplicativos e recursos</li>
                <li>Revise a lista de programas instalados</li>
                <li>Desinstale programas que você não usa mais</li>
                <li>Isso libera espaço e reduz pontos de entrada para malware</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Atualizar Programas</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Programas desatualizados podem ter vulnerabilidades de segurança:
              </p>
              <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                <li>Configure programas para atualizar automaticamente quando possível</li>
                <li>Revise manualmente programas críticos mensalmente</li>
                <li>Use ferramentas como Chocolatey para gerenciar atualizações</li>
                <li>Navegadores devem estar sempre atualizados</li>
              </ul>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Limpeza de Registro (Cuidado!)</h3>
              <div className="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30 mb-4">
                <p className="text-white font-semibold mb-2">⚠️ ATENÇÃO:</p>
                <p className="text-gray-300 leading-relaxed">
                  Limpeza de registro pode causar problemas se feita incorretamente. Sempre faça backup do registro antes e use apenas ferramentas confiáveis. Se não se sentir seguro, pule esta etapa ou contrate um profissional.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#31A8FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Monitoramento de Performance</h2>
              
              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Verificar Temperaturas</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Superaquecimento é uma das principais causas de problemas e falhas:
              </p>
              <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-6">
                <li>Use ferramentas como HWMonitor, Core Temp ou SpeedFan para monitorar temperaturas</li>
                <li>Temperaturas normais: CPU 40-70°C em uso normal, GPU 50-80°C</li>
                <li>Se temperaturas estão consistentemente altas (acima de 80°C), pode indicar problema</li>
                <li>Verifique se ventiladores estão funcionando corretamente</li>
                <li>Limpe poeira que pode estar bloqueando dissipadores de calor</li>
              </ul>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Monitorar Uso de Recursos</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-4">
                <li>Use o Gerenciador de Tarefas para monitorar CPU, RAM e disco</li>
                <li>Identifique programas que consomem muitos recursos</li>
                <li>Investigue uso anormalmente alto que pode indicar problema</li>
                <li>Verifique processos em segundo plano desnecessários</li>
              </ol>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#8B31FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Checklist de Manutenção</h2>
              
              <div className="bg-[#171313] p-6 rounded-lg border border-[#31A8FF]/30 mb-4">
                <h3 className="text-xl font-bold text-white mb-4">Manutenção Semanal</h3>
                <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4">
                  <li>☐ Verificar antivírus ativo e atualizado</li>
                  <li>☐ Limpeza rápida de arquivos temporários</li>
                  <li>☐ Verificar espaço em disco</li>
                </ul>
              </div>

              <div className="bg-[#171313] p-6 rounded-lg border border-[#FF4B6B]/30 mb-4">
                <h3 className="text-xl font-bold text-white mb-4">Manutenção Mensal</h3>
                <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4">
                  <li>☐ Verificação completa de antivírus</li>
                  <li>☐ Atualizar Windows e programas</li>
                  <li>☐ Verificar erros no disco</li>
                  <li>☐ Desfragmentar disco (apenas HDD)</li>
                  <li>☐ Revisar programas instalados</li>
                  <li>☐ Monitorar temperaturas</li>
                </ul>
              </div>

              <div className="bg-[#171313] p-6 rounded-lg border border-[#8B31FF]/30 mb-4">
                <h3 className="text-xl font-bold text-white mb-4">Manutenção Trimestral</h3>
                <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4">
                  <li>☐ Limpeza física completa (remover poeira)</li>
                  <li>☐ Verificação de hardware</li>
                  <li>☐ Backup completo e teste de restauração</li>
                  <li>☐ Revisão completa de segurança</li>
                  <li>☐ Otimização completa do sistema</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#FF4B6B]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Conclusão</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                A manutenção preventiva é um investimento em tempo que economiza muito mais tempo e dinheiro no futuro. Um computador bem mantido funciona melhor, dura mais e é menos propenso a falhas inesperadas que podem interromper seu trabalho ou causar perda de dados.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Estabeleça uma rotina de manutenção e cumpra-a regularmente. Use este guia como referência e adapte a frequência das tarefas conforme seu uso do computador. Para uso intensivo ou profissional, pode ser necessário fazer manutenção mais frequentemente.
              </p>
              <div className="bg-[#171313] p-6 rounded-lg border border-[#31A8FF]/30 mt-6">
                <p className="text-white font-semibold mb-3 text-lg">Manutenção Profissional Disponível</p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Se você preferir que nossa equipe faça a manutenção preventiva do seu computador, oferecemos serviços de manutenção remota completa e regular.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/todos-os-servicos"
                    className="px-6 py-3 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 text-center"
                  >
                    Ver Serviços de Manutenção
                  </Link>
                  <Link 
                    href="https://wa.me/5511996716235?text=Olá!%20Gostaria%20de%20falar%20sobre%20manutenção%20preventiva."
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
                <p className="text-gray-400 text-sm">Acelere seu computador com técnicas profissionais.</p>
              </Link>
              <Link href="/guias/limpeza-computador" className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-xl border border-[#31A8FF]/10 hover:border-[#FF4B6B]/30 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-2">Limpeza Completa do Computador</h3>
                <p className="text-gray-400 text-sm">Técnicas avançadas para limpeza profunda do sistema.</p>
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

