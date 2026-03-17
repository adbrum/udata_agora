"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
  CardNoResults,
  Dropdown,
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

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

const getStatusLabel = (source: HarvestSource) => {
  const job = source.last_job;
  if (!job) return "Sem execução";
  if (job.status === "done") return "Terminado";
  if (job.status === "failed") return "Falhado";
  if (job.status === "running") return "Em execução";
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
  const router = useRouter();
  const { activeOrg, isLoading: isOrgLoading } = useActiveOrganization();
  const [showPublishDropdown, setShowPublishDropdown] = useState(false);
  const publishDropdownWrapperRef = useRef<HTMLDivElement>(null);

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

  const publishRoutes: Record<string, string> = {
    dataset: "/pages/admin/me/datasets/new",
    reuse: "/pages/admin/me/reuses/new",
    harvester: "/pages/admin/harvesters/new",
    api: "/pages/admin/dataservices/new",
    article: "/pages/admin/system/posts/new",
    organization: "/pages/admin/organizations/new",
  };

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
            { label: "Minha organização", url: "#" },
            { label: "Harvesters", url: "/pages/admin/org/harvesters" },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">Harvesters</h1>
        <div
          className="relative inline-block publish-dropdown-wrapper"
          ref={publishDropdownWrapperRef}
        >
          <Button
            variant="primary"
            hasIcon={true}
            trailingIcon={
              showPublishDropdown ? "agora-line-chevron-up" : "agora-line-chevron-down"
            }
            trailingIconHover={
              showPublishDropdown ? "agora-solid-chevron-up" : "agora-solid-chevron-down"
            }
            className="px-24 py-16 rounded-8 h-auto relative z-10"
            onClick={() => setShowPublishDropdown((v) => !v)}
          >
            <span className="text-lg font-medium">
              Publicar <span className="font-bold">dados.gov</span>
            </span>
          </Button>
          <Dropdown
            type="text"
            showDropdown={showPublishDropdown}
            onHide={() => setShowPublishDropdown(false)}
            hideSectionNames={true}
            optionsVisible={6}
            onChange={(options) => {
              if (options.length > 0) {
                const route = publishRoutes[options[0].value as string];
                if (route) router.push(route);
              }
            }}
            style={{
              width: "max-content",
              minWidth: "100%",
            }}
          >
            <DropdownSection name="publish" label="">
              <DropdownOption value="dataset">Um conjunto de dados</DropdownOption>
              <DropdownOption value="reuse">Uma reutilização</DropdownOption>
              <DropdownOption value="harvester">Um harvester</DropdownOption>
              <DropdownOption value="api">Uma API</DropdownOption>
              <DropdownOption value="article">Um artigo</DropdownOption>
              <DropdownOption value="organization">Uma organização</DropdownOption>
            </DropdownSection>
          </Dropdown>
        </div>
      </div>

      <p className="text-neutral-700 text-sm mb-[16px]">
        {harvesters.length} resultados
      </p>

      <div className="flex items-center gap-[16px] mb-[24px]">
        <div className="flex-1">
          <InputSearchBar
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
                    ? formatDate(harvester.last_job.created)
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
