import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '@/components/AdSenseBanner';

export const metadata: Metadata = {
  title: "Guia Completo de Recuperação do Sistema Windows | VOLTRIS",
  description: "Aprenda a recuperar seu sistema Windows após falhas, corrupção ou problemas graves. Restaure seu computador para estado funcional com métodos profissionais.",
  keywords: [
    "recuperação de sistema",
    "restaurar windows",
    "ponto de restauração",
    "recuperação de falhas",
    "sistema corrompido",
    "restauração de imagem"
  ],
  openGraph: {
    title: "Guia Completo de Recuperação do Sistema Windows | VOLTRIS",
    description: "Recupere seu Windows após falhas com métodos profissionais e seguros.",
    type: "article",
    locale: "pt_BR"
  },
  twitter: {
    card: "summary_large_image",
    title: "Guia Completo de Recuperação do Sistema Windows",
    description: "Aprenda a recuperar seu sistema Windows após falhas e corrupções."
  }
};

export default function RecuperacaoSistemaGuide() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#121218] to-[#0A0A0F]">
        
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B31FF]/10 via-[#FF4B6B]/10 to-[#31A8FF]/10"></div>
          <div className="relative max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Guia Completo de Recuperação do Sistema Windows
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Recupere seu sistema Windows após falhas, corrupção ou problemas graves. 
              Aprenda métodos profissionais para restaurar seu computador ao estado funcional.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="bg-[#1c1c1e] px-3 py-1 rounded-full">Tempo estimado: 90 minutos</span>
              <span className="bg-[#1c1c1e] px-3 py-1 rounded-full">Nível: Avançado</span>
              <span className="bg-[#1c1c1e] px-3 py-1 rounded-full">Atualizado: Janeiro 2025</span>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="py-12 px-4 bg-[#121218]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Conteúdo do Guia</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1c1c1e] p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Métodos de Recuperação</h3>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Pontos de restauração do sistema</li>
                  <li>• Recuperação de imagem do sistema</li>
                  <li>• Reinicialização do sistema</li>
                  <li>• Restauração de fabricante</li>
                </ul>
              </div>
              <div className="bg-[#1c1c1e] p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Diagnóstico e Prevenção</h3>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Identificando causas de falhas</li>
                  <li>• Criando pontos de restauração</li>
                  <li>• Backup estratégico</li>
                  <li>• Monitoramento de sistema</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Introdução */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#8B31FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Quando e Por Que Recuperar o Sistema</h2>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                A recuperação do sistema é necessária quando seu Windows apresenta falhas graves, 
                corrupção de arquivos, infecções por malware ou após instalações problemáticas 
                que afetam o funcionamento normal do sistema operacional.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div className="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
                  <h3 className="text-white font-semibold mb-2">Sinais que Indicam Necessidade de Recuperação</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>❌ Sistema trava frequentemente</li>
                    <li>❌ Blue Screen of Death (BSOD)</li>
                    <li>❌ Programas não abrem ou crasham</li>
                    <li>❌ Desempenho extremamente lento</li>
                    <li>❌ Erros de arquivos do sistema</li>
                  </ul>
                </div>
                <div className="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
                  <h3 className="text-white font-semibold mb-2">Benefícios da Recuperação</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>✓ Retorno a estado estável</li>
                    <li>✓ Eliminação de malware</li>
                    <li>✓ Correção de erros do sistema</li>
                    <li>✓ Preservação de dados pessoais</li>
                    <li>✓ Evita reinstalação completa</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Conclusão */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#FF4B6B]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Conclusão</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                A recuperação do sistema é uma habilidade essencial para qualquer usuário avançado 
                de Windows. Com os métodos adequados e uma estratégia de prevenção bem planejada, 
                você pode resolver a maioria dos problemas graves do sistema sem perder dados importantes.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Lembre-se de que prevenção é sempre melhor que cura. Mantenha backups regulares, 
                crie pontos de restauração antes de grandes mudanças e monitore a saúde do seu 
                sistema continuamente para evitar problemas sérios.
              </p>
              <div className="bg-[#171313] p-6 rounded-lg border border-[#31A8FF]/30 mt-6">
                <p className="text-white font-semibold mb-3 text-lg">Precisa de Recuperação Profissional?</p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Nossa equipe especializada pode recuperar seu sistema com técnicas avançadas 
                  e garantir que seus dados estejam seguros durante todo o processo.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/todos-os-servicos"
                    className="px-6 py-3 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 text-center"
                  >
                    Ver Serviços de Recuperação
                  </Link>
                  <Link 
                    href="https://wa.me/5511996716235?text=Olá!%20Preciso%20de%20ajuda%20com%20recuperação%20de%20sistema."
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
              <Link href="/guias/formatacao-windows" className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-xl border border-[#FF4B6B]/10 hover:border-[#8B31FF]/30 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-2">Formatação do Windows</h3>
                <p className="text-gray-400 text-sm">Aprenda a formatar seu sistema corretamente.</p>
              </Link>
              <Link href="/guias/backup-dados" className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-xl border border-[#31A8FF]/10 hover:border-[#FF4B6B]/30 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-2">Backup de Dados</h3>
                <p className="text-gray-400 text-sm">Proteja seus dados com estratégias eficazes.</p>
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