'use client';

import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Button, Icon, Tag, Breadcrumb, CardExpandable } from '@ama-pt/agora-design-system';
import { Dataset } from '@/types/api';
import { DatasetTabs } from '@/components/DatasetTabs';

interface DatasetDetailClientProps {
    dataset: Dataset;
}

export default function DatasetDetailClient({ dataset }: DatasetDetailClientProps) {
    return (
        <div className="flex flex-col font-sans text-neutral-900 bg-white h-full">
            <main className="flex-grow container mx-auto px-4 py-8">
                {/* Breadcrumb Section */}
                <Breadcrumb
                    items={[
                        { label: 'Bem-vindo', url: '/' },
                        { label: 'Conjuntos de dados', url: '/pages/datasets' },
                        { label: dataset.title, url: `/pages/datasets/${dataset.slug}` }
                    ]}
                    className="mb-6"
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Title & Organization Header */}
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <h1 className="text-4xl font-bold text-neutral-900 leading-tight">
                                    {dataset.title}
                                </h1>
                                <Button variant="neutral" appearance="outline" className="flex-shrink-0 gap-2 items-center">
                                    <Icon name="agora-line-star" className="w-5 h-5" />
                                    Adicionar aos favoritos
                                </Button>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="prose max-w-none text-neutral-700 text-lg leading-relaxed mb-12">
                            <h2 className="text-xl font-bold text-neutral-900 mb-4 hidden">Descrição</h2>
                            <p>{dataset.description}</p>

                            {/* Example of extra content structure to match screenshot "Observações preliminares" */}
                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-neutral-900 mb-4">Observações preliminares</h3>
                                <p className="text-neutral-600">
                                    Este relatório aborda as tendências demográficas e económicas do país, baseando-se em dados recolhidos ao longo do ano.
                                </p>
                            </div>

                            {/* Example of extra content structure to match screenshot "O que é DVF?" */}
                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-neutral-900 mb-4">O que é DVF?</h3>
                                <p className="text-neutral-600">
                                    Este conjunto de dados "Pedidos de Valores de Terrenos", publicado e produzido pela Direção Geral das Finanças Públicas, fornece informações sobre transações imobiliárias realizadas nos últimos cinco anos na França metropolitana e nos departamentos e territórios ultramarinos franceses, com exceção da Alsácia, Mosela e Mayotte. Os dados que contém provêm de escrituras notariais e informações cadastrais.
                                </p>
                                <a href="#" className="block mt-4 text-primary-700 font-bold hover:underline">
                                    Ler mais
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-8">
                        {/* Organization Box */}
                        <div className="bg-white border border-neutral-200 rounded-lg p-6">
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-200">
                                {dataset.organization?.logo ? (
                                    <div className="w-16 h-16 bg-white rounded border border-neutral-200 flex items-center justify-center p-2">
                                        <img
                                            src={dataset.organization.logo}
                                            alt={dataset.organization.name}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 bg-neutral-200 rounded flex items-center justify-center text-neutral-400">
                                        <Icon name="agora-line-building" className="w-8 h-8" />
                                    </div>
                                )}
                                <div>
                                    <div className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1">
                                        Organização
                                    </div>
                                    <div className="font-bold text-neutral-900 text-lg leading-tight">
                                        {dataset.organization?.name || 'Organização Desconhecida'}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 text-sm">
                                <div>
                                    <div className="font-bold text-neutral-900 mb-1">Relatório Anual</div>
                                    <div className="text-neutral-600">Disponível para consulta pública</div>
                                </div>
                                <div>
                                    <div className="font-bold text-neutral-900 mb-1">Última atualização</div>
                                    <div className="text-neutral-600">
                                        {new Date(dataset.last_modified).toLocaleDateString('pt-PT', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold text-neutral-900 mb-1">Licença</div>
                                    <a href="#" className="text-primary-700 hover:underline font-medium">
                                        Licença Aberta / Licença Aberta versão 2.0
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Metrics Box */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white border border-neutral-200 rounded-lg p-6">
                                <div className="text-sm text-neutral-500 mb-2">Vistas</div>
                                <div className="text-2xl font-bold text-neutral-900">
                                    {dataset.metrics?.views
                                        ? (dataset.metrics.views / 1000).toLocaleString('pt-PT', { maximumFractionDigits: 1 }) + ' mil'
                                        : '0'}
                                </div>
                                <div className="flex items-center gap-1 mt-2">
                                    <span className="text-xs text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                        +11.2 mil
                                    </span>
                                </div>
                                <div className="text-xs text-neutral-400 mt-1">desde julho de 2022</div>
                            </div>
                            <div className="bg-white border border-neutral-200 rounded-lg p-6">
                                <div className="text-sm text-neutral-500 mb-2">Downloads</div>
                                <div className="text-2xl font-bold text-neutral-900">
                                    {dataset.metrics?.downloads
                                        ? (dataset.metrics.downloads / 1000).toLocaleString('pt-PT', { maximumFractionDigits: 1 }) + ' mil'
                                        : '0'}
                                </div>
                                <div className="flex items-center gap-1 mt-2">
                                    <span className="text-xs text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                        +37.2 mil
                                    </span>
                                </div>
                                <div className="text-xs text-neutral-400 mt-1">desde julho de 2022</div>
                            </div>
                        </div>

                        {/* Quality Box */}
                        <div className="bg-white border border-neutral-200 rounded-lg p-6">
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="font-bold text-neutral-900">Qualidade dos metados</h3>
                            </div>
                            <div className="w-full bg-neutral-100 rounded-full h-2 mb-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                            <div className="text-xs text-neutral-500">100% Excelente</div>
                        </div>
                    </div>
                </div>

                {/* Blue Banner / Callout replaced with CardExpandable */}
                <CardExpandable
                    variant="primary-100"
                    leadingIcon="agora-line-information"
                    hasIcon={true}
                    cardTitle="Está à procura do preço de venda de um imóvel ou terreno?"
                    cardSubtitle={
                        <div className="flex flex-col gap-4 mt-4">
                            <p className="text-neutral-600">
                                O aplicativo "Dados de Valorização de Terrenos (DVF)" permite acessar informações claras sobre imóveis vendidos a partir do banco de dados da Direção Geral de Finanças Públicas.
                            </p>
                            <a href="#" className="text-primary-700 font-bold hover:underline inline-flex items-center gap-2">
                                Consulte o aplicativo "Dados de Valor de Terreno (DVF)"
                                <Icon name="agora-line-external-link" className="w-4 h-4" />
                            </a>
                        </div>
                    }
                    accordionHeadingTitle="Mais informações"
                    className="mb-16"
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
