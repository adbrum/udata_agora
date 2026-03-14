"use client";

import React, { useState } from "react";
import {
  Button,
  InputText,
  InputTextArea,
  Icon,
  StatusCard,
  Accordion,
  AccordionGroup,
  InputSelect,
  DropdownSection,
  DropdownOption,
  DragAndDropUploader,
} from "@ama-pt/agora-design-system";

interface ReusesFormClientProps {
  currentStep: number;
  onNextStep: () => void;
  onPreviousStep: () => void;
}

export default function ReusesFormClient({
  currentStep,
  onNextStep,
  onPreviousStep,
}: ReusesFormClientProps) {
  const auxiliarItemsStep1 = [
    {
      title: "Dê um nome à sua reutilização.",
      content:
        'Prefira um título que permita entender como os dados são usados, em vez do nome do site ou aplicativo ("Mecanismo de Busca de Acordos Comerciais" em vez de "Acordos-Comerciais.fr", por exemplo).',
    },
    {
      title: "Qual link preencher?",
      content:
        "Insira o link para a página onde o conteúdo reutilizado está visível. Dê preferência ao link para o próprio conteúdo reutilizado, e não para a página inicial. Certifique-se de que o link permaneça estável ao longo do tempo.",
    },
    {
      title: "Escolha um tipo",
      content:
        "Indique o tipo em que deve ser classificada a reutilização (API, aplicação, artigo de imprensa, visualização, etc.).",
    },
    {
      title: "Escolha um tema",
      content: "Escolha o tema associado à sua reutilização.",
    },
    {
      title: "Descreva sua reutilização.",
      content:
        "Você pode fornecer detalhes como a forma como a reutilização foi criada, o que ela permite fazer ou demonstrar, e até mesmo falar mais sobre você e o contexto dessa reutilização. É melhor manter um tom neutro: se a reutilização soar muito como uma mensagem promocional, podemos removê-la.",
    },
    {
      title: "Adicionar palavras-chave",
      content: (
        <>
          <p>
            As palavras-chave aparecem na página de destino e melhoram o posicionamento nos
            mecanismos de busca. Para cada palavra-chave, você pode obter uma lista de
            reutilizações para as quais essa palavra-chave também foi atribuída.
          </p>
          <p className="font-bold mt-3">Sugestões automáticas</p>
          <p className="mt-2">
            Com base no conteúdo que você reutiliza, podem ser sugeridas palavras-chave
            automaticamente. Você pode aceitá-las, modificá-las ou excluí-las.
          </p>
          <p className="mt-3">
            <a href="#" className="text-primary-600 underline">
              A IA baseia-se exclusivamente nas informações que você forneceu e, por vezes, pode
              cometer erros: releia sempre a proposta antes de validar.
            </a>
          </p>
        </>
      ),
    },
    {
      title: "Escolha uma imagem",
      content:
        'Se a sua reutilização assumir a forma de uma representação gráfica, você pode fornecer uma pré-visualização para outros utilizadores usando uma imagem ou captura de tela. Essa imagem aparecerá na seção "Reutilizações" da página do conjunto de dados associado. Quando relevante, as capturas de tela ilustram melhor a reutilização e, portanto, são preferíveis a logotipos ou ilustrações, por exemplo.',
    },
  ];

  const auxiliarItems = auxiliarItemsStep1;

  return (
    <>
      {/* Main content area: form + auxiliar sidebar */}
      <div className="datasets-admin-page__body">
        {/* Left: Form */}
        <div className="datasets-admin-page__form-area">
          {/* Step 1: Descreva sua reutilização */}
          {currentStep === 1 && (
            <>
              <StatusCard
                type="info"
                description={
                  <>
                    <strong>O que é reutilização?</strong>
                    <br />
                    A reutilização é um exemplo de uso de dados públicos. Publicar uma
                    reutilização pode ajudar a ganhar visibilidade e iniciar um diálogo
                    com o produtor do conjunto de dados.
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
                    label="Nome da reutilização *"
                    placeholder="Placeholder"
                    id="reuse-title"
                  />
                  <InputText
                    label="Penhor *"
                    placeholder="https://..."
                    id="reuse-link"
                  />
                  <InputSelect
                    label="Tipo *"
                    placeholder="Procure por um tipo..."
                    id="reuse-type"
                  >
                    <DropdownSection name="types">
                      <DropdownOption value="application">Aplicação</DropdownOption>
                      <DropdownOption value="api">API</DropdownOption>
                      <DropdownOption value="visualization">Visualização</DropdownOption>
                      <DropdownOption value="article">Artigo de imprensa</DropdownOption>
                      <DropdownOption value="idea">Ideia</DropdownOption>
                    </DropdownSection>
                  </InputSelect>
                  <InputSelect
                    label="Tema *"
                    placeholder="Pesquise um tópico..."
                    id="reuse-theme"
                  >
                    <DropdownSection name="themes">
                      <DropdownOption value="education">Educação</DropdownOption>
                      <DropdownOption value="health">Saúde</DropdownOption>
                      <DropdownOption value="transport">Transportes</DropdownOption>
                    </DropdownSection>
                  </InputSelect>
                  <InputTextArea
                    label="Descrição *"
                    placeholder="Placeholder"
                    id="reuse-description"
                    rows={4}
                    maxLength={246}
                  />
                  <InputSelect
                    label="Palavras-chave"
                    placeholder="Pesquise por uma palavra-chave..."
                    id="reuse-keywords"
                  >
                    <DropdownSection name="keywords">
                      <DropdownOption value="keyword1">Palavra-chave 1</DropdownOption>
                    </DropdownSection>
                  </InputSelect>
                  <div className="w-1/2">
                    <Button
                      appearance="outline"
                      variant="primary"
                      hasIcon
                      leadingIcon="agora-line-edit"
                      leadingIconHover="agora-solid-edit"
                      fullWidth
                    >
                      Sugira palavras-chave
                    </Button>
                  </div>
                  <Button
                    appearance="link"
                    variant="primary"
                    hasIcon
                    trailingIcon="agora-line-external-link"
                    trailingIconHover="agora-solid-external-link"
                  >
                    O que você achou dessa sugestão?
                  </Button>

                  <div>
                    <span className="text-primary-900 text-base font-medium leading-7">
                      Imagem de capa *
                    </span>
                    <div className="mt-2">
                      <DragAndDropUploader
                        dragAndDropLabel="Arraste e solte os ficheiros"
                        separatorLabel="ou"
                        inputLabel="Navegar"
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
