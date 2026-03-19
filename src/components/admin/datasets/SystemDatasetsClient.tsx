"use client";

import { useEffect, useMemo, useState } from "react";
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
  Pill,
  Button,
} from "@ama-pt/agora-design-system";
import { fetchDatasets } from "@/services/api";
import { Dataset } from "@/types/api";
import PublishDropdown from "@/components/admin/PublishDropdown";


type SortOrder = "none" | "ascending" | "descending";
type SortField = "title" | "created_at" | "last_modified" | "resources";

export default function SystemDatasetsClient() {

  const [allDatasets, setAllDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>("last_modified");
  const [sortOrder, setSortOrder] = useState<SortOrder>("descending");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    async function loadDatasets() {
      setIsLoading(true);
      try {
        const response = await fetchDatasets(1, 9999);
        setAllDatasets(response.data || []);
      } catch (error) {
        console.error("Error loading datasets:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadDatasets();
  }, []);

  const filteredDatasets = useMemo(() => {
    let result = allDatasets;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          (d.acronym && d.acronym.toLowerCase().includes(q)) ||
          d.slug.toLowerCase().includes(q)
      );
    }

    if (statusFilter) {
      result = result.filter((d) => {
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
    }

    return result;
  }, [allDatasets, searchQuery, statusFilter]);

  const sortedDatasets = useMemo(() => {
    if (sortOrder === "none") return filteredDatasets;

    return [...filteredDatasets].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "title":
          cmp = (a.title || "").localeCompare(b.title || "");
          break;
        case "created_at":
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "last_modified":
          cmp = new Date(a.last_modified).getTime() - new Date(b.last_modified).getTime();
          break;
        case "resources":
          cmp = (a.resources?.length || 0) - (b.resources?.length || 0);
          break;
      }
      return sortOrder === "descending" ? -cmp : cmp;
    });
  }, [filteredDatasets, sortField, sortOrder]);

  const totalItems = sortedDatasets.length;
  const start = (currentPage - 1) * pageSize;
  const datasets = sortedDatasets.slice(start, start + pageSize);

  const handleSort = (field: SortField) => (newOrder: SortOrder) => {
    setSortField(field);
    setSortOrder(newOrder);
    setCurrentPage(1);
  };

  const getSortOrder = (field: SortField): SortOrder => {
    return sortField === field ? sortOrder : "none";
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Sistema", url: "#" },
            { label: "Conjuntos de dados", url: "/pages/admin/system/datasets" },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">Conjuntos de dados</h1>
        <PublishDropdown />
      </div>

      <p className="text-neutral-700 text-sm mb-[16px]">
        {isLoading ? "A carregar..." : `${totalItems} resultados`}
      </p>

      <div className="flex items-end gap-[16px] mb-[24px]">
        <div className="w-[60%]">
          <InputSearchBar hasVoiceActionButton={false}
            label="Pesquisar"
            placeholder="Pesquise o nome, código ou sigla da entidade"
            aria-label="Pesquisar conjuntos de dados"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
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
            setCurrentPage(1);
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

      {!isLoading && datasets.length > 0 ? (
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
                sortType="string"
                sortOrder={getSortOrder("title")}
                onSortChange={handleSort("title")}
              >
                Título do conjunto de dados
              </TableHeaderCell>
              <TableHeaderCell>Estado</TableHeaderCell>
              <TableHeaderCell
                sortType="date"
                sortOrder={getSortOrder("created_at")}
                onSortChange={handleSort("created_at")}
              >
                Criado em
              </TableHeaderCell>
              <TableHeaderCell
                sortType="date"
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
              <TableHeaderCell>Ações</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datasets.map((dataset) => (
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
                  <Pill variant={dataset.private ? "warning" : "success"}>
                    {dataset.private ? "Rascunho" : "Público"}
                  </Pill>
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
                <TableCell headerLabel="Ações">
                  <div className="flex gap-[8px]">
                    <a href={`/pages/datasets/${dataset.slug}`}>
                      <Icon name="agora-line-eye" className="w-[20px] h-[20px]" />
                    </a>
                    <a href={`/pages/admin/me/datasets/edit?slug=${dataset.slug}`}>
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
              description="Ainda não publicou um conjunto de dados."
              hasAnchor={false}
              extraDescription={
                <div className="mt-24">
                  <Button
                    variant="primary"
                    appearance="outline"
                    onClick={() => window.location.href = '/pages/admin/me/datasets/new'}
                  >
                    Publique no portal
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
