"use client";

import { useRef, useState } from "react";
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
} from "@ama-pt/agora-design-system";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function CommunityResourcesClient() {
  const { displayName } = useCurrentUser();
  const [showPublishDropdown, setShowPublishDropdown] = useState(false);
  const publishDropdownWrapperRef = useRef<HTMLDivElement>(null);

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
