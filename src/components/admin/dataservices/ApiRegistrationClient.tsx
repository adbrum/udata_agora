"use client";

import React, { useState } from "react";
import {
  Button,
  InputText,
  InputTextArea,
  RadioButton,
  Icon,
  StatusCard,
  Accordion,
  AccordionGroup,
  InputSelect,
  DropdownSection,
  DropdownOption,
} from "@ama-pt/agora-design-system";

interface ApiRegistrationClientProps {
  currentStep: number;
  onNextStep: () => void;
  onPreviousStep: () => void;
}

export default function ApiRegistrationClient({
  currentStep,
  onNextStep,
  onPreviousStep,
}: ApiRegistrationClientProps) {
  const [accessType, setAccessType] = useState("open");

  const auxiliarItemsStep1 = [
    {
      title: "Como dar nome à sua API",
      content:
        'Dê à sua API um nome relevante e descritivo que reflita sua função ou área de aplicação. Um bom nome facilita a busca e a identificação por parte dos utilizadores. Sempre adicione o prefixo "API" para manter a consistência.',
    },
    {
      title: "Adicione uma abreviação ou sigla à API.",
      content:
        "Você tem a opção de adicionar uma sigla à sua API. As letras que compõem essa sigla não precisam ser separadas por pontos.",
    },
    {
      title: "Escreva uma boa descrição",
      content:
        "Escreva uma descrição clara e precisa da API. Os utilizadores precisam entender a finalidade da API, os dados fornecidos, o escopo abrangido (os dados são completos? Há alguma lacuna?), a frequência de atualização dos dados e os parâmetros que podem ser usados para fazer uma chamada.",
    },
    {
      title: "Defina o link correto para a API.",
      content:
        "A URL base de uma API é o ponto de entrada comum para todas as requisições, geralmente consistindo em um domínio ou endereço de servidor. Ela serve como base para a qual caminhos específicos (endpoints) são adicionados para acessar os diversos recursos da API.",
    },
    {
      title: "Adicione um link para a documentação da máquina.",
      content:
        "Idealmente, forneça um link OpenAPI (Swagger) que permita aos desenvolvedores explorar os endpoints, visualizar os métodos disponíveis e testar consultas diretamente da documentação. Para serviços geográficos, você pode fornecer um link para o serviço com uma consulta GetCapabilities para recuperar os metadados do serviço.",
    },
    {
      title: "Adicione um link para a documentação técnica.",
      content:
        "Adicione um link para a documentação técnica geral da API, descrevendo os passos de integração.",
    },
    {
      title: "Especifique o limite de chamadas",
      content:
        "Caso o número de chamadas à sua API seja limitado, defina aqui o número máximo de chamadas por minuto, ou mesmo por IP e/ou token.",
    },
    {
      title: "Indique a disponibilidade",
      content:
        "Especifique a disponibilidade média da sua API. O valor deve ser uma porcentagem.",
    },
    {
      title: "Selecione um tipo de acesso",
      content:
        'Escolha o tipo de acesso (aberto, aberto com conta ou restrito). Selecione "aberto" se os dados forem públicos. Selecione "aberto com conta" se o acesso aos dados exigir uma conta. Se selecionar "restrito", especifique os tipos de utilizadores que podem aceder a esta API.',
    },
    {
      title: "Adicione um link à solicitação de autorização.",
      content:
        "Se a sua API tiver acesso restrito, adicione o link ao formulário de solicitação de acesso. Você é administrador? A solução Datapass permite criar e gerenciar formulários de solicitação de acesso a dados com facilidade.",
    },
    {
      title: "Adicione um link para a documentação da empresa.",
      content:
        "A documentação comercial da sua API explica seu escopo e casos de uso. Ela complementa a documentação técnica.",
    },
  ];

  const auxiliarItems = auxiliarItemsStep1;

  return (
    <>
      {/* Main content area: form + auxiliar sidebar */}
      <div className="datasets-admin-page__body">
        {/* Left: Form */}
        <div className="datasets-admin-page__form-area">
          {/* Step 1: Descreva a sua API */}
          {currentStep === 1 && (
            <>
              <StatusCard
                type="info"
                description={
                  <>
                    <strong>O que é uma API?</strong>
                    <br />
                    Uma API é uma ferramenta informática que permite que um website
                    ou software se comunique com outro computador e troque dados.
                  </>
                }
              />

              <form className="datasets-admin-page__form">
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

                <h2 className="datasets-admin-page__section-title">Descrição</h2>

                <div className="datasets-admin-page__fields-group">
                  <InputText
                    label="Nome da API *"
                    placeholder="Placeholder"
                    id="api-name"
                  />
                  <InputText
                    label="Acrônimo"
                    placeholder="Placeholder"
                    id="api-acronym"
                  />
                  <InputTextArea
                    label="Descrição *"
                    placeholder="Placeholder"
                    id="api-description"
                    rows={4}
                    maxLength={246}
                  />
                  <InputText
                    label="Link raiz da API"
                    placeholder="https://..."
                    id="api-root-link"
                  />
                  <InputText
                    label="Link para a documentação da API (ficheiro OpenAPI ou Swagger)"
                    placeholder="https://..."
                    id="api-doc-openapi"
                  />
                  <InputText
                    label="Link para a documentação técnica da API"
                    placeholder="https://..."
                    id="api-doc-technical"
                  />
                  <InputText
                    label="Limite de chamadas"
                    placeholder="Placeholder"
                    id="api-rate-limit"
                  />
                  <InputText
                    label="Disponibilidade"
                    placeholder="99,9"
                    id="api-availability"
                  />
                </div>

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
                    placeholder="https://..."
                    id="api-auth-tool"
                  />
                  <InputText
                    label="Link para a documentação comercial da API"
                    placeholder="https://..."
                    id="api-doc-commercial"
                  />
                </div>

                <div className="datasets-admin-page__actions">
                  <Button
                    variant="primary"
                    hasIcon
                    trailingIcon="agora-line-arrow-right-circle"
                    trailingIconHover="agora-solid-arrow-right-circle"
                    onClick={onNextStep}
                  >
                    Seguindo
                  </Button>
                </div>
              </form>
            </>
          )}
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
    </>
  );
}
