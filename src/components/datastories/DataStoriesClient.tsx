'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, CardLinks, Checkbox, InputSearch, Pill, Sidebar, SidebarItem, ToggleGroup, Toggle } from '@ama-pt/agora-design-system';
import PageBanner from '@/components/PageBanner';
import { Pagination } from '@/components/Pagination';
import { CategoryToggles } from '@/components/CategoryToggles';
import { SiteMetrics } from '@/types/api';

// Dummy data for Data Stories
const dummyDataStories = [
  {
    id: '1',
    slug: 'servicos-publicos/o-canal-presencial',
    title: 'Serviços Públicos: o canal presencial',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    organization: { name: 'Serviços Públicos' },
    image: '/laptop.png',
    created_at: '2024-03-11T12:00:00Z',
    metrics: { views: 1250, reuses: 45, followers: 12 },
    datasets: [1, 2, 3]
  },
  {
    id: '2',
    slug: 'territorios-inteligentes/pressao-turistica-em-portugal',
    title: 'Territórios Inteligentes: Pressão turística em Portugal',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    organization: { name: 'Territórios Inteligentes' },
    image: '/laptop.png',
    created_at: '2024-03-10T12:00:00Z',
    metrics: { views: 890, reuses: 23, followers: 8 },
    datasets: [1, 2]
  }
];

interface DataStoriesClientProps {
  currentPage: number;
  siteMetrics?: SiteMetrics;
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
};

type ReuseFilterKey = keyof typeof REUSE_TOGGLE_FILTERS;

const DATASTORY_ADVANCED_FILTER_GROUPS: {
  name: string;
  param: string;
  data: { id: string; name: string }[];
  searchable: boolean;
}[] = [
  {
    name: "Organizações",
    param: "organization",
    data: [
      { id: "servicos-publicos", name: "Serviços Públicos" },
      { id: "territorios-inteligentes", name: "Territórios Inteligentes" },
      { id: "ama", name: "AMA" },
      { id: "dgo", name: "Direção-Geral do Orçamento" },
    ],
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
      { id: "user", name: "Utilizador" },
    ],
    searchable: false,
  },
  {
    name: "Palavras-chave",
    param: "tag",
    data: [
      { id: "turismo", name: "Turismo" },
      { id: "servicos-publicos", name: "Serviços públicos" },
      { id: "transformacao-digital", name: "Transformação digital" },
      { id: "territorio", name: "Território" },
      { id: "mobilidade", name: "Mobilidade" },
    ],
    searchable: true,
  },
];

