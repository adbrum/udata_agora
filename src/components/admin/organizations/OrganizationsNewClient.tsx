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
  Icon,
  StatusCard,
  Accordion,
  AccordionGroup,
} from "@ama-pt/agora-design-system";

export default function OrganizationsNewClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showPublishDropdown, setShowPublishDropdown] = useState(false);
  const totalSteps = 3;
  const currentStep = Number(searchParams.get("step")) || 1;
  const totalSegments = 12;
  const filledSegments = Math.round((currentStep / totalSteps) * totalSegments);

  const [orgName, setOrgName] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  const clearError = (field: string) => {
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleCreateOrg = () => {
    const errors: Record<string, boolean> = {};
    if (!orgName.trim()) errors.orgName = true;
    if (!orgDescription.trim()) errors.orgDescription = true;
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    router.push("/pages/admin/system/organizations");
  };

  const stepTitles: Record<number, string> = {
    1: "Crie ou participe de uma organização em dados.gov",
    2: "Descreva sua organização",
    3: "Finalize sua organização",
  };

  const publishRoutes: Record<string, string> = {
    dataset: "/pages/admin/me/datasets/new",
    reuse: "/pages/admin/me/reuses/new",
    harvester: "/pages/admin/me/datasets/new",
    api: "/pages/admin/dataservices/new",
    article: "/pages/admin/system/posts/new",
    organization: "/pages/admin/organizations/new",
  };

  const auxiliarItems = [
    {
      title: "Dê um nome à sua organização.",
      content: "Nome público da sua organização.",
    },
    {
      title: "Escolha uma sigla",
      content: "A sigla da sua organização, se houver.",
    },
    {
      title: "Por que fornecer um número SIRET?",
      content: (
        <>
          <p>
            Um número SIRET nos permitirá atribuir um tipo à sua organização
            (agências governamentais, autoridades locais, empresas, etc.) e
            facilitará sua certificação. O número deve ter 14 dígitos.
          </p>
          <p className="mt-2">
            Observe que todas as agências governamentais possuem um número SIRET.
          </p>
          <p className="mt-2">
            Você pode encontrar o seu número SIRET no{" "}
            <a href="#" className="text-primary-600 underline">
              Diretório Comercial.
            </a>
          </p>
        </>
      ),
    },
    {
      title: "Escreva uma boa descrição",
      content:
        "Por favor, descreva aqui o que sua organização faz e qual é a sua missão. Inclua todas as informações que permitam aos usuários entrar em contato com você: endereço de e-mail, endereço postal, conta do Twitter, etc.",
    },
    {
      title: "Digite um site",
      content:
        "Se a sua organização possui um site, por favor, forneça o endereço URL.",
    },
    {
      title: "Escolher o logotipo certo",
      content:
        'Se a sua organização tiver um logotipo ou foto de perfil, faça o upload aqui. Para fazer o upload de um logotipo, clique no botão "Escolher um arquivo do seu computador". Os seguintes formatos de imagem são aceitos: PNG, JPG/JPEG.',
    },
  ];

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Organizações", url: "/pages/admin/system/organizations" },
            {
              label: "Formulário de inscrição",
              url: "/pages/admin/organizations/new",
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

      {/* Main content area */}
      <div className="datasets-admin-page__body">
        <div className="datasets-admin-page__form-area">
          {/* Step 1: Ingressar ou criar */}
          {currentStep === 1 && (
            <div className="datasets-admin-page__form">
              <StatusCard
                type="info"
                description={
                  <>
                    <strong>Ingressar em uma organização</strong>
                    <br />
                    Uma organização é uma entidade na qual os usuários podem
                    colaborar. Conjuntos de dados publicados dentro de uma
                    organização podem ser editados por seus membros.
                  </>
                }
              />

              <div>
                <InputSelect
                  label="Pesquisar organização"
                  placeholder="Pesquise uma organização em dados.gov"
                  id="search-organization"
                  searchable
                  searchInputPlaceholder="Escreva para pesquisar..."
                  searchNoResultsText="Nenhum resultado encontrado"
                >
                  <DropdownSection name="organizations">
                    <DropdownOption value="org1">Organização 1</DropdownOption>
                    <DropdownOption value="org2">Organização 2</DropdownOption>
                  </DropdownSection>
                </InputSelect>

                <div className="flex items-center justify-center gap-[16px] mt-[16px]">
                  <span className="text-neutral-500">ou</span>
                </div>

                <div className="flex justify-center mt-[16px]">
                  <Button
                    variant="primary"
                    onClick={() =>
                      router.push("/pages/admin/organizations/new?step=2")
                    }
                  >
                    Criar uma organização
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Descreva sua organização */}
          {currentStep === 2 && (
            <>
              <StatusCard
                type="info"
                description={
                  <>
                    <strong>O que é uma organização?</strong>
                    <br />
                    Uma organização é uma entidade na qual muitos usuários podem
                    colaborar. Conjuntos de dados publicados sob a égide da
                    organização podem ser editados por seus membros.
                  </>
                }
              />

              <form className="datasets-admin-page__form">
                <p className="text-neutral-900 text-base leading-7">
                  Os campos marcados com um asterisco ( * ) são obrigatórios.
                </p>

                <h2 className="datasets-admin-page__section-title">Descrição</h2>

                <div className="datasets-admin-page__fields-group">
                  <InputText
                    label="Nome *"
                    placeholder=""
                    id="org-name"
                    value={orgName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setOrgName(e.target.value);
                      if (e.target.value.trim()) clearError("orgName");
                    }}
                    hasError={!!formErrors.orgName}
                    hasFeedback={!!formErrors.orgName}
                    feedbackState="danger"
                    errorFeedbackText="Campo obrigatório"
                  />

                  <InputText
                    label="Acrônimo"
                    placeholder=""
                    id="org-acronym"
                  />

                  <InputTextArea
                    label="Descrição *"
                    placeholder=""
                    id="org-description"
                    rows={6}
                    value={orgDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      setOrgDescription(e.target.value);
                      if (e.target.value.trim()) clearError("orgDescription");
                    }}
                    hasError={!!formErrors.orgDescription}
                    hasFeedback={!!formErrors.orgDescription}
                    feedbackState="danger"
                    errorFeedbackText="Campo obrigatório"
                  />

                  <InputText
                    label="Site da Internet"
                    placeholder=""
                    id="org-website"
                  />
                </div>

                <h2 className="datasets-admin-page__section-title">Logotipo</h2>

                <div className="datasets-admin-page__fields-group">
                  <DragAndDropUploader
                    dragAndDropLabel="Arraste e solte os arquivos"
                    separatorLabel="ou"
                    inputLabel="Selecione o ficheiro"
                    removeFileButtonLabel="Remover ficheiro"
                    replaceFileButtonLabel="Substituir ficheiro"
                    extensionsInstructions="Tamanho máximo: 4 MB. Formatos aceitos: JPG, JPEG, PNG."
                    accept=".jpg,.jpeg,.png"
                    maxSize={4194304}
                    maxCount={1}
                  />
                </div>

                <div className="datasets-admin-page__actions datasets-admin-page__actions--between">
                  <Button
                    appearance="outline"
                    variant="neutral"
                    onClick={() =>
                      router.push("/pages/admin/organizations/new?step=1")
                    }
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleCreateOrg}
                  >
                    Criar a organização
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* Step 3: Finalizar */}
          {currentStep === 3 && (
            <div className="datasets-admin-page__form">
              <StatusCard
                type="success"
                description={
                  <>
                    <strong>A sua organização foi criada!</strong>
                    <br />
                    Agora pode gerir a sua organização.
                  </>
                }
              />

              <div className="datasets-admin-page__actions datasets-admin-page__actions--between">
                <Button
                  appearance="outline"
                  variant="neutral"
                  onClick={() =>
                    router.push("/pages/admin/organizations/new?step=2")
                  }
                >
                  Anterior
                </Button>
                <Button
                  variant="primary"
                  onClick={() =>
                    router.push("/pages/admin/system/organizations")
                  }
                >
                  Guardar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Auxiliar sidebar (only for step 2) */}
        {currentStep === 2 && (
          <aside className="datasets-admin-page__auxiliar">
            <div className="datasets-admin-page__auxiliar-inner">
              <div className="datasets-admin-page__auxiliar-header">
                <Icon
                  name="agora-line-question-mark"
                  className="w-[24px] h-[24px]"
                />
                <h2 className="datasets-admin-page__auxiliar-title">Auxiliar</h2>
              </div>
              <AccordionGroup>
                {auxiliarItems.map((item, idx) => (
                  <Accordion
                    key={idx}
                    headingTitle={item.title}
                    headingLevel="h3"
                  >
                    <div className="py-[12px] text-sm text-neutral-700 leading-relaxed">
                      {item.content}
                    </div>
                  </Accordion>
                ))}
              </AccordionGroup>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
