'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumb, Button, Icon, Tag, Pill, Tabs, Tab, TabHeader, TabBody, CardGeneral } from '@ama-pt/agora-design-system';
import { Reuse, Dataset } from '@/types/api';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface ReuseDetailClientProps {
    reuse: Reuse;
}

export default function ReuseDetailClient({ reuse }: ReuseDetailClientProps) {
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: pt });
        } catch (e) {
            return dateString;
        }
    };

    const renderTabBody = (content: React.ReactNode) => (
        <TabBody>
            <div className="relative">
                <div
                    className="absolute inset-y-0 -mx-4 sm:-mx-8 md:-mx-16 lg:-mx-32 xl:-mx-64 bg-neutral-50 z-0"
                    aria-hidden="true"
                />
                <div className="relative z-10 py-32 sm:py-64">
                    <div className="container mx-auto">
                        {content}
                    </div>
                </div>
            </div>
        </TabBody>
    );

    return (
        <div className="flex flex-col font-sans text-neutral-900 bg-white min-h-screen">
            {/* Hero Section */}
            <section className="bg-neutral-900 text-white pt-24 pb-48 sm:pb-64">
                <div className="container mx-auto px-4 sm:px-16 md:px-32 lg:px-64">
                    {/* Breadcrumbs & Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-16 mb-32">
                        <Breadcrumb
                            darkMode={true}
                            items={[
                                { label: 'Bem-vindo', url: '/' },
                                { label: 'Reutilizações', url: '/pages/reuses' },
                                { label: reuse.title, url: `/pages/reuses/${reuse.slug || reuse.id}` }
                            ]}
                        />
                        <div className="flex flex-wrap items-center gap-8 sm:gap-16">
                            <Button
                                variant="primary"
                                appearance="outline"
                                darkMode={true}
                                hasIcon={true}
                                leadingIcon="agora-line-star"
                                leadingIconHover="agora-solid-star"
                            >
                                Adicionar aos favoritos
                            </Button>
                            <Button
                                variant="primary"
                                hasIcon={true}
                                trailingIcon="agora-line-external-link"
                                className="hidden sm:flex"
                                onClick={() => window.open(reuse.url, '_blank')}
                            >
                                Veja reutilização
                            </Button>
                            <Button
                                variant="secondary"
                                appearance="ghost"
                                darkMode={true}
                                hasIcon={true}
                                leadingIcon="agora-line-flag"
                                aria-label="Reportar"
                            />
                        </div>
                    </div>

                    {/* Hero Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-32">
                        {/* Image Column */}
                        <div className="lg:col-span-8">
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-800">
                                <img
                                    src={reuse.image || '/images/placeholders/reuse-large.png'}
                                    alt={reuse.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Sidebar Card Column */}
                        <div className="lg:col-span-4">
                            <div className="h-full bg-white text-neutral-900 rounded-lg p-32 flex flex-col gap-24">
                                {reuse.organization?.logo ? (
                                    <div className="w-fit px-12 py-6 bg-primary-50 rounded-8 border border-primary-200 flex items-center justify-center">
                                        <img
                                            src={reuse.organization.logo}
                                            alt={reuse.organization.name}
                                            className="h-24 object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-120 h-40 bg-neutral-100 rounded-8 border border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-xs font-bold uppercase tracking-wider">
                                        LOGOIPSUM
                                    </div>
                                )}

                                <div>
                                    <div className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-8">
                                        Tempo
                                    </div>
                                    <h1 className="text-2xl-bold leading-tight mb-16">
                                        {reuse.title}
                                    </h1>
                                    <div className="flex items-center flex-wrap gap-16 text-sm">
                                        <span className="font-medium">{reuse.type || 'Aplicação'}</span>
                                        <div className="flex items-center gap-4 text-neutral-500">
                                            <Icon name="agora-line-eye" className="w-16 h-16" />
                                            <span>{reuse.metrics?.views ? (reuse.metrics.views >= 1000 ? (reuse.metrics.views / 1000).toFixed(0) + ' mil' : reuse.metrics.views) : '0'}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-neutral-500">
                                            <Icon name="agora-line-chart-bar" className="w-16 h-16" />
                                            <span>217</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <a
                                        href={reuse.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-700 font-bold hover:underline inline-flex items-center gap-8"
                                    >
                                        Veja reutilização
                                        <Icon name="agora-line-external-link" className="w-16 h-16" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs Section */}
            <section className="bg-white border-b border-neutral-200 sticky top-0 z-20">
                <div className="container mx-auto px-4 sm:px-16 md:px-32 lg:px-64">
                    <Tabs>
                        <Tab>
                            <TabHeader>Descrição</TabHeader>
                            {renderTabBody(
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 sm:gap-64">
                                    {/* Sidebar Metadata */}
                                    <aside className="lg:col-span-4 flex flex-col gap-24">
                                        <div className="bg-white p-24 rounded-lg border border-neutral-200">
                                            <div className="mb-24">
                                                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-8">Temático</h3>
                                                <p className="font-medium text-neutral-900">Política e vida pública</p>
                                            </div>
                                            <div className="mb-24">
                                                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-8">Tipo</h3>
                                                <p className="font-medium text-neutral-900">{reuse.type || 'Aplicação'}</p>
                                            </div>
                                            <div className="mb-24">
                                                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-8">Tags</h3>
                                                <div className="flex flex-wrap gap-8">
                                                    {(reuse.tags || ['mapeamento', 'dataconnexions-6', 'eleição', 'noivado', 'demonstração de impacto', 'percorrer']).map(tag => (
                                                        <Pill key={tag} appearance="solid" variant="primary-100" className="text-primary-700 h-auto py-4 px-8 text-xs font-semibold">
                                                            {tag}
                                                        </Pill>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-24 rounded-lg border border-neutral-200">
                                            <div className="mb-24">
                                                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-8">Última atualização</h3>
                                                <p className="font-medium text-neutral-900">{formatDate(reuse.last_modified)}</p>
                                            </div>
                                            <div className="mb-24">
                                                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-8">Data de criação</h3>
                                                <p className="font-medium text-neutral-900">{formatDate(reuse.created_at)}</p>
                                            </div>
                                        </div>

                                        <div className="bg-white p-24 rounded-lg border border-neutral-200">
                                            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-8">Vistas</h3>
                                            <div className="text-2xl font-bold text-neutral-900 mb-8">
                                                {reuse.metrics?.views ? (reuse.metrics.views / 1000).toLocaleString('pt-PT') + ' mil' : '1,68 mil'}
                                            </div>
                                            <Pill variant="success" appearance="outline" className="mb-8 h-auto">+31,25mil em janeiro de 2026</Pill>
                                            <div className="text-xs text-neutral-400">desde julho de 2022</div>
                                        </div>
                                    </aside>

                                    {/* Main Content */}
                                    <div className="lg:col-span-8">
                                        <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed">
                                            <h2 className="text-2xl-bold text-neutral-900 mb-24">Descrição</h2>
                                            <div className="whitespace-pre-wrap mb-32">
                                                {reuse.description}
                                            </div>

                                            {/* Featured image in content */}
                                            <div className="my-32 rounded-lg overflow-hidden border border-neutral-200">
                                                <img
                                                    src="/images/placeholders/reuse-content.png"
                                                    alt="Conteúdo da reutilização"
                                                    className="w-full h-auto"
                                                />
                                            </div>

                                            <p>
                                                2015 marca o início de um período de alta densidade eleitoral ( em média, 1 eleição a cada 8 meses até 2017 ).
                                            </p>
                                            <p className="font-bold">
                                                O sete panneaux-election.fr destina-se a ativistas políticos e cidadãos responsáveis pela afixação de cartazes eleitorais para seus candidatos em locais oficiais.
                                            </p>
                                            <p>
                                                Os cartazes eleitorais, uma operação logística essencial durante uma campanha política, representam um investimento significativo de tempo e recursos para os ativistas. Com o panneaux-election.fr , os ativistas economizam recursos e seu trabalho é simplificado ; eles podem, assim, se concentrar no que mais importa: seu engajamento e a defesa de suas ideias.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Tab>
                        <Tab>
                            <TabHeader>Discussões (1)</TabHeader>
                            {renderTabBody(
                                <div className="text-neutral-500 italic">Nenhuma discussão iniciada ainda.</div>
                            )}
                        </Tab>
                    </Tabs>
                </div>
            </section>

            {/* Bottom Sections */}
            <section className="bg-neutral-50 py-64">
                <div className="container mx-auto px-4 sm:px-16 md:px-32 lg:px-64">
                    {/* Associated Datasets */}
                    <div className="mb-64">
                        <h2 className="text-2xl-bold text-neutral-900 mb-32">
                            {reuse.datasets?.length || 5} conjuntos de dados associados
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                            {/* Assuming we have some associated datasets or placeholders */}
                            {(reuse.datasets || Array(5).fill(null)).map((dataset: Dataset | null, i) => (
                                <CardGeneral
                                    key={dataset?.id || i}
                                    isCardHorizontal={true}
                                    variant="white"
                                    image={{
                                        src: dataset?.organization?.logo || '/images/placeholders/organization.png',
                                        alt: dataset?.organization?.name || 'LOGOIPSUM',
                                    }}
                                    subtitleText={dataset?.organization?.name || 'Agência para a Reforma Tecnológica do Estado'}
                                    titleText={(
                                        <span className="font-bold text-lg text-neutral-900">
                                            {dataset?.title || 'Relatório Anual'}
                                        </span>
                                    ) as any}
                                    descriptionText={(
                                        <div className="flex flex-col gap-8">
                                            <span className="text-xs text-neutral-500">Actualizado há 10 dias</span>
                                            <p className="text-sm line-clamp-2">
                                                {dataset?.description || 'Este relatório aborda as tendências demográficas e económicas do país, baseando-se em dados coletados ao longo do ano.'}
                                            </p>
                                            <div className="flex items-center gap-16 mt-8 text-neutral-500">
                                                <div className="flex items-center gap-4 text-xs font-medium">
                                                    <Icon name="agora-line-eye" className="w-16 h-16" />
                                                    3 M
                                                </div>
                                                <div className="flex items-center gap-4 text-xs font-medium">
                                                    <Icon name="agora-line-download" className="w-16 h-16" />
                                                    450 mil
                                                </div>
                                                <div className="flex items-center gap-4 text-xs font-medium">
                                                    <Icon name="agora-line-chart-bar" className="w-16 h-16" />
                                                    200
                                                </div>
                                                <div className="flex items-center gap-4 text-xs font-medium">
                                                    <Icon name="agora-line-star" className="w-16 h-16" />
                                                    321
                                                </div>
                                            </div>
                                        </div>
                                    ) as any}
                                />
                            ))}
                        </div>
                    </div>

                    {/* APIs Empty State */}
                    <div className="bg-white rounded-lg p-64 flex flex-col items-center justify-center text-center border border-neutral-200 border-dashed">
                        <div className="w-120 h-120 mb-24 opacity-50 grayscale">
                            <img src="/images/illustrations/empty-api.png" alt="Sem APIs" className="w-full h-full object-contain" onError={(e) => (e.currentTarget.src = 'https://portal.agora.gov.pt/img/illustrations/empty-state.svg')} />
                        </div>
                        <h3 className="text-xl-bold text-neutral-900 mb-8">Ainda não existem APIs associados</h3>
                        <p className="text-neutral-500 max-w-md">
                            Esta reutilização não está atualmente associada a nenhuma API disponível no catálogo.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
