'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Button,
  InputSearchBar,
  Icon,
  CardLinks,
  InputSelect,
  DropdownSection,
  DropdownOption,
  CardNoResults
} from '@ama-pt/agora-design-system';
import { Pagination } from '@/components/Pagination';
import { OrganizationsFilters } from './OrganizationsFilters';
import { APIResponse, OrgBadges, Organization, OrganizationFilters, SiteMetrics } from '@/types/api';
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
  alfabetica: 'name',
  recentes: '-last_modified',
};

function SortSelect({
  currentSortKey,
  onSortChange,
}: {
  currentSortKey: string;
  onSortChange: (value: string) => void;
}) {
  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectRef = React.useRef<any>(null);
  const lastValue = React.useRef(currentSortKey);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      const selected = selectRef.current?.selectedOptions?.[0]?.value;
      if (selected && selected !== lastValue.current) {
        lastValue.current = selected;
        onSortChange(selected);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [mounted, onSortChange]);

  if (!mounted) {
    return (
      <div className="selectOrganization">
        <label className="text-s-regular text-neutral-700 mb-4 block">
          Ordenar por:
        </label>
        <div className="w-full border border-neutral-300 rounded-8 px-16 py-12 text-m-regular text-neutral-900 bg-white">
          {currentSortKey === 'alfabetica' ? 'Ordem alfabética'
            : currentSortKey === 'recentes' ? 'Mais recentes'
            : 'Relevância'}
        </div>
      </div>
    );
  }

  return (
    <InputSelect
      label="Ordenar por:"
      id="sort-organizations"
      className="selectOrganization"
      ref={selectRef}
    >
      <DropdownSection name="order">
        <DropdownOption value="relevancia" selected={currentSortKey === 'relevancia'}>
          Relevância
        </DropdownOption>
        <DropdownOption value="alfabetica" selected={currentSortKey === 'alfabetica'}>
          Ordem alfabética
        </DropdownOption>
        <DropdownOption value="recentes" selected={currentSortKey === 'recentes'}>
          Mais recentes
        </DropdownOption>
      </DropdownSection>
    </InputSelect>
  );
}

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

  const handleSearch = React.useCallback(() => {
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
        >
          <InputSearchBar
            label="O que procura nas organizações?"
            placeholder="Pesquisar organizações..."
            id="organizations-search"
            hasVoiceActionButton={true}
            voiceActionAltText="Pesquisar por voz"
            searchActionAltText="Pesquisar"
            darkMode={true}
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearch(); }}
            onSearchActivate={() => handleSearch()}
          />
          <div className="mt-8 text-s-regular text-neutral-200">
            Exemplos: &quot;educação&quot;, &quot;saúde pública&quot;, &quot;ambiente&quot;
          </div>
          <div className="mt-[32px] text-white">
            <span>Conteúdo atualizados a 23.2.2026</span>
          </div>
          <div className="absolute w-full mb-64 bg-white text-neutral-900 shadow-lg dropdown"></div>
        </PageBanner>

        {/* Main Content */}
        <div className="container mx-auto md:gap-32 xl:gap-64 bg-white">
          <div className="grid md:grid-cols-3 xl:grid-cols-12 grid-filters">
            {/* Sidebar */}
            <div className="xl:col-span-4 xl:block p-32 pl-0">
              <OrganizationsFilters siteMetrics={siteMetrics} orgBadges={orgBadges} orgBadgeCounts={orgBadgeCounts} initialFilters={initialFilters} />
            </div>

            {/* Results Area */}
            <div className="xl:col-span-8 mt-[36px]">
              <div>
                <div className="grid md:grid-cols-2 xl:grid-cols-12 gap-32 mb-16 items-center mt-[12px]">
                  <span className="text-neutral-900 font-medium text-base xl:col-span-6 mt-[32px]">
                    {total.toLocaleString('pt-PT')} Resultados
                  </span>
                  <div className="w-full md:w-auto xl:col-span-6">
                    <SortSelect currentSortKey={currentSortKey} onSortChange={handleSort} />
                  </div>
                </div>

                <div className="divider-neutral-200 mt-[14px] mb-24" />

                <div className="grid grid-cols-1 md:grid-cols-2 agora-card-links-datasets-px0">
                  {organizations.length > 0 ? (
                    organizations.map((org) => (
                      <div key={org.id} className="h-full">
                        <CardLinks
                          onClick={() => router.push(`/pages/organizations/${org.slug}`)}
                          className="cursor-pointer text-neutral-900"
                          variant="transparent"
                          image={{
                            src: org.logo || '/images/placeholders/organization.png',
                            alt: org.name,
                          }}
                          category="Organização"
                          title={<div className="underline text-xl-bold">{org.name}</div>}
                          description={
                            org.description ? (
                              <p className="text-sm line-clamp-3 leading-relaxed text-neutral-900 mt-[8px] max-w-[592px]">
                                {org.description}
                              </p>
                            ) : undefined
                          }
                          date={
                            <span className="font-[300]">
                              {`Atualizado há ${formatDistanceToNow(new Date(org.last_modified), { locale: pt })}`}
                            </span>
                          }
                          links={[
                            {
                              href: '#',
                              hasIcon: true,
                              leadingIcon: 'agora-line-eye',
                              leadingIconHover: 'agora-solid-eye',
                              trailingIcon: '',
                              trailingIconHover: '',
                              trailingIconActive: '',
                              children: org.metrics?.views
                                ? org.metrics.views >= 1000000
                                  ? (org.metrics.views / 1000000).toFixed(1).replace('.', ',') + ' M'
                                  : org.metrics.views >= 1000
                                    ? (org.metrics.views / 1000).toFixed(0) + ' mil'
                                    : String(org.metrics.views)
                                : '0',
                              title: 'Visualizações',
                              onClick: (e: React.MouseEvent) => e.preventDefault(),
                              className: 'text-[#034AD8]',
                            },
                            {
                              href: '#',
                              hasIcon: true,
                              leadingIcon: 'agora-line-calendar',
                              leadingIconHover: 'agora-solid-calendar',
                              trailingIcon: '',
                              trailingIconHover: '',
                              trailingIconActive: '',
                              children: String(org.metrics?.datasets || 0),
                              title: 'Datasets',
                              onClick: (e: React.MouseEvent) => e.preventDefault(),
                              className: 'text-[#034AD8]',
                            },
                            {
                              href: '#',
                              hasIcon: false,
                              children: (
                                <span className="flex items-center gap-8">
                                  <img src="/Icons/bar_chart.svg" alt="" aria-hidden="true" />
                                  <span>{org.metrics?.reuses || 0}</span>
                                </span>
                              ),
                              title: 'Reutilizações',
                              onClick: (e: React.MouseEvent) => e.preventDefault(),
                            },
                            {
                              href: '#',
                              hasIcon: true,
                              leadingIcon: 'agora-line-star',
                              leadingIconHover: 'agora-solid-star',
                              trailingIcon: '',
                              trailingIconHover: '',
                              trailingIconActive: '',
                              children: String(org.metrics?.followers || 0),
                              title: 'Favoritos',
                              onClick: (e: React.MouseEvent) => e.preventDefault(),
                              className: 'text-[#034AD8]',
                            },
                          ]}
                          mainLink={
                            <Link href={`/pages/organizations/${org.slug}`}>
                              <span className="underline">{org.name}</span>
                            </Link>
                          }
                          blockedLink={true}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2">
                      <CardNoResults
                        icon={<Icon name="agora-line-search" className="w-12 h-12 text-primary-500" />}
                        title="Não encontrou nenhuma organização?"
                        subtitle={<span className="font-bold">Tente redefinir os filtros para ampliar sua busca.</span>}
                        description={<div className="max-w-[592px] mx-auto">Explore a nossa lista completa de publicadores de dados abertos.</div>}
                        position="center"
                        hasAnchor={false}
                        extraDescription={
                          <div className="mt-32">
                            <Button
                              variant="primary"
                              onClick={() => router.push('/pages/organizations')}
                              trailingIcon="agora-line-arrow-right-circle"
                              trailingIconHover="agora-solid-arrow-right-circle"
                            >
                              Redefinir filtros
                            </Button>
                          </div>
                        }
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
