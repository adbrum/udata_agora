"use client";

import {
  Breadcrumb,
  CardNoResults,
  Icon,
  InputSelect,
  InputSearchBar,
  DropdownSection,
  DropdownOption,
} from "@ama-pt/agora-design-system";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import PublishDropdown from "@/components/admin/PublishDropdown";

export default function CommunityResourcesClient() {
  const { displayName } = useCurrentUser();

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: displayName || "...", url: "#" },
            { label: "Recursos comunitários", url: "/pages/admin/community-resources" },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">Recursos comunitários</h1>
        <PublishDropdown />
      </div>

      <div className="datasets-page__body">
        <div className="datasets-page__sidebar">
          <p className="datasets-page__count">
            <strong>0 RECURSOS COMUNITÁRIOS</strong>
          </p>
          <InputSearchBar
            label="Pesquisar"
            placeholder="Pesquisar"
            aria-label="Pesquisar recursos comunitários"
          />
          <InputSelect
            label="Filtrar"
            placeholder="Filtrar por status"
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

        <div className="datasets-page__content">
          <CardNoResults
            className="datasets-page__empty"
            position="center"
            icon={
              <Icon name="agora-line-file" className="datasets-page__empty-icon" />
            }
            description="Você ainda não publicou um recurso comunitário."
          />
        </div>
      </div>
    </div>
  );
}
