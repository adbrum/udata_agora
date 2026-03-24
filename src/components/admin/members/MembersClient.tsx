"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
import {
  fetchOrganization,
  addMember,
  updateMemberRole,
  removeMember,
  suggestUsers,
} from "@/services/api";
import { OrganizationMember, UserSuggestion } from "@/types/api";
import { useActiveOrganization } from "@/hooks/useActiveOrganization";
import PublishDropdown from "@/components/admin/PublishDropdown";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

const roleLabels: Record<string, string> = {
  admin: "ADMINISTRADOR",
  editor: "EDITOR",
};

const rolePillVariant = (role: string) => {
  switch (role) {
    case "admin":
      return "informative" as const;
    case "editor":
      return "success" as const;
    default:
      return "neutral" as const;
  }
};

interface AddMemberPopupProps {
  orgId: string;
  onMemberAdded: () => void;
}

function AddMemberPopupContent({ orgId, onMemberAdded }: AddMemberPopupProps) {
  const { hide } = usePopupContext();
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("editor");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        const results = await suggestUsers("");
        setSuggestions(results);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    }
    loadUsers();
  }, []);

  const handleAdd = async () => {
    if (!selectedUserId) return;
    setIsSubmitting(true);
    try {
      await addMember(orgId, selectedUserId, selectedRole);
      onMemberAdded();
      hide();
    } catch (error) {
      console.error("Error adding member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <InputSelect
        key={suggestions.length}
        label="Utilizador"
        placeholder="Pesquisar um utilizador"
        id="member-user"
        searchable
        searchInputPlaceholder="Escreva para pesquisar..."
        searchNoResultsText="Nenhum resultado encontrado"
        onChange={(options: { value?: string }[]) => {
          const id = options?.[0]?.value || "";
          setSelectedUserId(id);
        }}
      >
        <DropdownSection name="users">
          {suggestions.map((user) => (
            <DropdownOption key={user.id} value={user.id}>
              {`${user.first_name} ${user.last_name}`}
            </DropdownOption>
          ))}
        </DropdownSection>
      </InputSelect>

      <InputSelect
        label="Papel do membro"
        placeholder="Selecionar uma opção"
        id="member-role"
        defaultValue="editor"
        onChange={(options: { value?: string }[]) =>
          setSelectedRole(options?.[0]?.value || "editor")
        }
      >
        <DropdownSection name="roles">
          <DropdownOption value="admin">Administrador</DropdownOption>
          <DropdownOption value="editor">Editor</DropdownOption>
        </DropdownSection>
      </InputSelect>

      <div className="flex gap-[16px]">
        <Button appearance="outline" variant="neutral" onClick={() => hide()}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleAdd}
          disabled={!selectedUserId || isSubmitting}
        >
          {isSubmitting ? "A adicionar..." : "Adicionar à organização"}
        </Button>
      </div>
    </div>
  );
}

interface RemoveMemberPopupProps {
  orgId: string;
  member: OrganizationMember;
  onMemberRemoved: () => void;
}

