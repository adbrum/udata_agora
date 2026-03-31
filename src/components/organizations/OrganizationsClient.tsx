'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Button,
  InputSearch,
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

function SortSelect({
  currentSortKey,
  onSortChange,
}: {
  currentSortKey: string;
  onSortChange: (value: string) => void;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="selectOrganization">
        <label className="text-s-regular text-neutral-700 mb-4 block">
          Ordenar por:
        </label>
        <div className="w-full border border-neutral-300 rounded-8 px-16 py-12 text-m-regular text-neutral-900 bg-white">
          {currentSortKey === 'recentes' ? 'Mais recente'
            : currentSortKey === 'antigos' ? 'Mais antigo'
            : currentSortKey === 'subscritores' ? 'Subscritores'
            : currentSortKey === 'reutilizacoes' ? 'Reutilizações'
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
      onChange={(options) => {
        const selected = options?.[0]?.value;
        if (selected && selected !== currentSortKey) {
          onSortChange(selected as string);
        }
      }}
    >
      <DropdownSection name="order">
        <DropdownOption value="relevancia" selected={currentSortKey === 'relevancia'}>
          Relevância
        </DropdownOption>
        <DropdownOption value="recentes" selected={currentSortKey === 'recentes'}>
          Mais recente
        </DropdownOption>
        <DropdownOption value="antigos" selected={currentSortKey === 'antigos'}>
          Mais antigo
        </DropdownOption>
        <DropdownOption value="subscritores" selected={currentSortKey === 'subscritores'}>
          Subscritores
        </DropdownOption>
        <DropdownOption value="reutilizacoes" selected={currentSortKey === 'reutilizacoes'}>
          Reutilizações
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
          <div className="grid md:grid-cols-3 xl:grid-cols-12 grid-filters gap-x-[32px]">
            {/* Sidebar */}
            <div className="xl:col-span-5 xl:block p-32 pl-0">
              <OrganizationsFilters siteMetrics={siteMetrics} orgBadges={orgBadges} orgBadgeCounts={orgBadgeCounts} initialFilters={initialFilters} />
            </div>

            {/* Results Area */}
            <div className="xl:col-span-7">
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
                          {...(org.logo ? { image: { src: org.logo, alt: org.name } } : {})}
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
