"use client";

import { useEffect, useState } from "react";
import {
  Breadcrumb,
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
import PublishDropdown from "@/components/admin/PublishDropdown";
import { fetchHarvesters } from "@/services/api";
import type { HarvestSource } from "@/types/api";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const VALIDATION_STATUS: Record<
  string,
  { label: string; variant: "success" | "warning" | "danger" | "informative" }
> = {
  pending: { label: "Em espera de validação", variant: "warning" },
  accepted: { label: "Validado", variant: "success" },
  refused: { label: "Recusado", variant: "danger" },
};

const JOB_STATUS: Record<
  string,
  { label: string; variant: "success" | "warning" | "danger" | "informative" }
> = {
  pending: { label: "Pendente", variant: "informative" },
  initializing: { label: "A inicializar", variant: "informative" },
  initialized: { label: "Inicializado", variant: "informative" },
  processing: { label: "Em processamento", variant: "informative" },
  done: { label: "Terminado", variant: "success" },
  "done-errors": { label: "Terminado com erros", variant: "warning" },
  failed: { label: "Falhado", variant: "danger" },
};

function getStatus(source: HarvestSource) {
  if (source.validation?.state && source.validation.state !== "accepted") {
    return VALIDATION_STATUS[source.validation.state] || VALIDATION_STATUS.pending;
  }
  if (source.last_job?.status) {
    return JOB_STATUS[source.last_job.status] || { label: "Sem tarefa de momento", variant: "informative" as const };
  }
  return { label: "Sem tarefa de momento", variant: "informative" as const };
}

export default function SystemHarvestersClient() {
  const [harvesters, setHarvesters] = useState<HarvestSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchHarvesters(1, 50);
        setHarvesters(res.data || []);
      } catch (error) {
        console.error("Error loading harvesters:", error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Sistema", url: "#" },
            { label: "Harvesters", url: "/pages/admin/system/harvesters" },
          ]}
        />
      </div>

      <div className="admin-page__header">
        <h1 className="admin-page__title">Harvesters</h1>
        <PublishDropdown />
      </div>

      <p className="text-neutral-700 text-sm mb-[16px]">
        {isLoading ? "A carregar..." : `${harvesters.length} resultados`}
      </p>

      <div className="flex items-end gap-[16px] mb-[24px]">
        <div className="admin-search-wrapper">
          <InputSearchBar
            hasVoiceActionButton={false}
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
            <DropdownOption value="pending">Em espera de validação</DropdownOption>
            <DropdownOption value="accepted">Validado</DropdownOption>
            <DropdownOption value="refused">Recusado</DropdownOption>
          </DropdownSection>
        </InputSelect>
      </div>

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
            <TableHeaderCell sortType="numeric" sortOrder="none">
              Items
            </TableHeaderCell>
            <TableHeaderCell>Ações</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {harvesters.map((harvester) => {
            const status = getStatus(harvester);
            return (
              <TableRow key={harvester.id}>
                <TableCell headerLabel="Nome">
                  <a
                    href={`/pages/admin/harvesters/${harvester.id}`}
                    className="text-primary-600 underline"
                  >
                    {harvester.name}
                  </a>
                </TableCell>
                <TableCell headerLabel="Estatuto">
                  <Pill variant={status.variant}>{status.label}</Pill>
                </TableCell>
                <TableCell headerLabel="Implementação">
                  {harvester.backend}
                </TableCell>
                <TableCell headerLabel="Criado em">
                  {format(new Date(harvester.created_at), "d 'de' MMMM 'de' yyyy", {
                    locale: pt,
                  })}
                </TableCell>
                <TableCell headerLabel="Última execução">
                  {harvester.last_job?.ended
                    ? format(new Date(harvester.last_job.ended), "d 'de' MMMM 'de' yyyy", {
                        locale: pt,
                      })
                    : "Ainda não"}
                </TableCell>
                <TableCell headerLabel="Items">
                  {harvester.last_job?.items?.length || 0}
                </TableCell>
                <TableCell headerLabel="Ações">
                  <div className="flex gap-[8px]">
                    <a href={`/pages/admin/harvesters/${harvester.id}`}>
                      <Icon name="agora-line-eye" className="w-[20px] h-[20px]" />
                    </a>
                    <a href={`/pages/admin/harvesters/${harvester.id}`}>
                      <Icon name="agora-line-edit" className="w-[20px] h-[20px]" />
                    </a>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
