'use client';

import React from 'react';
import { Breadcrumb, CardArticle, Button, InputSearchBar } from '@ama-pt/agora-design-system';
import { Pagination } from '@/components/Pagination';
import { APIResponse, Reuse } from '@/types/api';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface ReusesClientProps {
    initialData: APIResponse<Reuse>;
    currentPage: number;
}

export default function ReusesClient({
    initialData,
    currentPage,
}: ReusesClientProps) {
    const { data: reuses, total, page_size } = initialData;

    return (
        <div className="min-h-screen flex flex-col font-sans text-neutral-900 bg-neutral-50">
            <main className="flex-grow bg-white">
                {/* Hero Section */}
                <div className="agora-card-highlight-newsletter datasets-background bg-primary-900">
                    <div className="card-container relative z-10 pt-8 pb-20">
                        {/* Top Content: Breadcrumb, Title, Subtitle */}
                        <div className="card-content w-full">
                            <div className="container mx-auto px-4">
                                <Breadcrumb
                                    items={[
                                        { label: 'Bem-vindo', url: '/' },
                                        { label: 'Reutilizações', url: '/pages/reuses' }
                                    ]}
                                    darkMode={true}
                                    className="mb-4"
                                />

                                <div className="title">
                                    <h1 className="xl:text-3xl-bold md:text-3xl-bold xs:text-2xl-bold text-white">Reutilizações</h1>
                                </div>

                                <div className="subtitle">
                                    <p className="text-primary-100 mb-8 max-w-3xl">
                                        Descubra como os dados abertos estão a ser utilizados para criar valor.
                                        Existem {total.toLocaleString('pt-PT')} reutilizações publicadas.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Content: Search Bar and Publicar Button */}
                        <div className="input-container">
                            <div className="email-bar">
                                <div className="container mx-auto grid xs:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 pb-64">
                                    <div className="relative text-white">
                                        <InputSearchBar
                                            label="Pesquisar reutilizações"
                                            hideLabel={true}
                                            placeholder="Exemplo: Eleição presidencial de 2022"
                                            id="reuses-search"
                                            hasVoiceActionButton={true}
                                            voiceActionAltText="Pesquisar por voz"
                                            searchActionAltText="Pesquisar"
                                            darkMode={true}
                                        />
                                        <div className="mt-64">
                                            <Button
                                                variant="primary"
                                                hasIcon={true}
                                                trailingIcon="agora-line-arrow-right-circle"
                                                trailingIconHover="agora-solid-arrow-right-circle"
                                                className="!bg-[#7BB2FF] !text-[#002D72] px-24 py-16 rounded-8 h-auto [&_svg]:!fill-black"
                                            >
                                                <span className="text-lg font-medium">
                                                    Publicar <span className="font-bold">reutilização</span>
                                                </span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content - Grid of Reuses */}
                <div className="container mx-auto px-4 py-64">
                    <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-32">
                        {reuses.map((reuse) => (
                            <CardArticle
                                key={reuse.id}
                                image={{
                                    src: reuse.image_thumbnail || reuse.image || '/images/placeholders/reuse.png',
                                    alt: reuse.title,
                                }}
                                subtitle={`Publicado a ${format(new Date(reuse.created_at), 'dd MM yyyy', { locale: pt })}`}
                                title={reuse.title}
                                mainAnchor={{
                                    href: `/pages/reuses/${reuse.slug}`,
                                    target: '_self',
                                    title: 'Ver mais',
                                    hasIcon: true,
                                    iconOnly: true,
                                    leadingIcon: 'agora-line-arrow-right-circle',
                                    leadingIconHover: 'agora-solid-arrow-right-circle',
                                    variant: 'primary',
                                }}
                                blockedLink={true}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-64 flex justify-center pb-12">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={total}
                            pageSize={page_size}
                            baseUrl="/pages/reuses"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
