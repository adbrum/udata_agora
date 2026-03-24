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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const totalPages = Math.ceil(harvesters.length / itemsPerPage);
  const paginatedHarvesters = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return harvesters.slice(start, start + itemsPerPage);
  }, [harvesters, currentPage, itemsPerPage]);

  if (isOrgLoading) return <p>A carregar...</p>;
  if (!activeOrg) {
    return (
      <div className="admin-page">
        <CardNoResults
          className="datasets-page__empty"
          position="center"
          icon={
            <Icon name="agora-line-buildings" className="w-12 h-12 text-primary-500 icon-xl" />
          }
          title="Sem organizações"
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
            { label: "Harvesters", url: "/pages/admin/org/harvesters" },
          ]}
        />
      </div>

      <div className="admin-page__header">
        <h1 className="admin-page__title">Harvesters</h1>
        <PublishDropdown />
      </div>

      <p className="text-neutral-700 text-sm mb-[16px]">
        {harvesters.length} resultados
      </p>

      <div className="flex items-end gap-[16px] mb-[24px]">
        <div className="admin-search-wrapper">
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
        <>
          <Table>
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
              {paginatedHarvesters.map((harvester, index) => (
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

          <div className="flex items-center justify-between mt-[16px] py-[12px] border-t border-neutral-200">
            <div className="flex items-center gap-[8px]">
              <span className="text-sm text-neutral-600">Linhas por página</span>
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="border border-neutral-300 rounded px-[8px] py-[4px] text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-[8px]">
              <span className="text-sm text-neutral-600">
                {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, harvesters.length)} de {harvesters.length}
              </span>
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-[4px] text-primary-600 disabled:text-neutral-300" aria-label="Página anterior">
                <Icon name="agora-line-arrow-left" className="w-[20px] h-[20px]" />
              </button>
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-[4px] text-primary-600 disabled:text-neutral-300" aria-label="Próxima página">
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
                <Icon name="agora-line-buildings" className="w-12 h-12 text-primary-500 icon-xl" />
              }
              title="Sem harvesters"
              description="A organização ainda não tem harvesters."
              hasAnchor={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
