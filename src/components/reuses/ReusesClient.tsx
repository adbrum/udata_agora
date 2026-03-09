'use client';

import React from 'react';
import { CardArticle, InputSearchBar } from '@ama-pt/agora-design-system';
import { Pagination } from '@/components/Pagination';
import { APIResponse, Reuse } from '@/types/api';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

import PageBanner from '@/components/PageBanner';

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
    <div className="min-h-screen flex flex-col font-sans text-neutral-900 bg-neutral-50 filters reuse">
      <main className="flex-grow bg-primary-50">
        <PageBanner
          title="Reutilizações"
          backgroundImageUrl="/Banner/hero-bg.png"
          backgroundPosition="center right"
          breadcrumbItems={[
            { label: 'Home', url: '/' },
            { label: 'Reutilizações', url: '/pages/reuses' }
          ]}
        >
          <InputSearchBar
            label="O que procura no Portal?"
            placeholder="Pesquisar datasets, organizações, temas..."
            id="reuses-search"
            hasVoiceActionButton={true}
            voiceActionAltText="Pesquisar por voz"
            searchActionAltText="Pesquisar"
            darkMode={true}
          />
          <div className="mt-8 text-s-regular text-neutral-200">
            Exemplos: &quot;educação&quot;, &quot;saúde pública&quot;, &quot;ambiente&quot;
          </div>
          <div className="mt-[32px] text-white">
            <span>Conteúdo atualizados a 23.2.2026</span>
          </div>
          <div className="absolute w-full mb-64 bg-white text-neutral-900 shadow-lg dropdown"></div>
        </PageBanner>

        {/* Main Content - Grid of Reuses */}
        <div className="container mx-auto md:gap-32 xl:gap-64 bg-white">
          <div className="py-64">
            <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-32">
              {reuses.map((reuse) => (
                <CardArticle
                  key={reuse.id}
                  image={{
                    src: reuse.image_thumbnail || reuse.image || '/laptop.png',
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
        </div>
      </main>
    </div>
  );
}
