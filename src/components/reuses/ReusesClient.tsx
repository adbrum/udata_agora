'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  Toggle,
  Pill,
  Sidebar,
  SidebarItem,
  Checkbox,
  InputSearch,
} from '@ama-pt/agora-design-system';
import { Pagination } from '@/components/Pagination';
import { CategoryToggles } from '@/components/CategoryToggles';
import {
  fetchOrganizations,
  suggestTags,
} from '@/services/api';
import { APIResponse, Organization, Reuse, ReuseFilters, ReuseType, SiteMetrics } from '@/types/api';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

import PageBanner from '@/components/PageBanner';

const SORT_OPTIONS: Record<string, string> = {
  relevancia: '',
  recentes: '-created',
  visualizados: '-views',
  seguidores: '-followers',
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
      <div className="selectReuse">
        <label className="text-s-regular text-neutral-700 mb-4 block">
          Ordenar por :
        </label>
        <div className="w-full border border-neutral-300 rounded-8 px-16 py-12 text-m-regular text-neutral-900 bg-white">
          {currentSortKey === 'recentes'
            ? 'Mais recentes'
            : currentSortKey === 'visualizados'
              ? 'Mais visualizados'
              : currentSortKey === 'seguidores'
                ? 'Mais seguidos'
                : 'Relevância'}
        </div>
      </div>
    );
  }

  return (
    <InputSelect
      label="Ordenar por :"
      id="sort-reuses"
      className="selectReuse"
      ref={selectRef}
    >
      <DropdownSection name="order">
        <DropdownOption value="relevancia" selected={currentSortKey === 'relevancia'}>
          Relevância
        </DropdownOption>
        <DropdownOption value="recentes" selected={currentSortKey === 'recentes'}>
          Mais recentes
        </DropdownOption>
        <DropdownOption value="visualizados" selected={currentSortKey === 'visualizados'}>
          Mais visualizados
        </DropdownOption>
        <DropdownOption value="seguidores" selected={currentSortKey === 'seguidores'}>
          Mais seguidos
        </DropdownOption>
      </DropdownSection>
    </InputSelect>
  );
}

function TypeSelect({
  currentType,
  reuseTypes,
  onTypeChange,
}: {
  currentType: string;
  reuseTypes: ReuseType[];
  onTypeChange: (value: string) => void;
}) {
  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectRef = React.useRef<any>(null);
  const lastValue = React.useRef(currentType);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      const selected = selectRef.current?.selectedOptions?.[0]?.value;
      if (selected !== undefined && selected !== lastValue.current) {
        lastValue.current = selected;
        onTypeChange(selected);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [mounted, onTypeChange]);

  if (!mounted) {
    const label = reuseTypes.find((rt) => rt.id === currentType)?.label || 'Todos os tipos';
    return (
      <div>
        <label className="text-s-regular text-neutral-700 mb-4 block">Tipo:</label>
        <div className="w-full border border-neutral-300 rounded-8 px-16 py-12 text-m-regular text-neutral-900 bg-white">
          {label}
        </div>
      </div>
    );
  }

  return (
    <InputSelect label="Tipo:" id="filter-type" ref={selectRef}>
      <DropdownSection name="types">
        <DropdownOption value="" selected={!currentType}>
          Todos os tipos
        </DropdownOption>
        {reuseTypes.map((rt) => (
          <DropdownOption key={rt.id} value={rt.id} selected={currentType === rt.id}>
            {rt.label}
          </DropdownOption>
        ))}
      </DropdownSection>
    </InputSelect>
  );
}

