'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  InputSearch,
  Icon,
  CardGeneral,
  ToggleGroup,
  Toggle,
  CardNoResults
} from '@ama-pt/agora-design-system';
import { Pagination } from '@/components/Pagination';
import { OrganizationsFilters } from './OrganizationsFilters';
import { APIResponse, OrgBadges, Organization, OrganizationFilters, SiteMetrics } from '@/types/api';
import PublishDropdown from "@/components/admin/PublishDropdown";
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';

import PageBanner from '@/components/PageBanner';

interface OrganizationsClientProps {
  initialData: APIResponse<Organization>;
  currentPage: number;
  siteMetrics: SiteMetrics;
  orgBadges: OrgBadges;
  orgBadgeCounts: Record<string, number>;
  initialFilters: OrganizationFilters;
}

const SORT_OPTIONS: Record<string, string> = {
  relevancia: '',
  recentes: '-last_modified',
  antigos: 'last_modified',
  subscritores: '-followers',
  reutilizacoes: '-reuses',
};

const SORT_LABELS: Record<string, string> = {
  relevancia: 'Relevância',
  recentes: 'Mais recente',
  antigos: 'Mais antigo',
  subscritores: 'Subscritores',
  reutilizacoes: 'Reutilizações',
};

export default function OrganizationsClient({
  initialData,
  currentPage,
  siteMetrics,
  orgBadges,
  orgBadgeCounts,
  initialFilters,
}: OrganizationsClientProps) {
  const router = useRouter();
  const { data: organizations, total, page_size } = initialData;

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
      if (initialFilters.badge) params.set('badge', initialFilters.badge);
      if (initialFilters.sort) params.set('sort', initialFilters.sort);
      for (const [key, value] of Object.entries(overrides)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      params.set('page', '1');
      const qs = params.toString();
      return `/pages/organizations${qs ? `?${qs}` : ''}`;
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
    <div className="min-h-screen flex flex-col font-sans text-neutral-900 bg-neutral-50 filters organization">
      <main className="flex-grow bg-primary-50">
        <PageBanner
          title="Organizações"
          backgroundImageUrl="/Banner/hero-bg.png"
          backgroundPosition="center right"
          //containerClassName="dataset"
          breadcrumbItems={[
            { label: 'Home', url: '/' },
            { label: 'Organizações', url: '/pages/organizations' }
          ]}
          subtitle={
            <p className="text-primary-100 max-w-[592px]">
              Pesquise através de {total.toLocaleString('pt-PT')} organizações
              em dados.gov
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
              placeholder="Pesquisar organizações..."
              id="organizations-search"
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
          {/* Results count + Sort toggles */}
          <div className="grid md:grid-cols-3 xl:grid-cols-12 grid-filters gap-x-[32px]">
            <div className="xl:col-span-5 flex items-center py-16">
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
              <OrganizationsFilters siteMetrics={siteMetrics} orgBadges={orgBadges} orgBadgeCounts={orgBadgeCounts} initialFilters={initialFilters} />
            </div>

            {/* Results Area */}
            <div className="xl:col-span-7">
              <div>

                <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-32">
                  {organizations.length > 0 ? (
                    organizations.map((org) => {
                      const formatMetric = (value: number | undefined) => {
                        if (!value) return "0";
                        if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(".", ",") + " M";
                        if (value >= 1_000) return (value / 1_000).toFixed(0) + " mil";
                        return String(value);
                      };
                      const timeAgo = org.last_modified
                        ? formatDistanceToNow(new Date(org.last_modified), { locale: pt })
                            .replace("aproximadamente ", "")
                            .replace("quase ", "")
                            .replace("menos de ", "")
                            .replace("cerca de ", "")
                        : "Desconhecido";

                      return (
                        <Link
                          key={org.id}
                          href={`/pages/organizations/${org.slug}`}
                          className="card-general-listing rounded-[4px] overflow-hidden h-full flex flex-col"
                        >
                          <CardGeneral
                            variant="neutral-100"
                            image={{
                              src: org.logo || "/images/placeholders/organization.png",
                              alt: org.name,
                              height: "88px",
                              className: "bg-primary-100 !object-contain !h-[56px]",
                            }}
                            subtitleText={
                              (
                                <div className="flex flex-col">
                                  <span style={{ fontSize: "16px" }} className="text-neutral-900">{timeAgo}</span>
                                  <span style={{ fontSize: "16px", fontWeight: 300 }} className="text-neutral-900 mt-4">
                                    Organização
                                  </span>
                                </div>
                              ) as unknown as string
                            }
                            titleText={org.name}
                            descriptionText={
                              (
                                <div className="flex flex-col grow">
                                  {org.description && (
                                    <p className="text-m-regular text-neutral-800 line-clamp-3 mb-16">
                                      {org.description}
                                    </p>
                                  )}
                                  <div className="mt-auto">
                                    <div className="flex items-center flex-wrap gap-8 text-xs mt-12 text-neutral-700">
                                      <div className="flex items-center gap-8" title="Visualizações">
                                        <Icon
                                          name={org.metrics?.views ? "agora-solid-eye" : "agora-line-eye"}
                                          dimensions="xs"
                                          className="fill-neutral-700"
                                          aria-hidden="true"
                                        />
                                        <span>{formatMetric(org.metrics?.views)}</span>
                                      </div>
                                      <div className="flex items-center gap-8" title="Datasets">
                                        <Icon
                                          name={org.metrics?.datasets ? "agora-solid-calendar" : "agora-line-calendar"}
                                          dimensions="xs"
                                          className="fill-neutral-700"
                                          aria-hidden="true"
                                        />
                                        <span>{org.metrics?.datasets || 0}</span>
                                      </div>
                                      <div className="flex items-center gap-8" title="Reutilizações">
                                        <img src="/Icons/bar_chart.svg" className="w-16 h-16" alt="" aria-hidden="true" />
                                        <span>{org.metrics?.reuses || 0}</span>
                                      </div>
                                      <div className="flex items-center gap-8" title="Favoritos">
                                        <Icon
                                          name={org.metrics?.followers ? "agora-solid-star" : "agora-line-star"}
                                          dimensions="xs"
                                          className="fill-neutral-700"
                                          aria-hidden="true"
                                        />
                                        <span>{formatMetric(org.metrics?.followers)}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-8 text-primary-600 mt-16">
                                      <Icon
                                        name="agora-line-arrow-right-circle"
                                        className="w-32 h-32"
                                        aria-hidden="true"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ) as unknown as string
                            }
                            isBlockedLink={true}
                            anchor={{
                              href: `/pages/organizations/${org.slug}`,
                            }}
                          />
                        </Link>
                      );
                    })
                  ) : (
                    <div className="col-span-full">
                      <CardNoResults
                        icon={<Icon name="agora-line-search" className="w-12 h-12 text-primary-500" />}
                        title="Nenhuma organização encontrada"
                        subtitle={<span className="font-bold">Não existem organizações que correspondam aos filtros aplicados.</span>}
                        description={<div className="max-w-[592px] mx-auto">Experimente remover filtros ou usar outros termos de pesquisa.</div>}
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
                    baseUrl="/pages/organizations"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
