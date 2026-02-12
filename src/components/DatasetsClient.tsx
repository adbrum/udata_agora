'use client';

import React from 'react';
import Link from 'next/link';
import { Button, InputSearchBar, Icon, CardGeneral, InputSelect, DropdownSection, DropdownOption, Pill } from '@ama-pt/agora-design-system';
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
                <div className="text-primary-100 text-sm mb-4">
                  <Link href="/" className="opacity-70 hover:opacity-100 transition-opacity underline">Bem-vindo</Link>
                  <span className="mx-2">/</span>
                  <span className="font-semibold">Conjunto de dados</span>
                </div>

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
                    <div className="agora-input-search-bar">
                      <div className="input-label-wrapper flex items-end mb-16 justify-between">

                      </div>
                      <div className="input-search-bar-container">
                        <input
                          placeholder="Pesquisar datasets, organizações, temas..."
                          id="portal-search"
                          className="grow outline-none"
                          type="text"
                        />
                        <div className="actions-container flex flex-row gap-16">
                          <button
                            type="button"
                            aria-label="Pesquisar por voz"
                            className="flex items-center justify-center content-center agora-btn agora-btn-link-primary microphone-icon"
                          >
                            <span className="children-wrapper">
                              <div className="icon-wrapper leading">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                  className="icon icon-m fill-(--color-primary-600) block!"
                                  role="img"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12 0C10.9391 0 9.92172 0.421427 9.17157 1.17157C8.42143 1.92172 8 2.93913 8 4V12C8 13.0609 8.42143 14.0783 9.17157 14.8284C9.92172 15.5786 10.9391 16 12 16C13.0609 16 14.0783 15.5786 14.8284 14.8284C15.5786 14.0783 16 13.0609 16 12V4C16 2.93913 15.5786 1.92172 14.8284 1.17157C14.0783 0.421427 13.0609 0 12 0ZM10.5858 2.58579C10.9609 2.21071 11.4696 2 12 2C12.5304 2 13.0391 2.21071 13.4142 2.58579C13.7893 2.96086 14 3.46957 14 4V12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12V4C10 3.46957 10.2107 2.96086 10.5858 2.58579Z"
                                  ></path>
                                  <path d="M6 10C6 9.44771 5.55228 9 5 9C4.44772 9 4 9.44771 4 10V12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.60623 18.9199 9.2482 19.717 11.0019 19.9375C11.0006 19.9582 11 19.979 11 20V22H8C7.44772 22 7 22.4477 7 23C7 23.5523 7.44772 24 8 24H16C16.5523 24 17 23.5523 17 23C17 22.4477 16.5523 22 16 22H13V20C13 19.979 12.9993 19.9582 12.9981 19.9375C14.7518 19.717 16.3938 18.9199 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12V10C20 9.44771 19.5523 9 19 9C18.4477 9 18 9.44771 18 10V12C18 13.5913 17.3679 15.1174 16.2426 16.2426C15.1174 17.3679 13.5913 18 12 18C10.4087 18 8.88258 17.3679 7.75736 16.2426C6.63214 15.1174 6 13.5913 6 12V10Z"></path>
                                </svg>
                              </div>
                            </span>
                          </button>
                          <button
                            aria-label="Pesquisar"
                            disabled
                            className="flex items-center justify-center content-center agora-btn agora-btn-solid-primary agora-btn-with-icon is-icon-only magnifier-icon"
                          >
                            <div className="icon-wrapper leading">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon icon-m fill-(--color-primary-600) leading-icon-default block!"
                                aria-hidden="true"
                                role="img"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M16.6177 18.0319C15.078 19.2635 13.125 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11C20 13.125 19.2635 15.078 18.0319 16.6177L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0977 20.6834 22.0977 20.2929 21.7071L16.6177 18.0319ZM4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11C18 12.886 17.2541 14.5978 16.0413 15.8565C16.0071 15.8828 15.9742 15.9116 15.9429 15.9429C15.9116 15.9742 15.8827 16.0071 15.8564 16.0413C14.5977 17.2542 12.886 18 11 18C7.13401 18 4 14.866 4 11Z"
                                ></path>
                              </svg>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-64">
                      <Button
                        variant="primary"
                        hasIcon={true}
                        trailingIcon="agora-line-arrow-right-circle"
                        trailingIconHover="agora-solid-arrow-right-circle"
                        className="!bg-[#7BB2FF] !text-[#002D72] px-24 py-16 rounded-8 h-auto [&_svg]:!fill-black"
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
                      <DropdownSection>
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
                                <span className="text-xs text-neutral-500">
                                  Atualizado há{' '}
                                  {formatDistanceToNow(new Date(dataset.last_modified), {
                                    locale: pt,
                                  })}
                                </span>

                                <p className="text-neutral-600 text-sm line-clamp-2 leading-relaxed">
                                  {dataset.description}
                                </p>

                                <Pill appearance="solid" variant="warning" className="w-fit h-fit inline-flex items-center">
                                  Metadados: 35%
                                </Pill>

                                <div className="flex items-center gap-16 text-sm text-neutral-600 mt-8">
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


        </div>

      </main >
    </div >
  );


}