const REUSE_TOGGLE_FILTERS = {
  tipo_reutilizacao: {
    title: "Tipo de reutilização",
    options: [
      { id: "all", label: "Todos", count: "2,8 mil" },
      { id: "visualization", label: "Visualização", count: "1,1 mil" },
      { id: "application", label: "Aplicativo", count: "1 mil" },
      { id: "blog_post", label: "Postagem no blog", count: "238" },
      { id: "press_article", label: "Artigo de imprensa", count: "184" },
      { id: "api", label: "API", count: "129" },
      { id: "scientific", label: "Publicação científica", count: "68" },
      { id: "idea", label: "Ideia", count: "32" },
      { id: "hardware", label: "Hardware conectado", count: "3" },
    ],
  },
  atualizacao: {
    title: "Data da atualização",
    options: [
      { id: "all", label: "Todos", count: "352" },
      { id: "30_days", label: "Os últimos 30 dias", count: "96" },
      { id: "12_months", label: "Os últimos 12 meses", count: "279" },
      { id: "3_years", label: "Os últimos 3 anos", count: "352" },
    ],
  },
  organizacao: {
    title: "Tipo de organização",
    options: [
      { id: "all", label: "Todos", count: "352" },
      { id: "public_service", label: "Serviço público", count: "259" },
      { id: "local_authority", label: "Autoridade local", count: "54" },
      { id: "business", label: "Negócios", count: "8" },
      { id: "association", label: "Associação", count: "6" },
      { id: "user", label: "Usuário", count: "7" },
    ],
  },
};

type ReuseFilterKey = keyof typeof REUSE_TOGGLE_FILTERS;

interface ReusesClientProps {
  initialData: APIResponse<Reuse>;
  currentPage: number;
  initialFilters?: ReuseFilters;
  reuseTypes?: ReuseType[];
  siteMetrics?: SiteMetrics;
}

