"use client";

import {
  Breadcrumb,
  Button,
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
import PublishDropdown from "@/components/admin/PublishDropdown";

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
  const { show } = usePopupContext();
  const members = mockMembers;

  return (
    <div className="admin-page">
      <div className="admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Organização", url: "#" },
            { label: "Membros", url: "/pages/admin/org/members" },
          ]}
        />
      </div>

      <div className="admin-page__header">
        <h1 className="admin-page__title">Membros</h1>
        <PublishDropdown />
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
              dimensions: "m",
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
