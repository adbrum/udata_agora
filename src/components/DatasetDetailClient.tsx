'use client';

import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Button, Icon, Tag } from '@ama-pt/agora-design-system';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Dataset } from '@/types/api';

interface DatasetDetailClientProps {
    dataset: Dataset;
}

export default function DatasetDetailClient({ dataset }: DatasetDetailClientProps) {
    return (
        <div className="min-h-screen flex flex-col font-sans text-neutral-900 bg-neutral-50">
            <Header />

            <main className="flex-grow">
                {/* Breadcrumb Section */}
                <div className="bg-primary-900 pt-8 pb-4">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-primary-100 text-sm mb-4">
                            <Link href="/" className="opacity-70 hover:opacity-100 transition-opacity underline">
                                Bem-vindo
                            </Link>
                            <span className="mx-2">/</span>
                            <Link href="/datasets" className="opacity-70 hover:opacity-100 transition-opacity underline">
                                Conjuntos de dados
                            </Link>
                            <span className="mx-2">/</span>
                            <span className="font-semibold truncate">{dataset.title}</span>
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <section className="bg-white border-b border-neutral-200 pb-12 pt-8">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Logo / Image */}
                            <div className="w-full md:w-auto flex-shrink-0">
                                <div className="w-32 h-32 bg-neutral-100 rounded-lg flex items-center justify-center p-4 border border-neutral-200">
                                    {dataset.organization?.logo ? (
                                        <img
                                            src={dataset.organization.logo}
                                            alt={dataset.organization.name}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    ) : (
                                        <Icon name="agora-line-building" className="w-12 h-12 text-neutral-400" />
                                    )}
                                </div>
                            </div>

                            {/* Title & Info */}
                            <div className="flex-grow">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {dataset.organization && (
                                        <span className="inline-flex items-center px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded font-medium">
                                            {dataset.organization.name}
                                        </span>
                                    )}
                                    <span className="inline-flex items-center px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded font-medium">
                                        Atualizado {formatDistanceToNow(new Date(dataset.last_modified), { addSuffix: true, locale: pt })}
                                    </span>
                                </div>

                                <h1 className="text-3xl font-bold text-neutral-900 mb-4">{dataset.title}</h1>

                                <p className="text-neutral-600 text-lg leading-relaxed max-w-4xl">
                                    {dataset.description && dataset.description.length > 300
                                        ? dataset.description.substring(0, 300) + '...'
                                        : dataset.description}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex-shrink-0 flex flex-col gap-3">
                                <Button variant="primary">
                                    Seguir
                                </Button>
                                <Button variant="neutral" appearance="outline">
                                    Partilhar
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Main Column */}
                            <div className="lg:col-span-2 space-y-12">
                                {/* Resources */}
                                <div>
                                    <h2 className="text-2xl font-bold mb-6">Recursos</h2>
                                    <div className="space-y-4">
                                        {dataset.resources.map((resource) => (
                                            <div key={resource.id} className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow flex items-start justify-between gap-4">
                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-300 rounded text-xs font-mono font-bold uppercase text-neutral-600">
                                                            {resource.format || 'Ficheiro'}
                                                        </span>
                                                        <h3 className="font-bold text-lg text-primary-700 hover:underline cursor-pointer">
                                                            {resource.title}
                                                        </h3>
                                                    </div>
                                                    <div className="text-sm text-neutral-500">
                                                        Publicado {formatDistanceToNow(new Date(resource.created_at), { addSuffix: true, locale: pt })}
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="primary" className="!p-2">
                                                            <Icon name="agora-line-download" className="w-5 h-5" aria-label="Download" />
                                                        </Button>
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Full Description */}
                                <div>
                                    <h2 className="text-2xl font-bold mb-6">Descrição</h2>
                                    <div className="prose max-w-none text-neutral-700">
                                        <p>{dataset.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Column */}
                            <div className="space-y-8">
                                {/* Metrics */}
                                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                                    <h3 className="font-bold text-lg mb-4 border-b pb-2">Métricas</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-neutral-600 flex items-center gap-2">
                                                <Icon name="agora-line-eye" className="w-5 h-5" /> Visualizações
                                            </span>
                                            <span className="font-bold">{dataset.metrics?.views || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-neutral-600 flex items-center gap-2">
                                                <Icon name="agora-line-download" className="w-5 h-5" /> Downloads
                                            </span>
                                            <span className="font-bold">{dataset.metrics?.downloads || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-neutral-600 flex items-center gap-2">
                                                <Icon name="agora-line-user" className="w-5 h-5" /> Seguidores
                                            </span>
                                            <span className="font-bold">{dataset.metrics?.followers || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tags */}
                                {dataset.tags && dataset.tags.length > 0 && (
                                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
                                        <h3 className="font-bold text-lg mb-4 border-b pb-2">Palavras-chave</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {dataset.tags.map((tag, i) => (
                                                <Tag key={i}>{tag}</Tag>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Additional Info */}
                                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                                    <h3 className="font-bold text-lg mb-4 border-b pb-2">Informação Adicional</h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <span className="block text-neutral-500 text-xs uppercase">Criado em</span>
                                            <span className="font-medium">{new Date(dataset.created_at).toLocaleDateString('pt-PT')}</span>
                                        </div>
                                        <div>
                                            <span className="block text-neutral-500 text-xs uppercase">Última atualização</span>
                                            <span className="font-medium">{new Date(dataset.last_modified).toLocaleDateString('pt-PT')}</span>
                                        </div>
                                        <div>
                                            <span className="block text-neutral-500 text-xs uppercase">Identificador</span>
                                            <span className="font-mono text-xs">{dataset.id}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
