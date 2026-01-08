'use client';

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSenseBanner from '../../components/AdSenseBanner';
import Link from 'next/link';

export default function BackupDadosGuide() {
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
            <span className="text-white">Backup de Dados</span>
          </nav>
        </div>

        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#31A8FF]/30 to-[#8B31FF]/30 text-white mb-4">
              Backup
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
              Como Fazer Backup dos Seus Dados
            </h1>
            <p className="text-gray-400 text-lg mb-4">
              <strong className="text-white">Tempo de leitura:</strong> 10 minutos | <strong className="text-white">Dificuldade:</strong> Básico
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Aprenda métodos eficazes para fazer backup completo dos seus arquivos importantes, incluindo backup em nuvem, HD externo e métodos automatizados. Proteja seus dados contra perda por falhas de hardware, vírus, acidentes ou formatação.
            </p>
          </div>
        </section>

        <AdSenseBanner />

        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#8B31FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Por Que Fazer Backup É Crítico?</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                A perda de dados pode acontecer por diversas razões: falha de hardware do disco rígido, infecção por vírus ou ransomware, apagamento acidental, formatação, roubo de computador, ou desastres naturais como incêndio ou inundação. Quando você perde dados importantes como fotos de família, documentos de trabalho, projetos ou anos de arquivos pessoais, pode ser devastador e, em muitos casos, irreversível.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                A regra de ouro da tecnologia é: "Se você tem apenas uma cópia de um arquivo importante, você não tem nenhuma cópia". Discos rígidos falham, computadores são roubados, e acidentes acontecem. Fazer backup regular é a única forma garantida de proteger seus dados valiosos.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Este guia apresenta várias estratégias de backup, desde métodos simples e rápidos até soluções mais robustas e automatizadas. A melhor estratégia geralmente combina múltiplos métodos para ter redundância - se um método falhar, você ainda terá seus dados seguros em outro lugar.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#FF4B6B]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">O Que Deve Ser Incluído no Backup?</h2>
              
              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Dados Essenciais</h3>
              <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-6">
                <li><strong className="text-white">Documentos:</strong> Arquivos Word, Excel, PDFs, apresentações, projetos</li>
                <li><strong className="text-white">Fotos e Vídeos:</strong> Bibliotecas de imagens, vídeos pessoais, memórias importantes</li>
                <li><strong className="text-white">Músicas:</strong> Coleções de áudio pessoais e downloads</li>
                <li><strong className="text-white">E-mails:</strong> Se usar cliente de e-mail local (Outlook, Thunderbird)</li>
                <li><strong className="text-white">Favoritos do navegador:</strong> Bookmarks e senhas salvas (com cuidado e criptografia)</li>
                <li><strong className="text-white">Configurações:</strong> Preferências de programas importantes</li>
                <li><strong className="text-white">Licenças e chaves:</strong> Chaves de ativação de software pago</li>
                <li><strong className="text-white">Projetos pessoais:</strong> Código, designs, trabalhos acadêmicos</li>
              </ul>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">O Que NÃO Precisa Ser Backupeado</h3>
              <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                <li>Sistema operacional (pode ser reinstalado)</li>
                <li>Programas instalados (podem ser baixados novamente)</li>
                <li>Arquivos temporários</li>
                <li>Cache de navegadores</li>
                <li>Arquivos de sistema do Windows</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#31A8FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Método 1: Backup em HD Externo ou Pen Drive</h2>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                Este é o método mais simples e direto. Ideal para backups periódicos manuais:
              </p>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Vantagens</h3>
              <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-6">
                <li>Controle total sobre seus dados</li>
                <li>Não depende de internet</li>
                <li>Acesso rápido aos arquivos</li>
                <li>Funciona mesmo sem conexão</li>
                <li>Relativamente barato</li>
              </ul>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Como Fazer</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Conecte o HD externo ou pen drive ao computador</li>
                <li>Verifique se há espaço suficiente (precisa ter mais espaço que os arquivos a serem copiados)</li>
                <li>Abra o Explorador de Arquivos</li>
                <li>Navegue até as pastas que deseja fazer backup:
                  <ul className="mt-2 space-y-1 ml-6">
                    <li><code className="bg-[#2a2a2e] px-2 py-1 rounded">C:\Users\[SeuUsuário]\Documents</code></li>
                    <li><code className="bg-[#2a2a2e] px-2 py-1 rounded">C:\Users\[SeuUsuário]\Pictures</code></li>
                    <li><code className="bg-[#2a2a2e] px-2 py-1 rounded">C:\Users\[SeuUsuário]\Videos</code></li>
                    <li><code className="bg-[#2a2a2e] px-2 py-1 rounded">C:\Users\[SeuUsuário]\Desktop</code></li>
                    <li><code className="bg-[#2a2a2e] px-2 py-1 rounded">C:\Users\[SeuUsuário]\Downloads</code></li>
                  </ul>
                </li>
                <li>Copie as pastas inteiras para o HD externo</li>
                <li>Verifique se a cópia foi bem-sucedida abrindo alguns arquivos do backup</li>
                <li>Guarde o HD externo em local seguro, preferencialmente fora de casa (escritório, cofre, casa de familiares)</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Usando Ferramenta de Backup do Windows</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                O Windows inclui ferramentas de backup que podem automatizar o processo:
              </p>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-4">
                <li>Vá em Configurações &gt; Atualização e Segurança &gt; Backup</li>
                <li>Clique em "Adicionar uma unidade" e selecione seu HD externo</li>
                <li>Configure para fazer backup automático regularmente</li>
                <li>O Windows fará backup automático das pastas principais</li>
              </ol>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#8B31FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Método 2: Backup em Nuvem</h2>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                Backup em nuvem armazena seus arquivos em servidores online, acessíveis de qualquer lugar e protegidos contra falhas locais:
              </p>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Serviços de Backup em Nuvem</h3>
              <ul className="space-y-3 text-gray-300 list-disc list-inside ml-4 mb-6">
                <li><strong className="text-white">Google Drive:</strong> 15GB gratuitos, integrado com Gmail e Google Fotos</li>
                <li><strong className="text-white">OneDrive (Microsoft):</strong> 5GB gratuitos, integrado com Windows e Office</li>
                <li><strong className="text-white">Dropbox:</strong> 2GB gratuitos, sincronização eficiente</li>
                <li><strong className="text-white">iCloud:</strong> Ideal para usuários Apple</li>
                <li><strong className="text-white">Mega:</strong> 20GB gratuitos, foco em privacidade</li>
              </ul>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Como Configurar Backup Automático em Nuvem</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Escolha um serviço de nuvem e crie uma conta</li>
                <li>Instale o aplicativo do serviço no seu computador</li>
                <li>Configure quais pastas sincronizar</li>
                <li>Os arquivos serão sincronizados automaticamente quando você os modificar</li>
                <li>Configure para fazer backup de pastas específicas automaticamente</li>
              </ol>

              <div className="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30 mb-4">
                <p className="text-white font-semibold mb-2">💡 Dica:</p>
                <p className="text-gray-300 leading-relaxed">
                  Para máxima segurança, use backup em nuvem E HD externo. Isso cria redundância - se um método falhar, você ainda terá seus dados no outro. Além disso, mantenha uma cópia offline para acesso rápido mesmo sem internet.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#FF4B6B]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Método 3: Backup Completo do Sistema (Imagem)</h2>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                Backup de imagem cria uma cópia completa de todo o sistema, incluindo sistema operacional, programas e dados. É útil para restaurar o computador exatamente como estava:
              </p>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Ferramenta de Backup do Windows</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Pressione <kbd className="bg-[#2a2a2e] px-2 py-1 rounded">Windows + R</kbd></li>
                <li>Digite <code className="bg-[#2a2a2e] px-2 py-1 rounded">control</code> e pressione Enter</li>
                <li>Vá em Sistema e Segurança &gt; Backup e Restauração (Windows 7)</li>
                <li>Clique em "Criar uma imagem do sistema"</li>
                <li>Escolha onde salvar (HD externo recomendado)</li>
                <li>Selecione as unidades a incluir</li>
                <li>Confirme e inicie o backup (pode levar horas)</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Ferramentas Terceirizadas</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Ferramentas como Acronis True Image, Macrium Reflect ou EaseUS Todo Backup oferecem mais funcionalidades e opções de backup:
              </p>
              <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                <li>Backup incremental (apenas mudanças desde último backup)</li>
                <li>Agendamento mais flexível</li>
                <li>Compressão para economizar espaço</li>
                <li>Opções de restauração mais avançadas</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#31A8FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Estratégia de Backup Recomendada (Regra 3-2-1)</h2>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                A regra 3-2-1 é uma estratégia profissional de backup amplamente recomendada:
              </p>

              <ul className="space-y-3 text-gray-300 list-disc list-inside ml-4 mb-6">
                <li><strong className="text-white">3 cópias:</strong> Mantenha pelo menos 3 cópias dos seus dados importantes</li>
                <li><strong className="text-white">2 tipos diferentes de mídia:</strong> Use diferentes tipos de armazenamento (HD externo + nuvem, por exemplo)</li>
                <li><strong className="text-white">1 cópia fora de casa:</strong> Mantenha pelo menos uma cópia em local físico diferente (escritório, cofre, casa de familiares)</li>
              </ul>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Exemplo Prático de Estratégia 3-2-1</h3>
              <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                <li><strong className="text-white">Cópia 1:</strong> Dados originais no seu computador</li>
                <li><strong className="text-white">Cópia 2:</strong> Backup no HD externo (mantido em casa)</li>
                <li><strong className="text-white">Cópia 3:</strong> Backup na nuvem (servidores online)</li>
                <li><strong className="text-white">Cópia 4 (extra):</strong> Backup em segundo HD externo mantido em outro local</li>
              </ul>
            </div>

            {/* Segurança no Backup */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#31A8FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Segurança no Backup de Dados</h2>
              
              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Criptografia de Backups</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Para dados sensíveis, é fundamental criptografar seus backups:
              </p>
              
              <div className="mb-4">
                <h4 className="text-xl font-bold text-white mb-2">Opções de Criptografia</h4>
                <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                  <li><strong className="text-white">BitLocker (Windows Pro/Enterprise)</strong>: Criptografia nativa do Windows para unidades inteiras</li>
                  <li><strong className="text-white">VeraCrypt</strong>: Software gratuito de código aberto para criptografia de volumes</li>
                  <li><strong className="text-white">7-Zip com senha</strong>: Compactação criptografada para backups individuais</li>
                  <li><strong className="text-white">Serviços de nuvem com criptografia</strong>: Google Drive, OneDrive, Dropbox oferecem criptografia</li>
                </ul>
              </div>

              <div className="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
                <p className="text-white font-semibold mb-2">⚠️ Aviso de Segurança:</p>
                <p className="text-gray-300 leading-relaxed">
                  Se você perder a senha de um backup criptografado, os dados são irrecuperavelmente perdidos. Sempre mantenha cópias de segurança das senhas em locais seguros e separados dos backups.
                </p>
              </div>
            </div>

            {/* Tipos Avançados de Backup */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#8B31FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Tipos Avançados de Backup</h2>
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">Backup Incremental vs Diferencial</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
                    <h4 className="text-white font-semibold mb-2">Backup Incremental</h4>
                    <ul className="space-y-1 text-gray-300 text-sm">
                      <li>✓ Mais econômico em espaço</li>
                      <li>✓ Mais rápido para backups subsequentes</li>
                      <li>✗ Restauração mais complexa</li>
                    </ul>
                  </div>
                  <div className="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
                    <h4 className="text-white font-semibold mb-2">Backup Diferencial</h4>
                    <ul className="space-y-1 text-gray-300 text-sm">
                      <li>✓ Restauração mais simples</li>
                      <li>✓ Menos vulnerável a corrupção</li>
                      <li>✗ Cresce em tamanho com o tempo</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">Backup em Tempo Real</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Soluções que fazem backup contínuo de cada alteração:
                </p>
                <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                  <li>Serviços cloud sync (OneDrive, Google Drive, Dropbox)</li>
                  <li>Software especializado (Acronis, Veeam)</li>
                  <li>Snapshot automático do sistema</li>
                </ul>
              </div>
            </div>

            {/* Estratégias Empresariais */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#FF4B6B]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Estratégias Empresariais de Backup</h2>
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">Compliance e Regulamentações</h3>
                <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                  <li><strong className="text-white">LGPD/GDPR</strong>: Proteção de dados pessoais</li>
                  <li><strong className="text-white">SOX</strong>: Requisitos financeiros</li>
                  <li><strong className="text-white">HIPAA</strong>: Dados de saúde</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">Ferramentas Corporativas</h3>
                <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                  <li>Veeam Backup & Replication</li>
                  <li>Acronis Cyber Protect</li>
                  <li>Commvault Complete Backup</li>
                  <li>Veritas NetBackup</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#8B31FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Frequência de Backup</h2>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                A frequência ideal depende de como você usa seu computador:
              </p>

              <ul className="space-y-3 text-gray-300 list-disc list-inside ml-4 mb-6">
                <li><strong className="text-white">Usuários casuais:</strong> Backup semanal ou mensal pode ser suficiente</li>
                <li><strong className="text-white">Trabalho importante:</strong> Backup diário ou em tempo real (sincronização contínua)</li>
                <li><strong className="text-white">Dados críticos:</strong> Múltiplos backups por dia ou backup em tempo real</li>
                <li><strong className="text-white">Fotos e documentos pessoais:</strong> Backup mensal ou quando houver novos arquivos importantes</li>
              </ul>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Automatizar Backups</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                A melhor forma de garantir que backups sejam feitos regularmente é automatizar:
              </p>
              <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                <li>Configure backup em nuvem para sincronização automática</li>
                <li>Use agendamento do Windows para backup automático em HD externo</li>
                <li>Configure lembretes no calendário para backup manual periódico</li>
                <li>Use ferramentas de backup que enviam notificações quando backup falha</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#FF4B6B]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Verificar e Testar Backups</h2>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                Fazer backup não é suficiente - você precisa verificar periodicamente que os backups estão funcionando:
              </p>

              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li><strong className="text-white">Teste restauração:</strong> Periodicamente, tente restaurar alguns arquivos do backup para garantir que funciona</li>
                <li><strong className="text-white">Verifique integridade:</strong> Use ferramentas de verificação de integridade de arquivos</li>
                <li><strong className="text-white">Monitore espaço:</strong> Certifique-se de que há espaço suficiente no destino do backup</li>
                <li><strong className="text-white">Verifique logs:</strong> Revise logs de backup para garantir que não há erros</li>
                <li><strong className="text-white">Teste acesso:</strong> Periodicamente, verifique se consegue acessar backups em nuvem</li>
              </ol>

              <div className="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30 mt-4">
                <p className="text-white font-semibold mb-2">⚠️ Importante:</p>
                <p className="text-gray-300 leading-relaxed">
                  Um backup que nunca foi testado pode não funcionar quando você mais precisar. Testar restauração é tão importante quanto fazer o backup. Muitas pessoas descobrem que seus backups não funcionam apenas quando tentam usar em uma situação de emergência.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#31A8FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Conclusão</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Fazer backup regular dos seus dados é uma das práticas mais importantes em segurança digital. Perda de dados pode ser devastadora, mas é completamente evitável com uma estratégia de backup adequada.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Implemente uma estratégia de backup que funcione para você - pode ser simples (HD externo periódico) ou mais robusta (múltiplos métodos com automação). O importante é começar e manter o hábito de fazer backup regularmente. Lembre-se: é melhor ter um backup simples que você faz regularmente do que um sistema complexo que você nunca usa.
              </p>
              <div className="bg-[#171313] p-6 rounded-lg border border-[#31A8FF]/30 mt-6">
                <p className="text-white font-semibold mb-3 text-lg">Ajuda Profissional Disponível</p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Se você precisa de ajuda para configurar backups automatizados ou recuperar dados perdidos, nossa equipe pode ajudar remotamente.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/todos-os-servicos"
                    className="px-6 py-3 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 text-center"
                  >
                    Ver Serviços de Backup
                  </Link>
                  <Link 
                    href="https://wa.me/5511996716235?text=Olá!%20Preciso%20de%20ajuda%20com%20backup%20de%20dados."
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
              <Link href="/guias/seguranca-digital" className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-xl border border-[#8B31FF]/10 hover:border-[#FF4B6B]/30 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-2">Guia de Segurança Digital</h3>
                <p className="text-gray-400 text-sm">Proteja seus dados contra vírus e malware.</p>
              </Link>
              <Link href="/guias/formatacao-windows" className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-xl border border-[#31A8FF]/10 hover:border-[#FF4B6B]/30 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-2">Formatação do Windows</h3>
                <p className="text-gray-400 text-sm">Aprenda a fazer backup antes de formatar.</p>
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

