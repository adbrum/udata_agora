"use client";

import React from "react";
import { Breadcrumb, Button, CardAction, StatusCard } from "@ama-pt/agora-design-system";

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

      <StatusCard
        type="info"
        description="Se desejar realizar testes, utilize demo.dados.gov"
      />

      <div className="datasets-new-page__cards mb-[32px]">
        <CardAction
          variant="neutral-100"
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
          variant="neutral-100"
          titleText="Publicar com um diagrama"
          descriptionText="Seus dados seguem um esquema de referência? Selecione um esquema e crie seus dados estruturados!"
          icon={{ name: "agora-line-edit" }}
          button={{
            children: "Publicar com um diagrama",
            variant: "neutral",
          }}
        />
      </div>

      {/* Admin sections */}
      <div className="datasets-new-page__admin-sections">
        <div className="datasets-new-page__admin-section">
          <p className="text-primary-900 text-base font-bold leading-7">
            Você é um administrador e deseja automatizar a publicação de seus dados?
          </p>
          <p className="text-neutral-700 text-sm leading-relaxed">
            Você pode publicar automaticamente via API ou vinculando seu portal de dados
            abertos ao data.gouv.fr com um coletor de dados.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button
              appearance="link"
              variant="primary"
              hasIcon
              trailingIcon="agora-line-external-link"
              trailingIconHover="agora-solid-external-link"
            >
              Consulte a documentação da API.
            </Button>
            <Button
              appearance="link"
              variant="primary"
              hasIcon
              trailingIcon="agora-line-external-link"
              trailingIconHover="agora-solid-external-link"
            >
              Saiba mais sobre a colheita.
            </Button>
            <Button
              appearance="link"
              variant="primary"
              hasIcon
              trailingIcon="agora-line-external-link"
              trailingIconHover="agora-solid-external-link"
            >
              Escreva-nos
            </Button>
          </div>
        </div>

        <div className="datasets-new-page__admin-section">
          <p className="text-primary-900 text-base font-bold leading-7">
            Você é um administrador e deseja catalogar seus dados?
          </p>
          <p className="text-neutral-700 text-sm leading-relaxed">
            Você pode usar o serviço para que os departamentos do governo central gerenciem
            e disponibilizem seu catálogo de dados.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button
              appearance="link"
              variant="primary"
              hasIcon
              trailingIcon="agora-line-external-link"
              trailingIconHover="agora-solid-external-link"
            >
              Acesse a área de catalogação.
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
