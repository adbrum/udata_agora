"use client";

import { Breadcrumb, CardNoResults, Icon } from "@ama-pt/agora-design-system";
import PublishDropdown from "@/components/admin/PublishDropdown";

export default function DiscussionsClient() {

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Organização", url: "#" },
            { label: "Discussões", url: "/pages/admin/org/discussions" },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">Discussões</h1>
        <PublishDropdown />
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
