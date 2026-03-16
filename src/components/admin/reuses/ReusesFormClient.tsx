"use client";

import React, { useState, useEffect } from "react";
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
  CardGeneral,
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
  const [reuseName, setReuseName] = useState("");
  const [reuseLink, setReuseLink] = useState("");
  const [reuseType, setReuseType] = useState(false);
  const [reuseTheme, setReuseTheme] = useState(false);
  const [reuseDescription, setReuseDescription] = useState("");
  const [reuseCoverImage, setReuseCoverImage] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  // Step 2 state
  const [datasetLinks, setDatasetLinks] = useState([{ url: "" }]);
  const [datasetLinkErrors, setDatasetLinkErrors] = useState<Record<number, string>>({});
  const [apiLinks, setApiLinks] = useState([{ url: "" }]);
  const [apiLinkErrors, setApiLinkErrors] = useState<Record<number, string>>({});

  useEffect(() => {
    setDatasetLinkErrors({});
    setApiLinkErrors({});
  }, [currentStep]);

  const handleNextStep = () => {
    const errors: Record<string, boolean> = {};
    if (!reuseName.trim()) errors.reuseName = true;
    if (!reuseLink.trim()) errors.reuseLink = true;
    if (!reuseDescription.trim()) errors.reuseDescription = true;
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    onNextStep();
  };

  const handleDatasetUrlChange = (index: number, value: string) => {
    const updated = [...datasetLinks];
    updated[index] = { url: value };
    setDatasetLinks(updated);
    if (value.trim() && datasetLinkErrors[index]) {
      setDatasetLinkErrors((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
  };

  const addDatasetLink = () => {
    const lastIndex = datasetLinks.length - 1;
    if (!datasetLinks[lastIndex].url.trim()) {
      setDatasetLinkErrors((prev) => ({ ...prev, [lastIndex]: "Campo obrigatório" }));
      return;
    }
    setDatasetLinks((prev) => [...prev, { url: "" }]);
  };

  const removeDatasetLink = (index: number) => {
    setDatasetLinks((prev) => prev.filter((_, i) => i !== index));
    setDatasetLinkErrors((prev) => {
      const next: Record<number, string> = {};
      Object.entries(prev).forEach(([key, value]) => {
        const k = Number(key);
        if (k < index) next[k] = value;
        else if (k > index) next[k - 1] = value;
      });
      return next;
    });
  };

  const handleApiUrlChange = (index: number, value: string) => {
    const updated = [...apiLinks];
    updated[index] = { url: value };
    setApiLinks(updated);
    if (value.trim() && apiLinkErrors[index]) {
      setApiLinkErrors((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
  };

  const addApiLink = () => {
    const lastIndex = apiLinks.length - 1;
    if (!apiLinks[lastIndex].url.trim()) {
      setApiLinkErrors((prev) => ({ ...prev, [lastIndex]: "Campo obrigatório" }));
      return;
    }
    setApiLinks((prev) => [...prev, { url: "" }]);
  };

  const removeApiLink = (index: number) => {
    setApiLinks((prev) => prev.filter((_, i) => i !== index));
    setApiLinkErrors((prev) => {
      const next: Record<number, string> = {};
      Object.entries(prev).forEach(([key, value]) => {
        const k = Number(key);
        if (k < index) next[k] = value;
        else if (k > index) next[k - 1] = value;
      });
      return next;
    });
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
      title: "Descreva a sua reutilização.",
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
                    value={reuseName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setReuseName(e.target.value);
                      if (e.target.value.trim()) clearError("reuseName");
                    }}
                    hasError={!!formErrors.reuseName}
                    hasFeedback={!!formErrors.reuseName}
                    feedbackState="danger"
                    errorFeedbackText="Campo obrigatório"
                  />
                  <InputText
                    label="Reutilização *"
                    placeholder="https://..."
                    id="reuse-link"
                    value={reuseLink}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setReuseLink(e.target.value);
                      if (e.target.value.trim()) clearError("reuseLink");
                    }}
                    hasError={!!formErrors.reuseLink}
                    hasFeedback={!!formErrors.reuseLink}
                    feedbackState="danger"
                    errorFeedbackText="Campo obrigatório"
                  />
                  <InputSelect
                    label="Tipo *"
                    placeholder="Procure por um tipo..."
                    id="reuse-type"
                    onChange={(options) => {
                      const hasSelection = options.length > 0;
                      setReuseType(hasSelection);
                      if (hasSelection) clearError("reuseType");
                    }}
                    hasError={!!formErrors.reuseType}
                    hasFeedback={!!formErrors.reuseType}
                    feedbackState="danger"
                    errorFeedbackText="Campo obrigatório"
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
                    onChange={(options) => {
                      const hasSelection = options.length > 0;
                      setReuseTheme(hasSelection);
                      if (hasSelection) clearError("reuseTheme");
                    }}
                    hasError={!!formErrors.reuseTheme}
                    hasFeedback={!!formErrors.reuseTheme}
                    feedbackState="danger"
                    errorFeedbackText="Campo obrigatório"
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
                    value={reuseDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      setReuseDescription(e.target.value);
                      if (e.target.value.trim()) clearError("reuseDescription");
                    }}
                    hasError={!!formErrors.reuseDescription}
                    hasFeedback={!!formErrors.reuseDescription}
                    feedbackState="danger"
                    errorFeedbackText="Campo obrigatório"
                  />
                  <InputSelect
                    label="Palavras-chave"
                    placeholder="Pesquise por uma palavra-chave..."
                    id="reuse-keywords"
                    searchable
                    searchInputPlaceholder="Escreva para pesquisar..."
                    searchNoResultsText="Nenhum resultado encontrado"
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
                        inputLabel="Selecionar ficheiros"
                        removeFileButtonLabel="Remover ficheiro"
                        replaceFileButtonLabel="Substituir ficheiro"
                        extensionsInstructions="Tamanho máximo: 4 MB. Formatos aceitos: JPG, JPEG, PNG."
                        accept=".jpg,.jpeg,.png"
                        maxSize={4194304}
                        maxCount={1}
                        onChange={() => {
                          setReuseCoverImage(true);
                          clearError("reuseCoverImage");
                        }}
                        hasError={!!formErrors.reuseCoverImage}
                        hasFeedback={!!formErrors.reuseCoverImage}
                        feedbackState="danger"
                        feedbackText="Campo obrigatório"
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
                    onClick={handleNextStep}
                  >
                    Seguinte
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* Step 2: Vinculando conjuntos de dados e APIs */}
          {currentStep === 2 && (
            <>
              <StatusCard
                type="info"
                description="É importante vincular todos os conjuntos de dados utilizados, pois isso ajuda a compreender as referências cruzadas necessárias e a melhorar a visibilidade da sua reutilização."
              />

              <form className="datasets-admin-page__form">
                {/* Conjuntos de dados */}
                <InputSelect
                  label="Pesquisar um conjunto de dados"
                  placeholder="Procurando um conjunto de dados..."
                  id="reuse-dataset-search"
                >
                  <DropdownSection name="datasets">
                    <DropdownOption value="dataset1">
                      Conjunto de dados 1
                    </DropdownOption>
                  </DropdownSection>
                </InputSelect>

                {datasetLinks.map((link, index) => (
                  <div key={`dataset-${index}`} className="mt-[16px]">
                    <InputText
                      label="Link para o conjunto de dados"
                      placeholder="https://..."
                      id={`reuse-dataset-url-${index}`}
                      value={link.url}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleDatasetUrlChange(index, e.target.value)
                      }
                      hasError={!!datasetLinkErrors[index]}
                      hasFeedback={!!datasetLinkErrors[index]}
                      feedbackState="danger"
                      errorFeedbackText={datasetLinkErrors[index]}
                    />
                    {link.url.trim() && (
                      <div className="flex justify-end mt-[8px]">
                        <Button
                          appearance="link"
                          variant="danger"
                          hasIcon
                          leadingIcon="agora-line-trash"
                          leadingIconHover="agora-solid-trash"
                          onClick={() => removeDatasetLink(index)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-end">
                  <Button
                    appearance="outline"
                    variant="primary"
                    hasIcon
                    leadingIcon="agora-line-plus-circle"
                    leadingIconHover="agora-solid-plus-circle"
                    onClick={addDatasetLink}
                  >
                    Adicionar
                  </Button>
                </div>

                {/* APIs */}
                <div className="mt-[32px]">
                  <InputSelect
                    label="Pesquisar uma API"
                    placeholder="Pesquise uma API..."
                    id="reuse-api-search"
                  >
                    <DropdownSection name="apis">
                      <DropdownOption value="api1">API 1</DropdownOption>
                    </DropdownSection>
                  </InputSelect>
                </div>

                {apiLinks.map((link, index) => (
                  <div key={`api-${index}`} className="mt-[16px]">
                    <InputText
                      label="Link para a API"
                      placeholder="https://..."
                      id={`reuse-api-url-${index}`}
                      value={link.url}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleApiUrlChange(index, e.target.value)
                      }
                      hasError={!!apiLinkErrors[index]}
                      hasFeedback={!!apiLinkErrors[index]}
                      feedbackState="danger"
                      errorFeedbackText={apiLinkErrors[index]}
                    />
                    {link.url.trim() && (
                      <div className="flex justify-end mt-[8px]">
                        <Button
                          appearance="link"
                          variant="danger"
                          hasIcon
                          leadingIcon="agora-line-trash"
                          leadingIconHover="agora-solid-trash"
                          onClick={() => removeApiLink(index)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-end">
                  <Button
                    appearance="outline"
                    variant="primary"
                    hasIcon
                    leadingIcon="agora-line-plus-circle"
                    leadingIconHover="agora-solid-plus-circle"
                    onClick={addApiLink}
                  >
                    Adicionar
                  </Button>
                </div>

                <div className="datasets-admin-page__actions datasets-admin-page__actions--between">
                  <Button
                    appearance="outline"
                    variant="neutral"
                    onClick={onPreviousStep}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="primary"
                    hasIcon
                    trailingIcon="agora-line-arrow-right-circle"
                    trailingIconHover="agora-solid-arrow-right-circle"
                    onClick={onNextStep}
                  >
                    Seguinte
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* Step 3: Finalizar a publicação */}
          {currentStep === 3 && (
            <>
              <StatusCard
                type="success"
                description={
                  <>
                    <strong>A sua reutilização foi criada!</strong>
                    <br />
                    Agora você pode publicar ou salvar como rascunho.
                  </>
                }
              />

              <CardGeneral
                variant="white-outline"
                isCardHorizontal
                isBlockedLink
                iconDefault="agora-line-layers-menu"
                iconHover="agora-solid-layers-menu"
                titleText={reuseName || "Sem título"}
                descriptionText={reuseDescription || "Sem descrição"}
                anchor={{
                  href: `/pages/reuses/preview?title=${encodeURIComponent(reuseName)}&description=${encodeURIComponent(reuseDescription)}`,
                  children: "",
                }}
              />

              <Button
                appearance="link"
                variant="primary"
                hasIcon
                trailingIcon="agora-line-external-link"
                trailingIconHover="agora-solid-external-link"
              >
                Dê-nos o seu feedback sobre o processo de publicação.
              </Button>

              <div className="datasets-admin-page__actions flex justify-end gap-[18px]">
                <Button appearance="outline" variant="neutral">
                  Salvar rascunho
                </Button>
                <Button variant="primary">
                  Publicar reutilização
                </Button>
              </div>
            </>
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
    </>
  );
}
