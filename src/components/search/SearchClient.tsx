"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Icon,
  Toggle,
  Pill,
  InputSearchBar,
  CardNoResults,
} from "@ama-pt/agora-design-system";

import PageBanner from "@/components/PageBanner";
import { Pagination } from "@/components/Pagination";
import {
  searchDatasets,
  searchOrganizations,
  searchReuses,
  searchDataservices,
} from "@/services/api";
import { Dataset, Organization, Reuse, Dataservice } from "@/types/api";

type SearchType = "datasets" | "dataservices" | "reuses" | "organizations";

const TYPES: {
  type: SearchType;
  label: string;
  icon: string | ((active: boolean) => string);
  iconHover: string;
}[] = [
  {
    type: "datasets",
    label: "Conjunto de dados",
    icon: "agora-line-layers-menu",
    iconHover: "agora-solid-layers-menu",
  },
  {
    type: "dataservices",
    label: "APIs",
    icon: (active: boolean) =>
      active ? "/Icons/reduce_white.svg" : "/Icons/reduce.svg",
    iconHover: "/Icons/reduce_white.svg",
  },
  {
    type: "reuses",
    label: "Reutilizações",
    icon: (active: boolean) =>
      active ? "/Icons/bar_char_white.svg" : "/Icons/bar_chart.svg",
    iconHover: "/Icons/bar_char_white.svg",
  },
  {
    type: "organizations",
    label: "Organizações",
    icon: "agora-line-buildings",
    iconHover: "agora-solid-buildings",
  },
];

const PAGE_SIZE = 10;

