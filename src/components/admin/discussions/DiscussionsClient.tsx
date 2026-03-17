"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
  CardNoResults,
  Dropdown,
  Icon,
  DropdownSection,
  DropdownOption,
} from "@ama-pt/agora-design-system";

export default function DiscussionsClient() {
  const router = useRouter();
  const [showPublishDropdown, setShowPublishDropdown] = useState(false);
  const publishDropdownWrapperRef = useRef<HTMLDivElement>(null);

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
            { label: "Discussões", url: "/pages/admin/org/discussions" },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">Discussões</h1>
        <div
          className="relative inline-block publish-dropdown-wrapper"
          ref={publishDropdownWrapperRef}
        >
          <Button
            variant="primary"
            hasIcon={true}
            trailingIcon={
              showPublishDropdown ? "agora-line-chevron-up" : "agora-line-chevron-down"
            }
            trailingIconHover={
              showPublishDropdown ? "agora-solid-chevron-up" : "agora-solid-chevron-down"
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

      <div className="datasets-page__body">
        <div className="datasets-page__content">
          <CardNoResults
            className="datasets-page__empty"
            position="center"
            icon={
              <Icon name="agora-line-chat" className="datasets-page__empty-icon" />
            }
            description="Ainda não há discussões."
          />
        </div>
      </div>
    </div>
  );
}
