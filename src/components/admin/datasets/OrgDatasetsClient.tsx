"use client";

import { useEffect, useState, useMemo } from "react";
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
import { fetchOrgDatasets } from "@/services/api";
import { Dataset } from "@/types/api";
import { useActiveOrganization } from "@/hooks/useActiveOrganization";
import PublishDropdown from "@/components/admin/PublishDropdown";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

export default function OrgDatasetsClient() {
  const { activeOrg, isLoading: isOrgLoading } = useActiveOrganization();

  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (!activeOrg) {
      setIsLoading(false);
      return;
    }
    async function loadDatasets() {
      setIsLoading(true);
      try {
        const response = await fetchOrgDatasets(activeOrg!.id, 1, 9999);
        setDatasets(response.data || []);
      } catch (error) {
        console.error("Error loading org datasets:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadDatasets();
  }, [activeOrg]);

  const totalPages = Math.ceil(datasets.length / itemsPerPage);

  const paginatedDatasets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return datasets.slice(start, start + itemsPerPage);
  }, [datasets, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  if (isOrgLoading) return <p>A carregar...</p>;
  if (!activeOrg) {
    return (
      <div className="admin-page">
        <CardNoResults
          className="datasets-page__empty"
          position="center"
          icon={
            <Icon name="agora-line-edit" className="w-12 h-12 text-primary-500 icon-xl" />
          }
          title="Sem publicações"
          description="Não pertence a nenhuma organização."
          hasAnchor={false}
        />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Organização", url: "#" },
            { label: "Conjuntos de dados", url: "/pages/admin/org/datasets" },
          ]}
        />
      </div>

      <div className="admin-page__header">
        <h1 className="admin-page__title">Conjuntos de dados</h1>
        <PublishDropdown />
      </div>

      <p className="text-neutral-700 text-sm mb-[16px]">
        {datasets.length} resultados
      </p>

      <div className="flex items-end gap-[16px] mb-[24px]">
        <div className="flex-1">
          <InputSearchBar hasVoiceActionButton={false}
            label="Pesquisar"
            placeholder="Pesquise o nome, código ou sigla da entidade"
            aria-label="Pesquisar conjuntos de dados"
          />
        </div>
        <InputSelect
          label=""
          hideLabel
          placeholder="Filtrar por estado"
          id="filter-status"
        >
          <DropdownSection name="status">
            <DropdownOption value="public">Público</DropdownOption>
            <DropdownOption value="archived">Arquivo</DropdownOption>
            <DropdownOption value="draft">Rascunho</DropdownOption>
            <DropdownOption value="deleted">Excluído</DropdownOption>
          </DropdownSection>
        </InputSelect>
        <a href={`/api/1/organizations/${activeOrg.id}/catalog`} download>
          <Button
            variant="primary"
            appearance="outline"
            hasIcon
            leadingIcon="agora-line-download"
            leadingIconHover="agora-solid-download"
          >
            Catálogo
          </Button>
        </a>
      </div>

      {isLoading ? (
        <p>A carregar...</p>
      ) : datasets.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell sortType="string" sortOrder="descending">
                  Título do conjunto de dados
                </TableHeaderCell>
                <TableHeaderCell>Estado</TableHeaderCell>
                <TableHeaderCell sortType="date" sortOrder="none">
                  Criado em
                </TableHeaderCell>
                <TableHeaderCell sortType="date" sortOrder="none">
                  Modificado em
                </TableHeaderCell>
                <TableHeaderCell>Ações</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDatasets.map((dataset, index) => (
                <TableRow key={index}>
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
                  <TableCell headerLabel="Modificado em">
                    {formatDate(dataset.last_modified)}
                    <br />
                    <span className="text-sm text-neutral-500">
                      sobre{" "}
                      <span className="text-success-600">●</span>{" "}
                      {dataset.organization?.name ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell headerLabel="Ações">
                    <div className="flex gap-[8px]">
                      <a href={`/pages/datasets/${dataset.slug}`}>
                        <Icon name="agora-line-eye" className="w-[20px] h-[20px]" />
                      </a>
                      <a href={`/pages/admin/org/datasets/edit?slug=${dataset.slug}`}>
                        <Icon name="agora-line-edit" className="w-[20px] h-[20px]" />
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-[16px] py-[12px] border-t border-neutral-200">
            <div className="flex items-center gap-[8px]">
              <span className="text-sm text-neutral-600">Linhas por página</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                className="border border-neutral-300 rounded px-[8px] py-[4px] text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-[8px]">
              <span className="text-sm text-neutral-600">
                {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, datasets.length)} de {datasets.length}
              </span>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-[4px] text-primary-600 disabled:text-neutral-300"
                aria-label="Página anterior"
              >
                <Icon name="agora-line-arrow-left" className="w-[20px] h-[20px]" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-[4px] text-primary-600 disabled:text-neutral-300"
                aria-label="Próxima página"
              >
                <Icon name="agora-line-arrow-right" className="w-[20px] h-[20px]" />
              </button>
            </div>
          </div>
        </>
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
              description="A organização ainda não publicou conjuntos de dados."
              hasAnchor={false}
              extraDescription={
                <div className="mt-24">
                  <Button
                    variant="primary"
                    appearance="outline"
                    onClick={() => window.location.href = '/pages/admin/org/datasets/new'}
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
