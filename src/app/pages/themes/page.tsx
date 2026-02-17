'use client';

import React, { useState } from 'react';
import { Breadcrumb, Icon, Button, InputSearchBar } from '@ama-pt/agora-design-system';

export default function ThemesPage() {
    const [expandedSection, setExpandedSection] = useState<string | null>('ofertas');

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <main className="flex-grow bg-white">
            {/* Banner Section */}
            {/* Banner Section */}
            <div className="agora-card-highlight-newsletter datasets-background bg-primary-900">
                <div className="card-container relative z-10 pt-8 pb-20">
                    <div className="card-content w-full">
                        <div className="container mx-auto px-4">
                            <Breadcrumb
                                darkMode={true}
                                items={[
                                    { label: 'Bem-vindo', url: '/' },
                                    { label: 'Dados relacionados à cultura', url: '#' }
                                ]}
                                className="mb-4"
                            />
                            <div className="title">
                                <h1 className="xl:text-3xl-bold md:text-3xl-bold xs:text-2xl-bold text-white">Dados relacionados à cultura</h1>
                            </div>
                            <div className="subtitle">
                                <p className="text-primary-100 mb-8 max-w-4xl text-lg leading-relaxed">
                                    Esta página tem como objetivo listar os principais conjuntos de dados relacionados à cultura disponíveis em dados.gov.pt. Ela não é exaustiva e <a href="#" className="underline font-bold hover:text-primary-200 transition-colors">está aberta a contribuições</a>.
                                </p>
                                <p className="text-primary-100 max-w-4xl text-lg leading-relaxed">
                                    Você pode descobrir todos os dados relacionados à cultura em <a href="#" className="underline font-bold hover:text-primary-200 transition-colors">culture.data.gouv.fr</a>, a plataforma dedicada a referenciar, promover e divulgar dados culturais públicos na França.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="input-container">
                        <div className="email-bar">
                            <div className="container mx-auto grid xs:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 pb-64">
                                <div className="relative text-white">
                                    <InputSearchBar
                                        label="Pesquisar conjuntos de dados de cultura"
                                        hideLabel={true}
                                        placeholder="Pesquisar datasets, organizações, temas..."
                                        id="culture-search"
                                        hasVoiceActionButton={true}
                                        voiceActionAltText="Pesquisar por voz"
                                        searchActionAltText="Pesquisar"
                                        darkMode={true}
                                    />
                                    <div className="mt-64">
                                        <Button
                                            variant="primary"
                                            darkMode={true}
                                            hasIcon={false}
                                            className="px-24 py-16 rounded-8 h-auto"
                                        >
                                            <span className="text-lg font-medium">
                                                Publicar <span className="font-bold">dados.gov</span>
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-64">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-48">

                    {/* Sidebar Navigation */}
                    <div className="md:col-span-1">
                        <div className="sticky top-120">
                            <div className="mb-40 flex justify-center md:justify-start">
                                <img
                                    src="/culture-illustration.png"
                                    alt="Ilustração de Cultura"
                                    className="w-full max-w-[180px] h-auto grayscale opacity-80"
                                />
                            </div>

                            <nav className="flex flex-col border-t border-neutral-200 pt-16">
                                <div className="py-12 border-b border-neutral-100">
                                    <a href="#" className="text-primary-700 font-bold hover:text-primary-900 transition-colors flex items-center justify-between">
                                        Observações preliminares
                                    </a>
                                </div>

                                {/* Ofertas e espaços culturais */}
                                <div className="py-12 border-b border-neutral-100 flex flex-col">
                                    <button
                                        onClick={() => toggleSection('ofertas')}
                                        className={`font-bold flex items-center justify-between w-full text-left transition-colors ${expandedSection === 'ofertas' ? 'text-primary-700' : 'text-neutral-900 hover:text-primary-700'}`}
                                    >
                                        Ofertas e espaços culturais
                                        <Icon
                                            name={expandedSection === 'ofertas' ? 'agora-line-chevron-down' : 'agora-line-chevron-right'}
                                            className="w-5 h-5"
                                        />
                                    </button>
                                    {expandedSection === 'ofertas' && (
                                        <div className="pl-16 mt-12 flex flex-col gap-8 text-sm text-neutral-600">
                                            <a href="#heranca" className="hover:text-primary-700 transition-colors">Herança</a>
                                            <a href="#livros" className="hover:text-primary-700 transition-colors">Livros e leitura</a>
                                            <a href="#imprensa" className="hover:text-primary-700 transition-colors">Imprensa</a>
                                            <a href="#cinema" className="hover:text-primary-700 transition-colors">Cinema</a>
                                            <a href="#apresentacao" className="hover:text-primary-700 transition-colors">Apresentação ao vivo</a>
                                        </div>
                                    )}
                                </div>

                                {/* Práticas culturais */}
                                <div className="py-12 border-b border-neutral-100">
                                    <button
                                        onClick={() => toggleSection('praticas')}
                                        className="text-neutral-900 font-bold flex items-center justify-between w-full text-left hover:text-primary-700 transition-colors"
                                    >
                                        Práticas culturais
                                        <Icon name="agora-line-chevron-right" className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Políticas culturais */}
                                <div className="py-12 border-b border-neutral-100">
                                    <button
                                        className="text-neutral-900 font-bold flex items-center justify-between w-full text-left hover:text-primary-700 transition-colors"
                                    >
                                        Políticas culturais
                                        <Icon name="agora-line-chevron-right" className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Economia da cultura */}
                                <div className="py-12 border-b border-neutral-100">
                                    <button
                                        className="text-neutral-900 font-bold flex items-center justify-between w-full text-left hover:text-primary-700 transition-colors"
                                    >
                                        Economia da cultura
                                        <Icon name="agora-line-chevron-right" className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="py-12 border-b border-neutral-100">
                                    <a href="#" className="text-neutral-900 font-bold hover:text-primary-700 transition-colors block">
                                        Recursos documentais culturais
                                    </a>
                                </div>

                                <div className="py-12 border-b border-neutral-100">
                                    <a href="#" className="text-neutral-900 font-bold hover:text-primary-700 transition-colors block">
                                        Reutilização de dados relacionados à cultura
                                    </a>
                                </div>

                                <div className="py-12">
                                    <a href="#" className="text-neutral-900 font-bold hover:text-primary-700 transition-colors leading-tight block">
                                        Os principais produtores de dados relacionados à cultura
                                    </a>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-3">
                        <section className="mb-64">
                            <h2 className="text-3xl font-bold text-neutral-900 mb-24">Ofertas e espaços culturais</h2>
                            <ul className="space-y-4 mb-48">
                                <li>
                                    <a href="#" className="text-primary-700 hover:underline flex items-center gap-8 font-medium group">
                                        Base de dados de espaços e instalações culturais (Basílica)
                                        <Icon name="agora-line-external-link" className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </a>
                                </li>
                            </ul>

                            {/* Herança Section */}
                            <div id="heranca" className="mt-48 scroll-mt-120">
                                <h3 className="text-xl font-bold text-neutral-900 border-b border-neutral-200 pb-8 mb-24 flex items-center gap-12">
                                    Herança
                                </h3>
                                <ul className="space-y-12 list-disc pl-24 text-neutral-700">
                                    <li>
                                        <a href="#" className="text-primary-700 hover:underline font-medium">Edifícios protegidos como Monumentos Históricos</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-primary-700 hover:underline font-medium">Lista e localização de museus na França</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-primary-700 hover:underline font-medium">Lista de coordenadas GPS de monumentos nacionais</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-primary-700 hover:underline font-medium">Museus da França: Base de dados Muséofile</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-primary-700 hover:underline font-medium">Lista de sítios patrimoniais notáveis (SPR)</a>:
                                        <span className="ml-4">Cidades, vilas ou distritos cuja conservação, restauração, reabilitação ou valorização apresenta, do ponto de vista histórico, arquitetônico, arqueológico, artístico ou paisagístico, interesse público.</span>
                                    </li>
                                    <li>
                                        <a href="#" className="text-primary-700 hover:underline font-medium">Lista de edifícios classificados como &quot;Arquitetura Contemporânea Notável&quot; (ACR)</a>:
                                        <span className="ml-4">Edifícios, conjuntos arquitetônicos, obras de arte e empreendimentos cujo design apresenta interesse arquitetônico ou técnico.</span>
                                    </li>
                                    <li>
                                        <a href="#" className="text-primary-700 hover:underline font-medium">Lista de Casas de Personalidades Ilustres</a>:
                                        <span className="ml-4">Lugares cuja finalidade é preservar e transmitir a memória de mulheres e homens que se destacaram na história política, social e cultural.</span>
                                    </li>
                                    <li>
                                        <a href="#" className="text-primary-700 hover:underline font-medium">Lista de jardins notáveis</a>:
                                        <span className="ml-4">Jardins e parques de interesse cultural, estético, histórico ou botânico.</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Livros e leitura Section */}
                            <div id="livros" className="mt-48 scroll-mt-120">
                                <h3 className="text-xl font-bold text-neutral-900 border-b border-neutral-200 pb-8 mb-24">Livros e leitura</h3>
                                <ul className="space-y-12 list-disc pl-24 text-neutral-700">
                                    <li>
                                        <a href="#" className="text-primary-700 hover:underline font-medium">Bibliotecas municipais: endereços e dados de atividade</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-primary-700 hover:underline font-medium">Lista de organizações beneficiadas pela exceção de direitos autorais para pessoas com deficiência</a>
                                    </li>
                                </ul>
                            </div>

                            {/* Imprensa Section */}
                            <div id="imprensa" className="mt-48 scroll-mt-120">
                                <h3 className="text-xl font-bold text-neutral-900 border-b border-neutral-200 pb-8 mb-24">Imprensa</h3>
                                <ul className="space-y-12 list-disc pl-24 text-neutral-700">
                                    <li>
                                        <a href="#" className="text-primary-700 hover:underline font-medium">Lista de publicações de imprensa</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-primary-700 hover:underline font-medium">Lista de serviços de notícias online reconhecidos</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-primary-700 hover:underline font-medium">Lista de agências de notícias credenciadas</a>
                                    </li>
                                </ul>
                            </div>

                            {/* Cinema Section */}
                            <div id="cinema" className="mt-48 scroll-mt-120">
                                <h3 className="text-xl font-bold text-neutral-900 border-b border-neutral-200 pb-8 mb-24">Cinema</h3>
                                <ul className="space-y-12 list-disc pl-24 text-neutral-700">
                                    <li>
                                        <a href="#" className="text-primary-700 hover:underline font-medium">Lista de cinemas em funcionamento</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-primary-700 hover:underline font-medium">Cinemas do OpenStreetMap</a>
                                    </li>
                                </ul>
                            </div>

                            {/* Apresentação ao vivo Section */}
                            <div id="apresentacao" className="mt-48 scroll-mt-120">
                                <h3 className="text-xl font-bold text-neutral-900 border-b border-neutral-200 pb-8 mb-24">Apresentação ao vivo</h3>
                                <ul className="space-y-12 list-disc pl-24 text-neutral-700">
                                    <li>
                                        <a href="#" className="text-primary-700 hover:underline font-medium">Ópera - Apresentações líricas e coreográficas - Temporada 2023/2024</a>
                                    </li>
                                </ul>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
