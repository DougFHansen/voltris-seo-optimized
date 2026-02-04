import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia Completo de Backup de Dados: A Regra 3-2-1 (2026)";
const description = "Aprenda como fazer backup profissional dos seus dados com a regra 3-2-1. Tutorial completo sobre backup em HD externo, nuvem, imagem do sistema e proteção contra ransomware em 2026.";
const keywords = [
  'guia completo backup de dados pc 2026',
  'o que é regra de backup 3-2-1 tutorial 2026',
  'como fazer backup de arquivos windows 11 guia',
  'backup em hd externo vs nuvem comparativo 2026',
  'melhores softwares de backup gratuito windows 11',
  'backup de imagem do sistema macrium reflect',
  'cold backup proteção ransomware 2026',
  'como proteger dados contra vírus backup'
];

export const metadata: Metadata = createGuideMetadata('backup-dados', title, description, keywords);

export default function DataBackupGuide() {
  const summaryTable = [
    { label: "Regra Principal", value: "3-2-1 (3 cópias, 2 mídias, 1 externa)" },
    { label: "Hardware Básico", value: "HD Externo 1TB+ (Cold Backup)" },
    { label: "Hardware Premium", value: "NAS Synology/QNAP + Nuvem" },
    { label: "Software Gratuito", value: "Macrium Reflect Free / Veeam Agent" },
    { label: "Software Pago", value: "Acronis Cyber Protect / EaseUS Todo" },
    { label: "Frequência Mínima", value: "Semanal para dados críticos" },
    { label: "Tempo de Setup", value: "30-60 minutos (primeira vez)" },
    { label: "Dificuldade", value: "Médio" }
  ];

  const contentSections = [
    {
      title: "Por que Você PRECISA de Backup (A Verdade Dura)",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          No mundo da tecnologia em 2026, existem dois tipos de pessoas: <strong>as que já perderam dados e as que ainda vão perder</strong>. Parece exagero? Estatísticas mostram que 30% dos usuários perdem dados críticos pelo menos uma vez na vida, e 60% das pequenas empresas que sofrem perda catastrófica de dados fecham as portas em 6 meses.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Um SSD pode queimar por um pico de energia (acontece mais do que você imagina), um notebook pode ser roubado ou molhado, um ransomware pode criptografar tudo em segundos, ou você mesmo pode deletar um arquivo importante sem querer. <strong>Ter uma estratégia de backup não é opcional</strong>—é tão essencial quanto ter antivírus.
        </p>
        <p class="mb-4 text-gray-300 leading-relaxed">
          Este guia vai ensinar a regra profissional <strong>3-2-1</strong>, usada por empresas e data centers ao redor do mundo, adaptada para usuários domésticos. Se você guarda fotos de família, documentos de trabalho, projetos criativos ou saves de jogos com 500 horas, este é o guia mais importante que você vai ler.
        </p>
      `
    },
    {
      title: "A Regra de Ouro: Backup 3-2-1 Explicada",
      content: `
        <p class="mb-4 text-gray-300">
          A <strong>Regra 3-2-1</strong> é o padrão internacional de backup profissional desde os anos 2000, e em 2026 continua sendo o método mais confiável:
        </p>
        
        <div class="bg-[#0A0A0F] border border-white/10 rounded-xl p-6 mb-6">
          <h4 class="text-white font-bold mb-4 text-xl">🔢 Decodificando a Regra 3-2-1</h4>
          
          <div class="space-y-6">
            <div>
              <h5 class="text-[#31A8FF] font-bold mb-2 flex items-center gap-2">
                <span class="text-2xl">3️⃣</span> Três Cópias de Cada Arquivo
              </h5>
              <p class="text-gray-300 text-sm ml-8">
                <strong>Não são 3 backups, são 3 cópias totais:</strong> o arquivo original no seu PC + 2 cópias de backup. Por quê? Se você tem apenas 1 cópia e ela falha, você perdeu tudo. Com 3 cópias, a chance de todas falharem ao mesmo tempo é estatisticamente desprezível (menos de 0,01%).
              </p>
            </div>
            
            <div>
              <h5 class="text-[#31A8FF] font-bold mb-2 flex items-center gap-2">
                <span class="text-2xl">2️⃣</span> Duas Mídias Diferentes
              </h5>
              <p class="text-gray-300 text-sm ml-8">
                <strong>Não coloque todos os ovos na mesma cesta:</strong> se suas 3 cópias estão todas em HDs externos, um surto de energia pode fritar todos ao mesmo tempo. O ideal é combinar: <strong>SSD interno (original) + HD Externo (backup 1) + Nuvem (backup 2)</strong>. Assim, um problema físico (fogo, roubo, pico de energia) não destrói tudo.
              </p>
            </div>
            
            <div>
              <h5 class="text-[#31A8FF] font-bold mb-2 flex items-center gap-2">
                <span class="text-2xl">1️⃣</span> Uma Cópia Offsite (Fora de Casa)
              </h5>
              <p class="text-gray-300 text-sm ml-8">
                <strong>Proteção contra desastres físicos:</strong> incêndio, inundação, roubo de casa toda. Em 2026, a forma mais prática de backup offsite é a <strong>nuvem</strong> (Google Drive, OneDrive, Dropbox, Backblaze). Se você é ultra-paranóico, pode deixar um HD externo na casa de um familiar ou em um cofre bancário (empresas fazem isso).
              </p>
            </div>
          </div>
        </div>
        
        <div class="bg-emerald-900/10 p-5 rounded-xl border border-emerald-500/20">
          <h4 class="text-emerald-400 font-bold mb-2">✅ Exemplo Prático da Regra 3-2-1</h4>
          <p class="text-sm text-gray-300">
            <strong>Seus arquivos importantes (fotos, documentos, projetos):</strong><br/>
            📁 <strong>Cópia 1:</strong> PC/Notebook (SSD interno - original)<br/>
            💾 <strong>Cópia 2:</strong> HD Externo 1TB conectado semanalmente (Cold Backup)<br/>
            ☁️ <strong>Cópia 3:</strong> Google Drive/OneDrive (Backup na nuvem, offsite)<br/><br/>
            Com essa configuração, você precisaria de um cenário apocalíptico (seu PC queimar + HD externo falhar + Google deletar sua conta) para perder tudo—praticamente impossível.
          </p>
        </div>
      `
    },
    {
      title: "Tipos de Backup: Entendendo as Diferenças",
      content: `
        <p class="mb-4 text-gray-300">
          Nem todo backup é igual. Existem 3 tipos principais, cada um com uma finalidade específica:
        </p>
        
        <div class="overflow-x-auto mb-6">
          <table class="w-full text-sm text-gray-300 border-collapse">
            <thead>
              <tr class="bg-white/5 border-b border-white/10">
                <th class="px-4 py-3 text-left text-white font-bold">Tipo de Backup</th>
                <th class="px-4 py-3 text-left text-white font-bold">O que Salva</th>
                <th class="px-4 py-3 text-left text-white font-bold">Velocidade</th>
                <th class="px-4 py-3 text-left text-white font-bold">Quando Usar</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-white/5 hover:bg-white/5">
                <td class="px-4 py-3"><strong class="text-[#31A8FF]">Backup de Arquivos</strong></td>
                <td class="px-4 py-3">Apenas seus documentos, fotos, vídeos</td>
                <td class="px-4 py-3 text-emerald-400">Rápido (5-20 min)</td>
                <td class="px-4 py-3">Uso diário/semanal</td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/5">
                <td class="px-4 py-3"><strong class="text-[#31A8FF]">Backup de Imagem do Sistema</strong></td>
                <td class="px-4 py-3">Windows completo + programas + configs</td>
                <td class="px-4 py-3 text-amber-400">Médio (30-90 min)</td>
                <td class="px-4 py-3">Mensal ou antes de grandes mudanças</td>
              </tr>
              <tr class="hover:bg-white/5">
                <td class="px-4 py-3"><strong class="text-[#31A8FF]">Clone de Disco</strong></td>
                <td class="px-4 py-3">Cópia idêntica bit-a-bit do SSD/HD</td>
                <td class="px-4 py-3 text-rose-400">Lento (1-4 horas)</td>
                <td class="px-4 py-3">Ao trocar de HD ou migrar PC</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">📂 1. Backup de Arquivos (File Backup)</h4>
        <p class="text-gray-300 mb-4">
          É o tipo mais simples: você copia suas pastas importantes (Documentos, Fotos, Vídeos, Downloads) para um HD externo ou nuvem. <strong>Prós:</strong> rápido, fácil, não ocupa muito espaço. <strong>Contras:</strong> se o Windows corromper, você perde programas e configurações (vai precisar reinstalar tudo do zero).
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">💿 2. Backup de Imagem do Sistema</h4>
        <p class="text-gray-300 mb-4">
          Cria uma "foto" completa do Windows como está agora: sistema operacional, programas instalados (Photoshop, Office, Steam), drivers, configurações personalizadas. Se o seu SSD morrer ou o Windows corromper, você <strong>restaura a imagem em 15-30 minutos e volta a trabalhar exatamente como estava</strong>—sem reinstalar nada. Este é o backup profissional, usado por empresas.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔄 3. Clone de Disco</h4>
        <p class="text-gray-300 mb-4">
          Cópia idêntica do disco inteiro (bit por bit). Útil quando você quer <strong>trocar de SSD</strong> (ex: migrar de um SSD 500GB para um de 1TB) sem reinstalar o Windows. Ou para criar um disco de emergência que você pode simplesmente conectar e bootar se o principal falhar.
        </p>
      `
    },
    {
      title: "Backup de Imagem do Sistema: O Essencial (Macrium Reflect)",
      content: `
        <p class="mb-4 text-gray-300">
          O <strong>Macrium Reflect Free</strong> é considerado o melhor software gratuito de backup de imagem em 2026. Vou ensinar o passo-a-passo completo:
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">📥 Instalação e Preparação</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Baixe o <strong>Macrium Reflect Free</strong> do site oficial (macrium.com).</li>
          <li>Durante a instalação, ele vai pedir para criar um <strong>Rescue Media</strong> (mídia de recuperação em pendrive). <strong>FAÇA ISSO</strong>—você vai precisar se o Windows não iniciar.</li>
          <li>Conecte seu HD Externo (recomendo pelo menos 500GB livre).</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">💾 Criando a Imagem do Sistema</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Abra o Macrium Reflect. Você verá uma lista dos seus discos.</li>
          <li>Clique em <strong>"Create an image of the partition(s) required to backup and restore Windows"</strong>—ele vai selecionar automaticamente as partições do Windows (geralmente C: e as partições de boot).</li>
          <li>Escolha o destino: seu HD Externo.</li>
          <li>Em "Schedule", você pode deixar "Run this backup now" ou agendar backups semanais automáticos.</li>
          <li>Clique em "Next" e depois "Finish". O backup vai começar e levar 30-90 minutos dependendo do tamanho do seu SSD.</li>
        </ol>
        
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mt-6">
          <h4 class="text-[#31A8FF] font-bold mb-2">💡 Dica de Ouro: Backup Incremental</h4>
          <p class="text-sm text-gray-300">
            Após criar a primeira imagem completa (Full Backup), os backups seguintes podem ser <strong>incrementais</strong>—ou seja, só copiam o que mudou desde o último backup. Isso é MUITO mais rápido (5-10 minutos) e economiza espaço. O Macrium faz isso automaticamente se você agendar backups recorrentes.
          </p>
        </div>
      `
    },
    {
      title: "O \"Backup Frio\" (Cold Backup): Proteção Contra Ransomware",
      content: `
        <p class="mb-4 text-gray-300">
          <strong>O maior erro que as pessoas cometem:</strong> deixar o HD de backup sempre conectado ao PC. Por quê isso é um problema?
        </p>
        
        <div class="bg-rose-900/10 p-5 rounded-xl border border-rose-500/20 mb-6">
          <h4 class="text-rose-400 font-bold mb-2 flex items-center gap-2">
            <span>🦠</span> O Perigo do Ransomware em 2026
          </h4>
          <p class="text-sm text-gray-300">
            Ransomware é um tipo de vírus que <strong>criptografa todos os seus arquivos</strong> (incluindo drives externos conectados) e exige pagamento para descriptografar. Se seu HD de backup estiver plugado 24h, ele será criptografado junto com o PC. Casos reais em 2025-2026 mostram empresas perdendo backups de anos por esse erro.
          </p>
        </div>
        
        <h4 class="text-white font-bold mb-3">❄️ Como Fazer Cold Backup Corretamente</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li><strong>Desconecte o HD de backup</strong> e guarde-o fisicamente em outro local (gaveta, cofre, outro cômodo).</li>
          <li><strong>Uma vez por semana</strong> (ou quinzenal, dependendo da importância), conecte o HD, faça o backup/atualização da imagem.</li>
          <li><strong>Assim que o backup terminar, REMOVA O CABO FISICAMENTE.</strong> Não basta "ejetar"—tire o cabo USB.</li>
          <li>O que não está conectado ao PC <strong>não pode ser atacado</strong> por vírus online.</li>
        </ol>
        
        <div class="bg-emerald-900/10 p-5 rounded-xl border border-emerald-500/20 mt-6">
          <h4 class="text-emerald-400 font-bold mb-2">✅ Esquema de Rodízio (Para Usuários Avançados)</h4>
          <p class="text-sm text-gray-300">
            Empresas usam 2 ou 3 HDs externos em rodízio: Semana 1 usa HD-A, Semana 2 usa HD-B, Semana 3 volta pro HD-A. Assim, se um backup der problema ou for corrompido, você tem o backup anterior intacto. Para usuários domésticos, 1 HD + nuvem já é suficiente.
          </p>
        </div>
      `
    },
    {
      title: "Backup na Nuvem: A Terceira Camada de Segurança",
      content: `
        <p class="mb-4 text-gray-300">
          O backup na nuvem é a <strong>cópia offsite</strong> da regra 3-2-1. Mesmo que sua casa pegue fogo ou seja roubada, seus dados estão seguros em servidores ao redor do mundo.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">☁️ Comparação de Serviços de Nuvem (2026)</h4>
        <div class="overflow-x-auto mb-6">
          <table class="w-full text-sm text-gray-300 border-collapse">
            <thead>
              <tr class="bg-white/5 border-b border-white/10">
                <th class="px-4 py-3 text-left text-white font-bold">Serviço</th>
                <th class="px-4 py-3 text-left text-white font-bold">Espaço Grátis</th>
                <th class="px-4 py-3 text-left text-white font-bold">Plano Pago</th>
                <th class="px-4 py-3 text-left text-white font-bold">Melhor Para</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-white/5 hover:bg-white/5">
                <td class="px-4 py-3"><strong>Google Drive</strong></td>
                <td class="px-4 py-3">15 GB</td>
                <td class="px-4 py-3">100GB: R$7/mês<br/>2TB: R$35/mês</td>
                <td class="px-4 py-3">Integração com Fotos e Docs</td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/5">
                <td class="px-4 py-3"><strong>OneDrive</strong></td>
                <td class="px-4 py-3">5 GB</td>
                <td class="px-4 py-3">100GB: R$9/mês<br/>1TB: R$25/mês (com Office 365)</td>
                <td class="px-4 py-3">Usuários de Windows/Office</td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/5">
                <td class="px-4 py-3"><strong>Dropbox</strong></td>
                <td class="px-4 py-3">2 GB</td>
                <td class="px-4 py-3">2TB: R$50/mês</td>
                <td class="px-4 py-3">Profissionais e equipes</td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/5">
                <td class="px-4 py-3"><strong>Backblaze B2</strong></td>
                <td class="px-4 py-3">0 GB</td>
                <td class="px-4 py-3">Ilimitado: US$7/mês</td>
                <td class="px-4 py-3">Backup automático de PC completo</td>
              </tr>
              <tr class="hover:bg-white/5">
                <td class="px-4 py-3"><strong>Mega.nz</strong></td>
                <td class="px-4 py-3">20 GB</td>
                <td class="px-4 py-3">400GB: R$20/mês</td>
                <td class="px-4 py-3">Privacidade (criptografia E2E)</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4 class="text-white font-bold mb-3">🔐 Sincronização vs Backup na Nuvem</h4>
        <p class="text-gray-300 mb-4">
          <strong>Cuidado:</strong> Google Drive e OneDrive fazem <strong>sincronização</strong>, não backup. Se você deletar um arquivo no PC, ele é deletado da nuvem também (após 30 dias na lixeira). Para backup verdadeiro (versionamento infinito), use Backblaze, Carbonite ou configure versões avançadas no OneDrive.
        </p>
      `
    },
    {
      title: "Hardware de Backup: O que Comprar em 2026",
      content: `
        <h4 class="text-white font-bold mb-3">💾 HD Externo vs SSD Externo vs NAS</h4>
        
        <div class="space-y-6">
          <div class="bg-[#0A0A0F] border border-white/10 rounded-xl p-6">
            <h5 class="text-[#31A8FF] font-bold mb-3">HD Externo (HDD) - Custo-Benefício</h5>
            <p class="text-gray-300 text-sm mb-3">
              <strong>Recomendado:</strong> Seagate Backup Plus, WD My Passport, Toshiba Canvio<br/>
              <strong>Capacidade:</strong> 1TB (R$300) até 5TB (R$700)<br/>
              <strong>Velocidade:</strong> ~100-150 MB/s (suficiente para backup)<br/>
              <strong>Durabilidade:</strong> 3-5 anos de uso moderado
            </p>
            <p class="text-gray-300 text-sm">
              ✅ <strong>Prós:</strong> Barato, grande capacidade, ideal para Cold Backup<br/>
              ❌ <strong>Contras:</strong> Mais lento, sensível a quedas, barulhento
            </p>
          </div>
          
          <div class="bg-[#0A0A0F] border border-white/10 rounded-xl p-6">
            <h5 class="text-[#31A8FF] font-bold mb-3">SSD Externo - Velocidade & Portabilidade</h5>
            <p class="text-gray-300 text-sm mb-3">
              <strong>Recomendado:</strong> Samsung T7/T9, SanDisk Extreme, Crucial X8<br/>
              <strong>Capacidade:</strong> 500GB (R$400) até 2TB (R$1200)<br/>
              <strong>Velocidade:</strong> ~500-1000 MB/s (5-10x mais rápido)<br/>
              <strong>Durabilidade:</strong> 5-10 anos, resistente a quedas
            </p>
            <p class="text-gray-300 text-sm">
              ✅ <strong>Prós:</strong> Super rápido, silencioso, compacto, resistente<br/>
              ❌ <strong>Contras:</strong> Mais caro por GB, menor capacidade máxima
            </p>
          </div>
          
          <div class="bg-[#0A0A0F] border border-white/10 rounded-xl p-6">
            <h5 class="text-[#31A8FF] font-bold mb-3">NAS (Network Attached Storage) - Solução Profissional</h5>
            <p class="text-gray-300 text-sm mb-3">
              <strong>Recomendado:</strong> Synology DS220+, QNAP TS-253D<br/>
              <strong>Capacidade:</strong> 4TB-20TB+ (2 ou 4 HDs em RAID)<br/>
              <strong>Custo:</strong> R$2000-R$5000 (NAS + HDs)<br/>
              <strong>Backup automático:</strong> Sim, via rede Wi-Fi
            </p>
            <p class="text-gray-300 text-sm">
              ✅ <strong>Prós:</strong> Backup automático de todos os PCs da casa, redundância RAID, acesso remoto<br/>
              ❌ <strong>Contras:</strong> Caro, requer configuração técnica, não é portátil
            </p>
          </div>
        </div>
        
        <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20 mt-6">
          <h4 class="text-amber-400 font-bold mb-2">⚠️ NUNCA Use Pen Drive para Backup</h4>
          <p class="text-sm text-gray-300">
            Pen drives são feitos para transferência rápida, não para armazenamento de longo prazo. Eles têm alta taxa de falha após 1-2 anos e podem corromper dados silenciosamente. Use apenas HD/SSD externos projetados para backup.
          </p>
        </div>
      `
    },
    {
      title: "Automação de Backup: Configurando Backups Agendados",
      content: `
        <p class="mb-4 text-gray-300">
          O melhor backup é aquele que acontece automaticamente, sem você precisar lembrar. Vou ensinar 3 níveis de automação:
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔄 Nível 1: Backup Automático do Windows (Histórico de Arquivos)</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Conecte um HD Externo dedicado (deixe-o sempre conectado, mas ative BitLocker para proteção).</li>
          <li>Vá em <strong>Configurações → Atualização e Segurança → Backup</strong>.</li>
          <li>Ative o "Histórico de Arquivos" e selecione seu HD Externo.</li>
          <li>O Windows vai copiar automaticamente suas pastas de usuário (Documentos, Fotos, Vídeos) a cada hora.</li>
        </ol>
        <p class="text-gray-300 text-sm mt-2 ml-4">
          <strong>Limitação:</strong> Só faz backup de arquivos, não do sistema. Se o Windows corromper, você perde programas.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔄 Nível 2: Macrium Reflect Agendado</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>No Macrium Reflect, ao criar a imagem, escolha "Schedule this backup".</li>
          <li>Configure para rodar toda <strong>Sexta-feira às 02:00</strong> (quando o PC estiver ocioso).</li>
          <li>Marque "Incremental backup" para que seja rápido após a primeira imagem completa.</li>
          <li>O Macrium vai acordar o PC, fazer o backup e voltar a dormir (se configurado na BIOS).</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔄 Nível 3: Sincronização com Nuvem</h4>
        <p class="text-gray-300 mb-3">
          Instale o app do Google Drive ou OneDrive e configure para sincronizar suas pastas importantes. Toda vez que você salvar um arquivo, ele sobe automaticamente para a nuvem em segundos.
        </p>
      `
    },
    {
      title: "Testando Seu Backup: A Etapa Que Ninguém Faz (Mas Deveria)",
      content: `
        <div class="bg-rose-900/10 p-5 rounded-xl border border-rose-500/20 mb-6">
          <h4 class="text-rose-400 font-bold mb-2">⚠️ Um Backup Não Testado é um Backup Que Não Existe</h4>
          <p class="text-sm text-gray-300">
            Estatísticas assustadoras: <strong>34% dos backups falham na hora de restaurar</strong>. Arquivos corrompidos, mídia defeituosa, configuração errada—você só descobre na hora do desespero, quando já é tarde. <strong>Teste seu backup pelo menos 1 vez a cada 3 meses.</strong>
          </p>
        </div>
        
        <h4 class="text-white font-bold mb-3">🧪 Como Testar Restauração de Arquivos</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Escolha 3-5 arquivos aleatórios do seu backup (fotos, documentos, vídeos).</li>
          <li>Tente abri-los direto do HD de backup ou restaure para uma pasta temporária.</li>
          <li>Verifique se abrem normalmente, sem corrupção.</li>
          <li>Se der erro, seu backup pode estar com problemas—investigue imediatamente.</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">🧪 Como Testar Restauração de Imagem do Sistema</h4>
        <p class="text-gray-300 mb-3">
          Você não precisa restaurar no PC real (isso apagaria tudo). Use uma <strong>Máquina Virtual</strong>:
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Baixe o VirtualBox (gratuito).</li>
          <li>Crie uma VM nova e monte seu arquivo de imagem (.mrimg do Macrium).</li>
          <li>Tente bootar a imagem. Se iniciar o Windows normalmente, seu backup está OK.</li>
          <li>Isso parece trabalhoso, mas te dá 100% de certeza de que seu backup funciona.</li>
        </ol>
      `
    },
    {
      title: "Recuperação de Desastres: O Que Fazer Quando Tudo Dá Errado",
      content: `
        <h4 class="text-white font-bold mb-3">💥 Cenário 1: SSD/HD Queimou ou Windows Não Inicia</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Conecte o <strong>Rescue Media</strong> do Macrium (pendrive que você criou).</li>
          <li>Entre na BIOS e configure para bootar pelo pendrive.</li>
          <li>No Macrium Recovery, escolha "Restore" e selecione sua imagem de backup do HD Externo.</li>
          <li>Restaure para o mesmo disco (ou um novo se você trocou o SSD).</li>
          <li>Tempo total: 20-40 minutos. Você volta ao Windows exatamente como estava no dia do backup.</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">🗂️ Cenário 2: Deletou Arquivo Importante Por Engano</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Se você tem backup de arquivos (Histórico de Arquivos do Windows ou OneDrive):</li>
          <li>Clique direito na pasta onde o arquivo estava → <strong>"Restaurar versões anteriores"</strong>.</li>
          <li>Escolha a data anterior à exclusão e restaure.</li>
          <li>Se você usou shift+delete (bypass da lixeira), softwares como Recuva podem recuperar (se não foi sobrescrito).</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">🦠 Cenário 3: Ransomware Criptografou Tudo</h4>
        <div class="bg-[#0A0A0F] border border-rose-500/20 rounded-xl p-6">
          <p class="text-gray-300 mb-4">
            <strong>NÃO PAGUE O RESGATE.</strong> Mesmo pagando, há 40% de chance de não receber a chave de descriptografia.
          </p>
          <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Desligue o PC imediatamente para evitar que o vírus se espalhe.</li>
            <li>Se você tem Cold Backup (HD desconectado), ele está seguro. Formate o PC e restaure a imagem.</li>
            <li>Se você só tem backup em nuvem, verifique se o ransomware não sincronizou antes de você perceber (OneDrive tem versionamento de 30 dias).</li>
            <li>Instale um antivírus potente (Malwarebytes Premium) e escaneie tudo antes de usar os backups.</li>
          </ol>
        </div>
      `
    },
    {
      title: "Erros Comuns de Backup (E Como Evitar)",
      content: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-[#0A0A0F] border border-rose-500/10 rounded-xl p-5">
            <h4 class="text-rose-400 font-bold mb-3 flex items-center gap-2">
              <span>❌</span> Erro #1
            </h4>
            <p class="text-white font-bold text-sm mb-2">"Vou fazer backup amanhã"</p>
            <p class="text-gray-300 text-xs">
              <strong>Realidade:</strong> Amanhã nunca chega. Faça o PRIMEIRO backup HOJE, mesmo que seja só copiar arquivos importantes pro Google Drive. Você pode otimizar depois.
            </p>
          </div>
          
          <div class="bg-[#0A0A0F] border border-rose-500/10 rounded-xl p-5">
            <h4 class="text-rose-400 font-bold mb-3 flex items-center gap-2">
              <span>❌</span> Erro #2
            </h4>
            <p class="text-white font-bold text-sm mb-2">Backup só no HD Externo sempre conectado</p>
            <p class="text-gray-300 text-xs">
              <strong>Por que é ruim:</strong> Ransomware, surto de energia ou próprio vírus vão pegar o backup junto. Sempre desconecte após usar (Cold Backup).
            </p>
          </div>
          
          <div class="bg-[#0A0A0F] border border-rose-500/10 rounded-xl p-5">
            <h4 class="text-rose-400 font-bold mb-3 flex items-center gap-2">
              <span>❌</span> Erro #3
            </h4>
            <p class="text-white font-bold text-sm mb-2">Confiar só na nuvem gratuita</p>
            <p class="text-gray-300 text-xs">
              <strong>Risco:</strong> Contas podem ser hackeadas, serviços podem mudar termos, ou você pode exceder o limite e perder sincronização. Sempre tenha backup LOCAL também.
            </p>
          </div>
          
          <div class="bg-[#0A0A0F] border border-rose-500/10 rounded-xl p-5">
            <h4 class="text-rose-400 font-bold mb-3 flex items-center gap-2">
              <span>❌</span> Erro #4
            </h4>
            <p class="text-white font-bold text-sm mb-2">Nunca testar o backup</p>
            <p class="text-gray-300 text-xs">
              <strong>Descoberta tarde demais:</strong> Quando você precisar restaurar e descobrir que está corrompido ou incompleto. Teste a cada 3 meses.
            </p>
          </div>
          
          <div class="bg-[#0A0A0F] border border-rose-500/10 rounded-xl p-5">
            <h4 class="text-rose-400 font-bold mb-3 flex items-center gap-2">
              <span>❌</span> Erro #5
            </h4>
            <p class="text-white font-bold text-sm mb-2">Usar o mesmo HD de backup por 10 anos</p>
            <p class="text-gray-300 text-xs">
              <strong>Durabilidade:</strong> HDs têm vida útil de 3-5 anos. Troque seu disco de backup periodicamente (teste o novo antes de descartar o antigo).
            </p>
          </div>
          
          <div class="bg-[#0A0A0F] border border-rose-500/10 rounded-xl p-5">
            <h4 class="text-rose-400 font-bold mb-3 flex items-center gap-2">
              <span>❌</span> Erro #6
            </h4>
            <p class="text-white font-bold text-sm mb-2">Backup só de fotos e esquecer documentos importantes</p>
            <p class="text-gray-300 text-xs">
              <strong>Checklist completo:</strong> Documentos, Fotos, Vídeos, Downloads, Desktop, Saves de Jogos (geralmente em Documents ou AppData), Favoritos do Navegador.
            </p>
          </div>
        </div>
      `
    },
    {
      title: "Backup de Dados em Ambientes Corporativos",
      content: `
        <p class="mb-4 text-gray-300">
          Em ambientes corporativos, a estratégia de backup precisa ser mais robusta e escalável. As empresas precisam seguir normas regulatórias como LGPD, SOX e outras que exigem proteção e auditoria de dados.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">🏢 Estratégias Corporativas de Backup</h4>
        <div class="space-y-6">
          <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h5 class="text-blue-400 font-bold mb-3">Backup em Nuvem Gerenciada</h5>
            <p class="text-gray-300 text-sm mb-3">
              Soluções como <strong>Azure Backup, AWS Backup, Google Cloud Backup</strong> oferecem proteção escalável para grandes volumes de dados corporativos. Benefícios:
            </p>
            <ul class="list-disc list-inside text-gray-300 text-sm space-y-1 ml-4">
              <li>Armazenamento ilimitado e georedundante</li>
              <li>Recuperação granular de arquivos e máquinas virtuais</li>
              <li>Compliance com normas regulatórias</li>
              <li>Controle centralizado e auditoria</li>
            </ul>
          </div>
          
          <div class="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20">
            <h5 class="text-purple-400 font-bold mb-3">Soluções Híbridas (On-Premises + Cloud)</h5>
            <p class="text-gray-300 text-sm mb-3">
              Muitas empresas usam uma abordagem híbrida combinando:
            </p>
            <ul class="list-disc list-inside text-gray-300 text-sm space-y-1 ml-4">
              <li>NAS/SAN locais para recuperação rápida (RTO baixo)</li>
              <li>Nuvem para proteção offsite e longo prazo</li>
              <li>Replicação síncrona e assíncrona entre locais</li>
              <li>Políticas de retenção automatizadas</li>
            </ul>
          </div>
          
          <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20">
            <h5 class="text-amber-400 font-bold mb-3">Considerações de Segurança Corporativa</h5>
            <p class="text-gray-300 text-sm">
              <strong>Criptografia em trânsito e em repouso</strong>, controle de acesso baseado em função (RBAC), log de auditoria e <strong>Zero Trust</strong> são fundamentais para proteger backups corporativos contra vazamentos e acessos não autorizados.
            </p>
          </div>
        </div>
      `
    },
    {
      title: "Backup para Desenvolvedores e Projetos de Software",
      content: `
        <p class="mb-4 text-gray-300">
          Desenvolvedores têm necessidades específicas de backup que diferem de usuários comuns. O foco está em código-fonte, bancos de dados, configurações de ambiente e ativos digitais.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">💻 Estratégias Específicas para Desenvolvedores</h4>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Tipo de Backup</th>
                <th class="p-3 text-left">Ferramenta Recomendada</th>
                <th class="p-3 text-left">Objetivo</th>
                <th class="p-3 text-left">Frequência</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3"><strong>Versionamento de Código</strong></td>
                <td class="p-3">Git (GitHub, GitLab, Bitbucket)</td>
                <td class="p-3">Histórico de alterações do código</td>
                <td class="p-3">Contínuo (commits frequentes)</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3"><strong>Banco de Dados</strong></td>
                <td class="p-3">mysqldump, pg_dump, MongoDB Atlas</td>
                <td class="p-3">Dados do sistema em produção</td>
                <td class="p-3">Diário ou a cada release</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3"><strong>Configurações de Ambiente</strong></td>
                <td class="p-3">Docker, Vagrant, Ansible</td>
                <td class="p-3">Reprodução de ambiente de desenvolvimento</td>
                <td class="p-3">Quando alteradas</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3"><strong>Assets Digitais</strong></td>
                <td class="p-3">AWS S3, Google Cloud Storage</td>
                <td class="p-3">Imagens, vídeos, áudios do projeto</td>
                <td class="p-3">Após cada adição/substituição</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔄 Estratégia 3-2-1 Adaptada para Devs</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
          <li><strong>3 cópias:</strong> Repositório local + Repositório remoto (GitHub) + Cópia de segurança em HD externo</li>
          <li><strong>2 mídias:</strong> SSD local + Nuvem (GitHub/Cloud) + HD Externo</li>
          <li><strong>1 offsite:</strong> GitHub ou outro serviço de nuvem (fora da infra local)</li>
        </ul>
      `
    },
    {
      title: "Backup de Dispositivos Móveis e Aplicativos",
      content: `
        <p class="mb-4 text-gray-300">
          Com a crescente dependência de smartphones e tablets, o backup desses dispositivos tornou-se tão importante quanto o backup de computadores.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">📱 Backup de iOS (iPhone/iPad)</h4>
        <p class="text-gray-300 mb-4">
          O ecossistema Apple oferece múltiplas opções de backup:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
          <li><strong>iCloud:</strong> Backup automático de fotos, contatos, mensagens, apps e configurações (5GB grátis)</li>
          <li><strong>iTunes/Finder:</strong> Backup completo em seu Mac ou PC (mais completo que iCloud)</li>
          <li><strong>Backup de fotos:</strong> iCloud Photos, Google Photos ou Flickr para armazenamento de fotos em alta qualidade</li>
          <li><strong>Aplicativos:</strong> Compras na App Store podem ser restauradas sem backup, mas dados locais precisam de backup</li>
        </ul>
        
        <h4 class="text-white font-bold mb-3 mt-6">🤖 Backup de Android</h4>
        <p class="text-gray-300 mb-4">
          O Android oferece mais flexibilidade mas menos integração:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
          <li><strong>Google One:</strong> Sincronização automática de contatos, mensagens, configurações e apps</li>
          <li><strong>Google Photos:</strong> Backup automático de fotos e vídeos (ilimitado em alta qualidade)</li>
          <li><strong>Backup local:</strong> Samsung Cloud, OnePlus Cloud ou backup manual via USB</li>
          <li><strong>Aplicativos de terceiros:</strong> Titanium Backup (root necessário) para backup completo de apps e dados</li>
        </ul>
        
        <div class="bg-emerald-900/10 p-5 rounded-xl border border-emerald-500/20 mt-6">
          <h4 class="text-emerald-400 font-bold mb-2">⚠️ Cuidados Especiais com Dados Móveis</h4>
          <p class="text-sm text-gray-300">
            Dados de aplicativos bancários, autenticadores (Authy, Google Authenticator) e senhas (armazenadas localmente) podem não ser sincronizados automaticamente. Verifique as configurações de backup de cada app crítico e considere exportações manuais periódicas.
          </p>
        </div>
      `
    },
    {
      title: "Monitoramento e Gestão de Estratégias de Backup",
      content: `
        <p class="mb-4 text-gray-300">
          Ter uma estratégia de backup é apenas metade do trabalho. Monitorar, testar e gerenciar regularmente é essencial para garantir que seus dados estejam realmente protegidos.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">📊 Ferramentas de Monitoramento de Backup</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div class="bg-gray-800/50 p-5 rounded-xl border border-gray-600">
            <h5 class="text-white font-bold mb-3">Para Usuários Individuais</h5>
            <ul class="list-disc list-inside text-gray-300 space-y-2 text-sm">
              <li><strong>CrystalDiskInfo:</strong> Monitora saúde de discos rígidos e SSDs</li>
              <li><strong>HDRandom:</strong> Verifica integridade de arquivos de backup</li>
              <li><strong>Macrium Reflect:</strong> Relatórios de status de backup e notificações</li>
              <li><strong>Windows Event Viewer:</strong> Verifica logs de backup do sistema</li>
            </ul>
          </div>
          
          <div class="bg-gray-800/50 p-5 rounded-xl border border-gray-600">
            <h5 class="text-white font-bold mb-3">Para Ambientes Corporativos</h5>
            <ul class="list-disc list-inside text-gray-300 space-y-2 text-sm">
              <li><strong>Veeam ONE:</strong> Monitoramento abrangente de backups e infraestrutura</li>
              <li><strong>Nagios:</strong> Monitoramento personalizável com alertas</li>
              <li><strong>Zabbix:</strong> Solução open-source para monitoramento de TI</li>
              <li><strong>Custom Dashboards:</strong> Painéis personalizados com KPIs de backup</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">📋 Checklist de Gestão de Backup</h4>
        <div class="space-y-4">
          <div class="flex items-start">
            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-1 mr-3">
              <span class="text-white text-xs font-bold">✓</span>
            </div>
            <p class="text-gray-300 text-sm"><strong>Testar restauração de backups:</strong> Mensalmente, tente restaurar um arquivo ou imagem do sistema</p>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-1 mr-3">
              <span class="text-white text-xs font-bold">✓</span>
            </div>
            <p class="text-gray-300 text-sm"><strong>Verificar espaço disponível:</strong> Certifique-se de que há espaço suficiente para backups futuros</p>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-1 mr-3">
              <span class="text-white text-xs font-bold">✓</span>
            </div>
            <p class="text-gray-300 text-sm"><strong>Atualizar softwares de backup:</strong> Manter softwares atualizados para aproveitar novas funcionalidades e correções de segurança</p>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-1 mr-3">
              <span class="text-white text-xs font-bold">✓</span>
            </div>
            <p class="text-gray-300 text-sm"><strong>Revisar políticas de retenção:</strong> Remover backups antigos conforme política definida para economizar espaço</p>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-1 mr-3">
              <span class="text-white text-xs font-bold">✓</span>
            </div>
            <p class="text-gray-300 text-sm"><strong>Avaliar criptografia:</strong> Verificar se os backups estão adequadamente criptografados</p>
          </div>
        </div>
      `
    },
    {
      title: "Quando Chamar um Profissional de Recuperação de Dados",
      content: `
        <p class="mb-4 text-gray-300">
          Às vezes, o desastre é grande demais para resolver sozinho. Aqui estão os cenários onde vale a pena investir em serviço profissional:
        </p>
        
        <div class="bg-[#0A0A0F] border border-[#FF4B6B]/20 rounded-xl p-6">
          <h4 class="text-[#FF4B6B] font-bold mb-4">🚨 Sinais de Que Você Precisa de Recuperação Profissional:</h4>
          <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
            <li><strong>HD fazendo barulho estranho</strong> (cliques, apitos)—indício de falha mecânica. NÃO tente ligar novamente, cada tentativa piora.</li>
            <li><strong>SSD não é reconhecido</strong> em nenhum PC/adaptador—pode ser falha de controlador que requer laboratório.</li>
            <li><strong>Dano físico</strong> (HD caiu, molhou, queimou)—recuperação requer sala limpa.</li>
            <li><strong>Ransomware com criptografia forte</strong> e você não tem backup—empresas especializadas podem ter chaves ou negociar.</li>
            <li><strong>Dados críticos de negócio</strong> (contratos, projetos de clientes, anos de trabalho)—o custo de perder pode ser maior que o serviço (R$500-R$5000).</li>
          </ul>
        </div>
        
        <p class="mt-6 text-gray-300">
          Empresas confiáveis de recuperação no Brasil: <strong>HD Doctor, E-Recovery, Ontrack</strong>. Sempre peça diagnóstico gratuito antes. <strong>VOLTRIS também oferece consultoria</strong> de backup e pode indicar parceiros de recuperação quando necessário.
        </p>
      `
    }
  ];

  const faqItems = [
    {
      question: "Qual é a diferença entre backup e sincronização?",
      answer: "<strong>Backup</strong> é uma cópia de segurança em um momento específico (snapshot). Se você deletar um arquivo, ele continua no backup. <strong>Sincronização</strong> (como Google Drive padrão) espelha as mudanças—se você deletar no PC, deleta na nuvem também. Para backup verdadeiro, use softwares como Macrium Reflect ou ative versionamento/retenção de 30+ dias nos serviços de nuvem."
    },
    {
      question: "Com que frequência devo fazer backup?",
      answer: "Depende da importância dos dados: <strong>Dados críticos de trabalho:</strong> Diário (sincronização automática com nuvem). <strong>Imagem do sistema:</strong> Semanal ou quinzenal. <strong>Arquivos pessoais:</strong> Semanal. <strong>Fotos de eventos importantes:</strong> Imediatamente após tirar. A regra de ouro: se você não pode perder, faça backup no mesmo dia."
    },
    {
      question: "Backup incremental ou completo? Qual é melhor?",
      answer: "<strong>Backup completo (Full):</strong> Copia tudo do zero. Mais lento (30-90 min), mas independente. Faça o primeiro backup assim. <strong>Backup incremental:</strong> Copia apenas o que mudou desde o último backup. Muito rápido (5-15 min), mas depende da cadeia de backups anteriores. O ideal: 1 backup completo mensal + backups incrementais semanais."
    },
    {
      question: "Posso usar um SSD externo em vez de HD para backup?",
      answer: "Sim, e há vantagens: SSDs são <strong>5-10x mais rápidos</strong>, silenciosos e resistentes a quedas. Porém, são mais caros por GB e têm capacidade máxima menor (geralmente até 2TB vs 5TB+ em HDs). Recomendo SSD externo se você precisa de velocidade (backup rápido antes de viajar) e HD tradicional para armazenamento de longo prazo (Cold Backup)."
    },
    {
      question: "O que é RAID e devo usá-lo para backup?",
      answer: "RAID é uma tecnologia que usa múltiplos HDs juntos. <strong>RAID 1</strong> (espelhamento) copia tudo em 2 HDs simultaneamente—se um falhar, o outro continua funcionando. Porém, <strong>RAID NÃO É BACKUP</strong>. Se você deletar um arquivo ou pegar ransomware, ele é deletado/criptografado em ambos os discos. RAID protege contra falha de hardware, mas não contra erro humano ou vírus. Use RAID em NAS para disponibilidade, mas mantenha backup separado."
    },
    {
      question: "Meu HD de backup está ficando cheio. O que fazer?",
      answer: "Opções: 1) <strong>Deletar backups antigos:</strong> Softwares como Macrium permitem manter apenas os últimos 3-6 meses. 2) <strong>Comprar HD maior:</strong> Preços caem constantemente (HD 2TB custa ~R$400 em 2026). 3) <strong>Comprimir backups:</strong> Ative compressão no software de backup (economiza 20-40% de espaço). 4) <strong>Mover arquivos grandes para nuvem:</strong> Vídeos antigos podem ir pro Google Drive ilimitado (Google Fotos em alta qualidade)."
    },
    {
      question: "Posso fazer backup apenas da pasta 'Meus Documentos'?",
      answer: "Pode, mas é <strong>incompleto</strong>. Muitos programas salvam dados em locais não-padrão: <strong>Saves de jogos:</strong> Documents, AppData, ou pasta do próprio jogo. <strong>Configurações de programas:</strong> AppData (Roaming/Local). <strong>Área de Trabalho:</strong> Desktop (muita gente salva tudo ali). <strong>Favoritos do navegador:</strong> Exportar manualmente. Faça backup de TODA a pasta do usuário (C:\\Users\\SeuNome) para não esquecer nada."
    },
    {
      question: "Backup na nuvem é seguro? E se hackearem minha conta?",
      answer: "Nuvem é segura SE você tomar precauções: 1) <strong>Senha forte + 2FA (autenticação de dois fatores)</strong>—obrigatório. 2) <strong>Criptografia ponta-a-ponta:</strong> Use Mega.nz ou Cryptomator se quiser que nem a Google/Microsoft possam ver seus arquivos. 3) <strong>Não salvar senhas na nuvem sem criptografia:</strong> Use gerenciador de senhas dedicado (Bitwarden). 4) Ataques a contas de nuvem são raros—mais comum é phishing (você entregar a senha sem querer). Seja cauteloso."
    },
    {
      question: "Como fazer backup de um PC que não liga mais?",
      answer: "Se o problema é software (Windows corrompido), o <strong>HD/SSD está intacto</strong>: 1) Remova o disco e conecte em outro PC via adaptador SATA-USB (R$30-60). 2) Copie seus arquivos diretamente do disco. Se o problema é hardware (HD não é reconhecido, faz barulho), pare imediatamente e procure serviço profissional de recuperação—cada tentativa de ligar pode piorar."
    },
    {
      question: "Backup de smartphone: como fazer no Android e iPhone?",
      answer: "<strong>Android:</strong> Google Fotos (fotos/vídeos ilimitados em alta qualidade) + Google Drive (apps e configurações). <strong>iPhone:</strong> iCloud (5GB grátis, mas geralmente insuficiente—pague os 50GB por R$3/mês). Para backup completo, conecte no PC e use iTunes/Finder (iOS) ou Samsung Smart Switch (Android). Não confie apenas na nuvem—faça backup local também."
    },
    {
      question: "Posso confiar em serviços gratuitos de nuvem para sempre?",
      answer: "<strong>Não 100%</strong>. Serviços podem mudar políticas (Google já diminuiu espaço gratuito várias vezes), serem descontinuados (RIP Google+, Picasa), ou sua conta pode ser suspensa por engano. Sempre tenha <strong>pelo menos 2 serviços de nuvem diferentes</strong> (ex: Google Drive + OneDrive) e 1 backup local (HD Externo). Nunca coloque todos os ovos na mesma cesta."
    },
    {
      question: "Vale a pena pagar por Backblaze ou Carbonite?",
      answer: "Sim, se você tem muitos dados (500GB+). <strong>Backblaze:</strong> US$7/mês por PC ilimitado—melhor custo-benefício. Backup automático contínuo de todo o PC. <strong>Carbonite:</strong> Similar, mas mais caro (US$72/ano). Vantagem: 'set and forget'—você nunca esquece de fazer backup porque é automático. Desvantagem: restauração pode ser lenta (download de centenas de GB). Para a maioria das pessoas, Google One 2TB (R$35/mês) + Macrium local é suficiente."
    },
    {
      question: "Como fazer backup de dados em ambientes corporativos?",
      answer: "Em ambientes corporativos, recomenda-se uma estratégia robusta combinando: 1) <strong>Backup em nuvem gerenciada</strong> (Azure Backup, AWS Backup) para escalabilidade e compliance com normas regulatórias; 2) <strong>Soluções híbridas</strong> combinando armazenamento local (NAS/SAN) com nuvem para recuperação rápida e proteção offsite; 3) <strong>Criptografia em trânsito e em repouso</strong>; 4) <strong>Controle de acesso baseado em função (RBAC)</strong>; 5) <strong>Log de auditoria</strong> para rastrear acesso a dados sensíveis. Também é fundamental seguir políticas de retenção de dados e ter planos de disaster recovery testados regularmente."
    },
    {
      question: "Quais são as melhores práticas para backup de desenvolvedores?",
      answer: "Desenvolvedores devem seguir estratégias específicas: 1) <strong>Versionamento de código</strong> com Git (GitHub, GitLab, Bitbucket) com commits frequentes; 2) <strong>Backup de banco de dados</strong> com mysqldump, pg_dump ou MongoDB Atlas; 3) <strong>Gerenciamento de ambiente</strong> com Docker, Vagrant ou Ansible; 4) <strong>Armazenamento de assets digitais</strong> em AWS S3 ou Google Cloud Storage; 5) <strong>Aplicar a regra 3-2-1</strong> adaptada: repositório local + remoto + cópia em HD externo. Isso garante que código e dados críticos estejam protegidos contra perdas."
    },
    {
      question: "Como fazer backup de smartphones e tablets?",
      answer: "Para <strong>iOS (iPhone/iPad)</strong>: utilize iCloud para backup automático ou iTunes/Finder para backup completo no Mac/PC. Para <strong>Android</strong>: use Google One para sincronização automática e Google Photos para backup de mídia. Independentemente do sistema, é importante: 1) Verificar configurações de backup de apps críticos; 2) Exportar manualmente dados de autenticadores e apps bancários; 3) Utilizar ferramentas como Titanium Backup (root necessário) para backup completo em Android; 4) Manter cópias locais de dados importantes."
    },
    {
      question: "Como monitorar e gerenciar estratégias de backup?",
      answer: "Monitoramento eficaz envolve: 1) <strong>Testar restauração</strong> mensalmente para garantir que os backups funcionam; 2) <strong>Verificar espaço disponível</strong> regularmente; 3) <strong>Atualizar softwares de backup</strong> para obter correções de segurança; 4) <strong>Revisar políticas de retenção</strong> para remover backups antigos; 5) <strong>Utilizar ferramentas de monitoramento</strong> como CrystalDiskInfo, Macrium Reflect, Veeam ONE ou Nagios; 6) <strong>Avaliar criptografia</strong> dos backups. Um checklist regular é essencial para garantir a eficácia da estratégia."
    },
    {
      question: "Como escolher entre backup local e na nuvem?",
      answer: "A escolha depende de vários fatores: <strong>Backup local</strong> (HD externo, NAS) oferece velocidade de acesso e restauração rápidas, controle total dos dados e custos menores no longo prazo, mas exige manutenção física e está sujeito a desastres locais. <strong>Backup na nuvem</strong> oferece proteção offsite, escalabilidade, acesso remoto e automação, mas tem custos mensais, depende de conexão à internet e pode ter limitações de banda. A melhor abordagem é usar <strong>ambos</strong> seguindo a regra 3-2-1."
    },
    {
      question: "O que é versionamento de backup e por que é importante?",
      answer: "<strong>Versionamento</strong> é manter múltiplas cópias de arquivos ao longo do tempo, permitindo restaurar versões anteriores. É importante porque: 1) <strong>Protege contra ransomware</strong>—permite restaurar antes da infecção; 2) <strong>Permite recuperação de arquivos modificados acidentalmente</strong>; 3) <strong>Fornece histórico de alterações</strong> para documentos importantes. Softwares como Macrium Reflect, Backblaze e serviços de nuvem como OneDrive (versões anteriores) oferecem versionamento. A retenção típica varia de 30 a 999 dias."
    },
    {
      question: "Como proteger backups contra acessos não autorizados?",
      answer: "Proteção de backups envolve: 1) <strong>Criptografia</strong>—use BitLocker (Windows), FileVault (Mac) ou VeraCrypt para criptografar discos de backup; 2) <strong>Autenticação forte</strong>—senha complexa e 2FA para serviços de nuvem; 3) <strong>Controle de acesso físico</strong>—mantenha HDs externos em locais seguros; 4) <strong>Permissões restritas</strong>—configure permissões adequadas em redes corporativas; 5) <strong>Monitoramento de acesso</strong>—registre quem acessa cópias de backup; 6) <strong>Princípio de menor privilégio</strong>—permita acesso apenas a quem precisa."
    },
    {
      question: "Como calcular o espaço necessário para backups?",
      answer: "Para calcular espaço necessário: 1) <strong>Quantifique dados atuais</strong>—use ferramentas como TreeSize (Windows) ou DaisyDisk (Mac); 2) <strong>Calcule crescimento esperado</strong>—estime aumento de 20-50% anualmente; 3) <strong>Considere tipo de backup</strong>—completo (todo conteúdo) vs incremental (apenas mudanças); 4) <strong>Versionamento</strong>—multiplique pelo número de versões mantidas (ex: 30 dias de backups diários); 5) <strong>Overhead</strong>—adicione 10-20% para metadados e compressão. Exemplo: 500GB atuais + 30% crescimento + 30 versões + 20% overhead = ~20TB necessário."
    },
    {
      question: "Quais são as tendências em backup de dados para 2026?",
      answer: "As principais tendências para 2026 incluem: 1) <strong>AI-driven backup</strong>—inteligência artificial para otimizar políticas e detectar anomalias; 2) <strong>Backup contínuo</strong>—cópias em tempo real em vez de agendadas; 3) <strong>Edge computing</strong>—backup em dispositivos próximos à fonte de dados; 4) <strong>Blockchain para integridade</strong>—verificação de autenticidade de backups; 5) <strong>Storage class memory</strong>—tecnologia de armazenamento híbrida para backups rápidos; 6) <strong>Zero-trust security</strong>—verificação contínua de segurança em todos os níveis de backup."
    },
    {
      question: "Como lidar com backup de dados regulados (LGPD, SOX, HIPAA)?",
      answer: "Para dados regulados, siga: 1) <strong>Classificação de dados</strong>—identifique dados pessoais e sensíveis; 2) <strong>Retenção obrigatória</strong>—mantenha backups pelo período exigido por lei; 3) <strong>Criptografia obrigatória</strong>—dados devem estar protegidos; 4) <strong>Registros de auditoria</strong>—documente quem acessa os backups; 5) <strong>Localização geográfica</strong>—algumas leis exigem que dados fiquem em determinados países; 6) <strong>Descarte seguro</strong>—destruição certificada após período de retenção."
    },
    {
      question: "Como automatizar backups em ambientes complexos?",
      answer: "Automação em ambientes complexos envolve: 1) <strong>Scripts personalizados</strong>—usando PowerShell (Windows) ou Bash (Linux) para tarefas específicas; 2) <strong>Orquestração</strong>—utilizando ferramentas como Ansible, Chef ou Puppet; 3) <strong>Agendamento inteligente</strong>—softwares como Acronis Cyber Protect Cloud oferecem políticas baseadas em eventos; 4) <strong>Notificações e alertas</strong>—integração com ferramentas de monitoramento; 5) <strong>Testes automatizados</strong>—verificação automática da integridade dos backups; 6) <strong>Escalabilidade</strong>—soluções que crescem com a infraestrutura."
    },
    {
      question: "Qual é o impacto do ransomware na estratégia de backup?",
      answer: "O ransomware transformou a estratégia de backup: 1) <strong>Cold backup</strong>—desconectar HDs após backup para evitar criptografia; 2) <strong>Versionamento granular</strong>—manter múltiplas versões para restaurar antes da infecção; 3) <strong>Isolamento de rede</strong>—usar backups offsite ou air-gapped; 4) <strong>Detecção precoce</strong>—monitoramento de padrões de criptografia; 5) <strong>Testes de restauração</strong>—verificar se backups não foram comprometidos; 6) <strong>Planejamento de incidentes</strong>—procedimentos para recuperação após ataque. A estratégia deve assumir que o ataque vai ocorrer."
    }
  ];

  const externalReferences = [
    { name: "Macrium Reflect - Download Oficial (Gratuito)", url: "https://www.macrium.com/reflectfree" },
    { name: "Microsoft Docs - Histórico de Arquivos do Windows", url: "https://support.microsoft.com/pt-br/windows/fazer-backup-dos-arquivos-com-o-hist%C3%B3rico-de-arquivos-5de0e203-ebae-05ab-db85-d5aa0a199255" },
    { name: "Backblaze - Estatísticas de Confiabilidade de HDs (2026)", url: "https://www.backblaze.com/blog/" },
    { name: "NIST Cybersecurity Framework - Backup Guidelines", url: "https://www.nist.gov/cyberframework" },
    { name: "ISO 27001 - Norma de Segurança da Informação", url: "https://www.iso.org/isoiec-27001-information-security.html" },
    { name: "AWS Backup Documentation", url: "https://docs.aws.amazon.com/aws-backup/latest/userguide/what-is-backup.html" },
    { name: "Microsoft Azure Backup Solutions", url: "https://azure.microsoft.com/services/backup/" },
    { name: "Google Cloud Backup and DR Service", url: "https://cloud.google.com/solutions/dr" },
    { name: "Ransomware Protection Best Practices", url: "https://www.cisa.gov/keep-calm-and-back-file" },
    { name: "LGPD e Proteção de Dados no Brasil", url: "https://www.gov.br/mds/pt-br/lgpd" }
  ];

  const relatedGuides = [
    {
      href: "/guias/backup-automatico-nuvem",
      title: "Backup Automático na Nuvem",
      description: "Configure sincronização automática com Google Drive, OneDrive e Dropbox."
    },
    {
      href: "/guias/criptografia-dados",
      title: "Criptografia de Dados com BitLocker",
      description: "Proteja seus backups com criptografia forte contra roubo e acesso não-autorizado."
    },
    {
      href: "/guias/verificar-saude-hd-ssd-crystaldiskinfo",
      title: "Verificar Saúde do HD/SSD",
      description: "Use CrystalDiskInfo para saber se seu disco de backup está com defeito antes de perder dados."
    },
    {
      href: "/guias/protecao-ransomware",
      title: "Proteção contra Ransomware",
      description: "Estratégias avançadas para proteger seus backups de ataques cibernéticos."
    },
    {
      href: "/guias/seguranca-digital",
      title: "Segurança Digital",
      description: "Proteja seus dados com boas práticas de segurança cibernética."
    },
    {
      href: "/guias/recuperacao-dados",
      title: "Recuperação de Dados",
      description: "Saiba o que fazer quando seus backups falham e como recuperar dados."
    },
    {
      href: "/guias/gestao-servicos",
      title: "Gestão de Serviços de TI",
      description: "Como gerenciar estrategicamente serviços de backup em ambientes corporativos."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="60 min"
      difficultyLevel="Médio"
      author="Equipe Técnica Voltris"
      lastUpdated="Fevereiro 2026"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
      faqItems={faqItems}
      externalReferences={externalReferences}
    />
  );
}
