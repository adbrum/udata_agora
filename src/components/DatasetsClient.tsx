'use client';

import React from 'react';
import Link from 'next/link';
import { Button, InputSearchBar, Icon } from '@ama-pt/agora-design-system';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Pagination } from '@/components/Pagination';
import { DatasetsFilters } from '@/components/DatasetsFilters';
import { APIResponse, Dataset } from '@/types/api';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';

interface DatasetsClientProps {
  initialData: APIResponse<Dataset>;
  currentPage: number;
}

export default function DatasetsClient({
  initialData,
  currentPage,
}: DatasetsClientProps) {
  const { data: datasets, total, page_size } = initialData;

  return (
    <div className="min-h-screen flex flex-col font-sans text-neutral-900 bg-neutral-50">
      <Header />

      <main className="flex-grow">
        {/* Breadcrumb Section */}
        <div className="datasets-background bg-primary-900 pt-8 pb-4">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-primary-100 text-sm mb-4">
              <Link href="/" className="opacity-70 hover:opacity-100 transition-opacity underline">Bem-vindo</Link>
              <span className="mx-2">/</span>
              <span className="font-semibold">Conjunto de dados</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="datasets-background bg-primary-900 text-white pb-20 pt-4">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-4">Conjunto de dados</h1>
              <p className="text-primary-100 mb-8">
                Pesquise através de {total.toLocaleString('pt-PT')} conjuntos
                de dados em dados.gov
              </p>

              <div className="max-w-2xl">
                <InputSearchBar
                  id="dataset-search"
                  label="Pesquisar"
                  hideLabel={true}
                  placeholder="Exemplo: Eleição presidencial de 2022"
                  searchActionAltText="Pesquisar"
                />
              </div>

              <div className="mt-8">
                <Button
                  variant="primary"
                  className="!bg-[#5F93FC] !text-primary-900 hover:!bg-[#4a80e8] border-none"
                >
                  <span className="flex items-center">
                    <span className="font-normal">Publicar</span>
                    <span className="font-bold mx-1">dados.gov</span>
                    <Icon name="agora-line-arrow-right-circle" aria-hidden="true" className="w-6 h-6 ml-1" />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        {/* Main Content - Full Width Layout */}
        {/* Main Content - Full Width Layout Wrapper */}
        <div className="flex flex-col md:flex-row w-full bg-white min-h-[500px]">
          {/* Sidebar Wrapper: 
               - w-full on mobile
               - on desktop: flex-basis calculated to cover from left edge to content split 
                 Logic: Container is centered (mx-auto). Left gutter is (100vw - 1280px)/2.
                 Sidebar content width is approx 320px. 
                 Total sidebar background width = Left Gutter + 320px.
           */}
          <aside className="bg-primary-50 border-r border-neutral-200 flex-shrink-0 w-full md:w-[calc((100vw-1280px)/2+300px)] xl:w-[calc((100vw-1280px)/2+320px)] hidden md:block">
            <div className="flex justify-end h-full">
              {/* Content Container: Fixed width aligned to the right of this sidebar area */}
              <div className="w-[300px] xl:w-[320px] p-6 pt-12">
                <DatasetsFilters />
              </div>
            </div>
          </aside>

          {/* Mobile Sidebar (simplified) */}
          <aside className="w-full bg-primary-50 p-6 md:hidden">
            <DatasetsFilters />
          </aside>

          {/* Results Wrapper */}
          <div className="flex-grow bg-white">
            {/* Content Container: aligned to the left of this area (which starts after sidebar)
                  Since the flex container splits the screen, this div starts exactly where content should start.
                  We just need to limit its width to the remaining part of the container (1280 - 320 = 960px).
              */}
            <div className="p-6 md:p-8 md:pt-12 max-w-5xl">
              {/* ... Content ... */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <span className="text-neutral-600 font-medium">
                  {total.toLocaleString('pt-PT')} resultados
                  {/* Debug Info */}
                  {/* <span className="text-xs text-gray-400 ml-2">(Org: {new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('organization')})</span> */}
                </span>
                <div className="w-full md:w-auto flex items-center gap-3">
                  <span className="text-sm text-neutral-500 whitespace-nowrap">
                    Ordenar por:
                  </span>
                  <div className="w-64 border border-neutral-300 rounded px-4 py-2 bg-white text-sm flex justify-between items-center cursor-pointer hover:border-primary-500 transition-colors">
                    <span>Número de visualizações</span>
                    <Icon name="agora-line-chevron-down" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {datasets.map((dataset) => (
                  <div
                    key={dataset.id}
                    className="bg-white p-6 rounded-8 shadow-center-low border border-neutral-200 flex flex-col md:flex-row gap-6 hover:shadow-center-medium transition-shadow items-start"
                  >
                    <div className="w-full md:w-48 h-24 flex-shrink-0 border border-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-400 uppercase overflow-hidden rounded bg-neutral-50">
                      {dataset.organization?.logo ? (
                        <img
                          src={dataset.organization.logo}
                          alt={dataset.organization.name}
                          className="max-w-full max-h-full object-contain p-2"
                        />
                      ) : (
                        <span>LOGOIPSUM</span>
                      )}
                    </div>

                    <div className="flex-grow w-full">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-1 md:mb-0">
                          {dataset.organization?.name ||
                            'Organização Desconhecida'}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-primary-900 mb-2">
                        <Link href={`/datasets/${dataset.slug}`} className="hover:text-primary-600 hover:underline">
                          {dataset.title}
                        </Link>
                      </h3>

                      <div className="text-xs text-neutral-500 mb-3 flex items-center gap-2">
                        <span>
                          Actualizado há{' '}
                          {formatDistanceToNow(
                            new Date(dataset.last_modified),
                            { locale: pt },
                          )}
                        </span>
                      </div>

                      <p className="text-neutral-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {dataset.description}
                      </p>

                      <div className="mb-5 flex gap-2 flex-wrap">
                        <span className="bg-warning-100 text-warning-800 text-xs px-3 py-1 rounded-full font-bold">
                          Metadados 35%
                        </span>
                        {dataset.tags &&
                          dataset.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="border border-neutral-200 text-neutral-600 text-xs px-3 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>

                      <div className="pt-4 border-t border-neutral-100 flex items-center gap-8 text-sm text-neutral-500">
                        <div
                          className="flex items-center gap-2"
                          title="Visualizações"
                        >
                          <Icon
                            name="agora-line-visibility"
                            className="w-5 h-5"
                            aria-hidden="true"
                          />
                          <span className="font-semibold">
                            {dataset.metrics?.views || 0} M
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-2"
                          title="Downloads"
                        >
                          <Icon
                            name="agora-line-download"
                            className="w-5 h-5"
                            aria-hidden="true"
                          />
                          <span className="font-semibold">
                            {dataset.metrics?.downloads || 0} mil
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-2"
                          title="Reutilizações"
                        >
                          <Icon
                            name="agora-line-share"
                            className="w-4 h-4"
                            aria-hidden="true"
                          />
                          <span className="font-semibold">
                            {dataset.metrics?.reuses || 0}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-2"
                          title="Seguidores"
                        >
                          <Icon
                            name="agora-line-star"
                            className="w-5 h-5"
                            aria-hidden="true"
                          />
                          <span className="font-semibold">
                            {dataset.metrics?.followers || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex justify-center pb-12">
                <Pagination
                  currentPage={currentPage}
                  totalItems={total}
                  pageSize={page_size}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
