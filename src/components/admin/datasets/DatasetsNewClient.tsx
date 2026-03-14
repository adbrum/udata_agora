"use client";

import React from "react";
import { Breadcrumb, CardAction } from "@ama-pt/agora-design-system";

export default function DatasetsNewClient() {
  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Lopes Inês", url: "#" },
            { label: "Conjuntos de dados", url: "/pages/admin/me/datasets" },
          ]}
        />
      </div>

      <h1 className="datasets-admin-page__title">Publicar em dados.gov</h1>

      <div className="datasets-new-page__cards">
        <CardAction
          titleText="Publicar um conjunto de dados"
          descriptionText="Seja uma administração pública ou uma empresa pública, todos podem publicar em dados.gov!"
          icon={{ name: "agora-line-file" }}
          button={{
            children: "Comece a publicar",
            variant: "primary",
            onClick: () => (window.location.href = "/pages/admin/me/datasetsadmin"),
          }}
        />

        <CardAction
          titleText="Publicar com um diagrama"
          descriptionText="Seus dados seguem um esquema de referência? Selecione um esquema e crie seus dados estruturados!"
          icon={{ name: "agora-line-edit" }}
          button={{
            children: "Publicar com um diagrama",
            variant: "neutral",
          }}
        />
      </div>
    </div>
  );
}
