"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Breadcrumb,
  CardNoResults,
  Icon,
  InputSelect,
  InputSearchBar,
  DropdownSection,
  DropdownOption,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Button,
  ProgressBar,
} from "@ama-pt/agora-design-system";
import StatusDot from "@/components/admin/StatusDot";
import { fetchAdminDatasets, fetchDatasets } from "@/services/api";
import { Dataset } from "@/types/api";
import PublishDropdown from "@/components/admin/PublishDropdown";


type SortOrder = "none" | "ascending" | "descending";
type SortField = "title" | "created_at" | "last_modified" | "resources";

const QUALITY_CRITERIA: [keyof NonNullable<Dataset["quality"]>, string][] = [
  ["dataset_description_quality", "Descrição"],
  ["has_resources", "Recursos"],
  ["license", "Licença"],
  ["has_open_format", "Formato aberto"],
  ["all_resources_available", "Recursos disponíveis"],
  ["resources_documentation", "Documentação"],
  ["update_frequency", "Frequência de atualização"],
  ["temporal_coverage", "Cobertura temporal"],
  ["spatial", "Cobertura espacial"],
];

function calculateQualityScore(quality?: Dataset["quality"]): number {
  if (!quality) return 0;
  if (quality.score > 0) return Math.round(quality.score * 100);
  const met = QUALITY_CRITERIA.filter(([key]) => quality[key] === true).length;
  return Math.round((met / QUALITY_CRITERIA.length) * 100);
}

const SORT_FIELD_MAP: Record<SortField, string | null> = {
  title: "title",
  created_at: "created",
  last_modified: "last_update",
  resources: null,
};