function RemoveMemberPopupContent({
  orgId,
  member,
  onMemberRemoved,
}: RemoveMemberPopupProps) {
  const { hide } = usePopupContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRemove = async () => {
    setIsSubmitting(true);
    try {
      await removeMember(orgId, member.user.id);
      onMemberRemoved();
      hide();
    } catch (error) {
      console.error("Error removing member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <p className="text-neutral-700">
        Tem a certeza que deseja eliminar este membro?
      </p>
      <div className="flex gap-[16px]">
        <Button appearance="outline" variant="neutral" onClick={() => hide()}>
          Cancelar
        </Button>
        <Button
          variant="danger"
          onClick={handleRemove}
          disabled={isSubmitting}
        >
          {isSubmitting ? "A eliminar..." : "Eliminar"}
        </Button>
      </div>
    </div>
  );
}

interface EditRolePopupProps {
  orgId: string;
  member: OrganizationMember;
  onRoleUpdated: () => void;
}

function EditRolePopupContent({
  orgId,
  member,
  onRoleUpdated,
}: EditRolePopupProps) {
  const { hide } = usePopupContext();
  const [selectedRole, setSelectedRole] = useState(member.role);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    if (selectedRole === member.role) {
      hide();
      return;
    }
    setIsSubmitting(true);
    try {
      await updateMemberRole(orgId, member.user.id, selectedRole);
      onRoleUpdated();
      hide();
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <p className="text-neutral-700">
        Alterar o papel de{" "}
        <strong>
          {member.user.first_name} {member.user.last_name}
        </strong>
      </p>

      <InputSelect
        label="Papel do membro"
        placeholder="Selecionar uma opção"
        id="edit-member-role"
        defaultValue={member.role}
        onChange={(options: { value?: string }[]) =>
          setSelectedRole(options?.[0]?.value || "editor")
        }
      >
        <DropdownSection name="roles">
          <DropdownOption value="admin">Administrador</DropdownOption>
          <DropdownOption value="editor">Editor</DropdownOption>
        </DropdownSection>
      </InputSelect>

      <div className="flex gap-[16px]">
        <Button appearance="outline" variant="neutral" onClick={() => hide()}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleUpdate}
          disabled={isSubmitting}
        >
          {isSubmitting ? "A guardar..." : "Guardar"}
        </Button>
      </div>
    </div>
  );
}

export default function MembersClient() {
  const { show } = usePopupContext();
  const { activeOrg, isLoading: isOrgLoading } = useActiveOrganization();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadMembers = useCallback(async () => {
    if (!activeOrg) return;
    setIsLoading(true);
    try {
      const org = await fetchOrganization(activeOrg.id);
      setMembers(org.members || []);
    } catch (error) {
      console.error("Error loading members:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeOrg]);

  useEffect(() => {
    if (!activeOrg) {
      setIsLoading(false);
      return;
    }
    loadMembers();
  }, [activeOrg, loadMembers]);

  const handleRemoveMember = (member: OrganizationMember) => {
    show(
      <RemoveMemberPopupContent
        orgId={activeOrg!.id}
        member={member}
        onMemberRemoved={loadMembers}
      />,
      {
        title: "Eliminar membro",
        closeAriaLabel: "Fechar",
        dimensions: "m",
      }
    );
  };

  const totalPages = Math.ceil(members.length / itemsPerPage);
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return members.slice(start, start + itemsPerPage);
  }, [members, currentPage, itemsPerPage]);

  if (isOrgLoading || isLoading) {
    return <div className="admin-page">A carregar...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: activeOrg?.name || "Organização", url: "#" },
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
          {members.length} {members.length === 1 ? "membro" : "membros"}
        </p>
        <Button
          variant="primary"
          appearance="outline"
          hasIcon={true}
          leadingIcon="agora-line-plus-circle"
          leadingIconHover="agora-solid-plus-circle"
          onClick={() =>
            show(
              <AddMemberPopupContent
                orgId={activeOrg!.id}
                onMemberAdded={loadMembers}
              />,
              {
                title: "Adicionar um membro à organização",
                closeAriaLabel: "Fechar",
                dimensions: "m",
              }
            )
          }
        >
          Adicionar um membro
        </Button>
      </div>

      <Table
        paginationProps={{
          itemsPerPageLabel: "Itens por página",
          itemsPerPage: itemsPerPage,
          totalItems: members.length,
          availablePageSizes: [10, 20, 50],
          currentPage: currentPage,
          buttonDropdownAriaLabel: "Selecionar itens por página",
          dropdownListAriaLabel: "Opções de itens por página",
          prevButtonAriaLabel: "Página anterior",
          nextButtonAriaLabel: "Próxima página",
          onPageChange: (page: number) => setCurrentPage(page),
          onPageSizeChange: (size: number) => {
            setItemsPerPage(size);
            setCurrentPage(1);
          },
        }}
      >
        <TableHeader>
          <TableRow>
            <TableHeaderCell sortType="string" sortOrder="none">
              Membros
            </TableHeaderCell>
            <TableHeaderCell>Estatuto</TableHeaderCell>
            <TableHeaderCell sortType="date" sortOrder="none">
              Membro desde
            </TableHeaderCell>
            <TableHeaderCell>Ações</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedMembers.map((member) => (
            <TableRow key={member.user.id}>
              <TableCell headerLabel="Membros">
                <div className="flex items-center gap-[8px]">
                  {member.user.avatar_thumbnail ? (
                    <img
                      src={member.user.avatar_thumbnail}
                      alt={`${member.user.first_name} ${member.user.last_name}`}
                      className="w-[32px] h-[32px] rounded-full"
                    />
                  ) : (
                    <Icon
                      name="agora-line-user"
                      className="w-[32px] h-[32px]"
                    />
                  )}
                  <div>
                    <a
                      href={`/pages/users/${member.user.slug}`}
                      className="text-primary-600 underline"
                    >
                      {member.user.first_name} {member.user.last_name}
                    </a>
                  </div>
                </div>
              </TableCell>
              <TableCell headerLabel="Estatuto">
                <Pill variant={rolePillVariant(member.role)}>
                  {roleLabels[member.role] || member.role.toUpperCase()}
                </Pill>
              </TableCell>
              <TableCell headerLabel="Membro desde">
                {formatDate(member.since)}
              </TableCell>
              <TableCell headerLabel="Ações">
                <div className="flex gap-[8px]">
                  <button
                    onClick={() =>
                      show(
                        <EditRolePopupContent
                          orgId={activeOrg!.id}
                          member={member}
                          onRoleUpdated={loadMembers}
                        />,
                        {
                          title: "Editar papel do membro",
                          closeAriaLabel: "Fechar",
                          dimensions: "m",
                        }
                      )
                    }
                    title="Editar papel"
                  >
                    <Icon
                      name="agora-line-edit"
                      className="w-[20px] h-[20px] text-primary-600 cursor-pointer"
                    />
                  </button>
                  <button
                    onClick={() => handleRemoveMember(member)}
                    title="Remover membro"
                  >
                    <Icon
                      name="agora-line-trash"
                      className="w-[20px] h-[20px] text-danger-600 cursor-pointer"
                    />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </div>
  );
}
