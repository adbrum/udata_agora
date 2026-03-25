"use client";

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
} from "@ama-pt/agora-design-system";
import StatusDot from "@/components/admin/StatusDot";
import PublishDropdown from "@/components/admin/PublishDropdown";

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

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
};

const mockResources: MockCommunityResource[] = [
  {
    title: "valeurs-foncieres-2019-2023.parquet",
    slug: "valeurs-foncieres-2019-2023",
    dataset: "Demandes de valeurs foncières",
    datasetSlug: "demandes-valeurs-foncieres",
    status: "Ainda não verificado",
    format: "parquet",
    createdAt: "2024-07-25",
    modifiedAt: "2024-07-25",
  },
  {
    title: "Sirene : Fichier StockEtablissement du 01 Juillet 2024 au format parquet",
    slug: "sirene-stock-etablissement-jul-2024",
    dataset: "Base Sirene des entreprises et de leurs établissements (SIREN, SIRET)",
    datasetSlug: "base-sirene",
    status: "Ainda não verificado",
    format: "parquet",
    createdAt: "2024-07-17",
    modifiedAt: "2024-07-17",
  },
  {
    title: "Sirene : Fichier StockUniteLegale du 01 Juillet 2024 au format parquet",
    slug: "sirene-stock-unite-legale-jul-2024",
    dataset: "Base Sirene des entreprises et de leurs établissements (SIREN, SIRET)",
    datasetSlug: "base-sirene",
    status: "Ainda não verificado",
    format: "parquet",
    createdAt: "2024-07-17",
    modifiedAt: "2024-07-17",
  },
  {
    title: "Sirene : Fichier StockUniteLegale du 01 Decembre 2023 au format parquet",
    slug: "sirene-stock-unite-legale-dec-2023",
    dataset: "Base Sirene des entreprises et de leurs établissements (SIREN, SIRET)",
    datasetSlug: "base-sirene",
    status: "Ainda não verificado",
    format: "parquet",
    createdAt: "2023-12-14",
    modifiedAt: "2023-12-15",
  },
  {
    title: "Sirene : Fichier StockEtablissement du 01 Decembre 2023 au format parquet",
    slug: "sirene-stock-etablissement-dec-2023",
    dataset: "Base Sirene des entreprises et de leurs établissements (SIREN, SIRET)",
    datasetSlug: "base-sirene",
    status: "Ainda não verificado",
    format: "parquet",
    createdAt: "2023-12-14",
    modifiedAt: "2023-12-15",
  },
  {
    title: "listagem-de-projetos-prr-por-distribuicao-geografica-20230615.xlsx",
    slug: "listagem-projetos-prr-geo",
    dataset: "de",
    datasetSlug: "de",
    status: "Ainda não verificado",
    format: "xlsx",
    createdAt: "2023-06-16",
    modifiedAt: "2023-06-16",
  },
  {
    title: "prr-listagem-de-contratualizacao-20230615.xlsx",
    slug: "prr-listagem-contratualizacao",
    dataset: "de",
    datasetSlug: "de",
    status: "Ainda não verificado",
    format: "xlsx",
    createdAt: "2023-06-16",
    modifiedAt: "2023-06-16",
  },
  {
    title: "listagem-de-entidades-prr-20230615.xlsx",
    slug: "listagem-entidades-prr",
    dataset: "de",
    datasetSlug: "de",
    status: "Ainda não verificado",
    format: "xlsx",
    createdAt: "2023-06-16",
    modifiedAt: "2023-06-16",
  },
  {
    title: "listagem-de-contratos-do-prr-20230615.xlsx",
    slug: "listagem-contratos-prr",
    dataset: "de",
    datasetSlug: "de",
    status: "Ainda não verificado",
    format: "xlsx",
    createdAt: "2023-06-16",
    modifiedAt: "2023-06-16",
  },
];

export default function SystemCommunityResourcesClient() {
  const resources = mockResources;

  return (
    <div className="admin-page">
      <div className="admin-page__breadcrumb">
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

      <div className="admin-page__header">
        <h1 className="admin-page__title">Recursos comunitários</h1>
        <PublishDropdown />
      </div>

      <p className="text-neutral-700 text-sm mb-[16px]">
        {resources.length} resultados
      </p>

      <div className="flex items-end gap-[16px] mb-[24px]">
        <div className="admin-search-wrapper">
          <InputSearchBar hasVoiceActionButton={false}
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
            <TableHeaderCell sortType="date" sortOrder="none">
              Título do recurso
            </TableHeaderCell>
            <TableHeaderCell>Estado</TableHeaderCell>
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
                  <div className="text-sm text-neutral-900">
                    {resource.dataset}
                  </div>
                </div>
              </TableCell>
              <TableCell headerLabel="Status">
                <StatusDot variant="warning">{resource.status}</StatusDot>
              </TableCell>
              <TableCell headerLabel="Formatar">
                <a href="#" className="text-primary-600 underline">
                  {resource.format}
                </a>
              </TableCell>
              <TableCell headerLabel="Criado em">{formatDate(resource.createdAt)}</TableCell>
              <TableCell headerLabel="Modificado em">
                {formatDate(resource.modifiedAt)}
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
