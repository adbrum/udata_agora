'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  InputSearchBar,
  InputSelect,
  DropdownSection,
  DropdownOption,
  Icon,
  CardNoResults,
  Button,
  CardLinks,
} from '@ama-pt/agora-design-system';
import { Pagination } from '@/components/Pagination';
import { CategoryToggles } from '@/components/CategoryToggles';
import { APIResponse, Dataservice, SiteMetrics } from '@/types/api';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';

import PageBanner from '@/components/PageBanner';

const SORT_OPTIONS: Record<string, string> = {
  relevancia: '',
  recentes: '-created_at',
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
      <div className="selectDataservice">
        <label className="text-s-regular text-neutral-700 mb-4 block">
          Ordenar por :
        </label>
        <div className="w-full border border-neutral-300 rounded-8 px-16 py-12 text-m-regular text-neutral-900 bg-white">
          {currentSortKey === 'recentes' ? 'Mais recentes' : 'Relevância'}
        </div>
      </div>
    );
  }

  return (
    <InputSelect
      label="Ordenar por :"
      id="sort-dataservices"
      className="selectDataservice"
      ref={selectRef}
    >
      <DropdownSection name="order">
        <DropdownOption value="relevancia" selected={currentSortKey === 'relevancia'}>
          Relevância
        </DropdownOption>
        <DropdownOption value="recentes" selected={currentSortKey === 'recentes'}>
          Mais recentes
        </DropdownOption>
      </DropdownSection>
    </InputSelect>
  );
}

interface DataservicesClientProps {
  initialData: APIResponse<Dataservice>;
  currentPage: number;
  siteMetrics?: SiteMetrics;
  initialFilters?: { q?: string; sort?: string };
}

