"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Breadcrumb,
  Button,
  Icon,
  Tabs,
  Tab,
  TabHeader,
  TabBody,
} from "@ama-pt/agora-design-system";
import {
  fetchHomeFeaturedDatasets,
  updateHomeFeaturedDatasets,
  fetchHomeFeaturedReuses,
  updateHomeFeaturedReuses,
  suggestDatasets,
  suggestReuses,
} from "@/services/api";
import type { Dataset, Reuse, DatasetSuggestion, ReuseSuggestion } from "@/types/api";

interface FeaturedListProps<T extends { id: string; title: string }> {
  items: T[];
  onRemove: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  getSubtitle?: (item: T) => string;
}

function FeaturedList<T extends { id: string; title: string }>({
  items,
  onRemove,
  onMoveUp,
  onMoveDown,
  getSubtitle,
}: FeaturedListProps<T>) {
  if (items.length === 0) {
    return (
      <p className="text-neutral-600 text-sm py-[16px]">
        Nenhum item destacado. Use a pesquisa acima para adicionar.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-[8px]">
      {items.map((item, index) => (
        <li
          key={item.id}
          className="flex items-center gap-[12px] p-[12px] bg-neutral-50 rounded-[8px] border border-neutral-200"
        >
          <span className="text-neutral-400 text-sm font-medium w-[24px] text-center">
            {index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-800 truncate">{item.title}</p>
            {getSubtitle && (
              <p className="text-xs text-neutral-500 truncate">{getSubtitle(item)}</p>
            )}
          </div>
          <div className="flex items-center gap-[4px]">
            <button
              type="button"
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="p-[4px] rounded hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Mover para cima"
            >
              <Icon name="agora-line-arrow-up" className="w-[16px] h-[16px]" />
            </button>
            <button
              type="button"
              onClick={() => onMoveDown(index)}
              disabled={index === items.length - 1}
              className="p-[4px] rounded hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Mover para baixo"
            >
              <Icon name="agora-line-arrow-down" className="w-[16px] h-[16px]" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="p-[4px] rounded hover:bg-red-100 text-red-600"
              title="Remover"
            >
              <Icon name="agora-line-trash" className="w-[16px] h-[16px]" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

interface AutocompleteProps<S extends { id: string; title: string }> {
  placeholder: string;
  onSearch: (query: string) => Promise<S[]>;
  onSelect: (item: S) => void;
  excludeIds: Set<string>;
}

function Autocomplete<S extends { id: string; title: string }>({
  placeholder,
  onSearch,
  onSelect,
  excludeIds,
}: AutocompleteProps<S>) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<S[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (value.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setIsSearching(true);
        try {
          const suggestions = await onSearch(value);
          const filtered = suggestions.filter((s) => !excludeIds.has(s.id));
          setResults(filtered);
          setIsOpen(filtered.length > 0);
        } catch {
          setResults([]);
          setIsOpen(false);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    },
    [onSearch, excludeIds]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-[8px] border border-neutral-300 rounded-[8px] px-[12px] py-[8px] bg-white focus-within:border-primary-500">
        <Icon name="agora-line-search" className="w-[16px] h-[16px] text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="flex-1 text-sm outline-none bg-transparent"
        />
        {isSearching && (
          <span className="text-xs text-neutral-400">A pesquisar...</span>
        )}
      </div>
      {isOpen && results.length > 0 && (
        <ul className="absolute z-10 w-full mt-[4px] bg-white border border-neutral-200 rounded-[8px] shadow-lg max-h-[240px] overflow-y-auto">
          {results.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="w-full text-left px-[12px] py-[8px] text-sm hover:bg-primary-50 transition-colors"
                onClick={() => {
                  onSelect(item);
                  setQuery("");
                  setResults([]);
                  setIsOpen(false);
                }}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SystemEditorialClient() {
  const [featuredDatasets, setFeaturedDatasets] = useState<Dataset[]>([]);
  const [featuredReuses, setFeaturedReuses] = useState<Reuse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingDatasets, setIsSavingDatasets] = useState(false);
  const [isSavingReuses, setIsSavingReuses] = useState(false);
  const [datasetsChanged, setDatasetsChanged] = useState(false);
  const [reusesChanged, setReusesChanged] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function loadFeatured() {
      setIsLoading(true);
      try {
        const [datasets, reuses] = await Promise.all([
          fetchHomeFeaturedDatasets(),
          fetchHomeFeaturedReuses(),
        ]);
        setFeaturedDatasets(datasets);
        setFeaturedReuses(reuses);
      } catch (error) {
        console.error("Error loading featured content:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadFeatured();
  }, []);

  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => setSaveMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  // Dataset handlers
  const handleAddDataset = (suggestion: DatasetSuggestion) => {
    const newDataset: Dataset = {
      id: suggestion.id,
      title: suggestion.title,
      slug: suggestion.slug,
      acronym: suggestion.acronym,
      description: "",
      organization: null,
      owner: null,
      license: null,
      frequency: "",
      private: false,
      featured: true,
      last_modified: "",
      created_at: "",
      tags: [],
      resources: [],
      badges: [],
      metrics: {},
      uri: "",
      page: suggestion.page,
    };
    setFeaturedDatasets((prev) => [...prev, newDataset]);
    setDatasetsChanged(true);
  };

  const handleRemoveDataset = (id: string) => {
    setFeaturedDatasets((prev) => prev.filter((d) => d.id !== id));
    setDatasetsChanged(true);
  };

  const handleMoveDatasetUp = (index: number) => {
    if (index === 0) return;
    setFeaturedDatasets((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
    setDatasetsChanged(true);
  };

  const handleMoveDatasetDown = (index: number) => {
    setFeaturedDatasets((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
    setDatasetsChanged(true);
  };

  const handleSaveDatasets = async () => {
    setIsSavingDatasets(true);
    try {
      const ids = featuredDatasets.map((d) => d.id);
      const updated = await updateHomeFeaturedDatasets(ids);
      setFeaturedDatasets(updated);
      setDatasetsChanged(false);
      setSaveMessage({ type: "success", text: "Conjuntos de dados destacados atualizados." });
    } catch (error) {
      console.error("Error saving featured datasets:", error);
      setSaveMessage({ type: "error", text: "Erro ao guardar conjuntos de dados destacados." });
    } finally {
      setIsSavingDatasets(false);
    }
  };

  // Reuse handlers
  const handleAddReuse = (suggestion: ReuseSuggestion) => {
    const newReuse: Reuse = {
      id: suggestion.id,
      title: suggestion.title,
      slug: suggestion.slug,
      description: "",
      type: "",
      url: "",
      image: suggestion.image_url,
      image_thumbnail: null,
      organization: null,
      owner: null,
      private: false,
      featured: true,
      archived: null,
      topic: null,
      created_at: "",
      last_modified: "",
      metrics: {},
      tags: [],
      badges: [],
      datasets: [],
      dataservices: [],
    };
    setFeaturedReuses((prev) => [...prev, newReuse]);
    setReusesChanged(true);
  };

  const handleRemoveReuse = (id: string) => {
    setFeaturedReuses((prev) => prev.filter((r) => r.id !== id));
    setReusesChanged(true);
  };

  const handleMoveReuseUp = (index: number) => {
    if (index === 0) return;
    setFeaturedReuses((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
    setReusesChanged(true);
  };

  const handleMoveReuseDown = (index: number) => {
    setFeaturedReuses((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
    setReusesChanged(true);
  };

  const handleSaveReuses = async () => {
    setIsSavingReuses(true);
    try {
      const ids = featuredReuses.map((r) => r.id);
      const updated = await updateHomeFeaturedReuses(ids);
      setFeaturedReuses(updated);
      setReusesChanged(false);
      setSaveMessage({ type: "success", text: "Reutilizações destacadas atualizadas." });
    } catch (error) {
      console.error("Error saving featured reuses:", error);
      setSaveMessage({ type: "error", text: "Erro ao guardar reutilizações destacadas." });
    } finally {
      setIsSavingReuses(false);
    }
  };

  const datasetExcludeIds = new Set(featuredDatasets.map((d) => d.id));
  const reuseExcludeIds = new Set(featuredReuses.map((r) => r.id));

  if (isLoading) {
    return (
      <div className="datasets-admin-page">
        <div className="datasets-admin-page__breadcrumb">
          <Breadcrumb
            items={[
              { label: "Administração", url: "/pages/admin" },
              { label: "Editorial", url: "/pages/admin/system/editorial" },
            ]}
          />
        </div>
        <h1 className="datasets-admin-page__title mb-[24px]">Editorial</h1>
        <p className="text-neutral-500">A carregar...</p>
      </div>
    );
  }

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Editorial", url: "/pages/admin/system/editorial" },
          ]}
        />
      </div>

      <h1 className="datasets-admin-page__title mb-[24px]">Editorial</h1>

      {saveMessage && (
        <div
          className={`mb-[16px] p-[12px] rounded-[8px] text-sm ${
            saveMessage.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      <Tabs>
        <Tab active>
          <TabHeader>Conjuntos de dados ({featuredDatasets.length})</TabHeader>
          <TabBody>
            <div className="flex flex-col gap-[16px] py-[16px]">
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-[8px] block">
                  Pesquisar conjuntos de dados para adicionar
                </label>
                <Autocomplete<DatasetSuggestion>
                  placeholder="Pesquisar conjuntos de dados..."
                  onSearch={(q) => suggestDatasets(q, 8)}
                  onSelect={handleAddDataset}
                  excludeIds={datasetExcludeIds}
                />
              </div>

              <FeaturedList<Dataset>
                items={featuredDatasets}
                onRemove={handleRemoveDataset}
                onMoveUp={handleMoveDatasetUp}
                onMoveDown={handleMoveDatasetDown}
                getSubtitle={(d) =>
                  d.organization?.name || d.owner
                    ? `${d.organization?.name || `${d.owner?.first_name} ${d.owner?.last_name}`}`
                    : ""
                }
              />

              <div className="flex justify-end">
                <Button
                  variant="primary"
                  disabled={!datasetsChanged || isSavingDatasets}
                  onClick={handleSaveDatasets}
                >
                  {isSavingDatasets ? "A guardar..." : "Guardar alterações"}
                </Button>
              </div>
            </div>
          </TabBody>
        </Tab>
        <Tab>
          <TabHeader>Reutilizações ({featuredReuses.length})</TabHeader>
          <TabBody>
            <div className="flex flex-col gap-[16px] py-[16px]">
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-[8px] block">
                  Pesquisar reutilizações para adicionar
                </label>
                <Autocomplete<ReuseSuggestion>
                  placeholder="Pesquisar reutilizações..."
                  onSearch={(q) => suggestReuses(q, 8)}
                  onSelect={handleAddReuse}
                  excludeIds={reuseExcludeIds}
                />
              </div>

              <FeaturedList<Reuse>
                items={featuredReuses}
                onRemove={handleRemoveReuse}
                onMoveUp={handleMoveReuseUp}
                onMoveDown={handleMoveReuseDown}
                getSubtitle={(r) =>
                  r.organization?.name || r.owner
                    ? `${r.organization?.name || `${r.owner?.first_name} ${r.owner?.last_name}`}`
                    : ""
                }
              />

              <div className="flex justify-end">
                <Button
                  variant="primary"
                  disabled={!reusesChanged || isSavingReuses}
                  onClick={handleSaveReuses}
                >
                  {isSavingReuses ? "A guardar..." : "Guardar alterações"}
                </Button>
              </div>
            </div>
          </TabBody>
        </Tab>
      </Tabs>
    </div>
  );
}
