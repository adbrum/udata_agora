'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Breadcrumb,
  Button,
  Icon,
  Pill,
  Tabs,
  Tab,
  TabHeader,
  TabBody,
  CardArticle,
  CardLinks,
} from '@ama-pt/agora-design-system';
import { Reuse, Dataset } from '@/types/api';
import { fetchDataset } from '@/services/api';
import { format, formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';

interface ReuseDetailClientProps {
  reuse: Reuse;
}

export default function ReuseDetailClient({ reuse }: ReuseDetailClientProps) {
  const router = useRouter();
  const [fullDatasets, setFullDatasets] = useState<Dataset[]>([]);
  const [isLoadingDatasets, setIsLoadingDatasets] = useState(true);
  const [datasetsPage, setDatasetsPage] = useState(1);
  const datasetsPageSize = 6;

  const datasetRefs = reuse.datasets || [];

  useEffect(() => {
    if (datasetRefs.length === 0) {
      setIsLoadingDatasets(false);
      return;
    }

    async function loadDatasets() {
      try {
        const slugs = datasetRefs.map((d) =>
          d.uri.split('/').filter(Boolean).pop() || d.id
        );
        const results = await Promise.all(
          slugs.map((slug) => fetchDataset(slug).catch(() => null))
        );
        setFullDatasets(results.filter((d): d is Dataset => d !== null));
      } catch {
        setFullDatasets([]);
      } finally {
        setIsLoadingDatasets(false);
      }
    }

    loadDatasets();
  }, [datasetRefs]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: pt });
    } catch {
      return dateString;
    }
  };

  const totalDatasetsPages = Math.ceil(fullDatasets.length / datasetsPageSize);
  const paginatedDatasets = fullDatasets.slice(
    (datasetsPage - 1) * datasetsPageSize,
    datasetsPage * datasetsPageSize
  );

  const renderPagination = (
    currentPage: number,
    total: number,
    pageSize: number,
    onPageChange: (page: number) => void
  ) => {
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-16 mt-32">
        <button
          className="px-16 py-8 text-sm font-medium text-primary-600 border border-primary-300 rounded hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        >
          Anterior
        </button>
        <span className="text-sm text-neutral-700">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="px-16 py-8 text-sm font-medium text-primary-600 border border-primary-300 rounded hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Seguinte
        </button>
      </div>
    );
  };

  const renderTabBody = (content: React.ReactNode) => (
    <TabBody>
      <div className="relative">
        <div
          className="absolute inset-y-0 -mx-4 sm:-mx-8 md:-mx-16 lg:-mx-32 xl:-mx-64 bg-neutral-50 z-0"
          aria-hidden="true"
        />
        <div className="relative z-10 ">
          <div className="container mx-auto">{content}</div>
        </div>
      </div>
    </TabBody>
  );

  return (
    <div className="flex flex-col font-sans text-neutral-900 bg-white min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-white text-neutral-900 pt-24 pb-48 sm:pb-64">
        <div className="container mx-auto px-4 sm:px-16 md:px-32 lg:px-64">
          {/* Breadcrumbs & Actions */}
          <div className="mb-24">
            <div className="mb-24">
              <Breadcrumb
                darkMode={false}
                items={[
                  { label: 'Home', url: '/' },
                  { label: 'Reutilizações', url: '/pages/reuses' },
                  {
                    label: reuse.title,
                    url: `/pages/reuses/${reuse.slug || reuse.id}`,
                  },
                ]}
              />
            </div>
            <div className="flex justify-end">
              <div className="flex flex-wrap items-center gap-16">
                <Button
                  variant="primary"
                  appearance="outline"
                  darkMode={false}
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
                  trailingIconHover="agora-line-external-link"
                  onClick={() => window.open(reuse.url, '_blank')}
                >
                  Veja reutilização
                </Button>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="grid md:grid-cols-3 xl:grid-cols-12 gap-32 mt-6 mb-24">
            {/* Image Column */}
            <div className="xl:col-span-8">
              <div className=" w-full">
                <img
                  src={reuse.image || '/laptop.png'}
                  alt={reuse.title}
                  className="w-full object-cover rounded-[4px]"
                />
              </div>
            </div>

            {/* Card Column */}
            <div className="xl:col-span-4 card-article-3_2">
              <CardArticle
                className="h-full bg-[#F2F6FF]! border-none shadow-none [&_.container-body]:p-32 [&_.container-body]:flex [&_.container-body]:flex-col [&_.container-body]:h-full"
                title={reuse.title}
                subtitle={
                  <div className="flex flex-col gap-24 mb-16">
                    {reuse.organization?.logo ? (
                      <div className="w-fit h-[48px] card-article-3_2-img py-8 rounded-8 border-2 border-primary-300 flex items-center justify-center">
                        <img
                          src={reuse.organization.logo}
                          alt={reuse.organization.name}
                        />
                      </div>
                    ) : (
                      <div className="w-[160px] h-[56px] bg-white rounded-8 border border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-xs font-bold uppercase tracking-wider shadow-sm">
                        {reuse.organization?.name || 'Sem organização'}
                      </div>
                    )}
                    <div className="text-sm font-medium underline cursor-pointer">
                      {reuse.organization?.name || reuse.owner?.first_name || ''}
                    </div>
                  </div>
                }
              >
                <div className="flex flex-col gap-24 h-full">
                  <div className="flex items-center flex-wrap gap-16 text-[15px]">
                    <span className="font-semibold text-neutral-900">
                      {reuse.type || 'Aplicação'}
                    </span>
                    <div className="flex items-center gap-8">
                      <Icon
                        name="agora-line-eye"
                        className="w-20 h-20 fill-[var(--color-neutral-900)]"
                      />
                      <span className="text-neutral-900">
                        {reuse.metrics?.views
                          ? reuse.metrics.views >= 1000
                            ? (reuse.metrics.views / 1000).toFixed(0) + ' mil'
                            : reuse.metrics.views
                          : '0'}
                      </span>
                    </div>
                    <div className="flex items-center gap-8">
                      <Icon
                        name="agora-line-calendar"
                        className="w-20 h-20 fill-[var(--color-neutral-900)]"
                      />
                      <span className="text-neutral-900">{datasetRefs.length}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-24">
                    <a
                      href={reuse.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#034AD8] text-lg hover:underline inline-flex items-center gap-8"
                    >
                      Veja reutilização
                      <Icon
                        name="agora-line-external-link"
                        className="w-24 h-24 fill-[#034AD8]"
                      />
                    </a>
                  </div>
                </div>
              </CardArticle>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="bg-white sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-16 md:px-32 lg:px-64 mb-24">
          <Tabs>
            <Tab>
              <TabHeader>Descrição</TabHeader>
              {renderTabBody(
                <div className="grid md:grid-cols-3 xl:grid-cols-12 gap-32 mt-6">
                  {/* Main Content */}
                  <div className="xl:col-span-8 max-w-ch">
                    <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed">
                      <h2 className="text-l-bold text-neutral-900 mb-32">Descrição</h2>
                      <div
                        className="mb-32 text-neutral-900 [&_a]:underline [&_a]:text-primary-600"
                        dangerouslySetInnerHTML={{ __html: reuse.description }}
                      />
                    </div>
                  </div>

                  {/* Sidebar Metadata */}
                  <aside className="xl:col-span-4 xl:block md:pt-64 flex flex-col gap-16">
                    <div className="bg-white p-32 rounded-4">
                      <h3 className="text-sm font-bold tracking-wider mb-8">Tipo</h3>
                      <p className="font-medium text-neutral-900">
                        {reuse.type || 'Aplicação'}
                      </p>
                    </div>

                    {reuse.tags && reuse.tags.length > 0 && (
                      <div className="bg-white p-32 rounded-4">
                        <h3 className="text-sm font-bold tracking-wider mb-8">Tags</h3>
                        <div className="flex flex-col items-start gap-8">
                          {reuse.tags.map((tag) => (
                            <Pill
                              key={tag}
                              appearance="solid"
                              variant="primary"
                              className="bg-primary-100 text-primary-700 h-auto py-4 px-8 text-xs font-semibold"
                            >
                              {tag}
                            </Pill>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-white p-32 rounded-4">
                      <h3 className="text-sm font-bold tracking-wider mb-8">
                        Última atualização
                      </h3>
                      <p className="font-medium text-neutral-900">
                        {formatDate(reuse.last_modified)}
                      </p>
                    </div>

                    <div className="bg-white p-32 rounded-4">
                      <h3 className="text-sm font-bold tracking-wider mb-8">
                        Data de criação
                      </h3>
                      <p className="font-medium text-neutral-900">
                        {formatDate(reuse.created_at)}
                      </p>
                    </div>

                    <div className="bg-white p-32 rounded-4">
                      <h3 className="text-sm font-bold tracking-wider mb-8">Vistas</h3>
                      <div className="text-2xl font-bold text-neutral-900 mb-8">
                        {reuse.metrics?.views
                          ? reuse.metrics.views >= 1000
                            ? (reuse.metrics.views / 1000).toLocaleString('pt-PT') + ' mil'
                            : reuse.metrics.views.toLocaleString('pt-PT')
                          : '0'}
                      </div>
                    </div>
                  </aside>
                </div>
              )}
            </Tab>
            <Tab>
              <TabHeader>Discussões</TabHeader>
              {renderTabBody(
                <div className="text-neutral-500 italic">
                  Nenhuma discussão iniciada ainda.
                </div>
              )}
            </Tab>
          </Tabs>
        </div>
      </section>

      {/* Associated Datasets */}
      {datasetRefs.length > 0 && (
        <section className="bg-neutral-50 py-64">
          <div className="container mx-auto px-4 sm:px-16 md:px-32 lg:px-64">
            <div className="mb-80">
              <h2 className="text-xl font-bold text-[#000032] mb-32">
                {datasetRefs.length} conjunto{datasetRefs.length !== 1 ? 's' : ''} de dados
                associado{datasetRefs.length !== 1 ? 's' : ''}
              </h2>
              {isLoadingDatasets ? (
                <div className="text-neutral-500">A carregar conjuntos de dados...</div>
              ) : fullDatasets.length > 0 ? (
                <>
                <div className="text-sm text-neutral-500 mb-16">
                  {fullDatasets.length} conjuntos de dados
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 agora-card-links-datasets gap-16">
                  {paginatedDatasets.map((dataset) => (
                    <div key={dataset.id} className="h-full">
                      <CardLinks
                        onClick={() => router.push(`/pages/datasets/${dataset.slug}`)}
                        className="cursor-pointer text-neutral-900"
                        variant="white"
                        image={{
                          src:
                            dataset.organization?.logo ||
                            '/images/placeholders/organization.png',
                          alt:
                            dataset.organization?.name || 'Organização sem logo',
                        }}
                        category={dataset.organization?.name}
                        title={dataset.title}
                        description={
                          <div className="flex flex-col gap-12">
                            <p className="text-sm line-clamp-3 leading-relaxed text-neutral-900 mt-[8px] max-w-[592px]">
                              {dataset.description}
                            </p>
                            <div className="flex items-center flex-wrap gap-[32px] text-xs mt-[16px] text-[#034AD8]">
                              <div
                                className="flex items-center gap-8"
                                title="Visualizações"
                              >
                                <Icon name="agora-line-eye" aria-hidden="true" />
                                <span>
                                  {dataset.metrics?.views
                                    ? dataset.metrics.views >= 1000
                                      ? `${(dataset.metrics.views / 1000).toFixed(0)} mil`
                                      : dataset.metrics.views
                                    : '0'}
                                </span>
                              </div>
                              <div
                                className="flex items-center gap-8"
                                title="Downloads"
                              >
                                <Icon name="agora-line-download" aria-hidden="true" />
                                <span>
                                  {dataset.metrics?.downloads
                                    ? dataset.metrics.downloads >= 1000
                                      ? `${(dataset.metrics.downloads / 1000).toFixed(0)} mil`
                                      : dataset.metrics.downloads
                                    : '0'}
                                </span>
                              </div>
                              <div
                                className="flex items-center gap-8"
                                title="Reutilizações"
                              >
                                <Icon name="agora-line-refresh" aria-hidden="true" />
                                <span>{dataset.metrics?.reuses || 0}</span>
                              </div>
                              <div
                                className="flex items-center gap-8"
                                title="Favoritos"
                              >
                                <Icon name="agora-line-star" aria-hidden="true" />
                                <span>{dataset.metrics?.followers || 0}</span>
                              </div>
                            </div>
                          </div>
                        }
                        date={
                          <span className="font-[300]">
                            {`Atualizado há ${formatDistanceToNow(new Date(dataset.last_modified), { locale: pt })}`}
                          </span>
                        }
                        mainLink={
                          <Link href={`/pages/datasets/${dataset.slug}`}>
                            <span className="underline">{dataset.title}</span>
                          </Link>
                        }
                        blockedLink={true}
                      />
                    </div>
                  ))}
                </div>
                {renderPagination(
                  datasetsPage,
                  fullDatasets.length,
                  datasetsPageSize,
                  setDatasetsPage
                )}
                </>
              ) : (
                <div className="text-neutral-500">
                  Não foi possível carregar os conjuntos de dados associados.
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
