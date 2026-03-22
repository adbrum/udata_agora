"use client";

import React, { useState, useRef, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
  DropdownSection,
  DropdownOption,
  InputText,
  InputTextArea,
  Icon,
  StatusCard,
  Accordion,
  AccordionGroup,
  Switch,
  Pill,
} from "@ama-pt/agora-design-system";
import { useAuth } from "@/context/AuthContext";
import PublishDropdown from "@/components/admin/PublishDropdown";
import AuxiliarList from "@/components/admin/AuxiliarList";
import IsolatedSelect from "@/components/admin/IsolatedSelect";

export default function HarvestersNewClient() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const totalSteps = 3;
  const currentStep = Number(searchParams.get("step")) || 1;
  const totalSegments = 12;
  const filledSegments = Math.round((currentStep / totalSteps) * totalSegments);

  const [harvesterName, setHarvesterName] = useState("");
  const [harvesterUrl, setHarvesterUrl] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [isEnabled, setIsEnabled] = useState(true);
  const [isAutoArchive, setIsAutoArchive] = useState(true);
  const [filters, setFilters] = useState<
    { mode: string; type: string; value: string }[]
  >([]);

  const selectedProducerRef = useRef("");
  const selectedTypeRef = useRef("");
  const filterModeRefs = useRef<Record<number, React.MutableRefObject<string>>>({});
  const filterTypeRefs = useRef<Record<number, React.MutableRefObject<string>>>({});

  const getFilterModeRef = (index: number) => {
    if (!filterModeRefs.current[index]) {
      filterModeRefs.current[index] = { current: "include" };
    }
    return filterModeRefs.current[index];
  };

  const getFilterTypeRef = (index: number) => {
    if (!filterTypeRefs.current[index]) {
      filterTypeRefs.current[index] = { current: "organization" };
    }
    return filterTypeRefs.current[index];
  };

  const producerOptions = useMemo(
    () => (
      <DropdownSection name="identity">
        <DropdownOption value="user">
          {user ? `${user.first_name} ${user.last_name}` : "Eu próprio"}
        </DropdownOption>
        {(user?.organizations || []).map((org) => (
          <DropdownOption key={org.id} value={org.id}>
            {org.name}
          </DropdownOption>
        ))}
      </DropdownSection>
    ),
    [user],
  );

  const typeOptions = useMemo(
    () => (
      <DropdownSection name="types">
        <DropdownOption value="dcat">DCAT</DropdownOption>
        <DropdownOption value="ckan">CKAN</DropdownOption>
        <DropdownOption value="csw">CSW</DropdownOption>
        <DropdownOption value="ods">ODS</DropdownOption>
      </DropdownSection>
    ),
    [],
  );

  const filterModeOptions = useMemo(
    () => (
      <DropdownSection name="mode">
        <DropdownOption value="include">Incluir</DropdownOption>
        <DropdownOption value="exclude">Excluir</DropdownOption>
      </DropdownSection>
    ),
    [],
  );

  const filterTypeSelectOptions = useMemo(
    () => (
      <DropdownSection name="type">
        <DropdownOption value="organization">Organização</DropdownOption>
        <DropdownOption value="tag">Marcação</DropdownOption>
      </DropdownSection>
    ),
    [],
  );

  const addFilter = () => {
    setFilters((prev) => [...prev, { mode: "include", type: "organization", value: "" }]);
  };

  const removeFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, field: string, value: string) => {
    setFilters((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    );
  };

  const clearError = (field: string) => {
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleStep1Next = () => {
    const errors: Record<string, boolean> = {};
    if (!harvesterName.trim()) errors.harvesterName = true;
    if (!harvesterUrl.trim()) errors.harvesterUrl = true;
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    router.push("/pages/admin/harvesters/new?step=2");
  };

  const stepTitles: Record<number, string> = {
    1: "Descreva o seu harvester",
    2: "Visualize o seu harvester",
    3: "Finalizar",
  };

  const auxiliarItems = [
    {
      title: "Escolha um nome",
      content:
        "Dê um nome ao seu harvester. Esta é uma referência interna que o ajudará a identificá-lo caso crie vários harvesters. O nome do seu harvester não será público.",
      hasError: !!formErrors.harvesterName,
    },
    {
      title: "Descreva o seu harvester",
      content:
        "Adicione detalhes no campo de descrição para seu uso interno. A descrição é opcional.",
    },
    {
      title: "Selecione o URL correto",
      content:
        "Insira aqui o URL do portal que deseja recolher. Normalmente, trata-se do URL da página inicial do seu portal de dados abertos. O URL permite que o harvester navegue e recupere todos os seus conjuntos de dados.",
      hasError: !!formErrors.harvesterUrl,
    },
    {
      title: "Selecione o tipo de implementação",
      content:
        "Escolha o formato dos metadados (por exemplo, DCAT, CKAN, etc.). Esse formato permite que o harvester saiba como ler e interpretar seus metadados, para que possam ser transcritos corretamente em dados.gov.",
    },
  ];

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Harvesters", url: "/pages/admin/system/harvesters" },
            {
              label: "Formulário de inscrição",
              url: "/pages/admin/harvesters/new",
            },
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

      {/* Main content area */}
      <div className="datasets-admin-page__body">
        <div className="datasets-admin-page__form-area">
          {/* Step 1: Descreva o seu harvester */}
          {currentStep === 1 && (
            <>
              <StatusCard
                type="info"
                description={
                  <>
                    <strong>O que é um harvester?</strong>
                    <br />
                    Um harvester é um mecanismo para reunir metadados de um catálogo
                    remoto e armazená-los em outra plataforma, fornecendo um
                    segundo ponto de acesso aos dados.
                  </>
                }
              />

              <form className="datasets-admin-page__form">
                <p className="text-neutral-900 text-base leading-7 pt-32">
                  Os campos marcados com um asterisco ( * ) são obrigatórios.
                </p>

                <h2 className="datasets-admin-page__section-title">Produtor</h2>

                <div className="datasets-admin-page__fields-group">
                  <IsolatedSelect
                    label="Verifique a identidade que deseja usar para publicar *"
                    placeholder="Para pesquisar..."
                    id="harvester-producer"
                    onChangeRef={selectedProducerRef}
                  >
                    {producerOptions}
                  </IsolatedSelect>
                </div>

                <h2 className="datasets-admin-page__section-title">Descrição</h2>

                <div className="datasets-admin-page__fields-group">
                  <InputText
                    label="Nome *"
                    placeholder=""
                    id="harvester-name"
                    value={harvesterName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setHarvesterName(e.target.value);
                      if (e.target.value.trim()) clearError("harvesterName");
                    }}
                    hasError={!!formErrors.harvesterName}
                    hasFeedback={!!formErrors.harvesterName}
                    feedbackState="danger"
                    errorFeedbackText="Campo obrigatório"
                  />

                  <InputTextArea
                    label="Descrição"
                    placeholder=""
                    id="harvester-description"
                    rows={6}
                  />

                  <InputText
                    label="URL *"
                    placeholder=""
                    id="harvester-url"
                    value={harvesterUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setHarvesterUrl(e.target.value);
                      if (e.target.value.trim()) clearError("harvesterUrl");
                    }}
                    hasError={!!formErrors.harvesterUrl}
                    hasFeedback={!!formErrors.harvesterUrl}
                    feedbackState="danger"
                    errorFeedbackText="Campo obrigatório"
                  />
                </div>

                <h2 className="datasets-admin-page__section-title">
                  Implementação
                </h2>

                <div className="datasets-admin-page__fields-group">
                  <IsolatedSelect
                    label="Tipo *"
                    placeholder=""
                    id="harvester-type"
                    searchable
                    searchInputPlaceholder="Escreva para pesquisar..."
                    searchNoResultsText="Nenhum resultado encontrado"
                    onChangeRef={selectedTypeRef}
                  >
                    {typeOptions}
                  </IsolatedSelect>

                  <div>
                    <p className="text-primary-900 text-base font-medium leading-7">
                      Filtros
                    </p>

                    {filters.map((filter, index) => (
                      <div key={index} className={`mt-[8px] pb-[16px] mb-[8px] ${index < filters.length - 1 ? "border-b border-neutral-200" : ""}`}>
                        <div className="flex items-center gap-[8px]">
                          <IsolatedSelect
                            label=""
                            hideLabel
                            placeholder="Incluir"
                            id={`filter-mode-${index}`}
                            onChangeRef={getFilterModeRef(index)}
                          >
                            {filterModeOptions}
                          </IsolatedSelect>
                          <IsolatedSelect
                            label=""
                            hideLabel
                            placeholder="Organização"
                            id={`filter-type-${index}`}
                            onChangeRef={getFilterTypeRef(index)}
                          >
                            {filterTypeSelectOptions}
                          </IsolatedSelect>
                        </div>
                        <div className="flex items-center gap-[8px] mt-[8px]">
                          <div className="flex-1">
                            <InputText
                              label=""
                              hideLabel
                              placeholder=""
                              id={`filter-value-${index}`}
                              value={filter.value}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateFilter(index, "value", e.target.value)
                              }
                            />
                          </div>
                          <Button
                            variant="danger"
                            hasIcon
                            iconOnly
                            leadingIcon="agora-line-trash"
                            leadingIconHover="agora-solid-trash"
                            onClick={() => removeFilter(index)}
                            aria-label="Excluir filtro"
                          >
                            {" "}
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      appearance="link"
                      variant="primary"
                      hasIcon
                      leadingIcon="agora-line-plus-circle"
                      leadingIconHover="agora-solid-plus-circle"
                      onClick={addFilter}
                    >
                      Adicionar um filtro
                    </Button>
                  </div>

                  <div className="flex gap-[48px]">
                    <Switch
                      label="Ativado"
                      checked={isEnabled}
                      onChange={() => setIsEnabled((v) => !v)}
                    />
                    <Switch
                      label="Arquivamento automático"
                      checked={isAutoArchive}
                      onChange={() => setIsAutoArchive((v) => !v)}
                    />
                  </div>
                </div>

                <div className="datasets-admin-page__actions">
                  <Button
                    variant="primary"
                    hasIcon
                    trailingIcon="agora-line-arrow-right-circle"
                    trailingIconHover="agora-solid-arrow-right-circle"
                    onClick={handleStep1Next}
                  >
                    Seguinte
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* Step 2: Visualize */}
          {currentStep === 2 && (
            <div className="datasets-admin-page__form">
              <div className="flex flex-col gap-[8px] mb-[24px]">
                <p className="text-neutral-700 text-sm flex items-center gap-[6px]">
                  <Icon name="agora-line-calendar" className="w-[16px] h-[16px]" />
                  Iniciado em: 15 de março de 2026 às 17h13
                </p>
                <p className="text-neutral-700 text-sm flex items-center gap-[6px]">
                  <Icon name="agora-line-calendar" className="w-[16px] h-[16px]" />
                  Terminado em: 15 de março de 2026 às 17:13
                </p>
                <p className="text-neutral-700 text-sm">
                  Status : <Pill variant="danger">Erro</Pill>
                </p>
                <p className="text-neutral-700 text-sm flex items-center gap-[12px]">
                  Elementos:
                  <span className="flex items-center gap-[4px]"><Icon name="agora-line-check" className="w-[16px] h-[16px]" /> 0</span>
                  <span className="flex items-center gap-[4px]"><Icon name="agora-line-alert-triangle" className="w-[16px] h-[16px]" /> 0</span>
                  <span className="flex items-center gap-[4px]"><Icon name="agora-line-info-mark" className="w-[16px] h-[16px]" /> 0</span>
                  <span className="flex items-center gap-[4px]"><Icon name="agora-line-x" className="w-[16px] h-[16px]" /> 0</span>
                  (0 no total)
                </p>
              </div>

              <StatusCard
                type="success"
                description={
                  <>
                    <strong>O seu harvester foi criado</strong>
                    <br />
                    O harvester está a aguardar aprovação. Será notificado após aprovação (ou recusa).
                  </>
                }
              />

              <h2 className="datasets-admin-page__section-title">Erros</h2>

              <StatusCard
                type="danger"
                description={
                  <>
                    <strong>ERRO</strong> Tipo MIME não suportado: &quot;text/html&quot;
                  </>
                }
              />

              <p className="text-neutral-700 text-sm font-semibold uppercase mt-[24px]">
                0 itens
              </p>

              <div className="datasets-admin-page__actions datasets-admin-page__actions--between">
                <Button
                  appearance="outline"
                  variant="neutral"
                  hasIcon
                  leadingIcon="agora-line-arrow-left-circle"
                  leadingIconHover="agora-solid-arrow-left-circle"
                  onClick={() =>
                    router.push("/pages/admin/harvesters/new?step=1")
                  }
                >
                  Anterior
                </Button>
                <Button
                  variant="primary"
                  onClick={() => router.push("/pages/admin/system/harvesters")}
                >
                  Ver em administração
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Finalizar */}
          {currentStep === 3 && (
            <div className="datasets-admin-page__form">
              <StatusCard
                type="success"
                description={
                  <>
                    <strong>O seu harvester foi criado!</strong>
                    <br />
                    Agora pode gerir o seu harvester.
                  </>
                }
              />

              <div className="datasets-admin-page__actions datasets-admin-page__actions--between">
                <Button
                  appearance="outline"
                  variant="neutral"
                  onClick={() =>
                    router.push("/pages/admin/harvesters/new?step=2")
                  }
                >
                  Anterior
                </Button>
                <Button
                  variant="primary"
                  onClick={() =>
                    router.push("/pages/admin/system/harvesters")
                  }
                >
                  Guardar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Auxiliar sidebar (only for step 1) */}
        {currentStep === 1 && (
          <aside className="datasets-admin-page__auxiliar">
            <div className="datasets-admin-page__auxiliar-inner">
              <div className="datasets-admin-page__auxiliar-header">
                <Icon
                  name="agora-line-question-mark"
                  className="w-[24px] h-[24px]"
                />
                <h2 className="datasets-admin-page__auxiliar-title">Auxiliar</h2>
              </div>
              <AuxiliarList items={auxiliarItems} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
