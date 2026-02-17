'use client';

import React from 'react';
import { Button, Icon, Breadcrumb, CardArticle } from '@ama-pt/agora-design-system';
import Link from 'next/link';

export default function ArticleDetail() {
    return (
        <div className="flex flex-col font-sans text-neutral-900 bg-white min-h-screen">
            <main className="flex-grow container mx-auto px-4 py-64">
                {/* Breadcrumb */}
                <div className="mb-32">
                    <Breadcrumb
                        items={[
                            { label: 'Página inicial', url: '/' },
                            { label: 'Últimas novidades', url: '#' },
                            { label: 'Webinar Developers e Data Scientists', url: '#' }
                        ]}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-64">
                    {/* Main Content */}
                    <article className="lg:col-span-8">
                        <div className="mb-48">
                            <span className="text-primary-700 font-semibold uppercase tracking-wider text-sm">Webinar</span>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mt-16 mb-24 leading-tight">
                                Webinar Developers e Data Scientists: Publicação e uso de dados abertos
                            </h1>
                            <div className="flex items-center gap-16 text-neutral-500 text-sm">
                                <div className="flex items-center gap-8">
                                    <Icon name="agora-line-calendar" className="w-20 h-20" />
                                    <span>21 de novembro de 2024</span>
                                </div>
                                <div className="flex items-center gap-8">
                                    <Icon name="agora-line-user" className="w-20 h-20" />
                                    <span>Equipa dados.gov</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-48 rounded-2xl overflow-hidden shadow-xl">
                            <img
                                src="/last-new1.svg"
                                alt="Webinar Event"
                                className="w-full h-auto object-cover max-h-[500px]"
                            />
                        </div>

                        <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed space-y-24">
                            <p>
                                No próximo dia 21 de novembro, o portal dados.gov irá realizar um webinar dedicado a developers e data scientists, focado na publicação e aproveitamento de dados abertos em Portugal.
                            </p>
                            <p>
                                Este evento online pretende explorar as potencialidades técnicas da plataforma, demonstrando como as APIs disponíveis podem ser utilizadas para construir aplicações inovadoras e realizar análises de dados avançadas.
                            </p>
                            <h2 className="text-2xl font-bold text-primary-900 pt-16">O que esperar deste webinar?</h2>
                            <ul className="list-disc pl-24 space-y-12">
                                <li>Demonstração técnica da API do dados.gov (Ckan/Udata).</li>
                                <li>Boas práticas na estruturação de metadados para máxima descoberta.</li>
                                <li>Casos de uso reais: de dashboards municipais a modelos de IA.</li>
                                <li>Sessão de Q&A direta com a equipa técnica.</li>
                            </ul>
                            <p>
                                A participação é gratuita, mas requer inscrição prévia através do formulário abaixo. Junte-se a nós para fortalecer a comunidade de dados abertos em Portugal!
                            </p>

                            <div className="mt-64 p-32 bg-primary-50 rounded-16 border border-primary-100 flex flex-col md:flex-row items-center justify-between gap-24">
                                <div>
                                    <h3 className="text-xl font-bold text-primary-900">Garanta o seu lugar</h3>
                                    <p className="text-neutral-600">As inscrições encerram a 20 de novembro.</p>
                                </div>
                                <Button variant="primary">
                                    Inscrever-me agora
                                </Button>
                            </div>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-48">
                        <div className="bg-neutral-50 p-32 rounded-2xl border border-neutral-100">
                            <h3 className="text-xl font-bold text-primary-900 mb-24">Partilhar</h3>
                            <div className="flex gap-16">
                                <Button variant="primary" appearance="outline" iconOnly={true} leadingIcon="agora-line-facebook" aria-label="Partilhar no Facebook" />
                                <Button variant="primary" appearance="outline" iconOnly={true} leadingIcon="agora-line-twitter" aria-label="Partilhar no Twitter" />
                                <Button variant="primary" appearance="outline" iconOnly={true} leadingIcon="agora-line-linkedin" aria-label="Partilhar no LinkedIn" />
                                <Button variant="primary" appearance="outline" iconOnly={true} leadingIcon="agora-line-link" aria-label="Copiar link" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-primary-900 mb-24">Notícias relacionadas</h3>
                            <div className="flex flex-col gap-24">
                                <CardArticle
                                    image={{ src: '/last-new2.svg', alt: 'Related 1' }}
                                    subtitle="15 de novembro de 2024"
                                    title="Novas diretrizes para dados de mobilidade urbana"
                                    mainAnchor={{ href: '#', title: 'Ver mais', hasIcon: true, iconOnly: true, leadingIcon: 'agora-line-arrow-right-circle' }}
                                    blockedLink={true}
                                />
                                <CardArticle
                                    image={{ src: '/last-new3.svg', alt: 'Related 2' }}
                                    subtitle="10 de novembro de 2024"
                                    title="Lançamento do portal de dados abertos da saúde"
                                    mainAnchor={{ href: '#', title: 'Ver mais', hasIcon: true, iconOnly: true, leadingIcon: 'agora-line-arrow-right-circle' }}
                                    blockedLink={true}
                                />
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
