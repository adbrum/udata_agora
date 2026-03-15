"use client";

import { useRef, useState } from "react";
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

interface MockReuse {
  title: string;
  slug: string;
  status: "Público" | "Rascunho";
  type: string;
  createdAt: string;
  lastActivity: string;
  lastActivityBy: string;
  datasets: number;
}

const today = new Date();
const formatDate = (date: Date) =>
  `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;

const mockReuses: MockReuse[] = [
  {
    title: "Mapa interativo de qualidade do ar",
    slug: "mapa-qualidade-ar",
    status: "Público",
    type: "Visualização",
    createdAt: formatDate(new Date(2025, 7, 20)),
    lastActivity: formatDate(new Date(2026, 0, 5)),
    lastActivityBy: "Lopes Inês",
    datasets: 2,
  },
  {
    title: "Dashboard de indicadores de mobilidade urbana",
    slug: "dashboard-mobilidade-urbana",
    status: "Público",
    type: "Aplicação",
    createdAt: formatDate(new Date(2025, 10, 12)),
    lastActivity: formatDate(new Date(2026, 1, 28)),
    lastActivityBy: "Lopes Inês",
    datasets: 3,
  },
  {
    title: "Análise de dados de acidentes rodoviários",
    slug: "analise-acidentes-rodoviarios",
    status: "Rascunho",
    type: "Visualização",
    createdAt: formatDate(today),
    lastActivity: formatDate(today),
    lastActivityBy: "Lopes Inês",
    datasets: 1,
  },
];

export default function SystemReusesClient() {
  const router = useRouter();
  const [showPublishDropdown, setShowPublishDropdown] = useState(false);
  const publishDropdownWrapperRef = useRef<HTMLDivElement>(null);
  const reuses = mockReuses;

  const publishRoutes: Record<string, string> = {
    dataset: "/pages/admin/me/datasets/new",
    reuse: "/pages/admin/me/reuses/new",
    harvester: "/pages/admin/me/datasets/new",
    api: "/pages/admin/dataservices/new",
    organization: "/pages/admin/me/datasets/new",
  };

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Sistema", url: "#" },
            { label: "Reutilizações", url: "/pages/admin/system/reuses" },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">Reutilizações</h1>
        <div
          className="relative inline-block publish-dropdown-wrapper"
          ref={publishDropdownWrapperRef}
        >
          <Button
            variant="primary"
            hasIcon={true}
            trailingIcon={
              showPublishDropdown ? "agora-line-arrow-up" : "agora-line-arrow-down"
            }
            trailingIconHover={
              showPublishDropdown ? "agora-solid-arrow-up" : "agora-solid-arrow-down"
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
            optionsVisible={5}
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
              <DropdownOption value="organization">Uma organização</DropdownOption>
            </DropdownSection>
          </Dropdown>
        </div>
      </div>

      <p className="text-neutral-700 text-sm mb-[16px]">
        {reuses.length} resultados
      </p>

      <div className="flex items-center gap-[16px] mb-[24px]">
        <div className="flex-1">
          <InputSearchBar
            label="Pesquisar"
            placeholder="Pesquise o nome da reutilização"
            aria-label="Pesquisar reutilizações"
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

      {reuses.length > 0 ? (
        <Table
          paginationProps={{
            itemsPerPageLabel: "Linhas por página",
            itemsPerPage: 5,
            totalItems: reuses.length,
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
                Título da reutilização
              </TableHeaderCell>
              <TableHeaderCell>Estado</TableHeaderCell>
              <TableHeaderCell sortType="date" sortOrder="none">
                Criado em
              </TableHeaderCell>
              <TableHeaderCell sortType="numeric" sortOrder="descending">
                Conjuntos de dados
              </TableHeaderCell>
              <TableHeaderCell>Ações</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reuses.map((reuse, index) => (
              <TableRow key={index}>
                <TableCell headerLabel="Título">
                  <a
                    href={`/pages/reuses/${reuse.slug}`}
                    className="text-primary-600 underline"
                  >
                    {reuse.title}
                  </a>
                </TableCell>
                <TableCell headerLabel="Estado">
                  <Pill variant={reuse.status === "Público" ? "success" : "warning"}>
                    {reuse.status}
                  </Pill>
                </TableCell>
                <TableCell headerLabel="Criado em">
                  {reuse.createdAt}
                  <br />
                  <span className="text-sm text-neutral-500">
                    sobre{" "}
                    <span className="text-success-600">●</span>{" "}
                    {reuse.lastActivityBy}
                  </span>
                </TableCell>
                <TableCell headerLabel="Conjuntos de dados">
                  {reuse.datasets}
                </TableCell>
                <TableCell headerLabel="Ações">
                  <div className="flex gap-[8px]">
                    <a href={`/pages/reuses/${reuse.slug}`}>
                      <Icon name="agora-line-eye" className="w-[20px] h-[20px]" />
                    </a>
                    <a href={`/pages/admin/me/reuses/edit?slug=${reuse.slug}`}>
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
              description="Você ainda não publicou uma reutilização."
              hasAnchor
              valueAnchor="Publicar em dados.gov"
              anchorHref="/pages/admin/me/reuses/new"
              anchorTarget="_self"
            />
          </div>
        </div>
      )}
    </div>
  );
}
