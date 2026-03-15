"use client";

import { useRef, useState } from "react";
import {
  Breadcrumb,
  Button,
  CardNoResults,
  Dropdown,
  Icon,
  InputSearchBar,
  DropdownSection,
  DropdownOption,
} from "@ama-pt/agora-design-system";

export default function DataservicesClient() {
  const [showPublishDropdown, setShowPublishDropdown] = useState(false);
  const publishDropdownWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Lopes Inês", url: "#" },
            { label: "API", url: "/pages/admin/me/dataservices" },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">API</h1>
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
            optionsVisible={4}
            style={{
              width: "max-content",
              minWidth: "100%",
            }}
          >
            <DropdownSection name="publish" label="">
              <DropdownOption value="dataset">Um conjunto de dados</DropdownOption>
              <DropdownOption value="reuse">Uma reutilização</DropdownOption>
              <DropdownOption value="harvester">Um harvester</DropdownOption>
              <DropdownOption value="organization">Uma organização</DropdownOption>
            </DropdownSection>
          </Dropdown>
        </div>
      </div>

      <div className="datasets-page__body">
        <div className="datasets-page__sidebar">
          <p className="datasets-page__count">
            <strong>0 API</strong>
          </p>
          <InputSearchBar
            label="Pesquisar"
            placeholder="Pesquisar"
            aria-label="Pesquisar APIs"
          />
        </div>

        <div className="datasets-page__content">
          <CardNoResults
            className="datasets-page__empty"
            position="center"
            icon={
              <Icon name="agora-line-file" className="datasets-page__empty-icon" />
            }
            description="Você ainda não publicou uma API."
            hasAnchor
            valueAnchor="Publicar em dados.gov"
            anchorHref="/pages/admin/dataservices/new"
            anchorTarget="_self"
          />
        </div>
      </div>
    </div>
  );
}
