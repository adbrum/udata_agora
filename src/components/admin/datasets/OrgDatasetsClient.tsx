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
import PublishDropdown from "@/components/admin/PublishDropdown";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

interface OrgDatasetsClientProps {
  orgId: string;
}

export default function OrgDatasetsClient({ orgId }: OrgDatasetsClientProps) {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function loadDatasets() {
      setIsLoading(true);
      try {
        const response = await fetchOrgDatasets(orgId, 1, 9999);
        setDatasets(response.data || []);
      } catch (error) {
        console.error("Error loading org datasets:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadDatasets();
  }, [orgId]);

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
        <a href={`/api/1/organizations/${orgId}/catalog`} download>
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
          <Table
            paginationProps={{
              itemsPerPageLabel: "Itens por página",
              itemsPerPage: itemsPerPage,
              totalItems: datasets.length,
              availablePageSizes: [10, 20, 50],
              currentPage: currentPage,
              buttonDropdownAriaLabel: "Selecionar itens por página",
              dropdownListAriaLabel: "Opções de itens por página",
              prevButtonAriaLabel: "Página anterior",
              nextButtonAriaLabel: "Próxima página",
              onPageChange: (page: number) => handlePageChange(page),
              onPageSizeChange: (size: number) => handleItemsPerPageChange(String(size)),
            }}
          >
            <TableHeader>
              <TableRow>
                <TableHeaderCell sortType="string" sortOrder="none">
                  Título do conjunto de dados
                </TableHeaderCell>
                <TableHeaderCell sortType="string" sortOrder="none">
                  Estado
                </TableHeaderCell>
                <TableHeaderCell sortType="date" sortOrder="none">
                  Criado em
                </TableHeaderCell>
                <TableHeaderCell sortType="date" sortOrder="none">
                  Última modificação
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
                  <TableCell headerLabel="Última modificação">
                    <div>
                      <div>{formatDate(dataset.last_modified)}</div>
                      {dataset.owner ? (
                        <a
                          href={`/pages/users/${dataset.owner.slug}`}
                          className="text-primary-600 text-xs underline"
                        >
                          {dataset.owner.first_name} {dataset.owner.last_name}
                        </a>
                      ) : dataset.organization ? (
                        <a
                          href={`/pages/organizations/${dataset.organization.slug}`}
                          className="text-primary-600 text-xs underline"
                        >
                          {dataset.organization.name}
                        </a>
                      ) : null}
                    </div>
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
