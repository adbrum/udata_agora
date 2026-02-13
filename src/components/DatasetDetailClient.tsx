'use client';

import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Button, Icon, Tag, Breadcrumb, CardExpandable, Pill, ProgressBar } from '@ama-pt/agora-design-system';
import { Dataset } from '@/types/api';
import { DatasetTabs } from '@/components/DatasetTabs';

interface DatasetDetailClientProps {
    dataset: Dataset;
}

export default function DatasetDetailClient({ dataset }: DatasetDetailClientProps) {
    return (
        <div className="flex flex-col font-sans text-neutral-900 bg-white h-full">
            <main className="flex-grow container mx-auto px-4 py-64">
                {/* Breadcrumb & Action Section */}
                <div className="flex justify-between items-center mb-6">
                    <Breadcrumb
                        items={[
                            { label: 'Bem-vindo', url: '/' },
                            { label: 'Conjuntos de dados', url: '/pages/datasets' },
                            { label: dataset.title, url: `/pages/datasets/${dataset.slug}` }
                        ]}
                    />
                    <Button
                        variant="primary"
                        appearance="outline"
                        hasIcon={true}
                        leadingIcon="agora-line-star"
                        leadingIconHover="agora-solid-star"
                        className="flex-shrink-0"
                    >
                        Adicionar aos favoritos
                    </Button>
                </div>

                <div className="grid md:grid-cols-3 xl:grid-cols-12 gap-32 pb-64">
                    {/* Main Content Column */}
                    <div className="xl:col-span-6 xl:block  md:pt-64">
                        {/* Title & Organization Header */}
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <h1 className="text-xl-bold text-neutral-900 leading-tight mb-24">
                                    {dataset.title}
                                </h1>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="prose max-w-none text-neutral-700 text-lg leading-relaxed mb-12">
                            <h2 className="text-xl font-bold text-neutral-900 mb-4 hidden">Descrição</h2>
                            <p>{dataset.description}</p>

                            {/* Example of extra content structure to match screenshot "Observações preliminares" */}
                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-neutral-900 mb-4">Observações preliminares</h3>
                                <p className="">
                                    Este relatório aborda as tendências demográficas e económicas do país, baseando-se em dados recolhidos ao longo do ano.
                                </p>
                            </div>

                            {/* Example of extra content structure to match screenshot "O que é DVF?" */}
                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-neutral-900 mb-4">O que é DVF?</h3>
                                <p className="">
                                    Este conjunto de dados "Pedidos de Valores de Terrenos", publicado e produzido pela Direção Geral das Finanças Públicas, fornece informações sobre transações imobiliárias realizadas nos últimos cinco anos na França metropolitana e nos departamentos e territórios ultramarinos franceses, com exceção da Alsácia, Mosela e Mayotte. Os dados que contém provêm de escrituras notariais e informações cadastrais.
                                </p>
                                <a href="#" className="block mt-4 text-primary-700 font-bold hover:underline">
                                    Ler mais
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="xl:col-span-6 md:pt-64 ">
                        {/* Organization Box */}
                        <div className="rounded-lg p-32 flex flex-col gap-24 h-fit md:mb-8 bg-primary-100">
                            {/* Organization Logo Badge */}
                            {dataset.organization?.logo ? (
                                <div className="w-fit px-12 py-6 bg-[#F0F5FF] rounded-8 border border-[#7BB2FF] flex items-center justify-center">
                                    <img
                                        src={dataset.organization.logo}
                                        alt={dataset.organization.name}
                                        className="h-24 object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="w-fit px-12 py-6 bg-neutral-100 rounded-8 border border-neutral-200 flex items-center justify-center text-neutral-400">
                                    <Icon name="agora-line-building" className="w-6 h-6" />
                                </div>
                            )}

                            {/* Main Information */}
                            <div className="space-y-16">
                                <div className=" text-sm">
                                    {dataset.organization?.name || 'Organização Desconhecida'}
                                </div>
                                <div className="text-xl-bold text-neutral-900 leading-tight">
                                    {dataset.title}
                                </div>
                                <div className="text-neutral-900 text-sm">
                                    <span className="font-bold">Última atualização:</span>{' '}
                                    {new Date(dataset.last_modified).toLocaleDateString('pt-PT', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                                <div className="pt-8">
                                    <a href="#" className="text-primary-700 hover:underline font-medium text-sm">
                                        Licença Aberta / Licença Aberta versão 2.0
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Metrics Box */}
                        <div className="grid grid-cols-2 gap-8 md:mb-8">
                            <div className="bg-primary-100 p-32 rounded-lg p-6 ">
                                <div className="text-sm mb-2">Vistas</div>
                                <div className="text-2xl font-bold text-neutral-900">
                                    {dataset.metrics?.views
                                        ? (dataset.metrics.views / 1000).toLocaleString('pt-PT', { maximumFractionDigits: 1 }) + ' mil'
                                        : '0'}
                                </div>
                                <div className="flex items-center gap-1 mt-2">
                                    <Pill
                                        appearance="outline"
                                        variant="success"
                                        className="h-auto"
                                    >
                                        +11.2 mil
                                    </Pill>
                                </div>
                                <div className="text-xs text-neutral-400 mt-1">desde julho de 2022</div>
                            </div>
                            <div className="bg-primary-100 p-32 rounded-lg p-6">
                                <div className="text-sm mb-2">Downloads</div>
                                <div className="text-2xl font-bold text-neutral-900">
                                    {dataset.metrics?.downloads
                                        ? (dataset.metrics.downloads / 1000).toLocaleString('pt-PT', { maximumFractionDigits: 1 }) + ' mil'
                                        : '0'}
                                </div>
                                <div className="flex items-center gap-1 mt-2">
                                    <Pill
                                        appearance="outline"
                                        variant="success"
                                        className="h-auto"
                                    >
                                        +37.2 mil
                                    </Pill>
                                </div>
                                <div className="text-xs text-neutral-400 mt-1">desde julho de 2022</div>
                            </div>
                        </div>

                        {/* Quality Box */}
                        <div className="bg-primary-100 p-32 rounded-lg p-6">
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="font-bold text-neutral-900">Qualidade dos metados</h3>
                            </div>
                            <ProgressBar
                                value={100}
                                label="Excelente"
                            />
                        </div>
                    </div>
                </div>

                {/* Blue Banner / Callout replaced with CardExpandable */}
                <CardExpandable
                    variant="primary-100"
                    showBookmarkIcon={true}
                    cardTitle="Está à procura do preço de venda de um imóvel ou terreno?"
                    cardSubtitle={
                        <div className="flex flex-col gap-4 mt-4">
                            <p className="">
                                O aplicativo "Dados de Valorização de Terrenos (DVF)" permite acessar informações claras sobre imóveis vendidos a partir do banco de dados da Direção Geral de Finanças Públicas.
                            </p>
                            <a href="#" className="text-primary-700 font-bold hover:underline inline-flex items-center gap-2">
                                Consulte o aplicativo "Dados de Valor de Terreno (DVF)"
                                <Icon name="agora-line-external-link" className="w-4 h-4" />
                            </a>
                        </div>
                    }
                    accordionHeadingTitle="Mais informações"
                    className="mt-16"
                >
                    {/* Extra detail section or empty if nothing else is hidden */}
                    <div className="pt-4">
                        Aqui poderá encontrar detalhes adicionais sobre o funcionamento do aplicativo e integração de dados.
                    </div>
                </CardExpandable>

                {/* Tabs Section at the very bottom of main content */}
                <DatasetTabs dataset={dataset} />
            </main>
        </div>
    );
}