export default function SystemDatasetsClient() {

  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadDatasets = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiSort = sortField ? SORT_FIELD_MAP[sortField] : null;
      const sortParam =
        sortOrder === "none" || !apiSort
          ? undefined
          : `${sortOrder === "descending" ? "-" : ""}${apiSort}`;

      const filters = {
        q: searchQuery.trim() || undefined,
        sort: sortParam,
      };

      // Try authenticated request first (returns all datasets for sysadmin),
      // fall back to public request if auth fails
      let response = await fetchAdminDatasets(currentPage, pageSize, filters);
      if (response.total === 0 && !searchQuery.trim()) {
        response = await fetchDatasets(currentPage, pageSize, filters);
      }
      setDatasets(response.data || []);
      setTotalItems(response.total || 0);
    } catch (error) {
      console.error("Error loading datasets:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, sortField, sortOrder]);

  useEffect(() => {
    loadDatasets();
  }, [loadDatasets]);

  const handleSearch = (value: string) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 400);
  };

  const handleSort = (field: SortField) => (newOrder: SortOrder) => {
    setSortField(newOrder === "none" ? null : field);
    setSortOrder(newOrder);
    setCurrentPage(1);
  };

  const getSortOrder = (field: SortField): SortOrder => {
    return sortField === field ? sortOrder : "none";
  };

  const filteredDatasets = useMemo(() => {
    if (!statusFilter) return datasets;
    return datasets.filter((d) => {
      switch (statusFilter) {
        case "public":
          return !d.private && !d.archived && !d.deleted;
        case "draft":
          return !!d.private;
        case "archived":
          return !!d.archived;
        case "deleted":
          return !!d.deleted;
        default:
          return true;
      }
    });
  }, [datasets, statusFilter]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Sistema", url: "#" },
            { label: "Conjuntos de dados", url: "/pages/admin/system/datasets" },
          ]}
        />
      </div>

      <div className="admin-page__header">
        <h1 className="admin-page__title">Conjuntos de dados</h1>
        <PublishDropdown />
      </div>

      <p className="text-neutral-700 text-sm mb-[16px]">
        {isLoading ? "A carregar..." : `${totalItems} resultados`}
      </p>

      <div className="flex items-end gap-[16px] mb-[24px]">
        <div className="admin-search-wrapper">
          <InputSearchBar hasVoiceActionButton={false}
            label="Pesquisar"
            placeholder="Pesquise o nome, código ou sigla da entidade"
            aria-label="Pesquisar conjuntos de dados"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleSearch(e.target.value);
            }}
          />
        </div>
        <InputSelect
          label=""
          hideLabel
          placeholder="Filtrar por estado"
          id="filter-status"
          onChange={(options) => {
            setStatusFilter(options.length > 0 ? (options[0].value as string) : "");
          }}
        >
          <DropdownSection name="status">
            <DropdownOption value="public">Público</DropdownOption>
            <DropdownOption value="archived">Arquivo</DropdownOption>
            <DropdownOption value="draft">Rascunho</DropdownOption>
            <DropdownOption value="deleted">Excluído</DropdownOption>
          </DropdownSection>
        </InputSelect>
      </div>

      {!isLoading && filteredDatasets.length > 0 ? (
        <Table
          paginationProps={{
            itemsPerPageLabel: "Itens por página",
            itemsPerPage: pageSize,
            totalItems: totalItems,
            availablePageSizes: [5, 10, 20],
            currentPage: currentPage,
            buttonDropdownAriaLabel: "Selecionar itens por página",
            dropdownListAriaLabel: "Opções de itens por página",
            prevButtonAriaLabel: "Página anterior",
            nextButtonAriaLabel: "Próxima página",
            onPageChange: (page: number) => setCurrentPage(page),
            onPageSizeChange: (size: number) => {
              setPageSize(size);
              setCurrentPage(1);
            },
          }}
        >
          <TableHeader>
            <TableRow>
              <TableHeaderCell
                sortType="numeric"
                sortOrder={getSortOrder("title")}
                onSortChange={handleSort("title")}
              >
                Título do conjunto de dados
              </TableHeaderCell>
              <TableHeaderCell>Estado</TableHeaderCell>
              <TableHeaderCell
                sortType="numeric"
                sortOrder={getSortOrder("created_at")}
                onSortChange={handleSort("created_at")}
              >
                Criado em
              </TableHeaderCell>
              <TableHeaderCell
                sortType="numeric"
                sortOrder={getSortOrder("last_modified")}
                onSortChange={handleSort("last_modified")}
              >
                Última modificação
              </TableHeaderCell>
              <TableHeaderCell
                sortType="numeric"
                sortOrder={getSortOrder("resources")}
                onSortChange={handleSort("resources")}
              >
                Ficheiros
              </TableHeaderCell>
              <TableHeaderCell>Pontuação</TableHeaderCell>
              <TableHeaderCell>Ações</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDatasets.map((dataset) => (
              <TableRow key={dataset.id}>
                <TableCell headerLabel="Título">
                  <a
                    href={`/pages/datasets/${dataset.slug}`}
                    className="text-primary-600 underline"
                  >
                    {dataset.title}
                  </a>
                </TableCell>
                <TableCell headerLabel="Estado">
                  <StatusDot variant={dataset.private ? "warning" : "success"}>
                    {dataset.private ? "Rascunho" : "Público"}
                  </StatusDot>
                </TableCell>
                <TableCell headerLabel="Criado em">
                  {formatDate(dataset.created_at)}
                </TableCell>
                <TableCell headerLabel="Última modificação">
                  {formatDate(dataset.last_modified)}
                </TableCell>
                <TableCell headerLabel="Ficheiros">
                  {dataset.resources?.length || 0}
                </TableCell>
                <TableCell headerLabel="Pontuação">
                  <div
                    className={
                      calculateQualityScore(dataset.quality) <= 45
                        ? "quality-progress-warning"
                        : calculateQualityScore(dataset.quality) > 50
                          ? "quality-progress-success"
                          : ""
                    }
                  >
                    <ProgressBar
                      value={calculateQualityScore(dataset.quality)}
                      max={100}
                      hidePercentageValue={true}
                    />
                  </div>
                  <span className="text-xs text-neutral-700">
                    {calculateQualityScore(dataset.quality)}%
                  </span>
                </TableCell>
                <TableCell headerLabel="Ações">
                  <div className="flex gap-[8px]">
                    <a href={`/pages/datasets/${dataset.slug}`}>
                      <Icon name="agora-line-eye" className="w-[20px] h-[20px]" />
                    </a>
                    <a href={`/pages/admin/datasets/${dataset.id}`}>
                      <Icon name="agora-line-edit" className="w-[20px] h-[20px]" />
                    </a>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="datasets-page__body">
          <div className="datasets-page__content">
            <CardNoResults
              className="datasets-page__empty"
              position="center"
              icon={
                <Icon name="agora-line-edit" className="w-12 h-12 text-primary-500 icon-xl" />
              }
              title="Sem publicações"
              description="Nenhum conjunto de dados encontrado."
              hasAnchor={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
