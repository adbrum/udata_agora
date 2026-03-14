"use client";

import React, { useState } from "react";
import {
  Button,
  InputText,
  InputTextArea,
  RadioButton,
  Icon,
  Breadcrumb,
  StatusCard,
  Accordion,
  AccordionGroup,
  InputSelect,
  InputDate,
  DropdownSection,
  DropdownOption,
} from "@ama-pt/agora-design-system";

export default function DatasetsAdminClient() {
  const [accessType, setAccessType] = useState("open");

  const auxiliarItems = [
    {
      title: "Nomeando seu conjunto de dados",
      content:
        "Explore nomes claros e concisos que descrevam a função principal do seu conjunto de dados.",
    },
    {
      title: "Adicione uma sigla ao conjunto de dados.",
      content:
        "Abreviações ajudam na identificação rápida em listas e dashboards.",
    },
    {
      title: "Escreva uma boa descrição",
      content:
        "Uma boa descrição deve resumir o que o conjunto de dados contém, quem o deve usar e os principais benefícios.",
    },
    {
      title: "Escreva uma breve descrição.",
      content:
        "Uma breve descrição ajuda a identificar rapidamente o conteúdo do conjunto de dados.",
    },
    {
      title: "Adicionar palavras-chave",
      content:
        "Palavras-chave ajudam a encontrar o conjunto de dados mais facilmente.",
    },
    {
      title: "Selecione uma licença",
      content:
        "A licença define as condições de utilização dos dados.",
    },
    {
      title: "Escolha a frequência de atualização.",
      content:
        "Indique com que regularidade os dados são atualizados.",
    },
    {
      title: "Forneça a cobertura de tempo.",
      content:
        "Indique o período temporal coberto pelo conjunto de dados.",
    },
    {
      title: "Complete as informações espaciais",
      content:
        "Indique a área geográfica coberta pelo conjunto de dados.",
    },
  ];

  return (
    <div className="datasets-admin-page">
      {/* Breadcrumbs */}
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Lopes Inês", url: "#" },
            { label: "Conjuntos de dados", url: "/pages/admin/me/datasets" },
          ]}
        />
      </div>

      {/* Page Title */}
      <h1 className="datasets-admin-page__title mt-[64px] mb-[64px]">Formulário de inscrição</h1>

      {/* Step indicator */}
      <div className="datasets-admin-page__step-header">
        <p className="datasets-admin-page__step-text">
          <span className="text-primary-600 font-bold">Passo 2 - </span>
          <span className="text-primary-900 font-bold">
            Descreva o conjunto de dados
          </span>
        </p>
      </div>

      {/* Progress bar */}
      <div className="datasets-admin-page__stepper">
        <div className="datasets-admin-page__stepper-bar">
          <div className="datasets-admin-page__stepper-mark datasets-admin-page__stepper-mark--start" />
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`datasets-admin-page__stepper-segment ${
                i < 6 ? "datasets-admin-page__stepper-segment--filled" : ""
              }`}
            />
          ))}
          <div className="datasets-admin-page__stepper-mark datasets-admin-page__stepper-mark--end" />
        </div>
        <span className="datasets-admin-page__stepper-label">Passo 2/4</span>
      </div>

      {/* Main content area: form + auxiliar sidebar */}
      <div className="datasets-admin-page__body">
        {/* Left: Form */}
        <div className="datasets-admin-page__form-area">
          {/* Info card */}
          <StatusCard
            type="info"
            description={
              <>
                <strong>O que é um conjunto de dados?</strong>
                <br />
                Em data.gouv.fr, um conjunto de dados é um conjunto de arquivos.
              </>
            }
          />

          <form className="datasets-admin-page__form">
            {/* Produtor Section */}
            <p className="text-neutral-900 text-base leading-7">
              Os campos marcados com um asterisco ( * ) são obrigatórios.
            </p>
            <h2 className="datasets-admin-page__section-title">Produtor</h2>

            <InputSelect
              label="Verifique a identidade que deseja usar na publicação."
              placeholder="Para pesquisar..."
              id="producer-identity"
            >
              <DropdownSection name="organizations">
                <DropdownOption value="org1">
                  Minha Organização
                </DropdownOption>
              </DropdownSection>
            </InputSelect>

            {/* Organization card */}
            <div className="datasets-admin-page__org-card">
              <p className="datasets-admin-page__org-card-title">
                Você não pertence a nenhuma organização.
              </p>
              <p className="datasets-admin-page__org-card-description">
                Recomendamos que publique em nome de uma organização se se
                tratar de uma atividade profissional.
              </p>
              <a
                href="#"
                className="datasets-admin-page__org-card-link"
              >
                Crie ou participe de uma organização
                <Icon
                  name="agora-line-arrow-right-circle"
                  className="w-[24px] h-[24px]"
                />
              </a>
            </div>

            {/* Descrição Section */}
            <h2 className="datasets-admin-page__section-title">Descrição</h2>

            <div className="datasets-admin-page__fields-group">
              <InputText
                label="Título*"
                placeholder="Placeholder"
                id="api-name"
              />
              <InputText
                label="Acrônimo"
                placeholder="Placeholder"
                id="api-acronym"
              />
              <InputTextArea
                label="Descrição*"
                placeholder="Placeholder"
                id="dataset-description"
                rows={4}
                maxLength={246}
              />
              <InputTextArea
                label="Descrição resumida"
                placeholder="Placeholder"
                id="dataset-short-description"
                rows={3}
              />
              <p className="text-neutral-500 text-sm leading-relaxed -mt-2">
                Se este campo for deixado em branco, serão utilizados os primeiros 200
                caracteres da sua descrição.
              </p>
              <div className="w-1/2">
                <Button appearance="outline" variant="primary" hasIcon leadingIcon="agora-line-edit" leadingIconHover="agora-solid-edit" fullWidth>
                  Sugira uma breve descrição.
                </Button>
              </div>

              <InputSelect
                label="Palavras-chave"
                placeholder="Pesquise por uma palavra-chave..."
                id="dataset-keywords"
              >
                <DropdownSection name="keywords">
                  <DropdownOption value="keyword1">Palavra-chave 1</DropdownOption>
                </DropdownSection>
              </InputSelect>
              <Button appearance="outline" variant="primary" hasIcon leadingIcon="agora-line-sparkles">
                Sugira palavras-chave
              </Button>
            </div>

            {/* Acesso Section */}
            <h2 className="datasets-admin-page__section-title">Acesso</h2>

            <div className="datasets-admin-page__fields-group">
              <div className="flex flex-col gap-[8px]">
                <span className="text-primary-900 text-base font-medium leading-7">
                  Tipo de acesso
                </span>
                <div className="flex flex-row gap-4">
                  <RadioButton
                    label="Abrir"
                    id="access-open"
                    name="access-type"
                    checked={accessType === "open"}
                    onChange={() => setAccessType("open")}
                  />
                  <RadioButton
                    label="Restrito"
                    id="access-restricted"
                    name="access-type"
                    checked={accessType === "restricted"}
                    onChange={() => setAccessType("restricted")}
                  />
                </div>
              </div>

              <InputSelect
                label="Licença"
                placeholder="Selecione uma licença"
                id="dataset-license"
              >
                <DropdownSection name="licenses">
                  <DropdownOption value="license1">Licença 1</DropdownOption>
                </DropdownSection>
              </InputSelect>
            </div>

            {/* Tempo Section */}
            <h2 className="datasets-admin-page__section-title">Tempo</h2>

            <div className="datasets-admin-page__fields-group">
              <InputSelect
                label="Frequência de atualização *"
                placeholder="Procure uma frequência..."
                id="dataset-frequency"
              >
                <DropdownSection name="frequencies">
                  <DropdownOption value="daily">Diária</DropdownOption>
                  <DropdownOption value="weekly">Semanal</DropdownOption>
                  <DropdownOption value="monthly">Mensal</DropdownOption>
                  <DropdownOption value="annual">Anual</DropdownOption>
                </DropdownSection>
              </InputSelect>

              <span className="text-primary-900 text-base font-medium leading-7">
                Cobertura temporal
              </span>
              <div className="flex gap-4">
                <InputDate
                  label="Começo"
                  id="dataset-date-start"
                  dayInputPlaceholder="dd"
                  monthInputPlaceholder="mm"
                  yearInputPlaceholder="aaaa"
                  calendarIconAriaLabel="Abrir calendário"
                  previousYearAriaLabel="Ano anterior"
                  previousMonthAriaLabel="Mês anterior"
                  nextMonthAriaLabel="Próximo mês"
                  nextYearAriaLabel="Próximo ano"
                  selectedDayAriaLabel="Dia selecionado"
                  todayDayAriaLabel="Hoje"
                  todayLabel="Hoje"
                  cancelLabel="Cancelar"
                  okLabel="OK"
                  hideLabel
                  hasIcon
                  icon="agora-line-calendar"
                />
                <InputDate
                  label="Fim"
                  id="dataset-date-end"
                  dayInputPlaceholder="dd"
                  monthInputPlaceholder="mm"
                  yearInputPlaceholder="aaaa"
                  calendarIconAriaLabel="Abrir calendário"
                  previousYearAriaLabel="Ano anterior"
                  previousMonthAriaLabel="Mês anterior"
                  nextMonthAriaLabel="Próximo mês"
                  nextYearAriaLabel="Próximo ano"
                  selectedDayAriaLabel="Dia selecionado"
                  todayDayAriaLabel="Hoje"
                  todayLabel="Hoje"
                  cancelLabel="Cancelar"
                  okLabel="OK"
                  hideLabel
                  hasIcon
                  icon="agora-line-calendar"
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="datasets-admin-page__actions">
              <Button
                variant="primary"
                hasIcon
                trailingIcon="agora-line-arrow-right-circle"
              >
                Seguinte
              </Button>
            </div>
          </form>
        </div>

        {/* Right: Auxiliar sidebar */}
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
      </div>
    </div>
  );
}
