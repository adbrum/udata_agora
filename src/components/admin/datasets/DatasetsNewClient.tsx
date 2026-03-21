"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
  CardAction,
  StatusCard,
} from "@ama-pt/agora-design-system";
import DatasetsAdminClient from "@/components/admin/datasetsadmin/DatasetsAdminClient";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import PublishDropdown from "@/components/admin/PublishDropdown";

export default function DatasetsNewClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { displayName } = useCurrentUser();
  const totalSteps = 4;
  const currentStep = Number(searchParams.get("step")) || 1;
  const datasetId = searchParams.get("datasetId");

  const buildStepUrl = (step: number) => {
    const params = new URLSearchParams({ step: String(step) });
    if (datasetId) params.set("datasetId", datasetId);
    return `/pages/admin/me/datasets/new?${params.toString()}`;
  };
  const totalSegments = 12;
  const displayStep = currentStep;
  const filledSegments = Math.round((displayStep / totalSteps) * totalSegments);

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: displayName || "...", url: "#" },
            { label: "Conjuntos de dados", url: "/pages/admin/me/datasets" },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">
          {currentStep === 1 ? "Publique em dados.gov" : "Formulário de inscrição"}
        </h1>
        <PublishDropdown />
      </div>

      {/* Step indicator */}
      <div className="datasets-admin-page__step-header">
        <p className="datasets-admin-page__step-text">
          <span className="text-primary-600 font-bold">Passo {currentStep} - </span>
          <span className="text-primary-900 font-bold">
            {currentStep === 1 && "Descreva o seu conjunto de dados"}
            {currentStep === 2 && "Descreva o seu conjunto de dados"}
            {currentStep === 3 && "Adicionar ficheiros"}
            {currentStep === 4 && "Finalizar a publicação"}
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
          Passo {displayStep}/{totalSteps}
        </span>
      </div>

      {currentStep === 1 && (
        <>
          <StatusCard
            type="info"
            description="Se desejar realizar testes, utilize demo.dados.gov"
          />

          <div className="datasets-new-page__cards mb-[32px]" style={{ maxWidth: "50%" }}>
            <CardAction
              variant="neutral-100"
              titleText="Publique um conjunto de dados"
              descriptionText="Seja uma administração pública ou uma empresa pública, todos podem publicar em dados.gov!"
              icon={{ name: "agora-line-edit" }}
              button={{
                children: "Comece a publicar",
                variant: "primary",
                appearance: "outline",
                onClick: () => router.push("/pages/admin/me/datasets/new?step=2"),
              }}
            />
          </div>

          {/* Admin sections */}
          <div className="datasets-new-page__admin-sections">
            <div className="datasets-new-page__admin-section">
              <p className="text-primary-900 text-base font-bold leading-7">
                É administrador e deseja automatizar a publicação dos seus dados?
              </p>
              <p className="text-neutral-700 text-sm leading-relaxed">
                Pode publicar automaticamente via API ou vinculando seu portal de dados
                abertos ao dados.gov com um coletor de dados.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Button
                  appearance="link"
                  variant="primary"
                  hasIcon
                  trailingIcon="agora-line-external-link"
                  trailingIconHover="agora-solid-external-link"
                  onClick={() => router.push("/pages/faqs/api-documentation")}
                >
                  Consulte a documentação da API.
                </Button>
                <Button
                  appearance="link"
                  variant="primary"
                  hasIcon
                  trailingIcon="agora-line-external-link"
                  trailingIconHover="agora-solid-external-link"
                  onClick={() => router.push("/pages/faqs/reuse")}
                >
                  Saiba mais sobre o harvester.
                </Button>
                <Button
                  appearance="link"
                  variant="primary"
                  hasIcon
                  trailingIcon="agora-line-external-link"
                  trailingIconHover="agora-solid-external-link"
                  onClick={() => router.push("/pages/support")}
                >
                  Contacte-nos
                </Button>
              </div>
            </div>

            <div className="datasets-new-page__admin-section">
              <p className="text-primary-900 text-base font-bold leading-7">
                É administrador e deseja catalogar os seus dados?
              </p>
              <p className="text-neutral-700 text-sm leading-relaxed">
                Pode usar o serviço para que os departamentos do governo central giram
                e disponibilizem o seu catálogo de dados.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Button
                  appearance="link"
                  variant="primary"
                  hasIcon
                  trailingIcon="agora-line-external-link"
                  trailingIconHover="agora-solid-external-link"
                >
                  Aceda à área de catálogo.
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {currentStep >= 2 && (
        <DatasetsAdminClient
          currentStep={currentStep}
          datasetId={datasetId}
          onNextStep={() => router.push(buildStepUrl(currentStep + 1))}
          onPreviousStep={() => router.push(buildStepUrl(currentStep - 1))}
        />
      )}
    </div>
  );
}
