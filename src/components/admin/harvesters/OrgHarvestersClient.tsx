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
import { fetchOrgHarvesters } from "@/services/api";
import { HarvestSource } from "@/types/api";
import { useActiveOrganization } from "@/hooks/useActiveOrganization";
import PublishDropdown from "@/components/admin/PublishDropdown";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

const getStatusLabel = (source: HarvestSource) => {
  const job = source.last_job;
  if (!job) return "Sem execução";
  if (job.status === "done") return "Terminado";
  if (job.status === "failed") return "Falhado";
  if (job.status === "started") return "Em execução";
  return job.status;
};

const getStatusVariant = (source: HarvestSource) => {
  const job = source.last_job;
  if (!job) return "informative" as const;
  if (job.status === "done") return "success" as const;
  if (job.status === "failed") return "danger" as const;
  return "warning" as const;
};

export default function OrgHarvestersClient() {
  const { activeOrg, isLoading: isOrgLoading } = useActiveOrganization();

  const [harvesters, setHarvesters] = useState<HarvestSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!activeOrg) {
      setIsLoading(false);
      return;
    }
    async function loadHarvesters() {
      setIsLoading(true);
      try {
        const response = await fetchOrgHarvesters(activeOrg!.id, 1, 9999);
        setHarvesters(response.data || []);
      } catch (error) {
        console.error("Error loading org harvesters:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadHarvesters();
  }, [activeOrg]);

  if (isOrgLoading) return <p>A carregar...</p>;
  if (!activeOrg) {
    return (
      <div className="datasets-admin-page">
        <CardNoResults
          className="datasets-page__empty"
          position="center"
          icon={
            <Icon name="agora-line-buildings" className="datasets-page__empty-icon" />
          }
          description="Não pertence a nenhuma organização."
        />
      </div>
    );
  }

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Organização", url: "#" },
            { label: "Harvesters", url: "/pages/admin/org/harvesters" },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">Harvesters</h1>
        <PublishDropdown />
      </div>

      <p className="text-neutral-700 text-sm mb-[16px]">
        {harvesters.length} resultados
      </p>

      <div className="flex items-end gap-[16px] mb-[24px]">
        <div className="w-[60%]">
          <InputSearchBar hasVoiceActionButton={false}
            label="Pesquisar"
            placeholder="Pesquise o nome do harvester"
            aria-label="Pesquisar harvesters"
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

      {isLoading ? (
        <p>A carregar...</p>
      ) : harvesters.length > 0 ? (
        <Table
          paginationProps={{
            itemsPerPageLabel: "Linhas por página",
            itemsPerPage: 10,
            totalItems: harvesters.length,
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
                Nome
              </TableHeaderCell>
              <TableHeaderCell>Estatuto</TableHeaderCell>
              <TableHeaderCell>Implementação</TableHeaderCell>
              <TableHeaderCell sortType="date" sortOrder="none">
                Criado em
              </TableHeaderCell>
              <TableHeaderCell sortType="date" sortOrder="none">
                Última execução
              </TableHeaderCell>
              <TableHeaderCell>Ações</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {harvesters.map((harvester, index) => (
              <TableRow key={index}>
                <TableCell headerLabel="Nome">
                  <a
                    href={`/pages/admin/org/harvesters/${harvester.id}`}
                    className="text-primary-600 underline"
                  >
                    {harvester.name}
                  </a>
                </TableCell>
                <TableCell headerLabel="Estatuto">
                  <Pill variant={getStatusVariant(harvester)}>
                    {getStatusLabel(harvester)}
                  </Pill>
                </TableCell>
                <TableCell headerLabel="Implementação">
                  {harvester.backend}
                </TableCell>
                <TableCell headerLabel="Criado em">
                  {formatDate(harvester.created_at)}
                </TableCell>
                <TableCell headerLabel="Última execução">
                  {harvester.last_job
                    ? formatDate(harvester.last_job.started ?? harvester.last_job.ended ?? "")
                    : "Ainda não"}
                </TableCell>
                <TableCell headerLabel="Ações">
                  <div className="flex gap-[8px]">
                    <a href={`/pages/admin/org/harvesters/${harvester.id}`}>
                      <Icon name="agora-line-eye" className="w-[20px] h-[20px]" />
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
                <Icon name="agora-line-document" className="datasets-page__empty-icon" />
              }
              description="A organização ainda não tem harvesters."
              hasAnchor
              valueAnchor="Criar harvester"
              anchorHref="/pages/admin/harvesters/new"
              anchorTarget="_self"
            />
          </div>
        </div>
      )}
    </div>
  );
}
