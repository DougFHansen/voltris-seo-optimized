import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Mapa do Site | VOLTRIS',
    description: 'Navegue por todas as páginas, guias técnicos, serviços de TI e otimizações de computador da Voltris.',
    alternates: { canonical: 'https://www.voltris.com.br/mapa-do-site' }
};

export default function MapaDoSitePage() {
    // Generate links at build time (or runtime via Edge/Node if dynamic, but this is a simple list)
    // For simplicity, we will just point to the hubs and rely on their internal links to pass juice,
    // OR we can list everything. A true HTML Sitemap lists everything.
    
    // We will build a comprehensive static list of the main sections to ensure crawlability.
    // The previous orphan pages were mostly 'como-...' pages in the root app.
    const orphans = [
        '/atualizar-drivers-windows-automatico',
        '/aumentar-desempenho-emulador-android-windows',
        '/cluster-conteudo',
        '/como-corrigir-mouse-acelerando-sozinho-windows',
        '/como-desativar-copilot-windows-11',
        '/como-desativar-o-onedrive-windows-11-total',
        '/como-desativar-teclas-de-aderencia-permanente',
        '/como-desativar-windows-update-permanente',
        '/como-diminuir-input-lag-teclado-mouse',
        '/como-escolher-melhor-dns-windows-11',
        '/como-limpar-arquivos-temporarios-automaticamente',
        '/como-limpar-cache-diret-x-windows-11',
        '/como-limpar-lista-de-arquivos-recentes-windows-11',
        '/como-remover-arquivos-duplicados-windows-11',
        '/como-verificar-saude-do-ssd-windows-11',
        '/comparacoes/otimizacao-manual-vs-automatica',
        '/configurar-windows-defender-jogos',
        '/corrigir-100-disco-windows-11',
        '/corrigir-lag-pontual-no-teclado-windows',
        '/desativar-aplicativos-segundo-plano-windows-11',
        '/desativar-servicos-desnecessarios-windows-11',
        '/desativar-telemetria-windows',
        '/descobrir-quem-esta-usando-sua-wifi-windows',
        '/diagnostico-hardware-temperatura-pc',
        '/melhorar-performance-do-discord-windows-11',
        '/melhorar-performance-do-excel-em-planilhas-pesadas',
        '/melhorar-performance-do-spotify-windows-11',
        '/melhorar-performance-hd-antigo-windows',
        '/melhorar-performance-obs-studio-windows',
        '/melhorar-saude-bateria-notebook-windows',
        '/melhorar-velocidade-inicializacao-windows-11',
        '/melhores-configuracoes-de-som-para-jogos-windows',
        '/melhores-programas-otimizar-windows',
        '/melhores-tweaks-performance-windows-11',
        '/otimizacao-computador',
        '/otimizar-windows-11-para-gta-v-rp',
        '/otimizar-windows-para-architectura-bim-autocad',
        '/otimizar-windows-para-edicao-de-foto-photoshop',
        '/otimizar-windows-para-edicao-de-video',
        '/otimizar-windows-para-estatistica-ciencia-dados',
        '/otimizar-windows-para-league-of-legends',
        '/otimizar-windows-para-programacao-desenvolvimento',
        '/otimizar-windows-para-streaming-twitch-youtube',
        '/reduzir-latencia-rede-jogos-online',
        '/remover-bloatware-windows-11',
        '/verificar-processos-que-consomem-mais-cpu-windows',
        '/empresas',
        '/erros-jogos',
        '/exterior/portugal',
        '/guia-definitivo-privacidade-windows',
        '/melhorar-performance-da-steam-windows-11',
        '/melhorar-performance-do-google-chrome-windows',
        '/otimizar-windows-11-para-warzone',
        '/otimizar-windows-para-fortnite',
        '/servicos-combinados',
        '/servicos-sp',
        '/tecnico-informatica-minha-regiao'
    ];

    return (
        <div className="min-h-screen bg-[#050510] font-sans selection:bg-[#31A8FF]/30">
            <Header />
            <main className="pt-24 px-4 pb-20 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8">Mapa do Site</h1>
                
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">Artigos de Otimização e Guias Práticos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {orphans.map(url => (
                            <Link key={url} href={url} className="text-slate-400 hover:text-white transition-colors break-all">
                                {url.replace('/', '').replace(/-/g, ' ')}
                            </Link>
                        ))}
                    </div>
                </section>
                
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-purple-400 mb-4">Hubs Principais</h2>
                    <ul className="space-y-2">
                        <li><Link href="/" className="text-slate-400 hover:text-white">Home</Link></li>
                        <li><Link href="/todos-os-servicos" className="text-slate-400 hover:text-white">Serviços</Link></li>
                        <li><Link href="/guias" className="text-slate-400 hover:text-white">Central de Guias</Link></li>
                        <li><Link href="/corporativo" className="text-slate-400 hover:text-white">Corporativo B2B</Link></li>
                        <li><Link href="/exterior" className="text-slate-400 hover:text-white">Brasileiros no Exterior</Link></li>
                    </ul>
                </section>
            </main>
            <Footer />
        </div>
    );
}
