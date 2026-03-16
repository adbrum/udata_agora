"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
  Dropdown,
  Icon,
  DropdownSection,
  DropdownOption,
  InputSelect,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Pill,
  usePopupContext,
} from "@ama-pt/agora-design-system";

interface MockMember {
  name: string;
  slug: string;
  email: string;
  status: string;
  memberSince: string;
  lastConnection: string;
}

const mockMembers: MockMember[] = [
  {
    name: "inescorreia correia",
    slug: "inescorreia-correia",
    email: "ines.correia@babelgroup.com",
    status: "Administrador",
    memberSince: "15 de março de 2026",
    lastConnection: "hoje",
  },
];

function AddMemberPopupContent() {
  const { hide } = usePopupContext();

  return (
    <div className="flex flex-col gap-[24px]">
      <InputSelect
        label="Utilizador"
        placeholder="Pesquisar um utilizador"
        id="member-user"
        searchable
        searchInputPlaceholder="Escreva para pesquisar..."
        searchNoResultsText="Nenhum resultado encontrado"
      >
        <DropdownSection name="users">
          <DropdownOption value="user1">Utilizador 1</DropdownOption>
          <DropdownOption value="user2">Utilizador 2</DropdownOption>
        </DropdownSection>
      </InputSelect>

      <InputSelect
        label="Papel do membro"
        placeholder="Selecionar uma opção"
        id="member-role"
      >
        <DropdownSection name="roles">
          <DropdownOption value="admin">Administrador</DropdownOption>
          <DropdownOption value="editor">Editor</DropdownOption>
          <DropdownOption value="member">Membro</DropdownOption>
        </DropdownSection>
      </InputSelect>

      <div className="flex gap-[16px]">
        <Button appearance="outline" variant="neutral" onClick={() => hide()}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={() => hide()}>
          Adicionar à organização
        </Button>
      </div>
    </div>
  );
}

export default function MembersClient() {
  const router = useRouter();
  const [showPublishDropdown, setShowPublishDropdown] = useState(false);
  const publishDropdownWrapperRef = useRef<HTMLDivElement>(null);
  const { show } = usePopupContext();
  const members = mockMembers;

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
            { label: "Minha organização", url: "#" },
            { label: "Membros", url: "/pages/admin/org/members" },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">Membros</h1>
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

      <div className="flex items-center justify-between mb-[24px]">
        <p className="text-neutral-700 text-sm font-semibold uppercase">
          {members.length} membro
        </p>
        <Button
          variant="primary"
          hasIcon={true}
          leadingIcon="agora-line-plus-circle"
          leadingIconHover="agora-solid-plus-circle"
          onClick={() =>
            show(<AddMemberPopupContent />, {
              title: "Adicionar um membro à organização",
              closeAriaLabel: "Fechar",
              dimensions: "M",
            })
          }
        >
          Adicionar um membro
        </Button>
      </div>

      <Table
        paginationProps={{
          itemsPerPageLabel: "Linhas por página",
          itemsPerPage: 10,
          totalItems: members.length,
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
              Membros
            </TableHeaderCell>
            <TableHeaderCell>Estatuto</TableHeaderCell>
            <TableHeaderCell sortType="date" sortOrder="none">
              Membro desde
            </TableHeaderCell>
            <TableHeaderCell sortType="date" sortOrder="none">
              Última conexão
            </TableHeaderCell>
            <TableHeaderCell>Ações</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member, index) => (
            <TableRow key={index}>
              <TableCell headerLabel="Membros">
                <div>
                  <a
                    href={`/pages/users/${member.slug}`}
                    className="text-primary-600 underline"
                  >
                    {member.name}
                  </a>
                  <div className="text-sm text-neutral-500 flex items-center gap-[4px]">
                    <Icon name="agora-line-mail" className="w-[14px] h-[14px]" />
                    {member.email}
                  </div>
                </div>
              </TableCell>
              <TableCell headerLabel="Estatuto">
                <Pill variant="informative">{member.status.toUpperCase()}</Pill>
              </TableCell>
              <TableCell headerLabel="Membro desde">
                {member.memberSince}
              </TableCell>
              <TableCell headerLabel="Última conexão">
                {member.lastConnection}
              </TableCell>
              <TableCell headerLabel="Ações">
                <div className="flex gap-[8px]">
                  <a href={`/pages/users/${member.slug}`}>
                    <Icon name="agora-line-eye" className="w-[20px] h-[20px]" />
                  </a>
                  <a href={`/pages/admin/org/members/edit?slug=${member.slug}`}>
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
