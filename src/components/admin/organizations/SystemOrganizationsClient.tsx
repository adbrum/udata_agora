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
import PublishDropdown from "@/components/admin/PublishDropdown";

interface MockOrganization {
  name: string;
  slug: string;
  createdAt: string;
  datasets: number;
  api: number;
  reuses: number;
  members: number;
}

const mockOrganizations: MockOrganization[] = [
  {
    name: "SOBRANA",
    slug: "sobrana",
    createdAt: "15 de janeiro de 2026",
    datasets: 0,
    api: 0,
    reuses: 1,
    members: 0,
  },
  {
    name: "dados.gov",
    slug: "data-gouv-fr",
    createdAt: "15 de janeiro de 2026",
    datasets: 1,
    api: 1,
    reuses: 0,
    members: 0,
  },
  {
    name: "L'Apporteur d'Immo",
    slug: "lapporteur-dimmo",
    createdAt: "15 de janeiro de 2026",
    datasets: 0,
    api: 0,
    reuses: 1,
    members: 0,
  },
  {
    name: "iudo",
    slug: "iudo",
    createdAt: "15 de janeiro de 2026",
    datasets: 0,
    api: 0,
    reuses: 1,
    members: 0,
  },
  {
    name: "2803 MEDIA",
    slug: "2803-media",
    createdAt: "15 de janeiro de 2026",
    datasets: 0,
    api: 0,
    reuses: 1,
    members: 0,
  },
  {
    name: "CasaGoCo",
    slug: "casagoco",
    createdAt: "15 de janeiro de 2026",
    datasets: 0,
    api: 0,
    reuses: 1,
    members: 0,
  },
];

export default function SystemOrganizationsClient() {
  const organizations = mockOrganizations;

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Sistema", url: "#" },
            { label: "Organizações", url: "/pages/admin/system/organizations" },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">Organizações</h1>
        <PublishDropdown />
      </div>

      <p className="text-neutral-700 text-sm mb-[16px]">
        {organizations.length} resultados
      </p>

      <div className="flex items-end gap-[16px] mb-[24px]">
        <div className="w-[60%]">
          <InputSearchBar hasVoiceActionButton={false}
            label="Pesquisar"
            placeholder="Pesquise o nome da organização"
            aria-label="Pesquisar organizações"
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
          totalItems: organizations.length,
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
            <TableHeaderCell sortType="date" sortOrder="none">
              Criado em
            </TableHeaderCell>
            <TableHeaderCell sortType="numeric" sortOrder="none">
              Conjuntos de dados
            </TableHeaderCell>
            <TableHeaderCell sortType="numeric" sortOrder="none">
              API
            </TableHeaderCell>
            <TableHeaderCell sortType="numeric" sortOrder="none">
              Reutilizações
            </TableHeaderCell>
            <TableHeaderCell sortType="numeric" sortOrder="none">
              Membros
            </TableHeaderCell>
            <TableHeaderCell>Ações</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((org, index) => (
            <TableRow key={index}>
              <TableCell headerLabel="Nome">
                <a
                  href={`/pages/organizations/${org.slug}`}
                  className="text-primary-600 underline"
                >
                  {org.name}
                </a>
              </TableCell>
              <TableCell headerLabel="Criado em">{org.createdAt}</TableCell>
              <TableCell headerLabel="Conjuntos de dados">
                <a href="#" className="text-primary-600 underline">
                  {org.datasets}
                </a>
              </TableCell>
              <TableCell headerLabel="API">
                <a href="#" className="text-primary-600 underline">
                  {org.api}
                </a>
              </TableCell>
              <TableCell headerLabel="Reutilizações">
                <a href="#" className="text-primary-600 underline">
                  {org.reuses}
                </a>
              </TableCell>
              <TableCell headerLabel="Membros">
                <a href="#" className="text-primary-600 underline">
                  {org.members}
                </a>
              </TableCell>
              <TableCell headerLabel="Ações">
                <div className="flex gap-[8px]">
                  <a href={`/pages/organizations/${org.slug}`}>
                    <Icon name="agora-line-eye" className="w-[20px] h-[20px]" />
                  </a>
                  <a href={`/pages/admin/system/organizations/edit?slug=${org.slug}`}>
                    <Icon name="agora-line-edit" className="w-[20px] h-[20px]" />
                  </a>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
