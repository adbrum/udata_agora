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
} from "@ama-pt/agora-design-system";

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
  const router = useRouter();
  const [showPublishDropdown, setShowPublishDropdown] = useState(false);
  const publishDropdownWrapperRef = useRef<HTMLDivElement>(null);
  const users = mockUsers;

  const publishRoutes: Record<string, string> = {
    dataset: "/pages/admin/me/datasets/new",
    reuse: "/pages/admin/me/reuses/new",
    harvester: "/pages/admin/me/datasets/new",
    api: "/pages/admin/dataservices/new",
    article: "/pages/admin/system/articles/new",
    organization: "/pages/admin/me/datasets/new",
  };

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
        {users.length} resultados
      </p>

      <div className="flex items-center gap-[16px] mb-[24px]">
        <div className="flex-1">
          <InputSearchBar
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
