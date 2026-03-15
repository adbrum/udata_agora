"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
  Dropdown,
  DropdownSection,
  DropdownOption,
  InputText,
  InputTextArea,
  InputSelect,
  DragAndDropUploader,
  RadioButton,
} from "@ama-pt/agora-design-system";

export default function ArticlesNewClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showPublishDropdown, setShowPublishDropdown] = useState(false);
  const totalSteps = 2;
  const currentStep = Number(searchParams.get("step")) || 1;
  const totalSegments = 12;
  const filledSegments = Math.round((currentStep / totalSteps) * totalSegments);

  const [contentType, setContentType] = useState("markdown");

  const stepTitles: Record<number, string> = {
    1: "Descreva seu item",
    2: "Conteúdo",
  };

  const publishRoutes: Record<string, string> = {
    dataset: "/pages/admin/me/datasets/new",
    reuse: "/pages/admin/me/reuses/new",
    harvester: "/pages/admin/me/datasets/new",
    api: "/pages/admin/dataservices/new",
    article: "/pages/admin/system/articles/new",
    organization: "/pages/admin/me/datasets/new",
  };

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Bem-vindo", url: "/pages/admin" },
            { label: "Artigos", url: "/pages/admin/system/articles" },
            {
              label: "Formulário de inscrição",
              url: "/pages/admin/system/articles/new",
            },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">Formulário de inscrição</h1>
        <div className="relative inline-block publish-dropdown-wrapper">
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

      {/* Main content area: form + auxiliar sidebar */}
      <div className="datasets-admin-page__body">
        {/* Left: Form */}
        <div className="datasets-admin-page__form-area">
          {/* Step 1: Descrição */}
          {currentStep === 1 && (
            <form className="datasets-admin-page__form">
              <p className="text-neutral-900 text-base leading-7">
                Os campos marcados com um asterisco ( * ) são obrigatórios.
              </p>

              <h2 className="datasets-admin-page__section-title">Descrição</h2>

              <div className="datasets-admin-page__fields-group">
                <InputText
                  label="Título do artigo *"
                  placeholder=""
                  id="article-title"
                />

                <InputTextArea
                  label="Cabeçalho *"
                  placeholder=""
                  id="article-header"
                  rows={3}
                />

                <div className="flex flex-col gap-[8px]">
                  <span className="text-primary-900 text-base font-medium leading-7">
                    Tipo de conteúdo
                  </span>
                  <div className="flex flex-row gap-4">
                    <RadioButton
                      label="HTML"
                      id="content-html"
                      name="content-type"
                      checked={contentType === "html"}
                      onChange={() => setContentType("html")}
                    />
                    <RadioButton
                      label="Markdown"
                      id="content-markdown"
                      name="content-type"
                      checked={contentType === "markdown"}
                      onChange={() => setContentType("markdown")}
                    />
                  </div>
                </div>

                <InputSelect
                  label="Palavras-chave"
                  placeholder="Pesquise por uma palavra-chave..."
                  id="article-keywords"
                >
                  <DropdownSection name="keywords">
                    <DropdownOption value="keyword1">Palavra-chave 1</DropdownOption>
                  </DropdownSection>
                </InputSelect>

                <div>
                  <span className="text-primary-900 text-base font-medium leading-7">
                    Cobertor *
                  </span>
                  <div className="mt-2">
                    <DragAndDropUploader
                      dragAndDropLabel="Arraste e solte os arquivos"
                      separatorLabel="ou"
                      inputLabel="Selecionar ficheiro"
                      removeFileButtonLabel="Remover ficheiro"
                      replaceFileButtonLabel="Substituir ficheiro"
                      extensionsInstructions="Tamanho máximo: 4 MB. Formatos aceitos: JPG, JPEG, PNG."
                      accept=".jpg,.jpeg,.png"
                      maxSize={4194304}
                      maxCount={1}
                    />
                  </div>
                </div>
              </div>

              <div className="datasets-admin-page__actions">
                <Button
                  variant="primary"
                  hasIcon
                  trailingIcon="agora-line-arrow-right-circle"
                  trailingIconHover="agora-solid-arrow-right-circle"
                  onClick={() =>
                    router.push("/pages/admin/system/articles/new?step=2")
                  }
                >
                  Seguinte
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: Conteúdo */}
          {currentStep === 2 && (
            <form className="datasets-admin-page__form">
              <div className="datasets-admin-page__fields-group">
                <InputTextArea
                  label="Contente *"
                  placeholder=""
                  id="article-content"
                  rows={12}
                />
              </div>

              <div className="datasets-admin-page__actions datasets-admin-page__actions--between">
                <Button
                  appearance="outline"
                  variant="neutral"
                  onClick={() =>
                    router.push("/pages/admin/system/articles/new?step=1")
                  }
                >
                  Anterior
                </Button>
                <Button variant="primary">Para salvaguardar</Button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
