"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Breadcrumb } from "@ama-pt/agora-design-system";
import ReusesFormClient from "@/components/admin/reuses/ReusesFormClient";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import PublishDropdown from "@/components/admin/PublishDropdown";

export default function ReusesNewClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { displayName } = useCurrentUser();
  const totalSteps = 3;
  const currentStep = Number(searchParams.get("step")) || 1;
  const totalSegments = 12;
  const filledSegments = Math.round((currentStep / totalSteps) * totalSegments);

  const stepTitles: Record<number, string> = {
    1: "Descreva a sua reutilização",
    2: "Conectar conjuntos de dados e APIs",
    3: "Finalizar a publicação",
  };

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: displayName || "...", url: "#" },
            { label: "Reutilizações", url: "/pages/admin/me/reuses" },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">Formulário de inscrição</h1>
        <PublishDropdown />
      </div>

      {/* Step indicator */}
      <div className="datasets-admin-page__step-header">
        <p className="datasets-admin-page__step-text">
          <span className="text-primary-600 font-bold">Passo {currentStep} - </span>
          <span className="text-primary-900 font-bold">
            {stepTitles[currentStep]}
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
              className={`datasets-admin-page__stepper-segment ${
                i < filledSegments
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

      <ReusesFormClient
        currentStep={currentStep}
        onNextStep={() =>
          router.push(`/pages/admin/me/reuses/new?step=${currentStep + 1}`)
        }
        onPreviousStep={() =>
          router.push(`/pages/admin/me/reuses/new?step=${currentStep - 1}`)
        }
      />
    </div>
  );
}
