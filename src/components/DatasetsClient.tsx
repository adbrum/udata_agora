'use client';

import React from 'react';
import Link from 'next/link';
import { Button, InputSearchBar, Icon, CardGeneral, InputSelect, DropdownSection, DropdownOption, Pill, Breadcrumb } from '@ama-pt/agora-design-system';
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
    <div className="min-h-screen flex flex-col font-sans text-neutral-900 bg-neutral-50 filters">
      <main className="flex-grow bg-white">
        {/* Combined Hero Section with Agora Structure */}
        {/* Combined Hero Section with Agora Structure */}
        <div className="agora-card-highlight-newsletter datasets-background bg-primary-900">
          <div className="card-container relative z-10 pt-8 pb-20">
            <div className="card-content w-full">
              <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <Breadcrumb
                  items={[
                    { label: 'Bem-vindo', url: '/' },
                    { label: 'Conjunto de dados', url: '/pages/datasets' }
                  ]}
                  darkMode={true}
                  className="mb-4"
                />

                <div className="title">
                  <h1 className="xl:text-3xl-bold md:text-3xl-bold xs:text-2xl-bold">Conjunto de dados</h1>
                </div>

                <div className="subtitle">
                  <p className="text-primary-100 mb-8 max-w-3xl">
                    Pesquise através de {total.toLocaleString('pt-PT')} conjuntos
                    de dados em dados.gov
                  </p>
                </div>
              </div>
            </div>

            <div className="input-container">
              <div className="email-bar">
                <div className="container mx-auto grid xs:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 pb-64">
                  <div className="relative text-white">
                    <InputSearchBar
                      label="Pesquisar conjuntos de dados"
                      hideLabel={true}
                      placeholder="Pesquisar datasets, organizações, temas..."
                      id="datasets-search"
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
                    <div className="absolute w-full mb-64 bg-white text-neutral-900 shadow-lg dropdown"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {/* Main Content - Full Width Layout */}
        {/* Main Content - Full Width Layout Wrapper */}
        {/* Main Content */}
        <div className="container mx-auto md:gap-32 xl:gap-64 bg-white">
          <div className="grid md:grid-cols-3 xl:grid-cols-12 gap-32">
            {/* Sidebar */}
            <div className="xl:col-span-4 xl:block bg-primary-100 md:pt-64 p-32">
              <DatasetsFilters />
            </div>


            {/* Results Area */}
            <div className="xl:col-span-8 md:pt-64 ">
              <div>
                <div className="grid md:grid-cols-2 xl:grid-cols-12 gap-32 mb-16 items-center">
                  <span className="text-neutral-900 font-medium text-base xl:col-span-6 ">
                    {total.toLocaleString('pt-PT')} resultados
                  </span>
                  <div className="w-full md:w-auto xl:col-span-6 ">
                    <InputSelect
                      label="Ordenar por :"
                      id="sort-datasets"
                      defaultValue="reutilizacoes"
                    >
                      <DropdownSection name="order">
                        <DropdownOption value="reutilizacoes">Número de reutilizações</DropdownOption>
                        <DropdownOption value="recentes">Mais recentes</DropdownOption>
                        <DropdownOption value="visualizados">Mais visualizados</DropdownOption>
                      </DropdownSection>
                    </InputSelect>
                  </div>
                </div>

                <div className="flex flex-col">
                  {datasets.map((dataset, index) => (
                    <div
                      key={dataset.id}
                      className={`border-t md:pt-24 border-[#E1E4EA]  ${index === datasets.length - 1
                        ? 'border-b'
                        : ''
                        }`}
                    >
                      <div className="dataset-card-modern">
                        <CardGeneral
                          isCardHorizontal={true}
                          variant="white"
                          image={{
                            src: dataset.organization?.logo || '/images/placeholders/organization.png',
                            alt: dataset.organization?.name || 'Organização sem logo',
                          }}
                          subtitleText={dataset.organization?.name || 'Organização Desconhecida'}
                          titleText={
                            (
                              <Link href={`/pages/datasets/${dataset.slug}`} className="hover:underline text-primary-900 font-bold text-lg">
                                {dataset.title}
                              </Link>
                            ) as unknown as string
                          }
                          descriptionText={
                            (
                              <div className="flex flex-col gap-8">
                                <span className="text-xs ">
                                  Atualizado há{' '}
                                  {formatDistanceToNow(new Date(dataset.last_modified), {
                                    locale: pt,
                                  })}
                                </span>

                                <p className=" text-sm line-clamp-2 leading-relaxed">
                                  {dataset.description}
                                </p>

                                <Pill appearance="solid" variant="warning" className="w-fit h-fit inline-flex items-center">
                                  Metadados: 35%
                                </Pill>

                                <div className="flex items-center gap-16 text-sm  mt-8">
                                  <div className="flex items-center gap-8" title="Visualizações">
                                    <Icon name="agora-line-eye" className="w-20 h-20" aria-hidden="true" />
                                    <span className="font-medium">
                                      {dataset.metrics?.views
                                        ? dataset.metrics.views >= 1000000
                                          ? (dataset.metrics.views / 1000000).toFixed(1).replace('.', ',') + ' M'
                                          : dataset.metrics.views >= 1000
                                            ? (dataset.metrics.views / 1000).toFixed(0) + ' mil'
                                            : dataset.metrics.views
                                        : '0'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-8" title="Downloads">
                                    <Icon name="agora-line-download" className="w-20 h-20" aria-hidden="true" />
                                    <span className="font-medium">
                                      {dataset.metrics?.downloads
                                        ? dataset.metrics.downloads >= 1000
                                          ? (dataset.metrics.downloads / 1000).toFixed(0) + ' mil'
                                          : dataset.metrics.downloads
                                        : '0'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-8" title="Reutilizações">
                                    <Icon name="agora-line-chart-bar" className="w-20 h-20" aria-hidden="true" />
                                    <span className="font-medium">{dataset.metrics?.reuses || 0}</span>
                                  </div>
                                  <div className="flex items-center gap-8" title="Seguidores">
                                    <Icon name="agora-line-star" className="w-20 h-20" aria-hidden="true" />
                                    <span className="font-medium">{dataset.metrics?.followers || 0}</span>
                                  </div>
                                </div>
                              </div>
                            ) as unknown as string
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-64 flex justify-center pb-64">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={total}
                    pageSize={page_size}
                  />
                </div>
              </div>
            </div>
          </div>


        </div>

      </main >
    </div >
  );


}
