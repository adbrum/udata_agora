
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, InputSearch, Icon, CardGeneral, CardLinks, ToggleGroup, Toggle, Pill, CardNoResults } from '@ama-pt/agora-design-system';
import { Pagination } from '@/components/Pagination';
import { DatasetsFilters } from '@/components/datasets/DatasetsFilters';
import { APIResponse, Dataset, DatasetFilters, SiteMetrics } from '@/types/api';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';

import PageBanner from '@/components/PageBanner';
import PublishDropdown from "@/components/admin/PublishDropdown";

interface DatasetsClientProps {
  initialData: APIResponse<Dataset>;
  currentPage: number;
  siteMetrics?: SiteMetrics;
  initialFilters?: DatasetFilters;
}

const SORT_OPTIONS: Record<string, string> = {
  relevancia: '',
  criacao: '-created',
  atualizacao: '-last_update',
  seguidores: '-followers',
  reutilizacoes: '-reuses',
};

const SORT_LABELS: Record<string, string> = {
  relevancia: 'Relevância',
  criacao: 'Mais recente',
  atualizacao: 'Última atualização',
  seguidores: 'Seguidores',
  reutilizacoes: 'Reutilizações',
};

export default function DatasetsClient({
  initialData,
  currentPage,
  siteMetrics,
  initialFilters = {},
}: DatasetsClientProps) {

  const router = useRouter();
  const { data: datasets, total, page_size } = initialData;

  const currentQuery = initialFilters.q || '';
  const currentSort = initialFilters.sort || '';
  const [searchQuery, setSearchQuery] = React.useState(currentQuery);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSortKey = Object.entries(SORT_OPTIONS).find(
    ([, v]) => v === currentSort
  )?.[0] || 'relevancia';

  const buildUrl = React.useCallback(
    (overrides: Record<string, string | null>) => {
      const params = new URLSearchParams();
      if (initialFilters.q) params.set('q', initialFilters.q);
      if (initialFilters.sort) params.set('sort', initialFilters.sort);
      if (initialFilters.tag) {
        const tags = Array.isArray(initialFilters.tag) ? initialFilters.tag : [initialFilters.tag];
        tags.forEach((t) => params.append('tag', t));
      }
      if (initialFilters.license) {
        const licenses = Array.isArray(initialFilters.license) ? initialFilters.license : [initialFilters.license];
        licenses.forEach((l) => params.append('license', l));
      }
      if (initialFilters.format) {
        const formats = Array.isArray(initialFilters.format) ? initialFilters.format : [initialFilters.format];
        formats.forEach((f) => params.append('format', f));
      }
      if (initialFilters.organization) {
        const orgs = Array.isArray(initialFilters.organization) ? initialFilters.organization : [initialFilters.organization];
        orgs.forEach((o) => params.append('organization', o));
      }
      if (initialFilters.badge) {
        const badges = Array.isArray(initialFilters.badge) ? initialFilters.badge : [initialFilters.badge];
        badges.forEach((b) => params.append('badge', b));
      }
      if (initialFilters.schema) params.set('schema', initialFilters.schema);
      if (initialFilters.geozone) params.set('geozone', initialFilters.geozone);
      if (initialFilters.granularity) params.set('granularity', initialFilters.granularity);
      if (initialFilters.featured) params.set('featured', 'true');
      for (const [key, value] of Object.entries(overrides)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      params.set('page', '1');
      const qs = params.toString();
      return `/pages/datasets${qs ? `?${qs}` : ''}`;
    },
    [initialFilters]
  );

  React.useEffect(() => {
    if (searchQuery === currentQuery) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      router.replace(
        buildUrl({ q: searchQuery.trim() || null }),
        { scroll: false }
      );
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, currentQuery, router, buildUrl]);

  const handleSearch = React.useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    router.replace(
      buildUrl({ q: searchQuery.trim() || null }),
      { scroll: false }
    );
  }, [searchQuery, router, buildUrl]);

  const handleSort = React.useCallback(
    (selectedKey: string) => {
      const sortValue = SORT_OPTIONS[selectedKey] || null;
      if (sortValue === (currentSort || null)) return;
      router.replace(buildUrl({ sort: sortValue }), { scroll: false });
    },
    [router, buildUrl, currentSort]
  );

  return (
    <div className="min-h-screen flex flex-col font-sans text-neutral-900 bg-neutral-50 filters dataset">
      <main className="flex-grow bg-primary-50">
        <PageBanner
          title="Conjunto de dados"
          backgroundImageUrl="/Banner/hero-bg.png"
          backgroundPosition="center right"
          //containerClassName="dataset"
          breadcrumbItems={[
            { label: 'Home', url: '/' },
            { label: 'Conjunto de dados', url: '/pages/datasets' }
          ]}
          subtitle={
            <p className="text-primary-100 max-w-[592px]">
              Pesquise através de {total.toLocaleString('pt-PT')} conjuntos
              de dados em dados.gov
            </p>
          }
        >
          <PublishDropdown darkMode={true} />
        </PageBanner>

        {/* Search Section */}
        <div className="container mx-auto pt-32 pb-16 px-4">
          <div className="max-w-[592px]">
            <InputSearch
              label="Pesquisar"
              placeholder="Pesquisar conjunto de dados, organizações, temas..."
              id="datasets-search"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearch(); }}
            />
            <div className="mt-8 text-s-regular text-neutral-900">
              Exemplos: &quot;educação&quot;, &quot;saúde pública&quot;, &quot;ambiente&quot;
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto md:gap-32 xl:gap-64 bg-white">
          {/* Results count + Sort toggles — full width, aligned with grid */}
          <div className="grid md:grid-cols-3 xl:grid-cols-12 grid-filters gap-x-[32px]">
            <div className="xl:col-span-5 flex items-center pl-0 py-16">
              <span className="text-neutral-900 font-medium text-base">
                {total.toLocaleString('pt-PT')} Resultados
              </span>
            </div>
            <div className="xl:col-span-7 flex items-center justify-end py-16">
              <ToggleGroup
                multiple={false}
                onChange={(val) => {
                  const selected = val.length > 0 ? val[0] : 'relevancia';
                  if (selected !== currentSortKey) {
                    handleSort(selected);
                  }
                }}
              >
                {Object.entries(SORT_LABELS).map(([key, label]) => (
                  <Toggle
                    key={key}
                    value={key}
                    selected={currentSortKey === key}
                  >
                    {label}
                  </Toggle>
                ))}
              </ToggleGroup>
            </div>
          </div>
          <div className="divider-neutral-200 mb-24" />

          <div className="grid md:grid-cols-3 xl:grid-cols-12 grid-filters gap-x-[32px]">
            {/* Sidebar */}
            <div className="xl:col-span-5 xl:block">
              <DatasetsFilters siteMetrics={siteMetrics} searchQuery={currentQuery} />
            </div>

            {/* Results Area */}
            <div className="xl:col-span-7">
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 agora-card-links-datasets-px0">
                  {datasets.length > 0 ? (
                    datasets.map((dataset) => (
                      <div key={dataset.id} className="h-full">
                        <CardLinks
                          onClick={() => router.push(`/pages/datasets/${dataset.slug}`)}
                          className="cursor-pointer text-neutral-900"
                          variant="transparent"
                          image={{
                            src: dataset.organization?.logo || '/images/placeholders/organization.png',
                            alt: dataset.organization?.name || 'Organização sem logo',
                            onClick: dataset.organization?.slug ? (e: React.MouseEvent) => {
                              e.stopPropagation();
                              e.preventDefault();
                              router.push(`/pages/organizations/${dataset.organization!.slug}`);
                            } : undefined,
                            className: dataset.organization?.slug ? 'cursor-pointer' : undefined,
                          }}
                          category={
                            dataset.organization?.slug ? (
                              <Link
                                href={`/pages/organizations/${dataset.organization.slug}`}
                                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                className="text-primary-500 hover:underline hover:text-primary-700 transition-colors"
                              >
                                {dataset.organization.name}
                              </Link>
                            ) : dataset.organization?.name
                          }
                          title={dataset.title}
                          description={
                            <div className="flex flex-col gap-12">
                              <p className="text-sm line-clamp-3 leading-relaxed text-neutral-900 mt-[8px] max-w-[592px]">
                                {dataset.description}
                              </p>
                              <div className="flex flex-wrap gap-8 items-center mt-[8px]">
                                <span className="text-sm font-medium text-neutral-900">
                                  Metadados: {dataset.quality?.score != null ? Math.round(dataset.quality.score * 100) : 0}%
                                </span>
                              </div>
                              <div className="flex items-center flex-wrap gap-[32px] text-xs mt-[32px] text-[#034AD8] mb-[32px]">
                                <div className="flex items-center gap-8" title="Visualizações">
                                  <Icon name="agora-line-eye" className="" aria-hidden="true" />
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
                                <div className="flex items-center gap-8" title="Downloads">
                                  <Icon name="agora-line-download" className="" aria-hidden="true" />
                                  <span>
                                    {dataset.metrics?.resources_downloads
                                      ? dataset.metrics.resources_downloads >= 1000
                                        ? (dataset.metrics.resources_downloads / 1000).toFixed(0) + ' mil'
                                        : dataset.metrics.resources_downloads
                                      : '0'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-8" title="Reutilizações">
                                  <img src="/Icons/bar_chart.svg" className="" alt="" aria-hidden="true" />
                                  <span>{dataset.metrics?.reuses || 0}</span>
                                </div>
                                <div className="flex items-center gap-8" title="Favoritos">
                                  <img src="/Icons/favorite.svg" className="" alt="" aria-hidden="true" />
                                  <span>
                                    {dataset.metrics?.followers
                                      ? dataset.metrics.followers >= 1000
                                        ? (dataset.metrics.followers / 1000).toFixed(0) + ' mil'
                                        : dataset.metrics.followers
                                      : '0'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          }
                          date={<span className="font-[300]">{`Atualizado há ${formatDistanceToNow(new Date(dataset.last_modified), { locale: pt }).replace("aproximadamente ", "").replace("quase ", "").replace("menos de ", "").replace("cerca de ", "")}`}</span>}
                          mainLink={
                            <Link href={`/pages/datasets/${dataset.slug}`}>
                              <span className="underline">{dataset.title}</span>
                            </Link>
                          }
                          blockedLink={true}

                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2">
                      <CardNoResults
                        icon={<Icon name="agora-line-search" className="w-12 h-12 text-primary-500 icon-xl" />}
                        title="Não encontrámos o que procura"
                        subtitle={<span className="font-bold">A sua pesquisa não devolveu resultados.</span>}
                        description={<div className="max-w-[592px] mx-auto">Verifique os termos introduzidos ou ajuste os filtros para ver mais resultados.</div>}
                        position="center"
                        hasAnchor={false}
                      />
                    </div>
                  )}
                </div>

                <div className="pb-64 mt-8 flex justify-center">
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
