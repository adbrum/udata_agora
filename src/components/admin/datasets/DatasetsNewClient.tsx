"use client";

import React from "react";
import { Breadcrumb, CardAction } from "@ama-pt/agora-design-system";

export default function DatasetsNewClient() {
  const totalSteps = 4;
  const currentStep = 1;
  const totalSegments = 12;
  const filledSegments = Math.round((currentStep / totalSteps) * totalSegments);

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

      {/* Step indicator */}
      <div className="datasets-admin-page__step-header">
        <p className="datasets-admin-page__step-text">
          <span className="text-primary-600 font-bold">Passo{currentStep} - </span>
          <span className="text-primary-900 font-bold">
            Descreva o conjunto de dados
          </span>
        </p>
      </div>

      {/* Progress bar */}
      <div className="datasets-admin-page__stepper">
        <div className="datasets-admin-page__stepper-bar">
          <div className="datasets-admin-page__stepper-mark datasets-admin-page__stepper-mark--start" />
          {Array.from({ length: totalSegments }).map((_, i) => (
            <div
              key={i}
              className={`datasets-admin-page__stepper-segment ${i < filledSegments
                  ? "datasets-admin-page__stepper-segment--filled"
                  : ""
                }`}
            />
          ))}
          <div className="datasets-admin-page__stepper-mark datasets-admin-page__stepper-mark--end" />
        </div>
        <span className="datasets-admin-page__stepper-label">
          Passo {currentStep}/{totalSteps}
        </span>
      </div>

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
