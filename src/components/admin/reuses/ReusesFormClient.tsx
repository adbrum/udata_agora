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
  ButtonUploader,
  CardGeneral,
  CardLinks,
} from "@ama-pt/agora-design-system";
import {
  createReuse,
  updateReuse,
  uploadReuseImage,
  linkDatasetToReuse,
  linkDataserviceToReuse,
  fetchReuseTypes,
  fetchReuseTopics,
  fetchMyDatasets,
} from "@/services/api";
import type { Reuse, ReuseType, ReuseTopic, Dataset } from "@/types/api";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import Link from "next/link";
import AuxiliarList from "@/components/admin/AuxiliarList";

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
  const [selectedReuseType, setSelectedReuseType] = useState("");
  const [selectedReuseTopic, setSelectedReuseTopic] = useState("");
  const [reuseDescription, setReuseDescription] = useState("");
  const [reuseCoverImageFile, setReuseCoverImageFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdReuse, setCreatedReuse] = useState<Reuse | null>(null);

  // Dynamic options from backend
  const [reuseTypes, setReuseTypes] = useState<ReuseType[]>([]);
  const [reuseTopics, setReuseTopics] = useState<ReuseTopic[]>([]);

  // Step 2 state
  const [datasetLinks, setDatasetLinks] = useState([{ url: "" }]);
  const [datasetLinkErrors, setDatasetLinkErrors] = useState<Record<number, string>>({});
  const [apiLinks, setApiLinks] = useState([{ url: "" }]);
  const [apiLinkErrors, setApiLinkErrors] = useState<Record<number, string>>({});
  const [myDatasets, setMyDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

  useEffect(() => {
    fetchReuseTypes().then(setReuseTypes);
    fetchReuseTopics().then(setReuseTopics);
    fetchMyDatasets(1, 5).then((res) => setMyDatasets(res.data || []));
  }, []);

  useEffect(() => {
    setDatasetLinkErrors({});
    setApiLinkErrors({});
  }, [currentStep]);

  const handleStep1Next = async () => {
    const errors: Record<string, boolean> = {};
    if (!reuseName.trim()) errors.reuseName = true;
    if (!reuseLink.trim()) errors.reuseLink = true;
    if (!selectedReuseType) errors.reuseType = true;
    if (!selectedReuseTopic) errors.reuseTopic = true;
    if (!reuseDescription.trim()) errors.reuseDescription = true;
    if (!reuseCoverImageFile) errors.reuseCoverImage = true;
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setApiError(null);
    setIsSubmitting(true);

    const url = reuseLink.trim().match(/^https?:\/\//) ? reuseLink.trim() : `https://${reuseLink.trim()}`;

    try {
      const reuse = await createReuse({
        title: reuseName.trim(),
        description: reuseDescription.trim(),
        url,
        type: selectedReuseType,
        topic: selectedReuseTopic || undefined,
        private: true,
      });

      if (reuseCoverImageFile) {
        await uploadReuseImage(reuse.id, reuseCoverImageFile);
      }

      setCreatedReuse(reuse);
      onNextStep();
    } catch (error: unknown) {
      const err = error as { status?: number; data?: { errors?: Record<string, string>; message?: string } };
      if (err.status === 500) {
        setApiError("Erro interno do servidor. Verifique se todos os campos estão preenchidos corretamente e tente novamente.");
      } else if (err.data?.message) {
        setApiError(err.data.message);
      } else if (err.data?.errors && typeof err.data.errors === "object") {
        const messages = Object.values(err.data.errors).join(", ");
        setApiError(messages);
      } else {
        setApiError("Erro ao criar a reutilização. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
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
      hasError: !!formErrors.reuseName,
    },
    {
      title: "Qual link preencher?",
      content:
        "Insira o link para a página onde o conteúdo reutilizado está visível. Dê preferência ao link para o próprio conteúdo reutilizado, e não para a página inicial. Certifique-se de que o link permaneça estável ao longo do tempo.",
      hasError: !!formErrors.reuseLink,
    },
    {
      title: "Escolha um tipo",
      content:
        "Indique o tipo em que deve ser classificada a reutilização (API, aplicação, artigo de imprensa, visualização, etc.).",
      hasError: !!formErrors.reuseType,
    },
    {
      title: "Escolha um tema",
      content: "Escolha o tema associado à sua reutilização.",
      hasError: !!formErrors.reuseTopic,
    },
    {
      title: "Descreva a sua reutilização.",
      content:
        "Pode fornecer detalhes como a forma como a reutilização foi criada, o que permite fazer ou demonstrar, e até mesmo falar mais sobre si e o contexto desta reutilização. É melhor manter um tom neutro: se a reutilização soar muito como uma mensagem promocional, podemos removê-la.",
      hasError: !!formErrors.reuseDescription || !!formErrors.reuseDescriptionLength,
    },
    {
      title: "Adicionar palavras-chave",
      content: (
        <>
          <p>
            As palavras-chave aparecem na página de destino e melhoram o posicionamento nos
            mecanismos de pesquisa. Para cada palavra-chave, pode obter uma lista de
            reutilizações para as quais essa palavra-chave também foi atribuída.
          </p>
          <p className="font-bold mt-3">Sugestões automáticas</p>
          <p className="mt-2">
            Com base no conteúdo que reutiliza, podem ser sugeridas palavras-chave
            automaticamente. Pode aceitá-las, modificá-las ou excluí-las.
          </p>
          <p className="mt-3">
            <a href="#" className="text-primary-600 underline">
              A IA baseia-se exclusivamente nas informações que forneceu e, por vezes, pode
              cometer erros: releia sempre a proposta antes de validar.
            </a>
          </p>
        </>
      ),
    },
    {
      title: "Escolha uma imagem",
      content:
        'Se a sua reutilização assumir a forma de uma representação gráfica, pode fornecer uma pré-visualização para outros utilizadores usando uma imagem ou captura de ecrã. Esta imagem aparecerá na secção "Reutilizações" da página do conjunto de dados associado. Quando relevante, as capturas de ecrã ilustram melhor a reutilização e, portanto, são preferíveis a logotipos ou ilustrações, por exemplo.',
      hasError: !!formErrors.reuseCoverImage,
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

              {apiError && (
                <div className="mt-[32px] mb-[16px]">
                  <StatusCard type="danger" description={apiError} />
                </div>
              )}

              <form className="datasets-admin-page__form">
                <p className="text-neutral-900 text-base leading-7 pt-32">
                  Os campos marcados com um asterisco ( * ) são obrigatórios.
                </p>
                <h2 className="datasets-admin-page__section-title">Produtor</h2>

                <InputSelect
                  label="Verifique a identidade que deseja usar na publicação."
                  placeholder="Para pesquisar..."
                  id="producer-identity"
                  searchable
                  searchInputPlaceholder="Escreva para pesquisar..."
                  searchNoResultsText="Nenhum resultado encontrado"
                >
                  <DropdownSection name="organizations">
                    <DropdownOption value="org1">
                      Organização
                    </DropdownOption>
                  </DropdownSection>
                </InputSelect>

                <div className="datasets-admin-page__org-card">
                  <p className="datasets-admin-page__org-card-title">
                    Não pertence a nenhuma organização.
                  </p>
                  <p className="datasets-admin-page__org-card-description">
                    Recomendamos que publique em nome de uma organização se se
                    tratar de uma atividade profissional.
                  </p>
                  <a
                    href="/pages/admin/organizations/new"
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
                    placeholder="Insira o nome aqui"
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
                    placeholder="Insira o URL aqui (ex: https://...)"
                    id="reuse-link"
                    value={reuseLink}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setReuseLink(e.target.value);
                      if (e.target.value.trim()) {
                        clearError("reuseLink");
                        clearError("reuseLinkInvalid");
                      }
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
                    searchable
                    searchInputPlaceholder="Escreva para pesquisar..."
                    searchNoResultsText="Nenhum resultado encontrado"
                    onChange={(options) => {
                      if (options.length > 0) {
                        setSelectedReuseType(options[0].value as string);
                        clearError("reuseType");
                      } else {
                        setSelectedReuseType("");
                      }
                    }}
                    hasError={!!formErrors.reuseType}
                    hasFeedback={!!formErrors.reuseType}
                    feedbackState="danger"
                    errorFeedbackText="Campo obrigatório"
                  >
                    <DropdownSection name="types">
                      {reuseTypes.map((t) => (
                        <DropdownOption key={t.id} value={t.id}>
                          {t.label}
                        </DropdownOption>
                      ))}
                    </DropdownSection>
                  </InputSelect>
                  <InputSelect
                    label="Tema *"
                    placeholder="Pesquise um tópico..."
                    id="reuse-theme"
                    searchable
                    searchInputPlaceholder="Escreva para pesquisar..."
                    searchNoResultsText="Nenhum resultado encontrado"
                    onChange={(options) => {
                      if (options.length > 0) {
                        setSelectedReuseTopic(options[0].value as string);
                        clearError("reuseTopic");
                      } else {
                        setSelectedReuseTopic("");
                      }
                    }}
                    hasError={!!formErrors.reuseTopic}
                    hasFeedback={!!formErrors.reuseTopic}
                    feedbackState="danger"
                    errorFeedbackText="Campo obrigatório"
                  >
                    <DropdownSection name="themes">
                      {reuseTopics.map((t) => (
                        <DropdownOption key={t.id} value={t.id}>
                          {t.label}
                        </DropdownOption>
                      ))}
                    </DropdownSection>
                  </InputSelect>
                  <InputTextArea
                    label="Descrição *"
                    placeholder="Insira a descrição aqui"
                    id="reuse-description"
                    rows={4}
                    maxLength={246}
                    value={reuseDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      setReuseDescription(e.target.value);
                      if (e.target.value.trim()) clearError("reuseDescription");
                      if (e.target.value.trim().length >= 200) clearError("reuseDescriptionLength");
                    }}
                    hasError={!!formErrors.reuseDescription || !!formErrors.reuseDescriptionLength}
                    hasFeedback={!!formErrors.reuseDescription || !!formErrors.reuseDescriptionLength}
                    feedbackState={formErrors.reuseDescriptionLength ? "warning" : "danger"}
                    errorFeedbackText={formErrors.reuseDescription ? "Campo obrigatório" : "A descrição deve ter pelo menos 200 caracteres"}
                  />
                  <InputSelect
                    label="Palavras-chave"
                    placeholder="Pesquise por uma palavra-chave..."
                    id="reuse-keywords"
                    type="checkbox"
                    searchable
                    searchInputPlaceholder="Escreva para pesquisar..."
                    searchNoResultsText="Nenhum resultado encontrado"
                  >
                    <DropdownSection name="keywords">
                      <DropdownOption value="keyword1">Palavra-chave 1</DropdownOption>
                    </DropdownSection>
                  </InputSelect>
                  <div className="flex items-center gap-16">
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
                      O que achou desta sugestão?
                    </Button>
                  </div>

                  <div>
                    <span className="text-primary-900 text-base font-medium leading-7">
                      Imagem de capa *
                    </span>
                    <div className="mt-2">
                      <ButtonUploader
                        label="Ficheiros"
                        inputLabel="Selecione ou arraste o ficheiro"
                        removeFileButtonLabel="Remover ficheiro"
                        replaceFileButtonLabel="Substituir ficheiro"
                        extensionsInstructions="Tamanho máximo: 4 MB. Formatos aceitos: JPG, JPEG, PNG."
                        accept=".jpg,.jpeg,.png"
                        maxSize={4194304}
                        maxCount={1}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const files = e.target.files;
                          setReuseCoverImageFile(files && files.length > 0 ? files[0] : null);
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

                <div className="datasets-admin-page__actions flex justify-between gap-[18px]">
                  <Button
                    variant="primary"
                    appearance="outline"
                    hasIcon
                    leadingIcon="agora-line-arrow-left-circle"
                    leadingIconHover="agora-solid-arrow-left-circle"
                    onClick={onPreviousStep}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="primary"
                    hasIcon
                    trailingIcon="agora-line-arrow-right-circle"
                    trailingIconHover="agora-solid-arrow-right-circle"
                    onClick={handleStep1Next}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "A criar..." : "Seguinte"}
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* Step 2: Vinculando conjuntos de dados e APIs */}
          {currentStep === 2 && (
            <>
              <div className="mb-[24px]">
                <StatusCard
                  type="info"
                  description="É importante vincular todos os conjuntos de dados utilizados, pois isso ajuda a compreender as referências cruzadas necessárias e a melhorar a visibilidade da sua reutilização."
                />
              </div>
              {apiError && (
                <div className="mt-[32px] mb-[16px]">
                  <StatusCard type="danger" description={apiError} />
                </div>
              )}

              <form className="datasets-admin-page__form">
                {/* Conjuntos de dados */}
                <InputSelect
                  label="Pesquisar um conjunto de dados"
                  placeholder="Procurando um conjunto de dados..."
                  id="reuse-dataset-search"
                  searchable
                  searchInputPlaceholder="Escreva para pesquisar..."
                  searchNoResultsText="Nenhum resultado encontrado"
                  onChange={(options) => {
                    if (options.length > 0) {
                      const found = myDatasets.find((d) => d.id === options[0].value);
                      setSelectedDataset(found || null);
                    } else {
                      setSelectedDataset(null);
                    }
                  }}
                >
                  <DropdownSection name="datasets">
                    {myDatasets.map((d) => (
                      <DropdownOption key={d.id} value={d.id}>
                        {d.title}
                      </DropdownOption>
                    ))}
                  </DropdownSection>
                </InputSelect>

                {selectedDataset && (
                  <div className="agora-card-links-datasets-px0 mt-[16px]">
                    <CardLinks
                      onClick={() => {}}
                      className="cursor-pointer text-neutral-900"
                      variant="transparent"
                      image={{
                        src: selectedDataset.organization?.logo || "/images/placeholders/organization.png",
                        alt: selectedDataset.organization?.name || "Organização sem logo",
                      }}
                      category={selectedDataset.organization?.name}
                      title={selectedDataset.title}
                      description={
                        <div className="flex flex-col gap-12">
                          <p className="text-sm line-clamp-3 leading-relaxed text-neutral-900 mt-[8px]">
                            {selectedDataset.description}
                          </p>
                          <div className="flex flex-wrap gap-8 items-center mt-[8px]">
                            <span className="text-sm font-medium text-neutral-900">
                              Metadados: {selectedDataset.quality?.score != null ? Math.round(selectedDataset.quality.score * 100) : 0}%
                            </span>
                          </div>
                          <div className="flex items-center flex-wrap gap-[32px] text-xs mt-[32px] text-[#034AD8] mb-[32px]">
                            <div className="flex items-center gap-8" title="Visualizações">
                              <Icon name="agora-line-eye" aria-hidden="true" />
                              <span>{selectedDataset.metrics?.views || 0}</span>
                            </div>
                            <div className="flex items-center gap-8" title="Downloads">
                              <Icon name="agora-line-download" aria-hidden="true" />
                              <span>{selectedDataset.metrics?.resources_downloads || 0}</span>
                            </div>
                            <div className="flex items-center gap-8" title="Reutilizações">
                              <img src="/Icons/bar_chart.svg" alt="" aria-hidden="true" />
                              <span>{selectedDataset.metrics?.reuses || 0}</span>
                            </div>
                            <div className="flex items-center gap-8" title="Favoritos">
                              <img src="/Icons/favorite.svg" alt="" aria-hidden="true" />
                              <span>{selectedDataset.metrics?.followers || 0}</span>
                            </div>
                          </div>
                        </div>
                      }
                      date={
                        <span className="font-[300]">
                          {`Atualizado há ${formatDistanceToNow(new Date(selectedDataset.last_modified), { locale: pt }).replace("aproximadamente ", "").replace("quase ", "").replace("menos de ", "").replace("cerca de ", "")}`}
                        </span>
                      }
                      mainLink={
                        <Link href={`/pages/datasets/${selectedDataset.slug}`}>
                          <span className="underline">{selectedDataset.title}</span>
                        </Link>
                      }
                      blockedLink={true}
                    />
                  </div>
                )}

                {datasetLinks.map((link, index) => (
                  <div key={`dataset-${index}`} className="mt-[16px]">
                    <InputText
                      label="Link para o conjunto de dados"
                      placeholder="Insira o URL aqui"
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

                {/* APIs - oculto temporariamente */}
                {false && (<>
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
                      placeholder="Insira o URL aqui"
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
                </>)}

                <div className="datasets-admin-page__actions flex justify-between gap-[18px]">
                  <Button
                    variant="primary"
                    appearance="outline"
                    hasIcon
                    leadingIcon="agora-line-arrow-left-circle"
                    leadingIconHover="agora-solid-arrow-left-circle"
                    onClick={onPreviousStep}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="primary"
                    hasIcon
                    trailingIcon="agora-line-arrow-right-circle"
                    trailingIconHover="agora-solid-arrow-right-circle"
                    disabled={isSubmitting}
                    onClick={async () => {
                      if (!createdReuse) return;
                      setIsSubmitting(true);
                      setApiError(null);
                      try {
                        for (const link of datasetLinks) {
                          if (link.url.trim()) {
                            await linkDatasetToReuse(createdReuse.id, link.url.trim());
                          }
                        }
                        for (const link of apiLinks) {
                          if (link.url.trim()) {
                            await linkDataserviceToReuse(createdReuse.id, link.url.trim());
                          }
                        }
                        onNextStep();
                      } catch (error: unknown) {
                        const err = error as { data?: Record<string, unknown> };
                        if (err.data && typeof err.data === "object") {
                          const messages = Object.entries(err.data)
                            .map(([key, val]) => `${key}: ${val}`)
                            .join(", ");
                          setApiError(messages);
                        } else {
                          setApiError("Erro ao associar dados. Tente novamente.");
                        }
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                  >
                    {isSubmitting ? "A associar..." : "Seguinte"}
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* Step 3: Finalizar a publicação */}
          {currentStep === 3 && (
            <>
              <div className="mb-[24px]">
                <StatusCard
                  type="success"
                  description={
                    <>
                      <strong>A sua reutilização foi criada!</strong>
                      <br />
                      Agora pode publicar ou guardar como rascunho.
                    </>
                  }
                />
              </div>

              <div className="agora-card-links-datasets-px0">
                <CardLinks
                  onClick={() => {}}
                  className="cursor-pointer text-neutral-900"
                  variant="transparent"
                  image={{
                    src: createdReuse?.image_thumbnail || createdReuse?.image || "/laptop.png",
                    alt: reuseName || "Sem título",
                  }}
                  category={createdReuse?.organization?.name || "Reutilização"}
                  title={<div className="underline text-xl-bold">{reuseName || "Sem título"}</div>}
                  description={
                    reuseDescription ? (
                      <p className="text-sm line-clamp-3 leading-relaxed text-neutral-900 mt-[8px] max-w-[592px]">
                        {reuseDescription}
                      </p>
                    ) : undefined
                  }
                  date={
                    <span className="font-[300]">
                      Atualizado agora
                    </span>
                  }
                  links={[
                    {
                      href: "#",
                      hasIcon: true,
                      leadingIcon: "agora-line-eye",
                      leadingIconHover: "agora-solid-eye",
                      trailingIcon: "",
                      trailingIconHover: "",
                      trailingIconActive: "",
                      children: "0",
                      title: "Visualizações",
                      onClick: (e: React.MouseEvent) => e.preventDefault(),
                      className: "text-[#034AD8]",
                    },
                    {
                      href: "#",
                      hasIcon: true,
                      leadingIcon: "agora-line-calendar",
                      leadingIconHover: "agora-solid-calendar",
                      trailingIcon: "",
                      trailingIconHover: "",
                      trailingIconActive: "",
                      children: "0 datasets",
                      title: "Datasets",
                      onClick: (e: React.MouseEvent) => e.preventDefault(),
                      className: "text-[#034AD8]",
                    },
                    {
                      href: "#",
                      hasIcon: false,
                      children: (
                        <span className="flex items-center gap-8">
                          <img src="/Icons/bar_chart.svg" alt="" aria-hidden="true" />
                          <span>0</span>
                        </span>
                      ),
                      title: "Métricas",
                      onClick: (e: React.MouseEvent) => e.preventDefault(),
                    },
                    {
                      href: "#",
                      hasIcon: true,
                      leadingIcon: "agora-line-star",
                      leadingIconHover: "agora-solid-star",
                      trailingIcon: "",
                      trailingIconHover: "",
                      trailingIconActive: "",
                      children: 0,
                      title: "Favoritos",
                      onClick: (e: React.MouseEvent) => e.preventDefault(),
                      className: "text-[#034AD8]",
                    },
                  ]}
                  mainLink={
                    createdReuse ? (
                      <Link href={`/pages/reuses/${createdReuse.slug}`}>
                        <span className="underline">{reuseName}</span>
                      </Link>
                    ) : (
                      <span className="underline">{reuseName || "Sem título"}</span>
                    )
                  }
                  blockedLink={true}
                />
              </div>

              <Button
                appearance="link"
                variant="primary"
                hasIcon
                trailingIcon="agora-line-external-link"
                trailingIconHover="agora-solid-external-link"
              >
                Dê-nos o seu feedback sobre o processo de publicação.
              </Button>

              {apiError && (
                <div className="mt-[32px] mb-[16px]">
                  <StatusCard type="danger" description={apiError} />
                </div>
              )}

              <div className="datasets-admin-page__actions flex justify-end gap-[18px]">
                <Button
                  appearance="outline"
                  variant="neutral"
                  disabled={isSubmitting}
                  onClick={async () => {
                    if (!createdReuse) return;
                    setIsSubmitting(true);
                    try {
                      await updateReuse(createdReuse.id, { private: true });
                      window.location.href = "/pages/admin/me/reuses";
                    } catch {
                      setApiError("Erro ao salvar rascunho. Tente novamente.");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  {isSubmitting ? "A guardar..." : "Salvar rascunho"}
                </Button>
                <Button
                  variant="primary"
                  disabled={isSubmitting}
                  onClick={async () => {
                    if (!createdReuse) return;
                    setIsSubmitting(true);
                    setApiError(null);
                    try {
                      await updateReuse(createdReuse.id, { private: false });
                      window.location.href = "/pages/admin/me/reuses";
                    } catch {
                      setApiError("Erro ao publicar. Tente novamente.");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  {isSubmitting ? "A publicar..." : "Publicar reutilização"}
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
              <AuxiliarList items={auxiliarItems} />
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
