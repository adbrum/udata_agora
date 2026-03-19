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

interface MockUser {
  name: string;
  slug: string;
  email: string;
  createdAt: string;
  datasets: number;
  reuses: number;
}

const mockUsers: MockUser[] = [
  {
    name: "Alexandre Bulté",
    slug: "alexandre-bulte",
    email: "user237@example.com",
    createdAt: "15 de janeiro de 2026",
    datasets: 0,
    reuses: 0,
  },
  {
    name: "APAGADO APAGADO",
    slug: "apagado-apagado",
    email: "user236@example.com",
    createdAt: "15 de janeiro de 2026",
    datasets: 0,
    reuses: 0,
  },
  {
    name: "Erin King",
    slug: "erin-king",
    email: "user235@example.com",
    createdAt: "15 de janeiro de 2026",
    datasets: 0,
    reuses: 0,
  },
  {
    name: "Miryad Ali",
    slug: "miryad-ali",
    email: "user234@example.com",
    createdAt: "15 de janeiro de 2026",
    datasets: 0,
    reuses: 0,
  },
];

export default function SystemUsersClient() {
  const users = mockUsers;

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Sistema", url: "#" },
            { label: "Utilizadores", url: "/pages/admin/system/users" },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">Utilizadores</h1>
        <PublishDropdown />
      </div>

      <p className="text-neutral-700 text-sm mb-[16px]">
        {users.length} resultados
      </p>

      <div className="flex items-end gap-[16px] mb-[24px]">
        <div className="w-[60%]">
          <InputSearchBar hasVoiceActionButton={false}
            label="Pesquisar"
            placeholder="Pesquise o nome do utilizador"
            aria-label="Pesquisar utilizadores"
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
          totalItems: users.length,
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
              Reutilizações
            </TableHeaderCell>
            <TableHeaderCell>Ações</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell headerLabel="Nome">
                <div>
                  <a
                    href={`/pages/users/${user.slug}`}
                    className="text-primary-600 underline"
                  >
                    {user.name}
                  </a>
                  <div className="text-sm text-neutral-500 flex items-center gap-[4px]">
                    <Icon name="agora-line-mail" className="w-[14px] h-[14px]" />
                    {user.email}
                  </div>
                </div>
              </TableCell>
              <TableCell headerLabel="Criado em">{user.createdAt}</TableCell>
              <TableCell headerLabel="Conjuntos de dados">{user.datasets}</TableCell>
              <TableCell headerLabel="Reutilizações">{user.reuses}</TableCell>
              <TableCell headerLabel="Ações">
                <div className="flex gap-[8px]">
                  <a href={`/pages/users/${user.slug}`}>
                    <Icon name="agora-line-eye" className="w-[20px] h-[20px]" />
                  </a>
                  <a href={`/pages/admin/system/users/edit?slug=${user.slug}`}>
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
