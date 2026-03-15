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
  ProgressBar,
} from "@ama-pt/agora-design-system";

interface MockDataset {
  title: string;
  slug: string;
  status: "Público" | "Rascunho";
  createdAt: string;
  lastActivity: string;
  lastActivityBy: string;
  files: number;
  score: number;
}

const today = new Date();
const formatDate = (date: Date) =>
  `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;

const mockDatasets: MockDataset[] = [
  {
    title: "Estatísticas de acidentes rodoviários em Portugal",
    slug: "estatisticas-acidentes-rodoviarios",
    status: "Público",
    createdAt: formatDate(new Date(2025, 10, 3)),
    lastActivity: formatDate(new Date(2026, 1, 20)),
    lastActivityBy: "Lopes Inês",
    files: 3,
    score: 75,
  },
  {
    title: "Indicadores de qualidade do ar nas cidades portuguesas",
    slug: "indicadores-qualidade-ar",
    status: "Público",
    createdAt: formatDate(new Date(2025, 8, 15)),
    lastActivity: formatDate(new Date(2026, 0, 10)),
    lastActivityBy: "Lopes Inês",
    files: 2,
    score: 60,
  },
  {
    title: "Registo de entidades do setor público",
    slug: "registo-entidades-setor-publico",
    status: "Rascunho",
    createdAt: formatDate(today),
    lastActivity: formatDate(today),
    lastActivityBy: "Lopes Inês",
    files: 1,
    score: 30,
  },
];

export default function SystemDatasetsClient() {
  const router = useRouter();
  const [showPublishDropdown, setShowPublishDropdown] = useState(false);
  const publishDropdownWrapperRef = useRef<HTMLDivElement>(null);
  const datasets = mockDatasets;

  const publishRoutes: Record<string, string> = {
    dataset: "/pages/admin/me/datasets/new",
    reuse: "/pages/admin/me/reuses/new",
    harvester: "/pages/admin/me/datasets/new",
    api: "/pages/admin/dataservices/new",
    article: "/pages/admin/system/posts/new",
    organization: "/pages/admin/organizations/new",
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
        {datasets.length} resultados
      </p>

      <div className="flex items-center gap-[16px] mb-[24px]">
        <div className="flex-1">
          <InputSearchBar
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
      </div>

      {datasets.length > 0 ? (
        <Table
          paginationProps={{
            itemsPerPageLabel: "Itens por página",
            itemsPerPage: 10,
            totalItems: datasets.length,
            availablePageSizes: [5, 10, 20],
            currentPage: 1,
            buttonDropdownAriaLabel: "Selecionar itens por página",
            dropdownListAriaLabel: "Opções de itens por página",
            prevButtonAriaLabel: "Página anterior",
            nextButtonAriaLabel: "Próxima página",
          }}
        >
          <TableHeader>
            <TableRow>
              <TableHeaderCell sortType="string" sortOrder="descending">
                Título do conjunto de dados
              </TableHeaderCell>
              <TableHeaderCell>Estado</TableHeaderCell>
              <TableHeaderCell sortType="string" sortOrder="none">
                Criado em
              </TableHeaderCell>
              <TableHeaderCell sortType="string" sortOrder="none">
                Última atividade
              </TableHeaderCell>
              <TableHeaderCell>Ficheiros</TableHeaderCell>
              <TableHeaderCell>Pontuação</TableHeaderCell>
              <TableHeaderCell>Ações</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datasets.map((dataset, index) => (
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
                  <Pill variant={dataset.status === "Público" ? "success" : "warning"}>
                    {dataset.status}
                  </Pill>
                </TableCell>
                <TableCell headerLabel="Criado em">{dataset.createdAt}</TableCell>
                <TableCell headerLabel="Última atividade">
                  {dataset.lastActivity}
                  <br />
                  <span className="text-sm text-neutral-500">
                    sobre{" "}
                    <span className="text-success-600">●</span>{" "}
                    {dataset.lastActivityBy}
                  </span>
                </TableCell>
                <TableCell headerLabel="Ficheiros">{dataset.files}</TableCell>
                <TableCell headerLabel="Pontuação">
                  <ProgressBar
                    value={dataset.score}
                    aria-label={`Pontuação: ${dataset.score}%`}
                  />
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
                <Icon name="agora-line-file" className="datasets-page__empty-icon" />
              }
              description="Você ainda não publicou um conjunto de dados."
              hasAnchor
              valueAnchor="Publicar em dados.gov"
              anchorHref="/pages/admin/me/datasets/new"
              anchorTarget="_self"
            />
          </div>
        </div>
      )}
    </div>
  );
}