export default function DataservicesClient({
  initialData,
  currentPage,
  siteMetrics,
  initialFilters,
}: DataservicesClientProps) {
  const router = useRouter();
  const { data: dataservices, total, page_size } = initialData;
  const [searchQuery, setSearchQuery] = useState(initialFilters?.q || '');
  const currentQuery = initialFilters?.q || '';
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildUrl = useCallback(
    (overrides: { q?: string | null; sort?: string | null; page?: number } = {}) => {
      const params = new URLSearchParams();
      const q = overrides.q !== undefined ? overrides.q : initialFilters?.q;
      const sort = overrides.sort !== undefined ? overrides.sort : initialFilters?.sort;
      const page = overrides.page ?? currentPage;

      if (q) params.set('q', q);
      if (sort) params.set('sort', sort);
      if (page > 1) params.set('page', String(page));

      const qs = params.toString();
      return `/pages/dataservices${qs ? `?${qs}` : ''}`;
    },
    [initialFilters, currentPage]
  );

  useEffect(() => {
    if (searchQuery === currentQuery) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      router.push(buildUrl({ q: searchQuery.trim() || null, page: 1 }));
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, currentQuery, router, buildUrl]);

  const handleSearch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    router.push(buildUrl({ q: searchQuery.trim() || null, page: 1 }));
  }, [router, buildUrl, searchQuery]);

  const handleSortChange = useCallback(
    (value: string) => {
      router.push(buildUrl({ sort: SORT_OPTIONS[value] || null, page: 1 }));
    },
    [router, buildUrl]
  );

  const handleClearFilters = useCallback(() => {
    router.push('/pages/dataservices');
  }, [router]);

  const sortDefault = (() => {
    const reverseMap: Record<string, string> = {
      '-created_at': 'recentes',
    };
    return reverseMap[initialFilters?.sort || ''] || 'relevancia';
  })();

  const hasActiveFilters = !!(initialFilters?.q);

  return (
    <div className="min-h-screen flex flex-col font-sans text-neutral-900 bg-neutral-50 filters dataservice">
      <main className="flex-grow bg-primary-50">
        <PageBanner
          title="APIs"
          backgroundImageUrl="/Banner/hero-bg.png"
          backgroundPosition="center right"
          breadcrumbItems={[
            { label: 'Home', url: '/' },
            { label: 'APIs', url: '/pages/dataservices' },
          ]}
          subtitle={
            <p className="text-primary-100 max-w-[592px]">
              Pesquise através de {total.toLocaleString('pt-PT')} APIs em dados.gov
            </p>
          }
        >
          <InputSearchBar
            label="O que procura nas APIs?"
            placeholder="Pesquisar APIs..."
            id="dataservices-search"
            hasVoiceActionButton={true}
            voiceActionAltText="Pesquisar por voz"
            searchActionAltText="Pesquisar"
            darkMode={true}
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter') handleSearch();
            }}
            onSearchActivate={() => handleSearch()}
          />
          <div className="mt-8 text-s-regular text-neutral-200">
            Exemplos: &quot;geolocalização&quot;, &quot;transportes&quot;, &quot;saúde&quot;
          </div>
          <div className="absolute w-full mb-64 bg-white text-neutral-900 shadow-lg dropdown"></div>
        </PageBanner>

        <div className="container mx-auto md:gap-32 xl:gap-64 bg-white">
          <div className="grid md:grid-cols-3 xl:grid-cols-12 grid-filters">
            {/* Sidebar */}
            <div className="xl:col-span-4 xl:block p-32 pl-0">
              {siteMetrics && (
                <CategoryToggles siteMetrics={siteMetrics} searchQuery={initialFilters?.q} />
              )}
            </div>

            {/* Results Area */}
            <div className="xl:col-span-8 mt-[36px]">
              <div>
                <div className="grid md:grid-cols-2 xl:grid-cols-12 gap-32 mb-16 items-center mt-[12px]">
                  <span className="text-neutral-900 font-medium text-base xl:col-span-6 mt-[32px]">
                    {total.toLocaleString('pt-PT')} Resultados
                  </span>
                  <div className="w-full md:w-auto xl:col-span-6 flex items-end gap-16 justify-end">
                    {hasActiveFilters && (
                      <Button
                        variant="primary"
                        appearance="link"
                        hasIcon={true}
                        trailingIcon="agora-line-close"
                        trailingIconHover="agora-solid-close"
                        onClick={handleClearFilters}
                      >
                        Limpar filtros
                      </Button>
                    )}
                    <div className="flex-grow max-w-[240px]">
                      <SortSelect
                        currentSortKey={sortDefault}
                        onSortChange={handleSortChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="divider-neutral-200 mt-[14px] mb-24" />

                <div className="grid grid-cols-1 md:grid-cols-2 agora-card-links-datasets">
                  {dataservices.length > 0 ? (
                    dataservices.map((ds) => (
                      <div key={ds.id} className="h-full">
                        <CardLinks
                          onClick={() => router.push(`/pages/dataservices/preview?title=${encodeURIComponent(ds.title)}&description=${encodeURIComponent(ds.description || '')}`)}
                          className="cursor-pointer text-neutral-900"
                          variant="white"
                          image={{
                            src: ds.organization?.logo || '/images/placeholders/organization.png',
                            alt: ds.organization?.name || 'Organização sem logo',
                          }}
                          category={ds.organization?.name}
                          title={ds.title}
                          description={
                            <div className="flex flex-col gap-12">
                              <p className="text-sm line-clamp-3 leading-relaxed text-neutral-900 mt-[8px] max-w-[592px]">
                                {ds.description}
                              </p>
                              <div className="flex items-center flex-wrap gap-[32px] text-xs mt-[32px] text-[#034AD8] mb-[32px]">
                                <div className="flex items-center gap-8" title="Visualizações">
                                  <Icon name="agora-line-eye" className="" aria-hidden="true" />
                                  <span>{ds.metrics?.views || 0}</span>
                                </div>
                                <div className="flex items-center gap-8" title="Favoritos">
                                  <img src="/Icons/favorite.svg" className="" alt="" aria-hidden="true" />
                                  <span>{ds.metrics?.followers || 0}</span>
                                </div>
                              </div>
                            </div>
                          }
                          date={
                            <span className="font-[300]">
                              {`Atualizado há ${formatDistanceToNow(new Date(ds.last_modified), { locale: pt })}`}
                            </span>
                          }
                          mainLink={
                            <Link href={`/pages/dataservices/preview?title=${encodeURIComponent(ds.title)}&description=${encodeURIComponent(ds.description || '')}`}>
                              <span className="underline">{ds.title}</span>
                            </Link>
                          }
                          blockedLink={true}
                        />
                      </div>
                    ))
                  ) : (
                    <div>
                      <CardNoResults
                        icon={<Icon name="agora-line-search" className="w-12 h-12 text-primary-500 icon-xl" />}
                        title="Não encontrou o que procurava?"
                        subtitle={<span className="font-bold">Tente redefinir os filtros para ampliar sua busca.</span>}
                        description={<div className="max-w-[592px] mx-auto">Explore a nossa lista completa de APIs de dados abertos.</div>}
                        position="center"
                        hasAnchor={false}
                        extraDescription={
                          <div className="mt-24">
                            <Button
                              variant="primary"
                              onClick={handleClearFilters}
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

                <div className="pt-64 flex justify-center pb-64 pagination-filters">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={total}
                    pageSize={page_size}
                    baseUrl={buildUrl()}
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
