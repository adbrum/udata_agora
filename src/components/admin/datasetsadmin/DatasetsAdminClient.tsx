"use client";

import React, { useState } from "react";
import {
  Button,
  InputText,
  InputTextArea,
  RadioButton,
  Icon,
  Breadcrumb,
  Accordion,
  AccordionGroup,
  InputSelect,
  DropdownSection,
  DropdownOption,
} from "@ama-pt/agora-design-system";

export default function DatasetsAdminClient() {
  const [accessType, setAccessType] = useState("open");

  const auxiliarItems = [
    {
      title: "Como dar nomes à sua API",
      content:
        "Explore nomes claros e concisos que descrevam a função principal da sua API.",
    },
    {
      title: "Adicione uma abreviação ou sigla à API.",
      content:
        "Abreviações ajudam na identificação rápida em listas e dashboards.",
    },
    {
      title: "Escreva uma boa descrição",
      content:
        "Uma boa descrição deve resumir o que a API faz, quem a deve usar e os principais benefícios.",
    },
    {
      title: "Defina o link correto para a API.",
      content: "Use o endpoint base da sua API.",
    },
    {
      title: "Adicione um link para a documentação da máquina.",
      content: "Ficheiros como OpenAPI (Swagger) ou RAML.",
    },
    {
      title: "Adicione um link para a documentação técnica.",
      content: "Guias de integração, autenticação e exemplos de código.",
    },
    {
      title: "Especifique o limite de chamadas",
      content: "Indique o número máximo de pedidos por minuto/hora.",
    },
    {
      title: "Indique a disponibilidade",
      content: "Ex: 24/7, Dias úteis, 99.9% uptime.",
    },
    {
      title: "Selecione um tipo de acesso",
      content:
        "Explique a diferença entre acesso aberto, com conta ou restrito.",
    },
    {
      title: "Adicione um link à solicitação de autorização",
      content:
        "Onde os utilizadores podem pedir acesso se a API for restrita.",
    },
    {
      title: "Adicione um link para a documentação da empresa.",
      content: "Termos de serviço e políticas de privacidade.",
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
      <h1 className="datasets-admin-page__title">Formulário de inscrição</h1>

      {/* Step indicator */}
      <div className="datasets-admin-page__step-header">
        <p className="datasets-admin-page__step-text">
          <span className="text-primary-600 font-bold">Passo1 - </span>
          <span className="text-primary-900 font-bold">
            Descreva a sua API
          </span>
        </p>
      </div>

      {/* Progress bar */}
      <div className="datasets-admin-page__progress">
        <div className="datasets-admin-page__progress-bar">
          <div className="datasets-admin-page__progress-fill" />
        </div>
        <span className="datasets-admin-page__progress-label">Passo 1/3</span>
      </div>

      {/* Main content area: form + auxiliar sidebar */}
      <div className="datasets-admin-page__body">
        {/* Left: Form */}
        <div className="datasets-admin-page__form-area">
          {/* Info card */}
          <div className="datasets-admin-page__info-card">
            <Icon
              name="agora-solid-info-circle"
              className="datasets-admin-page__info-icon"
            />
            <div>
              <p className="datasets-admin-page__info-title">
                O que é uma API?
              </p>
              <p className="datasets-admin-page__info-description">
                Uma API é uma ferramenta informática que permite que um website
                ou software se comunique com outro computador e troque dados.
              </p>
            </div>
          </div>

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
                label="Nome da API*"
                placeholder="Placeholder"
                id="api-name"
              />
              <InputText
                label="Acrónimo"
                placeholder="Placeholder"
                id="api-acronym"
              />
              <InputTextArea
                label="Descrição*"
                placeholder="Placeholder"
                id="api-description"
                rows={4}
                maxLength={246}
              />
              <InputText
                label="Link raiz da API"
                placeholder="Placeholder"
                id="api-root-link"
              />
              <InputText
                label="Link para a documentação da API (arquivo OpenAPI ou Swagger)"
                placeholder="Placeholder"
                id="api-doc-openapi"
              />
              <InputText
                label="Link para a documentação técnica da API"
                placeholder="Placeholder"
                id="api-doc-technical"
              />
              <InputText
                label="Limite de chamadas"
                placeholder="Placeholder"
                id="api-rate-limit"
              />
              <InputText
                label="Disponibilidade"
                placeholder="Placeholder"
                id="api-availability"
              />
            </div>

            {/* Acesso Section */}
            <h2 className="datasets-admin-page__section-title">Acesso</h2>

            <div className="datasets-admin-page__fields-group">
              <div className="flex flex-col gap-[8px]">
                <span className="text-primary-900 text-base font-medium leading-7">
                  Tipo de acesso
                </span>
                <div className="flex flex-col">
                  <RadioButton
                    label="Abrir"
                    id="access-open"
                    name="access-type"
                    checked={accessType === "open"}
                    onChange={() => setAccessType("open")}
                  />
                  <RadioButton
                    label="Abrir com conta"
                    id="access-account"
                    name="access-type"
                    checked={accessType === "account"}
                    onChange={() => setAccessType("account")}
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
              <InputText
                label="Link para a ferramenta de autorização de acesso"
                placeholder="Placeholder"
                id="api-auth-tool"
              />
              <InputText
                label="Link para a documentação comercial da API"
                placeholder="Placeholder"
                id="api-doc-commercial"
              />
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
                name="agora-line-help-support"
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
