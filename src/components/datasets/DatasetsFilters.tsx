'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Sidebar, SidebarItem, Checkbox, InputSearch, Icon } from '@ama-pt/agora-design-system';
import {
  fetchOrganizations,
  fetchLicenses,
  fetchFrequencies,
  fetchDatasetBadges,
  fetchGranularities,
  suggestFormats,
  suggestTags,
  suggestSpatialZones,
} from '@/services/api';
import PageLoader from "@/components/common/PageLoader";
import { Organization, License, Frequency, Granularity } from '@/types/api';

interface FilterOption {
  id: string;
  name: string;
}

export const DatasetsFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [organizations, setOrganizations] = React.useState<Organization[]>([]);
  const [licenses, setLicenses] = React.useState<License[]>([]);
  const [frequencies, setFrequencies] = React.useState<Frequency[]>([]);
  const [badges, setBadges] = React.useState<FilterOption[]>([]);
  const [granularities, setGranularities] = React.useState<Granularity[]>([]);
  const [tagOptions, setTagOptions] = React.useState<FilterOption[]>([]);
  const [formatOptions, setFormatOptions] = React.useState<FilterOption[]>([]);
  const [zoneOptions, setZoneOptions] = React.useState<FilterOption[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQueries, setSearchQueries] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    async function loadFilterData() {
      try {
        const [orgsRes, licensesRes, frequenciesRes, badgesRes, granularitiesRes] =
          await Promise.all([
            fetchOrganizations(1, 100, { sort: "-datasets" }),
            fetchLicenses(),
            fetchFrequencies(),
            fetchDatasetBadges(),
            fetchGranularities(),
          ]);
        setOrganizations(orgsRes.data);
        setLicenses(licensesRes);
        setFrequencies(frequenciesRes);
        setBadges(
          Object.entries(badgesRes).map(([key, label]) => ({ id: key, name: label }))
        );
        setGranularities(granularitiesRes);
      } catch (error) {
        console.error('Failed to load filter data', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadFilterData();
  }, []);

  const handleTagSearch = React.useCallback(async (query: string) => {
    if (query.length < 2) {
      setTagOptions([]);
      return;
    }
    try {
      const results = await suggestTags(query);
      setTagOptions(results.map((t) => ({ id: t.text, name: t.text })));
    } catch {
      setTagOptions([]);
    }
  }, []);

  const handleFormatSearch = React.useCallback(async (query: string) => {
    if (query.length < 2) {
      setFormatOptions([]);
      return;
    }
    try {
      const results = await suggestFormats(query);
      setFormatOptions(results.map((f) => ({ id: f.text, name: f.text })));
    } catch {
      setFormatOptions([]);
    }
  }, []);

  const handleZoneSearch = React.useCallback(async (query: string) => {
    if (query.length < 2) {
      setZoneOptions([]);
      return;
    }
    try {
      const results = await suggestSpatialZones(query);
      setZoneOptions(results.map((z) => ({ id: z.id, name: z.name })));
    } catch {
      setZoneOptions([]);
    }
  }, []);

  const handleFilterChange = (paramName: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const currentValues = current.getAll(paramName);

    if (currentValues.includes(value)) {
      current.delete(paramName);
      currentValues
        .filter((v) => v !== value)
        .forEach((v) => current.append(paramName, v));
    } else {
      current.append(paramName, value);
    }

    current.set('page', '1');
    const search = current.toString();
    router.replace(`${pathname}${search ? `?${search}` : ''}`, { scroll: false });
  };

  const handleClearFilter = (paramName: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete(paramName);
    current.set('page', '1');
    const search = current.toString();
    router.replace(`${pathname}${search ? `?${search}` : ''}`, { scroll: false });
  };

  const handleSearchChange = (groupName: string, value: string) => {
    setSearchQueries((prev) => ({ ...prev, [groupName]: value }));

    if (groupName === 'Etiquetas') handleTagSearch(value);
    if (groupName === 'Formatos') handleFormatSearch(value);
    if (groupName === 'Cobertura Espacial') handleZoneSearch(value);
  };

  const getActiveValues = (paramName: string) => searchParams.getAll(paramName);

  const filterGroups: {
    name: string;
    param: string;
    data: FilterOption[];
    searchable: boolean;
    suggest?: boolean;
  }[] = [
    {
      name: 'Organização',
      param: 'organization',
      data: organizations.map((o) => ({ id: o.id, name: o.name })),
      searchable: true,
    },
    {
      name: 'Etiquetas',
      param: 'tag',
      data: tagOptions,
      searchable: true,
      suggest: true,
    },
    {
      name: 'Formatos',
      param: 'format',
      data: formatOptions,
      searchable: true,
      suggest: true,
    },
    {
      name: 'Licenças',
      param: 'license',
      data: licenses.map((l) => ({ id: l.id, name: l.title })),
      searchable: true,
    },
    {
      name: 'Frequência',
      param: 'frequency',
      data: frequencies.map((f) => ({ id: f.id, name: f.label })),
      searchable: true,
    },
    {
      name: 'Badges',
      param: 'badge',
      data: badges,
      searchable: true,
    },
    {
      name: 'Granularidade Espacial',
      param: 'granularity',
      data: granularities.map((g) => ({ id: g.id, name: g.name })),
      searchable: true,
    },
    {
      name: 'Cobertura Espacial',
      param: 'geozone',
      data: zoneOptions,
      searchable: true,
      suggest: true,
    },
  ];

  return (
    <div className="h-full">
      <h2 className="font-bold text-xl text-neutral-900 mt-[36px] mb-[64px] pl-[64px]">Filtros</h2>

      <Sidebar variant="filter" className="pl-[64px] font-bold">
        {filterGroups.map((group, index) => {
          const searchQuery = searchQueries[group.name] || '';
          const activeValues = getActiveValues(group.param);
          const activeCount = activeValues.length;

          // For suggest filters, merge selected values (from URL) with search results
          const selectedItems: FilterOption[] = group.suggest
            ? activeValues
                .filter((v) => !group.data.some((d) => d.id === v))
                .map((v) => ({ id: v, name: v }))
            : [];

          const allData = [...selectedItems, ...group.data];

          const filteredData = group.suggest
            ? allData
            : allData.filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              );

          const showSearch = group.searchable;
          const showScroll = filteredData.length > 5;

          return (
            <SidebarItem
              key={index}
              variant="filter"
              item={{
                children: <span className="font-bold">{group.name}</span>,
                hasIcon: true,
                collapsedIconTrailing: 'agora-line-minus-circle',
                collapsedIconHoverTrailing: 'agora-solid-minus-circle',
                expandedIconTrailing: 'agora-line-plus-circle',
                expandedIconHoverTrailing: 'agora-solid-plus-circle',
              }}
              hasPill={activeCount > 0}
              pillValue={activeCount}
            >
              <div>
                {activeCount > 0 && (
                  <button
                    onClick={() => handleClearFilter(group.param)}
                    className="text-xs text-primary-500 hover:text-primary-700 underline mb-4 mt-4 cursor-pointer"
                  >
                    Limpar {group.name.toLowerCase()}
                  </button>
                )}
                {showSearch && (
                  <div className="mb-4 mt-8 relative">
                    <InputSearch
                      label="Pesquisar"
                      hideLabel
                      placeholder={group.suggest ? 'Escreva para pesquisar...' : 'Pesquisar'}
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(group.name, e.target.value)}
                    />
                    <Icon
                      name="agora-solid-search"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-500 w-5 h-5 pointer-events-none"
                      aria-hidden="true"
                    />
                  </div>
                )}
                <div
                  className={`flex flex-col gap-2 ${showScroll ? 'max-h-[225px] overflow-y-auto' : ''}`}
                >
                  {isLoading && !group.suggest ? (
                    <PageLoader />
                  ) : filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <Checkbox
                        key={item.id}
                        label={item.name}
                        className="font-bold"
                        value={item.id}
                        name={group.param}
                        checked={activeValues.includes(item.id)}
                        onChange={() => handleFilterChange(group.param, item.id)}
                      />
                    ))
                  ) : group.suggest && searchQuery.length < 2 ? (
                    activeCount > 0 ? null : (
                      <p className="text-sm text-neutral-500">
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
    </div>
  );
};
