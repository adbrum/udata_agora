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

interface MockApi {
  title: string;
  slug: string;
  status: "Público" | "Rascunho" | "Excluído";
  access: string;
  createdAt: string;
  lastActivity: string;
  lastActivityBy: string;
  rateLimit: string;
  availability: string;
}

const today = new Date();
const formatDate = (date: Date) =>
  `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;

const mockApis: MockApi[] = [
  {
    title: "API de dados geográficos nacionais",
    slug: "api-dados-geograficos",
    status: "Público",
    access: "Abrir",
    createdAt: formatDate(new Date(2025, 9, 10)),
    lastActivity: formatDate(new Date(2026, 1, 15)),
    lastActivityBy: "Lopes Inês",
    rateLimit: "100/min",
    availability: "99,9%",
  },
  {
    title: "API de transportes públicos",
    slug: "api-transportes-publicos",
    status: "Rascunho",
    access: "Abrir",
    createdAt: formatDate(today),
    lastActivity: formatDate(today),
    lastActivityBy: "Lopes Inês",
    rateLimit: "",
    availability: "",
  },
  {
    title: "API de estatísticas de emprego",
    slug: "api-estatisticas-emprego",
    status: "Rascunho",
    access: "Restrito",
    createdAt: formatDate(today),
    lastActivity: formatDate(today),
    lastActivityBy: "Lopes Inês",
    rateLimit: "50/min",
    availability: "98%",
  },
];

export default function DataservicesClient() {
  const router = useRouter();
  const [showPublishDropdown, setShowPublishDropdown] = useState(false);
  const publishDropdownWrapperRef = useRef<HTMLDivElement>(null);
  const apis = mockApis;

  const publishRoutes: Record<string, string> = {
    dataset: "/pages/admin/me/datasets/new",
    reuse: "/pages/admin/me/reuses/new",
    harvester: "/pages/admin/me/datasets/new",
    organization: "/pages/admin/me/datasets/new",
  };

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Lopes Inês", url: "#" },
            { label: "API", url: "/pages/admin/me/dataservices" },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">API</h1>
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
            optionsVisible={4}
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
              <DropdownOption value="organization">Uma organização</DropdownOption>
            </DropdownSection>
          </Dropdown>
        </div>
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

      {apis.length > 0 ? (
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
              <TableHeaderCell>Acesso</TableHeaderCell>
              <TableHeaderCell sortType="date" sortOrder="none">
                Criado em
              </TableHeaderCell>
              <TableHeaderCell sortType="date" sortOrder="none">
                Modificado em
              </TableHeaderCell>
              <TableHeaderCell>Limite de chamadas</TableHeaderCell>
              <TableHeaderCell>Disponibilidade</TableHeaderCell>
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
                  <Pill
                    variant={
                      api.status === "Público"
                        ? "success"
                        : api.status === "Excluído"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {api.status}
                  </Pill>
                </TableCell>
                <TableCell headerLabel="Acesso">
                  <Pill variant="informative">{api.access}</Pill>
                </TableCell>
                <TableCell headerLabel="Criado em">{api.createdAt}</TableCell>
                <TableCell headerLabel="Modificado em">
                  {api.lastActivity}
                  <br />
                  <span className="text-sm text-neutral-500">
                    sobre{" "}
                    <span className="text-success-600">●</span>{" "}
                    {api.lastActivityBy}
                  </span>
                </TableCell>
                <TableCell headerLabel="Limite de chamadas">
                  {api.rateLimit || "—"}
                </TableCell>
                <TableCell headerLabel="Disponibilidade">
                  {api.availability || "—"}
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
