'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CardLinks,
  InputSearchBar,
  Button,
  InputSelect,
  DropdownSection,
  DropdownOption,
  Icon,
  CardNoResults,
  DropdownOptionProps,
} from '@ama-pt/agora-design-system';
import { Pagination } from '@/components/Pagination';
import { APIResponse, Reuse, ReuseFilters, ReuseType } from '@/types/api';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

import PageBanner from '@/components/PageBanner';

interface ReusesClientProps {
  initialData: APIResponse<Reuse>;
  currentPage: number;
  initialFilters?: ReuseFilters;
  reuseTypes?: ReuseType[];
}

export default function ReusesClient({
  initialData,
  currentPage,
  initialFilters,
  reuseTypes = [],
}: ReusesClientProps) {
  const router = useRouter();
  const { data: reuses, total, page_size } = initialData;
  const [searchQuery, setSearchQuery] = useState(initialFilters?.q || '');
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  const buildUrl = useCallback(
    (overrides: Partial<ReuseFilters> & { page?: number } = {}) => {
      const params = new URLSearchParams();
      const q = overrides.q ?? initialFilters?.q;
      const type = overrides.type ?? initialFilters?.type;
      const tag = overrides.tag ?? initialFilters?.tag;
      const organization = overrides.organization ?? initialFilters?.organization;
      const sort = overrides.sort ?? initialFilters?.sort;
      const page = overrides.page ?? currentPage;

      if (q) params.set('q', q);
      if (type) params.set('type', type);
      if (tag) params.set('tag', tag);
      if (organization) params.set('organization', organization);
      if (sort) params.set('sort', sort);
      if (page > 1) params.set('page', String(page));

      const qs = params.toString();
      return `/pages/reuses${qs ? `?${qs}` : ''}`;
    },
    [initialFilters, currentPage]
  );

  const handleSearch = useCallback(() => {
    router.push(buildUrl({ q: searchQuery || undefined, page: 1 }));
  }, [router, buildUrl, searchQuery]);

  const handleSortChange = useCallback(
    (value: string) => {
      const sortMap: Record<string, string> = {
        recentes: '-created',
        visualizados: '-views',
        reutilizacoes: '-reuses',
        seguidores: '-followers',
      };
      router.push(buildUrl({ sort: sortMap[value] || undefined, page: 1 }));
    },
    [router, buildUrl]
  );

  const handleTypeFilter = useCallback(
    (typeId: string) => {
      router.push(
        buildUrl({
          type: typeId === initialFilters?.type ? undefined : typeId,
          page: 1,
        })
      );
    },
    [router, buildUrl, initialFilters?.type]
  );

  const handleClearFilters = useCallback(() => {
    router.push('/pages/reuses');
  }, [router]);

  const sortDefault = (() => {
    const reverseMap: Record<string, string> = {
      '-created': 'recentes',
      '-views': 'visualizados',
      '-reuses': 'reutilizacoes',
      '-followers': 'seguidores',
    };
    return reverseMap[initialFilters?.sort || ''] || 'reutilizacoes';
  })();

  const hasActiveFilters = !!(
    initialFilters?.q ||
    initialFilters?.type ||
    initialFilters?.tag ||
    initialFilters?.organization
  );

  return (
    <div className="min-h-screen flex flex-col font-sans text-neutral-900 bg-neutral-50 reuse">
      <main className="flex-grow bg-white">
        <PageBanner
          title="Reutilizações"
          backgroundImageUrl="/Banner/hero-bg.png"
          backgroundPosition="center right"
          breadcrumbItems={[
            { label: 'Home', url: '/' },
            { label: 'Reutilizações', url: '/pages/reuses' },
          ]}
        >
          <InputSearchBar
            label="O que procura nas reutilizações?"
            placeholder="Pesquisar reutilizações..."
            id="reuses-search"
            hasVoiceActionButton={true}
            voiceActionAltText="Pesquisar por voz"
            searchActionAltText="Pesquisar"
            darkMode={true}
            defaultValue={initialFilters?.q || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter') handleSearch();
            }}
            onSearchActivate={() => handleSearch()}
          />
          <div className="mt-8 text-s-regular text-neutral-200">
            Exemplos: &quot;educação&quot;, &quot;saúde pública&quot;, &quot;ambiente&quot;
          </div>
          <div className="absolute w-full mb-64 bg-white text-neutral-900 shadow-lg dropdown"></div>
        </PageBanner>

        {/* Main Content - Grid of Reuses */}
        <div className="container mx-auto md:gap-32 xl:gap-64">
          <div className="pt-32 pb-64">
            <div className="grid md:grid-cols-2 xl:grid-cols-12 gap-32 mb-16 items-center mt-[12px]">
              <span className="text-neutral-900 font-medium text-base xl:col-span-7 mt-[32px]">
                {total.toLocaleString('pt-PT')} Resultados
              </span>
              <div className="w-full md:w-auto xl:col-span-5 flex items-end gap-16 justify-end">
                {reuseTypes.length > 0 && (
                  <div className="flex-grow max-w-[200px]">
                    <InputSelect
                      label="Tipo:"
                      id="filter-type"
                      defaultValue={initialFilters?.type || ''}
                      onChange={(options: DropdownOptionProps[]) => {
                        if (mountedRef.current) handleTypeFilter(options[0]?.value || '');
                      }}
                    >
                      <DropdownSection name="types">
                        <DropdownOption value="">Todos os tipos</DropdownOption>
                        {reuseTypes.map((rt) => (
                          <DropdownOption key={rt.id} value={rt.id}>
                            {rt.label}
                          </DropdownOption>
                        ))}
                      </DropdownSection>
                    </InputSelect>
                  </div>
                )}
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
                  <InputSelect
                    label="Ordenar por :"
                    id="sort-reuses"
                    defaultValue={sortDefault}
                    className="selectReuse"
                    onChange={(options: DropdownOptionProps[]) => {
                      if (mountedRef.current) handleSortChange(options[0]?.value || 'reutilizacoes');
                    }}
                  >
                    <DropdownSection name="order">
                      <DropdownOption value="reutilizacoes">
                        Número de reutilizações
                      </DropdownOption>
                      <DropdownOption value="recentes">Mais recentes</DropdownOption>
                      <DropdownOption value="visualizados">Mais visualizados</DropdownOption>
                      <DropdownOption value="seguidores">Mais seguidos</DropdownOption>
                    </DropdownSection>
                  </InputSelect>
                </div>
              </div>
            </div>

            <div className="divider-neutral-200 mt-[14px] mb-24" />

            <div className="grid grid-cols-2 agora-card-links-datasets-px0 gap-32">
              {reuses.length > 0 ? (
                reuses.map((reuse) => (
                  <div key={reuse.id} className="h-full">
                    <CardLinks
                      onClick={() => router.push(`/pages/reuses/${reuse.slug}`)}
                      className="cursor-pointer text-neutral-900"
                      variant="transparent"
                      image={{
                        src: reuse.image_thumbnail || reuse.image || '/laptop.png',
                        alt: reuse.title,
                      }}
                      category={reuse.organization?.name || 'Reutilização'}
                      title={<div className="underline text-xl-bold">{reuse.title}</div>}
                      description={
                        reuse.description ? (
                          <p className="text-sm line-clamp-3 leading-relaxed text-neutral-900 mt-[8px] max-w-[592px]">
                            {reuse.description}
                          </p>
                        ) : undefined
                      }
                      date={
                        <span className="font-[300]">
                          Atualizado{' '}
                          {format(
                            new Date(reuse.last_modified || reuse.created_at),
                            'dd MM yyyy',
                            { locale: pt }
                          )}
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
                          children: reuse.metrics?.views?.toLocaleString('pt-PT') || '0',
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
                          children: `${reuse.datasets?.length || 0} datasets`,
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
                              <span>{reuse.metrics?.reuses || 0}</span>
                            </span>
                          ),
                          title: 'Métricas',
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
                          children: reuse.metrics?.followers || 0,
                          title: 'Favoritos',
                          onClick: (e: React.MouseEvent) => e.preventDefault(),
                          className: 'text-[#034AD8]',
                        },
                      ]}
                      mainLink={
                        <Link href={`/pages/reuses/${reuse.slug}`}>
                          <span className="underline">{reuse.title}</span>
                        </Link>
                      }
                      blockedLink={true}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-2">
                  <CardNoResults
                    icon={
                      <Icon
                        name="agora-line-search"
                        className="w-12 h-12 text-primary-500"
                      />
                    }
                    title="Não encontrou nenhuma reutilização?"
                    subtitle={
                      <span className="font-bold">
                        Tente redefinir os filtros para ampliar sua busca.
                      </span>
                    }
                    description={
                      <div className="max-w-[592px] mx-auto">
                        Explore a nossa lista completa de reutilizações de dados abertos.
                      </div>
                    }
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

            {/* Pagination */}
            <div className="mt-64 flex justify-center pb-12">
              <Pagination
                currentPage={currentPage}
                totalItems={total}
                pageSize={page_size}
                baseUrl={buildUrl()}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
