"use client";

import { useEffect, useState } from "react";
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
} from "@ama-pt/agora-design-system";
import { fetchMyDataservices } from "@/services/api";
import { Dataservice } from "@/types/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import PublishDropdown from "@/components/admin/PublishDropdown";


const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

export default function DataservicesClient() {
  const { displayName } = useCurrentUser();

  const [apis, setApis] = useState<Dataservice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDataservices() {
      setIsLoading(true);
      try {
        const response = await fetchMyDataservices(1, 9999);
        setApis(response.data || []);
      } catch (error) {
        console.error("Error loading dataservices:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadDataservices();
  }, []);

  const getStatusLabel = (api: Dataservice) => {
    if (api.private) return "Rascunho";
    return "Público";
  };

  const getStatusVariant = (api: Dataservice) => {
    if (api.private) return "warning" as const;
    return "success" as const;
  };

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: displayName || "...", url: "#" },
            { label: "API", url: "/pages/admin/me/dataservices" },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">API</h1>
        <PublishDropdown />
      </div>

      <p className="text-neutral-700 text-sm mb-[16px]">
        {apis.length} resultados
      </p>

      <div className="flex items-center gap-[16px] mb-[24px]">
        <div className="flex-1">
          <InputSearchBar
            label="Pesquisar"
            placeholder="Pesquise o nome da API"
            aria-label="Pesquisar APIs"
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
      </div>

      {!isLoading && apis.length > 0 ? (
        <Table
          paginationProps={{
            itemsPerPageLabel: "Linhas por página",
            itemsPerPage: 5,
            totalItems: apis.length,
            availablePageSizes: [5, 10, 20],
            currentPage: 1,
            buttonDropdownAriaLabel: "Selecionar linhas por página",
            dropdownListAriaLabel: "Opções de linhas por página",
            prevButtonAriaLabel: "Página anterior",
            nextButtonAriaLabel: "Próxima página",
          }}
        >
          <TableHeader>
            <TableRow>
              <TableHeaderCell sortType="string" sortOrder="descending">
                Título da API
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
            {apis.map((api, index) => (
              <TableRow key={index}>
                <TableCell headerLabel="Título">
                  <a
                    href={`/pages/dataservices/${api.slug}`}
                    className="text-primary-600 underline"
                  >
                    {api.title}
                  </a>
                </TableCell>
                <TableCell headerLabel="Estado">
                  <Pill variant={getStatusVariant(api)}>
                    {getStatusLabel(api)}
                  </Pill>
                </TableCell>
                <TableCell headerLabel="Criado em">
                  {formatDate(api.created_at)}
                </TableCell>
                <TableCell headerLabel="Modificado em">
                  {formatDate(api.last_modified)}
                  <br />
                  <span className="text-sm text-neutral-500">
                    sobre{" "}
                    <span className="text-success-600">●</span>{" "}
                    {api.owner
                      ? `${api.owner.first_name} ${api.owner.last_name}`
                      : "—"}
                  </span>
                </TableCell>
                <TableCell headerLabel="Ações">
                  <div className="flex gap-[8px]">
                    <a href={`/pages/dataservices/${api.slug}`}>
                      <Icon name="agora-line-eye" className="w-[20px] h-[20px]" />
                    </a>
                    <a href={`/pages/admin/dataservices/edit?slug=${api.slug}`}>
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
                <Icon name="agora-line-file" className="datasets-page__empty-icon" />
              }
              description="Você ainda não publicou uma API."
              hasAnchor
              valueAnchor="Publicar em dados.gov"
              anchorHref="/pages/admin/dataservices/new"
              anchorTarget="_self"
            />
          </div>
        </div>
      )}
    </div>
  );
}
