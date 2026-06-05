import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TechFloatingElements from '@/components/TechFloatingElements';
import { MapPinIcon, ShieldCheckIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
    title: 'Técnico de Informática por Região | Atendimento Remoto | VOLTRIS',
    description: 'Encontre suporte técnico especializado e otimização de computadores em todos os estados do Brasil. Atendimento 100% remoto, seguro e imediato.',
    alternates: {
        canonical: 'https://www.voltris.com.br/tecnico-informatica-em'
    }
};

const statesData = [
    { name: "São Paulo", slug: "sao-paulo", abbr: "SP", highlight: true },
    { name: "Rio de Janeiro", slug: "rio-de-janeiro", abbr: "RJ", highlight: true },
    { name: "Minas Gerais", slug: "belo-horizonte", abbr: "MG", highlight: true },
    { name: "Paraná", slug: "curitiba", abbr: "PR", highlight: true },
    { name: "Rio Grande do Sul", slug: "porto-alegre", abbr: "RS" },
    { name: "Santa Catarina", slug: "florianopolis", abbr: "SC" },
    { name: "Bahia", slug: "salvador", abbr: "BA" },
    { name: "Pernambuco", slug: "recife", abbr: "PE" },
    { name: "Ceará", slug: "fortaleza", abbr: "CE" },
    { name: "Goiás", slug: "goiania", abbr: "GO" },
    { name: "Distrito Federal", slug: "brasilia", abbr: "DF" },
    { name: "Amazonas", slug: "manaus", abbr: "AM" },
    { name: "Pará", slug: "belem", abbr: "PA" },
    { name: "Espírito Santo", slug: "vitoria", abbr: "ES" },
    { name: "Mato Grosso do Sul", slug: "campo-grande", abbr: "MS" },
    { name: "Mato Grosso", slug: "cuiaba", abbr: "MT" },
    { name: "Maranhão", slug: "sao-luis", abbr: "MA" },
    { name: "Rio Grande do Norte", slug: "natal", abbr: "RN" },
    { name: "Paraíba", slug: "joao-pessoa", abbr: "PB" },
    { name: "Alagoas", slug: "maceio", abbr: "AL" },
    { name: "Piauí", slug: "teresina", abbr: "PI" },
    { name: "Sergipe", slug: "aracaju", abbr: "SE" },
    { name: "Tocantins", slug: "palmas", abbr: "TO" },
    { name: "Acre", slug: "rio-branco", abbr: "AC" },
    { name: "Rondônia", slug: "porto-velho", abbr: "RO" },
    { name: "Roraima", slug: "boa-vista", abbr: "RR" },
    { name: "Amapá", slug: "macapa", abbr: "AP" }
];

export default function HubRegioesPage() {
    return (
        <>
            <Header />
            <main className="bg-gray-50 min-h-screen font-sans">
                {/* Hero Section */}
                <section className="pt-32 pb-20 px-4 relative overflow-hidden bg-white border-b border-gray-200">
                    <TechFloatingElements />
                    <div className="max-w-5xl mx-auto text-center relative z-10">
                        <div className="mb-6 flex justify-center">
                            <Breadcrumbs items={[
                                { label: "Locais de Atendimento" }
                            ]} />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                            Atendimento Técnico <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">em Todo o Brasil</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Selecione seu estado abaixo. A Voltris oferece infraestrutura digital remota para garantir performance máxima, independentemente de onde você esteja.
                        </p>
                    </div>
                </section>

                {/* Grid Section */}
                <section className="py-20 px-4 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {statesData.map((state) => (
                                <Link
                                    key={state.slug}
                                    href={`/tecnico-informatica-em/${state.slug}`}
                                    className={`group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${state.highlight ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:border-blue-400 shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${state.highlight ? 'bg-white shadow-sm' : 'bg-gray-100 group-hover:bg-blue-50 transition-colors'}`}>
                                            <MapPinIcon className={`w-5 h-5 ${state.highlight ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'}`} />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-gray-900">{state.name}</span>
                                            <span className="text-xs text-gray-500 uppercase tracking-wider">{state.abbr}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer Banner */}
                <section className="pb-24 px-4 relative z-10">
                    <div className="max-w-4xl mx-auto p-12 rounded-[2rem] bg-gray-900 text-white text-center shadow-xl">
                        <ShieldCheckIcon className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-4">Seu estado não está na lista?</h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Nossa tecnologia de acesso remoto permite que atendamos literalmente qualquer cidade do Brasil com conexão à internet.
                        </p>
                        <Link href="/contato" className="inline-block px-8 py-4 rounded-xl bg-blue-600 font-bold hover:bg-blue-500 transition-colors">
                            Falar com um Especialista Agora
                        </Link>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