export default function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const tabParam = searchParams.get("type") as SearchType | null;
  const pageParam = Number(searchParams.get("page")) || 1;

  const [activeTab, setActiveTab] = useState<SearchType>(
    tabParam || "datasets"
  );
  const [searchInput, setSearchInput] = useState(query);

  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [reuses, setReuses] = useState<Reuse[]>([]);
  const [dataservices, setDataservices] = useState<Dataservice[]>([]);

  const [totals, setTotals] = useState({
    datasets: 0,
    dataservices: 0,
    organizations: 0,
    reuses: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(pageParam);

  useEffect(() => {
    if (tabParam && TYPES.some((t) => t.type === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    setCurrentPage(pageParam);
  }, [pageParam]);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    if (!query) return;
    async function fetchTotals() {
      const [dsRes, orgRes, reuseRes, dsvcRes] = await Promise.all([
        searchDatasets(query, 1, 1),
        searchOrganizations(query, 1, 1),
        searchReuses(query, 1, 1),
        searchDataservices(query, 1, 1),
      ]);
      setTotals({
        datasets: dsRes.total,
        dataservices: dsvcRes.total,
        organizations: orgRes.total,
        reuses: reuseRes.total,
      });
    }
    fetchTotals();
  }, [query]);

  useEffect(() => {
    if (!query) return;
    async function fetchResults() {
      setIsLoading(true);
      try {
        if (activeTab === "datasets") {
          const res = await searchDatasets(query, currentPage, PAGE_SIZE);
          setDatasets(res.data || []);
        } else if (activeTab === "dataservices") {
          const res = await searchDataservices(query, currentPage, PAGE_SIZE);
          setDataservices(res.data || []);
        } else if (activeTab === "organizations") {
          const res = await searchOrganizations(query, currentPage, PAGE_SIZE);
          setOrganizations(res.data || []);
        } else if (activeTab === "reuses") {
          const res = await searchReuses(query, currentPage, PAGE_SIZE);
          setReuses(res.data || []);
        }
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchResults();
  }, [query, activeTab, currentPage]);

  const buildUrl = useCallback(
    (params: { type?: string; page?: number; q?: string }) => {
      const t = params.type || activeTab;
      const p = params.page || 1;
      const q = params.q ?? query;
      return `/pages/search?q=${encodeURIComponent(q)}&type=${t}&page=${p}`;
    },
    [query, activeTab]
  );

  const handleTabChange = (tab: SearchType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    router.push(buildUrl({ type: tab, page: 1 }));
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      router.push(buildUrl({ q: searchInput.trim(), page: 1 }));
    }
  };

  const totalForActiveTab = totals[activeTab];

  const titleMap: Record<SearchType, string> = {
    datasets: "Conjuntos de dados",
    dataservices: "APIs",
    reuses: "Reutilizações",
    organizations: "Organizações",
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-neutral-900 bg-neutral-50 filters">
      <main className="flex-grow bg-primary-50">
        <PageBanner
          title={titleMap[activeTab]}
          backgroundImageUrl="/Banner/hero-bg.png"
          backgroundPosition="center right"
          breadcrumbItems={[
            { label: "Home", url: "/" },
            { label: "Pesquisa", url: "/pages/search" },
          ]}
        >
          <InputSearchBar
            label="Pesquisa avançada"
            placeholder="Pesquisar datasets, organizações, reutilizações..."
            id="search-page-input"
            hasVoiceActionButton={true}
            voiceActionAltText="Pesquisar por voz"
            searchActionAltText="Pesquisar"
            darkMode={true}
            value={searchInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchInput(e.target.value)
            }
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === "Enter") handleSearch();
            }}
            onSearchActivate={() => handleSearch()}
          />
        </PageBanner>

        <div className="container mx-auto md:gap-32 xl:gap-64 bg-white">
          <div className="grid md:grid-cols-3 xl:grid-cols-12 grid-filters">
            {/* Sidebar */}
            <div className="xl:col-span-4 xl:block p-32 pl-0">
              <div className="mb-64 pr-32 max-w-[592px] flex flex-col gap-16 mt-[32px]">
                <h2 className="font-bold text-xl text-neutral-900 mb-16">Tipo</h2>
                {TYPES.map((item) => {
                  const isActive = item.type === activeTab;
                  const icon =
                    typeof item.icon === "function"
                      ? item.icon(isActive)
                      : item.icon;
                  const className =
                    item.type === "reuses" || item.type === "dataservices"
                      ? "w-full agora-toggle agora-toggle-icon agora-toggle-icon-primary full-width has-icon"
                      : "w-full";
                  return (
                    <Toggle
                      key={item.type}
                      id={`search-type-${item.type}`}
                      name="search-type-toggle"
                      value={item.type}
                      appearance="icon"
                      variant="primary"
                      hasIcon
                      leadingIcon={icon}
                      leadingIconHover={item.iconHover}
                      checked={isActive}
                      onChange={() => handleTabChange(item.type)}
                      iconOnly={false}
                      fullWidth={true}
                      className={className}
                    >
                      <div className="flex items-center gap-12 font-bold text-sm">
                        <span
                          className={
                            isActive
                              ? "text-primary-600 font-bold"
                              : "text-neutral-900 font-bold"
                          }
                        >
                          {item.label}
                        </span>
                        <Pill
                          variant="neutral"
                          appearance="outline"
                          circular={false}
                          className="text-xs font-medium text-neutral-500 ml-16"
                        >
                          {totals[item.type].toLocaleString("pt-PT")}
                        </Pill>
                      </div>
                    </Toggle>
                  );
                })}
              </div>
            </div>

            {/* Main Content */}
            <div className="xl:col-span-8 p-32 pr-0">
              <div className="flex items-center justify-between mb-24">
                <p className="text-m-bold text-neutral-900">
                  {totalForActiveTab} Resultado
                  {totalForActiveTab !== 1 ? "s" : ""}
                </p>
              </div>

              {!isLoading && (
                <>
                  {activeTab === "datasets" && (
                    <div className="flex flex-col gap-0">
                      {datasets.length > 0 ? (
                        datasets.map((dataset) => (
                          <Link
                            key={dataset.id}
                            href={`/pages/datasets/${dataset.slug}`}
                            className="block p-20 border border-neutral-200 -mt-px first:rounded-t-8 last:rounded-b-8 hover:border-primary-600 hover:z-10 hover:shadow-sm transition-all relative"
                          >
                            <h3 className="text-m-bold text-primary-700">
                              {dataset.title}
                            </h3>
                            {dataset.organization && (
                              <p className="text-s-regular text-neutral-500 mt-4">
                                {dataset.organization.name}
                                {dataset.last_modified && (
                                  <span className="ml-8">
                                    — Atualizado a{" "}
                                    {new Date(
                                      dataset.last_modified
                                    ).toLocaleDateString("pt-PT")}
                                  </span>
                                )}
                              </p>
                            )}
                            <p className="text-s-regular text-neutral-700 mt-8 line-clamp-2">
                              {dataset.description}
                            </p>
                            {dataset.tags?.length > 0 && (
                              <div className="flex flex-wrap gap-8 mt-8">
                                {dataset.tags.slice(0, 5).map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs px-8 py-2 bg-neutral-100 text-neutral-600 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </Link>
                        ))
                      ) : (
                        <CardNoResults
                          position="center"
                          icon={
                            <Icon name="agora-line-search" className="w-48 h-48 text-neutral-400" />
                          }
                          title={`Nenhum resultado encontrado para "${query}"`}
                          description="Tente pesquisar com termos diferentes."
                        />
                      )}
                    </div>
                  )}

                  {activeTab === "dataservices" && (
                    <div className="flex flex-col gap-0">
                      {dataservices.length > 0 ? (
                        dataservices.map((ds) => (
                          <Link
                            key={ds.id}
                            href={`/pages/dataservices/${ds.id}`}
                            className="block p-20 border border-neutral-200 -mt-px first:rounded-t-8 last:rounded-b-8 hover:border-primary-600 hover:z-10 hover:shadow-sm transition-all relative"
                          >
                            <h3 className="text-m-bold text-primary-700">
                              {ds.title}
                            </h3>
                            {ds.organization && (
                              <p className="text-s-regular text-neutral-500 mt-4">
                                {ds.organization.name}
                              </p>
                            )}
                            <p className="text-s-regular text-neutral-700 mt-8 line-clamp-2">
                              {ds.description}
                            </p>
                          </Link>
                        ))
                      ) : (
                        <CardNoResults
                          position="center"
                          icon={
                            <Icon name="agora-line-search" className="w-48 h-48 text-neutral-400" />
                          }
                          title={`Nenhum resultado encontrado para "${query}"`}
                          description="Tente pesquisar com termos diferentes."
                        />
                      )}
                    </div>
                  )}

                  {activeTab === "organizations" && (
                    <div className="flex flex-col gap-0">
                      {organizations.length > 0 ? (
                        organizations.map((org) => (
                          <Link
                            key={org.id}
                            href={`/pages/organizations/${org.slug}`}
                            className="flex items-center gap-20 p-20 border border-neutral-200 -mt-px first:rounded-t-8 last:rounded-b-8 hover:border-primary-600 hover:z-10 hover:shadow-sm transition-all relative"
                          >
                            {org.logo ? (
                              <img
                                src={org.logo}
                                alt={org.name}
                                className="w-48 h-48 object-contain rounded-4 shrink-0"
                              />
                            ) : (
                              <div className="w-48 h-48 bg-neutral-100 rounded-4 flex items-center justify-center shrink-0">
                                <Icon
                                  name="agora-line-buildings"
                                  className="w-20 h-20 text-neutral-400"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="text-m-bold text-primary-700">
                                {org.name}
                              </h3>
                              {org.description && (
                                <p className="text-s-regular text-neutral-700 mt-4 line-clamp-2">
                                  {org.description}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))
                      ) : (
                        <CardNoResults
                          position="center"
                          icon={
                            <Icon name="agora-line-search" className="w-48 h-48 text-neutral-400" />
                          }
                          title={`Nenhum resultado encontrado para "${query}"`}
                          description="Tente pesquisar com termos diferentes."
                        />
                      )}
                    </div>
                  )}

                  {activeTab === "reuses" && (
                    <div className="flex flex-col gap-0">
                      {reuses.length > 0 ? (
                        reuses.map((reuse) => (
                          <Link
                            key={reuse.id}
                            href={`/pages/reuses/${reuse.slug}`}
                            className="flex items-center gap-20 p-20 border border-neutral-200 -mt-px first:rounded-t-8 last:rounded-b-8 hover:border-primary-600 hover:z-10 hover:shadow-sm transition-all relative"
                          >
                            {reuse.image_thumbnail || reuse.image ? (
                              <img
                                src={reuse.image_thumbnail || reuse.image || ""}
                                alt={reuse.title}
                                className="w-48 h-48 object-cover rounded-4 shrink-0"
                              />
                            ) : (
                              <div className="w-48 h-48 bg-neutral-100 rounded-4 flex items-center justify-center shrink-0">
                                <Icon
                                  name="agora-line-bar-chart"
                                  className="w-20 h-20 text-neutral-400"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="text-m-bold text-primary-700">
                                {reuse.title}
                              </h3>
                              {reuse.organization && (
                                <p className="text-s-regular text-neutral-500 mt-4">
                                  {reuse.organization.name}
                                </p>
                              )}
                              <p className="text-s-regular text-neutral-700 mt-4 line-clamp-2">
                                {reuse.description}
                              </p>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <CardNoResults
                          position="center"
                          icon={
                            <Icon name="agora-line-search" className="w-48 h-48 text-neutral-400" />
                          }
                          title={`Nenhum resultado encontrado para "${query}"`}
                          description="Tente pesquisar com termos diferentes."
                        />
                      )}
                    </div>
                  )}

                  {totalForActiveTab > PAGE_SIZE && (
                    <div className="mt-32">
                      <Pagination
                        currentPage={currentPage}
                        totalItems={totalForActiveTab}
                        pageSize={PAGE_SIZE}
                        baseUrl={`/pages/search?q=${encodeURIComponent(query)}&type=${activeTab}`}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {!query && (
        <div className="container mx-auto text-center py-48 text-neutral-500">
          <p className="text-m-regular">
            Introduza um termo para pesquisar no portal.
          </p>
        </div>
      )}
    </div>
  );
}
