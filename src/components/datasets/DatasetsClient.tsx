
'use client';

import React from 'react';
import Link from 'next/link';
import { Button, InputSearchBar, Icon, CardGeneral, CardLinks, InputSelect, DropdownSection, DropdownOption, Pill, CardNoResults } from '@ama-pt/agora-design-system';
import { Pagination } from '@/components/Pagination';
import { DatasetsFilters } from '@/components/datasets/DatasetsFilters';
import { APIResponse, Dataset } from '@/types/api';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';

import PageBanner from '@/components/PageBanner';

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
    <div className="min-h-screen flex flex-col font-sans text-neutral-900 bg-neutral-50 filters dataset">
      <main className="flex-grow bg-white">
        <PageBanner
          title="Conjunto de dados"
          backgroundImageUrl="/Banner/hero-bg.png"
          backgroundPosition="center right"
          containerClassName="dataset"
          breadcrumbItems={[
            { label: 'Home', url: '/' },
            { label: 'Conjunto de dados', url: '/pages/datasets' }
          ]}
          subtitle={
            <p className="text-primary-100 max-w-3xl">
              Pesquise através de {total.toLocaleString('pt-PT')} conjuntos
              de dados em dados.gov
            </p>
          }
        >
          <InputSearchBar
            label="O que procura no Portal?"
            placeholder="Pesquisar datasets, organizações, temas..."
            id="datasets-search"
            hasVoiceActionButton={true}
            voiceActionAltText="Pesquisar por voz"
            searchActionAltText="Pesquisar"
            darkMode={true}
          />
          <div className="mt-8 text-s-regular text-neutral-200">
            Exemplos: &quot;educação&quot;, &quot;saúde pública&quot;, &quot;ambiente&quot;
          </div>
          <div className="mt-[32px]">
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
        </PageBanner>

        {/* Main Content */}
        {/* Main Content - Full Width Layout */}
        {/* Main Content - Full Width Layout Wrapper */}
        {/* Main Content */}
        <div className="container mx-auto md:gap-32 xl:gap-64 bg-white">
          <div className="grid md:grid-cols-3 xl:grid-cols-12 gap-32">
            {/* Sidebar */}
            <div className="xl:col-span-4 xl:block bg-primary-100 p-32 pl-0">
              <DatasetsFilters />
            </div>


            {/* Results Area */}
            <div className="xl:col-span-8 mt-[36px]">
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
                      className="selectDataset"
                    >
                      <DropdownSection name="order">
                        <DropdownOption value="reutilizacoes">Número de reutilizações</DropdownOption>
                        <DropdownOption value="recentes">Mais recentes</DropdownOption>
                        <DropdownOption value="visualizados">Mais visualizados</DropdownOption>
                      </DropdownSection>
                    </InputSelect>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-32">
                  {datasets.length > 0 ? (
                    datasets.map((dataset) => (
                      <div key={dataset.id} className="h-full">
                        <CardLinks
                          variant="white"
                          image={{
                            src: dataset.organization?.logo || '/images/placeholders/organization.png',
                            alt: dataset.organization?.name || 'Organização sem logo',
                          }}
                          category={dataset.organization?.name}
                          title={dataset.title}
                          description={
                            <div className="flex flex-col gap-12">
                              <p className="text-sm line-clamp-3 leading-relaxed text-neutral-600">
                                {dataset.description}
                              </p>
                              <div className="flex flex-wrap gap-8 items-center">
                                <Pill appearance="solid" variant="warning" className="w-fit h-fit inline-flex items-center">
                                  Metadados: 35%
                                </Pill>
                              </div>
                              <div className="flex items-center flex-wrap gap-16 text-xs mt-8 text-neutral-500">
                                <div className="flex items-center gap-4" title="Visualizações">
                                  <Icon name="agora-line-eye" className="w-16 h-16" aria-hidden="true" />
                                  <span>
                                    {dataset.metrics?.views
                                      ? dataset.metrics.views >= 1000000
                                        ? (dataset.metrics.views / 1000000).toFixed(1).replace('.', ',') + ' M'
                                        : dataset.metrics.views >= 1000
                                          ? (dataset.metrics.views / 1000).toFixed(0) + ' mil'
                                          : dataset.metrics.views
                                      : '0'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4" title="Downloads">
                                  <Icon name="agora-line-download" className="w-16 h-16" aria-hidden="true" />
                                  <span>
                                    {dataset.metrics?.downloads
                                      ? dataset.metrics.downloads >= 1000
                                        ? (dataset.metrics.downloads / 1000).toFixed(0) + ' mil'
                                        : dataset.metrics.downloads
                                      : '0'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4" title="Reutilizações">
                                  <Icon name="agora-line-chart-bar" className="w-16 h-16" aria-hidden="true" />
                                  <span>{dataset.metrics?.reuses || 0}</span>
                                </div>
                              </div>
                            </div>
                          }
                          date={`Atualizado há ${formatDistanceToNow(new Date(dataset.last_modified), { locale: pt })}`}
                          mainLink={
                            <Link href={`/pages/datasets/${dataset.slug}`}>
                              {dataset.title}
                            </Link>
                          }
                          blockedLink={true}
                          topics={dataset.tags?.slice(0, 3).map(tag => (
                            <Pill key={tag} appearance="outline" variant="primary" className="text-[10px] py-2 px-6 h-auto">
                              {tag}
                            </Pill>
                          ))}
                        />
                      </div>
                    ))
                  ) : (
                    <div>
                      <CardNoResults
                        icon={<Icon name="agora-line-search" className="w-12 h-12 text-primary-500" />}
                        title="Não encontrou o que procurava?"
                        subtitle={<span className="font-bold">Tente redefinir os filtros para ampliar sua busca.</span>}
                        description="Você também pode visualizar as solicitações atuais e enviar as suas próprias em nosso fórum dedicado à pesquisa de dados e ao acesso aberto."
                        position="center"
                        hasAnchor={true}
                        valueAnchor="Redefir filtros"
                        anchorHref="/pages/datasets"
                        anchorTrailingIcon="agora-line-arrow-right-circle"
                        anchorTrailingIconHover="agora-solid-arrow-right-circle"
                      />
                    </div>
                  )}
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
