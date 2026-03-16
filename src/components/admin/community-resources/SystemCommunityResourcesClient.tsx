"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
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

interface MockCommunityResource {
  title: string;
  slug: string;
  dataset: string;
  datasetSlug: string;
  status: string;
  format: string;
  createdAt: string;
  modifiedAt: string;
}

const mockResources: MockCommunityResource[] = [
  {
    title: "valeurs-foncieres-2019-2023.parquet",
    slug: "valeurs-foncieres-2019-2023",
    dataset: "Demandes de valeurs foncières",
    datasetSlug: "demandes-valeurs-foncieres",
    status: "Ainda não verificado",
    format: "parquet",
    createdAt: "25 de julho de 2024",
    modifiedAt: "25 de julho de 2024",
  },
  {
    title: "Sirene : Fichier StockEtablissement du 01 Juillet 2024 au format parquet",
    slug: "sirene-stock-etablissement-jul-2024",
    dataset: "Base Sirene des entreprises et de leurs établissements (SIREN, SIRET)",
    datasetSlug: "base-sirene",
    status: "Ainda não verificado",
    format: "parquet",
    createdAt: "17 de julho de 2024",
    modifiedAt: "17 de julho de 2024",
  },
  {
    title: "Sirene : Fichier StockUniteLegale du 01 Juillet 2024 au format parquet",
    slug: "sirene-stock-unite-legale-jul-2024",
    dataset: "Base Sirene des entreprises et de leurs établissements (SIREN, SIRET)",
    datasetSlug: "base-sirene",
    status: "Ainda não verificado",
    format: "parquet",
    createdAt: "17 de julho de 2024",
    modifiedAt: "17 de julho de 2024",
  },
  {
    title: "Sirene : Fichier StockUniteLegale du 01 Decembre 2023 au format parquet",
    slug: "sirene-stock-unite-legale-dec-2023",
    dataset: "Base Sirene des entreprises et de leurs établissements (SIREN, SIRET)",
    datasetSlug: "base-sirene",
    status: "Ainda não verificado",
    format: "parquet",
    createdAt: "14 de dezembro de 2023",
    modifiedAt: "15 de dezembro de 2023",
  },
  {
    title: "Sirene : Fichier StockEtablissement du 01 Decembre 2023 au format parquet",
    slug: "sirene-stock-etablissement-dec-2023",
    dataset: "Base Sirene des entreprises et de leurs établissements (SIREN, SIRET)",
    datasetSlug: "base-sirene",
    status: "Ainda não verificado",
    format: "parquet",
    createdAt: "14 de dezembro de 2023",
    modifiedAt: "15 de dezembro de 2023",
  },
  {
    title: "listagem-de-projetos-prr-por-distribuicao-geografica-20230615.xlsx",
    slug: "listagem-projetos-prr-geo",
    dataset: "de",
    datasetSlug: "de",
    status: "Ainda não verificado",
    format: "xlsx",
    createdAt: "16 de junho de 2023",
    modifiedAt: "16 de junho de 2023",
  },
  {
    title: "prr-listagem-de-contratualizacao-20230615.xlsx",
    slug: "prr-listagem-contratualizacao",
    dataset: "de",
    datasetSlug: "de",
    status: "Ainda não verificado",
    format: "xlsx",
    createdAt: "16 de junho de 2023",
    modifiedAt: "16 de junho de 2023",
  },
  {
    title: "listagem-de-entidades-prr-20230615.xlsx",
    slug: "listagem-entidades-prr",
    dataset: "de",
    datasetSlug: "de",
    status: "Ainda não verificado",
    format: "xlsx",
    createdAt: "16 de junho de 2023",
    modifiedAt: "16 de junho de 2023",
  },
  {
    title: "listagem-de-contratos-do-prr-20230615.xlsx",
    slug: "listagem-contratos-prr",
    dataset: "de",
    datasetSlug: "de",
    status: "Ainda não verificado",
    format: "xlsx",
    createdAt: "16 de junho de 2023",
    modifiedAt: "16 de junho de 2023",
  },
];

export default function SystemCommunityResourcesClient() {
  const router = useRouter();
  const [showPublishDropdown, setShowPublishDropdown] = useState(false);
  const publishDropdownWrapperRef = useRef<HTMLDivElement>(null);
  const resources = mockResources;

  const publishRoutes: Record<string, string> = {
    dataset: "/pages/admin/me/datasets/new",
    reuse: "/pages/admin/me/reuses/new",
    harvester: "/pages/admin/harvesters/new",
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
            {
              label: "Recursos comunitários",
              url: "/pages/admin/system/community-resources",
            },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">Recursos comunitários</h1>
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
        {resources.length} resultados
      </p>

      <div className="flex items-center gap-[16px] mb-[24px]">
        <div className="flex-1">
          <InputSearchBar
            label="Pesquisar"
            placeholder="Pesquise o título do recurso"
            aria-label="Pesquisar recursos comunitários"
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

      <Table
        paginationProps={{
          itemsPerPageLabel: "Linhas por página",
          itemsPerPage: 10,
          totalItems: resources.length,
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
              Título do recurso
            </TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Formatar</TableHeaderCell>
            <TableHeaderCell sortType="date" sortOrder="none">
              Criado em
            </TableHeaderCell>
            <TableHeaderCell sortType="date" sortOrder="none">
              Modificado em
            </TableHeaderCell>
            <TableHeaderCell>Ação</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource, index) => (
            <TableRow key={index}>
              <TableCell headerLabel="Título do recurso">
                <div>
                  <a href="#" className="text-primary-600 underline">
                    {resource.title}
                  </a>
                  <div className="text-sm text-neutral-500 flex items-center gap-[4px]">
                    <Icon name="agora-line-link" className="w-[14px] h-[14px]" />
                    {resource.dataset}
                  </div>
                </div>
              </TableCell>
              <TableCell headerLabel="Status">
                <Pill variant="warning">{resource.status}</Pill>
              </TableCell>
              <TableCell headerLabel="Formatar">
                <a href="#" className="text-primary-600 underline">
                  {resource.format}
                </a>
              </TableCell>
              <TableCell headerLabel="Criado em">{resource.createdAt}</TableCell>
              <TableCell headerLabel="Modificado em">
                {resource.modifiedAt}
              </TableCell>
              <TableCell headerLabel="Ação">
                <a href="#">
                  <Icon name="agora-line-edit" className="w-[20px] h-[20px]" />
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