export default function ReusesClient({
  initialData,
  currentPage,
  initialFilters,
  reuseTypes = [],
  siteMetrics,
}: ReusesClientProps) {
  const router = useRouter();
  const { data: reuses, total, page_size } = initialData;
  const [searchQuery, setSearchQuery] = useState(initialFilters?.q || '');
  const currentQuery = initialFilters?.q || '';
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Toggle filters state
  const [selectedToggleFilters, setSelectedToggleFilters] = useState<Record<ReuseFilterKey, string>>({
    tipo_reutilizacao: "all",
    atualizacao: "all",
    organizacao: "all",
  });

  const handleToggleFilterChange = (filterKey: ReuseFilterKey, optionId: string) => {
    setSelectedToggleFilters((prev) => ({ ...prev, [filterKey]: optionId }));
  };

  // Advanced filters state
  const [filterOrgs, setFilterOrgs] = useState<Organization[]>([]);
  const [filterTagOptions, setFilterTagOptions] = useState<{ id: string; name: string }[]>([]);
  const [filterSearchQueries, setFilterSearchQueries] = useState<Record<string, string>>({});
  const [isFiltersLoading, setIsFiltersLoading] = useState(true);

  useEffect(() => {
    async function loadFilterData() {
      try {
        const orgsRes = await fetchOrganizations(1, 100, { sort: "-datasets" });
        setFilterOrgs(orgsRes.data);
      } catch (error) {
        console.error("Failed to load filter data", error);
      } finally {
        setIsFiltersLoading(false);
      }
    }
    loadFilterData();
  }, []);

  const handleTagSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setFilterTagOptions([]); return; }
    try {
      const results = await suggestTags(q);
      setFilterTagOptions(results.map((t) => ({ id: t.text, name: t.text })));
    } catch { setFilterTagOptions([]); }
  }, []);

  const handleAdvancedFilterChange = (paramName: string, value: string) => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const currentValues = params.getAll(paramName);
    if (currentValues.includes(value)) {
      params.delete(paramName);
      currentValues.filter((v) => v !== value).forEach((v) => params.append(paramName, v));
    } else {
      params.append(paramName, value);
    }
    params.set("page", "1");
    router.push(`/pages/reuses?${params.toString()}`);
  };

  const handleClearAdvancedFilter = (paramName: string) => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    params.delete(paramName);
    params.set("page", "1");
    router.push(`/pages/reuses?${params.toString()}`);
  };

  const handleFilterSearchChange = (groupName: string, value: string) => {
    setFilterSearchQueries((prev) => ({ ...prev, [groupName]: value }));
    if (groupName === "Temático") handleTagSearch(value);
  };

  const getActiveValues = (paramName: string) => {
    if (typeof window === 'undefined') return [];
    return new URLSearchParams(window.location.search).getAll(paramName);
  };

  const advancedFilterGroups: {
    name: string;
    param: string;
    data: { id: string; name: string }[];
    searchable: boolean;
    suggest?: boolean;
  }[] = [
    {
      name: "Organizações",
      param: "organization",
      data: filterOrgs.map((o) => ({ id: o.id, name: o.name })),
      searchable: true,
    },
    {
      name: "Tipo de organização",
      param: "org_type",
      data: [
        { id: "public_service", name: "Serviço público" },
        { id: "local_authority", name: "Autoridade local" },
        { id: "business", name: "Negócios" },
        { id: "association", name: "Associação" },
        { id: "user", name: "Usuário" },
      ],
      searchable: false,
    },
    {
      name: "Palavras-chave",
      param: "tag",
      data: filterTagOptions,
      searchable: true,
      suggest: true,
    },
  ];

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

  useEffect(() => {
    if (searchQuery === currentQuery) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      router.push(buildUrl({ q: searchQuery || undefined, page: 1 }));
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, currentQuery, router, buildUrl]);

  const handleSearch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    router.push(buildUrl({ q: searchQuery || undefined, page: 1 }));
  }, [router, buildUrl, searchQuery]);

  const handleSortChange = useCallback(
    (value: string) => {
      router.push(buildUrl({ sort: SORT_OPTIONS[value] || undefined, page: 1 }));
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
      '-followers': 'seguidores',
    };
    return reverseMap[initialFilters?.sort || ''] || 'relevancia';
  })();

  const hasActiveFilters = !!(
    initialFilters?.q ||
    initialFilters?.type ||
    initialFilters?.tag ||
    initialFilters?.organization
  );

  return (
    <div className="min-h-screen flex flex-col font-sans text-neutral-900 bg-neutral-50 filters reuse">
      <main className="flex-grow bg-primary-50">
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

        <div className="container mx-auto md:gap-32 xl:gap-64 bg-white">
          <div className="grid md:grid-cols-3 xl:grid-cols-12 grid-filters gap-x-[32px]">
            {/* Sidebar */}
            <div className="xl:col-span-6 xl:block p-32 pl-0">
              {siteMetrics && (
                <div className="pl-[64px]">
                  <CategoryToggles siteMetrics={siteMetrics} searchQuery={initialFilters?.q} />
                </div>
              )}

              <div className="flex flex-col gap-32 pl-[64px] mt-[36px] mb-[36px]">
                <h2 className="font-bold text-xl text-neutral-900">Filtros</h2>
                {(Object.keys(REUSE_TOGGLE_FILTERS) as ReuseFilterKey[]).map((filterKey) => {
                  const section = REUSE_TOGGLE_FILTERS[filterKey];
                  return (
                    <div key={filterKey} className="pr-32 max-w-[592px] flex flex-col gap-8">
                      <h3 className="font-bold text-base text-neutral-900 mb-8">
                        {section.title}
                      </h3>
                      {section.options.map((option) => {
                        const isSelected = selectedToggleFilters[filterKey] === option.id;
                        return (
                          <Toggle
                            key={option.id}
                            id={`reuse-filter-${filterKey}-${option.id}`}
                            name={`reuse-filter-${filterKey}`}
                            value={option.id}
                            appearance="icon"
                            variant="primary"
                            checked={isSelected}
                            onChange={() => handleToggleFilterChange(filterKey, option.id)}
                            iconOnly={false}
                            fullWidth={true}
                            className="w-full"
                          >
                            <div className="flex items-center gap-12 font-bold text-sm">
                              <span
                                className={
                                  isSelected
                                    ? "text-primary-600 font-bold"
                                    : "text-neutral-900 font-bold"
                                }
                              >
                                {option.label}
                              </span>
                              <Pill
                                variant="neutral"
                                appearance="outline"
                                circular={false}
                                className="text-xs font-medium text-neutral-500 ml-16"
                              >
                                {option.count}
                              </Pill>
                            </div>
                          </Toggle>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              <h2 className="font-bold text-xl text-neutral-900 mt-[36px] mb-[32px] pl-[64px]">Filtros avançados</h2>

              <Sidebar variant="filter" className="pl-[64px] font-bold">
                {advancedFilterGroups.map((group, index) => {
                  const sq = filterSearchQueries[group.name] || "";
                  const activeValues = getActiveValues(group.param);
                  const activeCount = activeValues.length;

                  const selectedItems: { id: string; name: string }[] = group.suggest
                    ? activeValues
                        .filter((v) => !group.data.some((d) => d.id === v))
                        .map((v) => ({ id: v, name: v }))
                    : [];

                  const allData = [...selectedItems, ...group.data];

                  const filteredData = group.suggest
                    ? allData
                    : allData.filter((item) =>
                        item.name.toLowerCase().includes(sq.toLowerCase())
                      );

                  const showScroll = filteredData.length > 5;

                  return (
                    <SidebarItem
                      key={index}
                      variant="filter"
                      item={{
                        children: <span className="font-bold">{group.name}</span>,
                        hasIcon: true,
                        collapsedIconTrailing: "agora-line-minus-circle",
                        collapsedIconHoverTrailing: "agora-solid-minus-circle",
                        expandedIconTrailing: "agora-line-plus-circle",
                        expandedIconHoverTrailing: "agora-solid-plus-circle",
                      }}
                      hasPill={activeCount > 0}
                      pillValue={activeCount}
                    >
                      <div>
                        {activeCount > 0 && (
                          <button
                            onClick={() => handleClearAdvancedFilter(group.param)}
                            className="text-xs text-primary-500 hover:text-primary-700 underline mb-4 mt-4 cursor-pointer"
                          >
                            Limpar {group.name.toLowerCase()}
                          </button>
                        )}
                        {group.searchable && (
                          <div className="mb-4 mt-8 relative">
                            <InputSearch
                              label="Pesquisar"
                              hideLabel
                              placeholder={
                                group.suggest ? "Escreva para pesquisar..." : "Pesquisar"
                              }
                              value={sq}
                              onChange={(e) =>
                                handleFilterSearchChange(group.name, e.target.value)
                              }
                            />
                            <Icon
                              name="agora-solid-search"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-500 w-5 h-5 pointer-events-none"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                        <div
                          className={`flex flex-col gap-2 ${
                            showScroll ? "max-h-[225px] overflow-y-auto" : ""
                          }`}
                        >
                          {isFiltersLoading && !group.suggest ? null : filteredData.length > 0 ? (
                            filteredData.map((item) => (
                              <Checkbox
                                key={item.id}
                                label={item.name}
                                className="font-bold"
                                value={item.id}
                                name={group.param}
                                checked={activeValues.includes(item.id)}
                                onChange={() =>
                                  handleAdvancedFilterChange(group.param, item.id)
                                }
                              />
                            ))
                          ) : group.suggest && sq.length < 2 ? (
                            activeCount > 0 ? null : (
                              <p className="text-sm text-neutral-900">
                                Escreva pelo menos 2 caracteres...
                              </p>
                            )
                          ) : (
                            <p className="text-sm text-neutral-500">Sem resultados</p>
                          )}
                        </div>
                      </div>
                    </SidebarItem>
                  );
                })}
              </Sidebar>

              <div className="mt-32 pl-[64px]">
                <Button
                  variant="primary"
                  appearance="outline"
                  onClick={() => {
                    setSelectedToggleFilters({
                      tipo_reutilizacao: "all",
                      atualizacao: "all",
                      organizacao: "all",
                    });
                    router.push("/pages/reuses");
                  }}
                >
                  Redefinir filtros
                </Button>
              </div>
            </div>

            {/* Results Area */}
            <div className="xl:col-span-6 mt-[36px]">
              <div>
            <div className="grid md:grid-cols-2 xl:grid-cols-12 gap-32 mb-16 items-center mt-[12px]">
              <span className="text-neutral-900 font-medium text-base xl:col-span-7 mt-[32px]">
                {total.toLocaleString('pt-PT')} Resultados
              </span>
              <div className="w-full md:w-auto xl:col-span-5 flex items-end gap-16 justify-end">
                {reuseTypes.length > 0 && (
                  <div className="flex-grow max-w-[200px]">
                    <TypeSelect
                      currentType={initialFilters?.type || ''}
                      reuseTypes={reuseTypes}
                      onTypeChange={handleTypeFilter}
                    />
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
                  <SortSelect
                    currentSortKey={sortDefault}
                    onSortChange={handleSortChange}
                  />
                </div>
              </div>
            </div>

            <div className="divider-neutral-200 mt-[14px] mb-24" />

            <div className="grid grid-cols-1 agora-card-links-datasets-px0 gap-32">
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
            <div className="pb-64 mt-8 flex justify-center">
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