export default function DataStoriesClient({ currentPage, siteMetrics }: DataStoriesClientProps) {
  const router = useRouter();
  const total = 48; // Dummy total to show pagination
  const pageSize = 12;
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [selectedToggleFilters, setSelectedToggleFilters] = React.useState<Record<ReuseFilterKey, string>>({
    tipo_reutilizacao: "all",
  });
  const [filterSearchQueries, setFilterSearchQueries] = React.useState<Record<string, string>>({});
  const [selectedAdvancedFilters, setSelectedAdvancedFilters] = React.useState<Record<string, string[]>>({});

  const handleToggleFilterChange = (filterKey: ReuseFilterKey, optionId: string) => {
    setSelectedToggleFilters((prev) => ({ ...prev, [filterKey]: optionId }));
  };

  const handleFilterSearchChange = (groupName: string, value: string) => {
    setFilterSearchQueries((prev) => ({ ...prev, [groupName]: value }));
  };

  const handleAdvancedFilterChange = (paramName: string, value: string) => {
    setSelectedAdvancedFilters((prev) => {
      const currentValues = prev[paramName] || [];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [paramName]: nextValues };
    });
  };

  const handleClearAdvancedFilter = (paramName: string) => {
    setSelectedAdvancedFilters((prev) => ({ ...prev, [paramName]: [] }));
  };

  const getActiveValues = (paramName: string) => selectedAdvancedFilters[paramName] || [];

  return (
    <div className="min-h-screen flex flex-col font-sans text-neutral-900 bg-neutral-50 datastories">
      <main className="flex-grow bg-white">
        <PageBanner
          title="Data Stories"
          backgroundImageUrl="/Banner/hero-bg.png"
          backgroundPosition="center right"
          breadcrumbItems={[
            { label: 'Home', url: '/' },
            { label: 'Data Stories', url: '/pages/datastories' }
          ]}
          subtitle={
            <p className="text-primary-100 max-w-[592px]">
              Pesquise através de {total} data stories em dados.gov.pt
            </p>
          }
        />

        {/* Search Section */}
        <div className="container mx-auto pt-32 pb-16 px-4">
          <div className="max-w-[592px]">
            <InputSearch
              label="Pesquisar"
              placeholder="Pesquisar data stories, temas..."
              id="datastories-search"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
            <div className="mt-8 text-s-regular text-neutral-900">
              Exemplos: &quot;serviços públicos&quot;, &quot;turismo&quot;, &quot;territórios&quot;
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto md:gap-32 xl:gap-64 bg-white">
          {/* Results count + Sort — full width, aligned with grid */}
          <div className="grid md:grid-cols-3 xl:grid-cols-12 grid-filters gap-x-[32px]">
            <div className="xl:col-span-5 flex flex-row items-end gap-24 pl-0 py-16">
              <Button
                appearance="outline"
                variant="neutral"
                hasIcon
                {...(filtersOpen
                  ? { leadingIcon: "agora-line-chevron-left", leadingIconHover: "agora-solid-chevron-left" }
                  : { trailingIcon: "agora-line-chevron-right", trailingIconHover: "agora-solid-chevron-right" }
                )}
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                {filtersOpen ? "Ocultar filtros" : "Abrir filtros"}
              </Button>
              <span className="text-neutral-900 text-l-regular whitespace-nowrap">
                {total} Resultados
              </span>
            </div>
            <div className="xl:col-span-7 flex items-center justify-end py-16">
              <ToggleGroup
                multiple={false}
                value="recentes"
                onChange={() => {}}
              >
                <Toggle value="recentes">Mais recentes</Toggle>
                <Toggle value="visualizados">Mais visualizados</Toggle>
              </ToggleGroup>
            </div>
          </div>
          <div className="divider-neutral-200 mb-24" />

          <div className={`grid grid-filters gap-x-[32px] ${filtersOpen ? "md:grid-cols-3 xl:grid-cols-12" : ""}`}>
            {filtersOpen && (
              <div className="xl:col-span-5 xl:block">
                {siteMetrics && (
                  <div>
                    <CategoryToggles siteMetrics={siteMetrics} searchQuery={searchQuery} />
                  </div>
                )}

                <div className="flex flex-col gap-32 mt-[36px] mb-[36px]">
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
                              id={`datastory-filter-${filterKey}-${option.id}`}
                              name={`datastory-filter-${filterKey}`}
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

                <h2 className="font-bold text-xl text-neutral-900 mt-[36px] mb-[32px]">Filtros avançados</h2>

                <Sidebar variant="filter" className="font-bold">
                  {DATASTORY_ADVANCED_FILTER_GROUPS.map((group, index) => {
                    const sq = filterSearchQueries[group.name] || "";
                    const activeValues = getActiveValues(group.param);
                    const activeCount = activeValues.length;
                    const filteredData = group.data.filter((item) =>
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
                            <div className="mb-4 mt-8">
                              <InputSearch
                                label="Pesquisar"
                                hideLabel
                                placeholder="Pesquisar"
                                value={sq}
                                onChange={(e) =>
                                  handleFilterSearchChange(group.name, e.target.value)
                                }
                              />
                            </div>
                          )}
                          <div
                            className={`flex flex-col gap-2 ${showScroll ? "max-h-[225px] overflow-y-auto" : ""}`}
                          >
                            {filteredData.length > 0 ? (
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
                            ) : (
                              <p className="text-sm text-neutral-500">Sem resultados</p>
                            )}
                          </div>
                        </div>
                      </SidebarItem>
                    );
                  })}
                </Sidebar>

                <div className="mt-32">
                  <Button
                    variant="primary"
                    appearance="outline"
                    onClick={() => {
                      setSelectedToggleFilters({ tipo_reutilizacao: "all" });
                      setSelectedAdvancedFilters({});
                      setFilterSearchQueries({});
                    }}
                  >
                    Limpar filtros
                  </Button>
                </div>
              </div>
            )}

            <div className={filtersOpen ? "xl:col-span-7" : "col-span-full"}>
              <div
                className="grid agora-card-links-datasets-px0 gap-32"
                style={{
                  gridTemplateColumns: filtersOpen
                    ? "repeat(1, minmax(0, 1fr))"
                    : "repeat(2, minmax(0, 1fr))",
                }}
              >
                {dummyDataStories.map((story) => (
                  <div key={story.id} className="h-full">
                    <CardLinks
                      onClick={() => router.push(`/pages/datastories/${story.slug}`)}
                      className="cursor-pointer text-neutral-900"
                      variant="transparent"
                      image={{
                        src: story.image,
                        alt: story.title,
                      }}
                      category={story.organization.name}
                      title={<div className="underline text-xl-bold">{story.title}</div>}
                      description={
                        <p className="text-sm line-clamp-3 leading-relaxed text-neutral-900 mt-[8px] max-w-[592px]">
                          {story.description}
                        </p>
                      }
                      date={
                        <span className="font-[300]">
                          Publicado em 11 de março de 2024
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
                          children: story.metrics.views.toLocaleString('pt-PT'),
                          title: 'Visualizações',
                          onClick: (e: React.MouseEvent) => e.preventDefault(),
                          className: 'text-[#034AD8]',
                        },
                        {
                          href: '#',
                          hasIcon: true,
                          leadingIcon: 'agora-line-layers-menu',
                          leadingIconHover: 'agora-solid-layers-menu',
                          trailingIcon: '',
                          trailingIconHover: '',
                          children: `${story.datasets.length}`,
                          title: 'Datasets',
                          onClick: (e: React.MouseEvent) => e.preventDefault(),
                          className: 'text-[#034AD8]',
                        },
                        {
                          href: '#',
                          hasIcon: true,
                          leadingIcon: 'agora-line-star',
                          leadingIconHover: 'agora-solid-star',
                          trailingIcon: '',
                          trailingIconHover: '',
                          children: story.metrics.followers,
                          title: 'Favoritos',
                          onClick: (e: React.MouseEvent) => e.preventDefault(),
                          className: 'text-[#034AD8]',
                        },
                      ]}
                      mainLink={
                        <Link href={`/pages/datastories/${story.slug}`}>
                          <span className="underline">{story.title}</span>
                        </Link>
                      }
                      blockedLink={true}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="pb-64 mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalItems={total}
                  pageSize={pageSize}
                  baseUrl="/pages/datastories"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
