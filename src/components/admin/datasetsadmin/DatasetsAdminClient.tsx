"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Button,
  CardGeneral,
  InputText,
  InputTextArea,
  RadioButton,
  Icon,
  StatusCard,
  Accordion,
  AccordionGroup,
  InputDate,
  DropdownSection,
  DropdownOption,
  ProgressBar,
} from "@ama-pt/agora-design-system";
import {
  createDataset,
  updateDataset,
  uploadResource,
  createResource,
  fetchLicenses,
  fetchFrequencies,
  fetchDataset,
  fetchMyDatasets,
  suggestTags,
  fetchOrgContactPoints,
  createContactPoint,
} from "@/services/api";
import {
  License,
  Frequency,
  Dataset,
  TagSuggestion,
  ContactPoint,
} from "@/types/api";
import AuxiliarList from "@/components/admin/AuxiliarList";
import IsolatedSelect from "@/components/admin/IsolatedSelect";
import FileUploadModal from "@/components/admin/FileUploadModal";
import { useAuth } from "@/context/AuthContext";
import { getFrequencyLabel } from "@/utils/frequencyLabels";

interface DatasetsAdminClientProps {
  currentStep: number;
  datasetId?: string | null;
  onNextStep: () => void;
  onPreviousStep: () => void;
  onDatasetCreated?: (datasetId: string) => void;
  onComplete?: () => void;
}

export default function DatasetsAdminClient({
  currentStep,
  datasetId,
  onNextStep,
  onPreviousStep,
  onDatasetCreated,
  onComplete,
}: DatasetsAdminClientProps) {
  const router = useRouter();
  const { user } = useAuth();

  // Form state
  const [accessType, setAccessType] = useState("open");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showFileError, setShowFileError] = useState(false);
  const [datasetTitle, setDatasetTitle] = useState("");
  const [datasetAcronym, setDatasetAcronym] = useState("");
  const [datasetDescription, setDatasetDescription] = useState("");
  const [datasetShortDescription, setDatasetShortDescription] = useState("");
  const selectedProducerRef = useRef("");
  const selectedLicenseRef = useRef("");
  const selectedFrequencyRef = useRef("");
  const selectedKeywordsRef = useRef("");
  const dummyRef = useRef("");
  const [temporalStart, setTemporalStart] = useState("");
  const [temporalEnd, setTemporalEnd] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [selectedProducer, setSelectedProducer] = useState("");
  const [orgContactPoints, setOrgContactPoints] = useState<ContactPoint[]>([]);
  const [selectedContactPointIds, setSelectedContactPointIds] = useState<string[]>([]);

  interface DraftContact {
    id: number;
    name: string;
    email: string;
    link: string;
    saved: boolean;
    errors: Record<string, boolean>;
  }
  const draftIdRef = useRef(0);
  const [draftContacts, setDraftContacts] = useState<DraftContact[]>([
    { id: 0, name: "", email: "", link: "", saved: false, errors: {} },
  ]);

  // Step 3 state
  const [resourceUrl, setResourceUrl] = useState("");

  // API state
  const [createdDataset, setCreatedDataset] = useState<Dataset | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Dropdown data
  const [licenses, setLicenses] = useState<License[]>([]);
  const [frequencies, setFrequencies] = useState<Frequency[]>([]);
  const [tags, setTags] = useState<TagSuggestion[]>([]);

  const producerOptions = useMemo(() => {
    const options = [
      <DropdownOption key="user" value="user">
        {user ? `${user.first_name} ${user.last_name}` : "Eu próprio"}
      </DropdownOption>,
      ...(user?.organizations || []).map((org) => (
        <DropdownOption key={org.id} value={org.id}>
          {org.name}
        </DropdownOption>
      )),
    ];
    return <DropdownSection name="identity">{options}</DropdownSection>;
  }, [user]);

  const licenseOptions = useMemo(() => {
    const options = licenses.map((license) => (
      <DropdownOption key={license.id} value={license.id}>
        {license.title}
      </DropdownOption>
    ));
    return <DropdownSection name="licenses">{options}</DropdownSection>;
  }, [licenses]);

  const frequencyOptions = useMemo(() => {
    const options = frequencies.map((freq) => (
      <DropdownOption key={freq.id} value={freq.id}>
        {getFrequencyLabel(freq.id, freq.label)}
      </DropdownOption>
    ));
    return <DropdownSection name="frequencies">{options}</DropdownSection>;
  }, [frequencies]);

  const tagOptions = useMemo(() => {
    const options = tags.map((tag) => (
      <DropdownOption key={tag.text} value={tag.text}>
        {tag.text}
      </DropdownOption>
    ));
    return <DropdownSection name="keywords">{options}</DropdownSection>;
  }, [tags]);

  // Fetch contact points when an organization is selected as producer
  useEffect(() => {
    if (selectedProducer && selectedProducer !== "user") {
      async function loadContactPoints() {
        try {
          const response = await fetchOrgContactPoints(selectedProducer);
          setOrgContactPoints(response.data);
        } catch (error) {
          console.error("Error loading contact points:", error);
          setOrgContactPoints([]);
        }
      }
      loadContactPoints();
    } else {
      setOrgContactPoints([]);
      setSelectedContactPointIds([]);
    }
  }, [selectedProducer]);

  const updateDraft = (draftId: number, field: string, value: string) => {
    setDraftContacts((prev) =>
      prev.map((d) =>
        d.id === draftId
          ? { ...d, [field]: value, errors: { ...d.errors, [field]: false } }
          : d,
      ),
    );
  };

  const handleSaveContactDraft = async (draftId: number) => {
    const draft = draftContacts.find((d) => d.id === draftId);
    if (!draft) return;

    const errors: Record<string, boolean> = {};
    if (!draft.name.trim()) errors.name = true;
    if (!draft.email.trim() && !draft.link.trim()) {
      errors.email = true;
      errors.link = true;
    }
    if (Object.keys(errors).length > 0) {
      setDraftContacts((prev) =>
        prev.map((d) => (d.id === draftId ? { ...d, errors } : d)),
      );
      return;
    }

    try {
      const payload: Parameters<typeof createContactPoint>[0] = {
        name: draft.name.trim(),
        role: "contact",
        organization: selectedProducer,
      };
      if (draft.email.trim()) payload.email = draft.email.trim();
      if (draft.link.trim()) payload.contact_form = draft.link.trim();
      const newContact = await createContactPoint(payload);
      setOrgContactPoints((prev) => [...prev, newContact]);
      setSelectedContactPointIds((prev) => [...prev, newContact.id]);
      setDraftContacts((prev) =>
        prev.map((d) =>
          d.id === draftId ? { ...d, saved: true, errors: {} } : d,
        ),
      );
    } catch (error) {
      console.error("Error creating contact point:", error);
    }
  };

  const handleAddNewDraft = async (saveDraftId: number) => {
    const draft = draftContacts.find((d) => d.id === saveDraftId);
    if (!draft) return;

    // Validate before saving
    const errors: Record<string, boolean> = {};
    if (!draft.name.trim()) errors.name = true;
    if (!draft.email.trim() && !draft.link.trim()) {
      errors.email = true;
      errors.link = true;
    }
    if (Object.keys(errors).length > 0) {
      setDraftContacts((prev) =>
        prev.map((d) => (d.id === saveDraftId ? { ...d, errors } : d)),
      );
      return;
    }

    await handleSaveContactDraft(saveDraftId);
    draftIdRef.current += 1;
    setDraftContacts((prev) => [
      ...prev,
      {
        id: draftIdRef.current,
        name: "",
        email: "",
        link: "",
        saved: false,
        errors: {},
      },
    ]);
  };

  // Whether user has existing datasets
  const [hasDatasets, setHasDatasets] = useState(true);

  useEffect(() => {
    async function loadDropdownData() {
      try {
        const [licensesData, frequenciesData, myDatasetsData, tagsData] =
          await Promise.all([
            fetchLicenses(),
            fetchFrequencies(),
            fetchMyDatasets(1, 1),
            suggestTags("", 50),
          ]);
        setLicenses(licensesData);
        setFrequencies(frequenciesData);
        setHasDatasets(myDatasetsData.data.length > 0);
        setTags(tagsData);
      } catch (error) {
        console.error("Error loading dropdown data:", error);
      }
    }
    loadDropdownData();
  }, []);

  // Restore dataset from API when datasetId is in the URL
  useEffect(() => {
    if (datasetId && !createdDataset) {
      async function restoreDataset() {
        try {
          const dataset = await fetchDataset(datasetId as string);
          setCreatedDataset(dataset);
        } catch (error) {
          console.error("Error restoring dataset:", error);
          setApiError("Não foi possível recuperar o conjunto de dados. Volte ao passo anterior.");
        }
      }
      restoreDataset();
    }
  }, [datasetId, createdDataset]);

  const clearError = (field: string) => {
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleStep2Next = async () => {
    const errors: Record<string, boolean> = {};
    if (!selectedProducerRef.current) errors.datasetProducer = true;
    if (!datasetTitle.trim()) errors.datasetTitle = true;
    if (!datasetDescription.trim()) errors.datasetDescription = true;
    if (!selectedFrequencyRef.current) errors.datasetFrequency = true;
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setApiError(null);
    setIsSubmitting(true);

    try {
      const payload: Parameters<typeof createDataset>[0] = {
        title: datasetTitle.trim(),
        description: datasetDescription.trim(),
        frequency: selectedFrequencyRef.current,
        private: true,
      };
      if (datasetAcronym.trim()) payload.acronym = datasetAcronym.trim();
      if (datasetShortDescription.trim()) {
        payload.description_short = datasetShortDescription.trim();
      } else {
        const desc = datasetDescription.trim();
        payload.description_short =
          desc.length > 197 ? desc.slice(0, 197) + "..." : desc;
      }
      if (selectedProducerRef.current && selectedProducerRef.current !== "user") {
        payload.organization = selectedProducerRef.current;
      }
      if (selectedLicenseRef.current) payload.license = selectedLicenseRef.current;
      if (selectedKeywordsRef.current) {
        payload.tags = selectedKeywordsRef.current.split(",").filter(Boolean);
      }
      if (selectedContactPointIds.length > 0) {
        payload.contact_points = selectedContactPointIds;
      }
      if (temporalStart) {
        payload.temporal_coverage = {
          start: temporalStart,
          ...(temporalEnd ? { end: temporalEnd } : {}),
        };
      }

      const dataset = await createDataset(payload);
      setCreatedDataset(dataset);
      if (onDatasetCreated) {
        onDatasetCreated(dataset.id);
      } else {
        router.push(
          `/pages/admin/datasets/new?step=${currentStep + 1}&datasetId=${dataset.id}`,
        );
      }
    } catch (error: unknown) {
      const err = error as { status?: number; data?: Record<string, unknown> };
      if (err.data && typeof err.data === "object") {
        const flattenValue = (val: unknown): string => {
          if (Array.isArray(val)) return val.map(flattenValue).join("; ");
          if (val && typeof val === "object") return Object.values(val as Record<string, unknown>).map(flattenValue).join("; ");
          return String(val);
        };
        const messages = Object.entries(err.data)
          .map(([key, val]) => `${key}: ${flattenValue(val)}`)
          .join(", ");
        setApiError(messages);
      } else {
        setApiError("Erro ao criar o conjunto de dados. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep3Next = async () => {
    const hasFiles = uploadedFiles.length > 0;
    const hasUrl = resourceUrl.trim().startsWith("https://");

    if (!hasFiles && !hasUrl) {
      setShowFileError(true);
      return;
    }
    if (!createdDataset) {
      setApiError("Erro: o conjunto de dados não foi criado. Volte ao passo anterior e preencha o formulário.");
      return;
    }

    setApiError(null);
    setIsSubmitting(true);
    try {
      if (hasFiles) {
        for (const file of uploadedFiles) {
          await uploadResource(createdDataset.id, file);
        }
      }
      if (hasUrl) {
        await createResource(createdDataset.id, {
          title: resourceUrl.trim(),
          type: "main",
          url: resourceUrl.trim(),
          filetype: "remote",
          format: "",
        });
      }
      onNextStep();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error uploading resources:", error.message, error.stack);
        setApiError(`Erro ao carregar ficheiro: ${error.message}`);
      } else {
        const err = error as { status?: number; data?: Record<string, unknown> };
        console.error("Error uploading resources:", err.status, err.data);
        if (err.data && typeof err.data === "object" && Object.keys(err.data).length > 0) {
          const msg =
            (err.data.message as string) ||
            Object.entries(err.data)
              .map(([key, val]) => `${key}: ${val}`)
              .join(", ");
          setApiError(`Erro ao carregar ficheiro: ${msg}`);
        } else {
          const statusHint = err.status ? ` (${err.status})` : "";
          setApiError(`Erro ao carregar ficheiro${statusHint}. Tente novamente.`);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!createdDataset) return;
    setApiError(null);
    setIsSubmitting(true);
    try {
      await updateDataset(createdDataset.id, { private: false });
      if (onComplete) onComplete();
      else router.push("/pages/admin/me/datasets");
    } catch (error) {
      console.error("Error publishing dataset:", error);
      setApiError("Erro ao publicar o conjunto de dados. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    if (onComplete) onComplete();
    else router.push("/pages/admin/me/datasets");
  };

  const auxiliarItemsStep2 = [
    {
      title: "Nomeando seu conjunto de dados",
      content: (
        <>
          <p>
            O título do seu conjunto de dados deve ser o mais preciso e específico possível.
          </p>
          <p>
            Deve também corresponder ao vocabulário utilizado pelos utilizadores que, na maioria
            das vezes, procuram dados através de um motor de pesquisa.
          </p>
        </>
      ),
      hasError: !!formErrors.datasetTitle,
    },
    {
      title: "Adicione uma sigla ao conjunto de dados.",
      content:
        "Tem a opção de adicionar uma sigla ao seu conjunto de dados. As letras que compõem essa sigla não precisam ser separadas por pontos.",
    },
    {
      title: "Escreva uma boa descrição",
      content: (
        <>
          <p>
            A descrição do seu conjunto de dados permite que os utilizadores obtenham informações sobre
            o conteúdo e a estrutura dos recursos publicados; pode, em particular, fornecer
            informações como:
          </p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-2">
            <li>A lista de ficheiros disponibilizados;</li>
            <li>Descrição do formato do ficheiro;</li>
            <li>A frequência de atualização.</li>
          </ul>
          <ul className="list-disc pl-5 mt-4 flex flex-col gap-2">
            <li>As motivações para a criação do conjunto de dados;</li>
            <li>A composição do conjunto de dados;</li>
            <li>O processo de coleta de dados;</li>
            <li>Pré-processamento de dados;</li>
            <li>A distribuição do conjunto de dados;</li>
            <li>Manutenção de conjuntos de dados;</li>
            <li>Considerações legais e éticas.</li>
          </ul>
        </>
      ),
      hasError: !!formErrors.datasetDescription,
    },
    {
      title: "Escreva uma breve descrição.",
      content: (
        <>
          <p>
            A descrição resumida apresenta seu conjunto de dados em uma ou duas frases. Isso ajuda
            os utilizadores a entenderem rapidamente o conteúdo e melhora sua visibilidade nos
            resultados de pesquisa.
          </p>
          <p className="font-bold mt-3">Sugestões automáticas</p>
          <p className="mt-2">
            Uma primeira versão pode ser gerada automaticamente se já tiver preenchido o título
            e uma descrição de pelo menos 200 caracteres, sendo então adaptada de acordo com as suas
            necessidades.
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
      title: "Adicionar palavras-chave",
      content: (
        <>
          <p>
            As palavras-chave descrevem seu conjunto de dados e facilitam sua descoberta. Elas
            melhoram seu posicionamento nos mecanismos de pesquisa e ajudam os utilizadores a encontrar
            com mais facilidade os dados que procuram.
          </p>
          <p className="font-bold mt-3">Sugestões automáticas</p>
          <p className="mt-2">
            Com base no conteúdo do seu conjunto de dados, podem ser sugeridas palavras-chave
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
      title: "Selecione uma licença",
      content:
        "As licenças definem as regras para a reutilização. Ao escolher uma licença de reutilização, garante que o conjunto de dados publicado será reutilizado de acordo com os termos de uso que definiu.",
    },
    {
      title: "Escolha a frequência de atualização.",
      content:
        "A frequência de atualização refere-se à frequência com que planeja atualizar os dados publicados. Essa frequência de atualização é apenas indicativa.",
      hasError: !!formErrors.datasetFrequency,
    },
    {
      title: "Forneça a cobertura de tempo.",
      content: (
        <>
          <p>A abrangência temporal indica o período de tempo dos dados publicados.</p>
          <p>Por exemplo: de 2012 a 2015.</p>
        </>
      ),
    },
    {
      title: "Complete as informações espaciais",
      content: (
        <>
          <p>
            A granularidade espacial indica o nível mais detalhado de informações geográficas que
            seus dados podem abranger.
          </p>
          <p>Por exemplo: em nível departamental ou municipal.</p>
        </>
      ),
    },
  ];

  const auxiliarItemsStep3 = [
    {
      title: "Escolher o formato certo",
      content: (
        <>
          <p>Os formatos devem ser:</p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-2">
            <li>
              <strong>Aberto:</strong> um formato aberto não adiciona especificações técnicas que
              restrinjam o uso dos dados (por exemplo, o uso de software pago);
            </li>
            <li>
              <strong>facilmente reutilizável:</strong> um formato facilmente reutilizável implica
              que qualquer pessoa ou servidor pode reutilizar facilmente o conjunto de dados;
            </li>
            <li>
              <strong>Utilizável em um sistema de processamento automatizado:</strong> um sistema de
              processamento automatizado permite operações automáticas relacionadas ao processamento
              de dados (por exemplo, um ficheiro CSV é facilmente utilizável por um sistema
              automatizado, ao contrário de um ficheiro PDF).
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Adicionar documentação",
      content: (
        <>
          <p>
            A descrição de um ficheiro facilita a reutilização de dados. Ela inclui, entre outras
            coisas:
          </p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-2">
            <li>uma descrição geral do conjunto de dados;</li>
            <li>uma descrição do método de produção de dados;</li>
            <li>uma descrição do modelo de dados;</li>
            <li>uma descrição do esquema de dados;</li>
            <li>uma descrição dos metadados;</li>
            <li>Uma descrição das principais mudanças.</li>
          </ul>
          <p className="text-red-500 mt-3 font-medium">
            Não adicionou nenhum ficheiro de documentação nem descreveu seus ficheiros.
          </p>
        </>
      ),
    },
  ];

  const auxiliarItems =
    currentStep === 3 || currentStep === 4 ? auxiliarItemsStep3 : auxiliarItemsStep2;

  return (
    <>
      {/* Main content area: form + auxiliar sidebar */}
      <div className="admin-page__body">
        {/* Left: Form */}
        <div className="admin-page__form-area">
          {apiError && (
            <StatusCard type="danger" description={apiError} />
          )}

          {/* Step 2: Descreva o conjunto de dados */}
          {currentStep === 2 && (
            <>
              <StatusCard
                type="info"
                description={
                  <>
                    <strong>O que é um conjunto de dados?</strong>
                    <br />
                    Em dados.gov, um conjunto de dados é um conjunto de ficheiros.
                  </>
                }
              />
              <p className="text-neutral-900 text-base leading-7 pt-32">
                Os campos marcados com um asterisco ( * ) são obrigatórios.
              </p>
              <h2 className="admin-page__section-title">Produtor</h2>

              <div className="admin-page__fields-group">
                <span className="text-primary-900 text-base font-medium leading-7">
                  Verifique a identidade que deseja usar na publicação.
                </span>
                <IsolatedSelect
                  label="Produtor*"
                  placeholder="Selecione o produtor..."
                  id="dataset-producer"
                  onChangeRef={selectedProducerRef}
                  onChangeCallback={(value) => {
                    setSelectedProducer(value);
                    if (value) {
                      setFormErrors((prev) => {
                        const next = { ...prev };
                        delete next.datasetProducer;
                        return next;
                      });
                    }
                  }}
                  hasError={!!formErrors.datasetProducer}
                  errorFeedbackText="Campo obrigatório"
                >
                  {producerOptions}
                </IsolatedSelect>
              </div>

              {(!user?.organizations || user.organizations.length === 0) && (
                <div className="admin-page__org-card flex flex-col items-center gap-[16px] bg-neutral-50 rounded-lg p-8 text-center mt-[24px]">
                  <h3 className="text-primary-900 text-lg font-bold leading-7">
                    Você não pertence a nenhuma organização.
                  </h3>
                  <p className="text-neutral-700 text-base leading-7">
                    Recomendamos que publique em nome de uma organização se se tratar de uma
                    atividade profissional.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => router.push("/pages/admin/organizations/new")}
                  >
                    Crie ou participe de uma organização
                  </Button>
                </div>
              )}




              <form
                className="admin-page__form"
                onSubmit={(e) => e.preventDefault()}
              >
                <h2 className="admin-page__section-title">Descrição</h2>

                <div className="admin-page__fields-group">
                  <InputText
                    label="Título*"
                    placeholder="Insira o título aqui"
                    id="api-name"
                    value={datasetTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setDatasetTitle(e.target.value);
                      if (e.target.value.trim()) clearError("datasetTitle");
                    }}
                    hasError={!!formErrors.datasetTitle}
                    hasFeedback={!!formErrors.datasetTitle}
                    feedbackState="danger"
                    errorFeedbackText="Campo obrigatório"
                  />
                  <InputText
                    label="Sigla"
                    placeholder="Insira a sigla aqui"
                    id="api-acronym"
                    value={datasetAcronym}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setDatasetAcronym(e.target.value);
                    }}
                  />
                  <InputTextArea
                    label="Descrição*"
                    placeholder="Insira a descrição aqui"
                    id="dataset-description"
                    rows={4}
                    maxLength={246}
                    showCharCounter={true}
                    value={datasetDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      setDatasetDescription(e.target.value);
                      if (e.target.value.trim()) clearError("datasetDescription");
                    }}
                    hasError={!!formErrors.datasetDescription}
                    hasFeedback={!!formErrors.datasetDescription || datasetDescription.length < 200}
                    feedbackState={formErrors.datasetDescription ? "danger" : "warning"}
                    feedbackText="Recomenda-se que a descrição tenha pelo menos 200 caracteres."
                    errorFeedbackText="Campo obrigatório"
                  />
                  <InputTextArea
                    label="Descrição resumida"
                    placeholder="Insira a descrição aqui"
                    id="dataset-short-description"
                    rows={3}
                    maxLength={200}
                    showCharCounter={true}
                    value={datasetShortDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      setDatasetShortDescription(e.target.value);
                      if (e.target.value.trim()) clearError("datasetShortDescription");
                    }}
                    hasFeedback
                    feedbackState="info"
                    feedbackText="Se este campo for deixado em branco, serão utilizados os primeiros 197 caracteres da sua descrição, seguidos de '...' (máximo de 200 caracteres)."
                  />
                  <IsolatedSelect
                    label="Palavras-chave"
                    placeholder="Pesquise por uma palavra-chave..."
                    id="dataset-keywords"
                    type="checkbox"
                    searchable
                    searchInputPlaceholder="Escreva para pesquisar..."
                    searchNoResultsText="Nenhum resultado encontrado"
                    onChangeRef={selectedKeywordsRef}
                  >
                    {tagOptions}
                  </IsolatedSelect>
                </div>



                <h2 className="admin-page__section-title">Acesso</h2>

                <div className="admin-page__fields-group">
                  <div className="flex flex-col gap-[8px]">
                    <span className="text-primary-900 text-base font-medium leading-7">
                      Tipo de acesso
                    </span>
                    <div className="flex flex-col gap-4">
                      <RadioButton
                        label="Aberto"
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

                  {accessType === "restricted" && (
                    <>
                      <div className="grid grid-cols-3 gap-8 mt-4 items-end">
                        <IsolatedSelect
                          label="Comunidade e Administração"
                          placeholder=""
                          id="dataset-restriction-community"
                          onChangeRef={dummyRef}
                        >
                          <DropdownSection name="community">
                            <DropdownOption value="sim">Sim</DropdownOption>
                            <DropdownOption value="nao">Não</DropdownOption>
                            <DropdownOption value="condicional">Condicional</DropdownOption>
                          </DropdownSection>
                        </IsolatedSelect>
                        <IsolatedSelect
                          label="Empresa e Associação"
                          placeholder=""
                          id="dataset-restriction-enterprise"
                          onChangeRef={dummyRef}
                        >
                          <DropdownSection name="enterprise">
                            <DropdownOption value="sim">Sim</DropdownOption>
                            <DropdownOption value="nao">Não</DropdownOption>
                            <DropdownOption value="condicional">Condicional</DropdownOption>
                          </DropdownSection>
                        </IsolatedSelect>
                        <IsolatedSelect
                          label="Privado"
                          placeholder=""
                          id="dataset-restriction-private"
                          onChangeRef={dummyRef}
                        >
                          <DropdownSection name="private">
                            <DropdownOption value="sim">Sim</DropdownOption>
                            <DropdownOption value="nao">Não</DropdownOption>
                            <DropdownOption value="condicional">Condicional</DropdownOption>
                          </DropdownSection>
                        </IsolatedSelect>
                      </div>
                      <IsolatedSelect
                        label="Motivo da restrição"
                        placeholder=""
                        id="dataset-restriction-reason"
                        onChangeRef={dummyRef}
                      >
                        <DropdownSection name="restriction-reason">
                          <DropdownOption value="confidencialidade-procedimentos">Confidencialidade dos procedimentos das autoridades públicas</DropdownOption>
                          <DropdownOption value="relacoes-internacionais">Relações internacionais, segurança pública ou defesa nacional</DropdownOption>
                          <DropdownOption value="curso-justica">Curso da justiça</DropdownOption>
                          <DropdownOption value="confidencialidade-comercial">Confidencialidade comercial ou industrial</DropdownOption>
                          <DropdownOption value="propriedade-intelectual">Direitos de propriedade intelectual</DropdownOption>
                          <DropdownOption value="dados-pessoais">Confidencialidade dos dados pessoais</DropdownOption>
                          <DropdownOption value="protecao-fornecedores">Proteção dos fornecedores voluntários de informações</DropdownOption>
                          <DropdownOption value="protecao-ambiental">Proteção ambiental</DropdownOption>
                          <DropdownOption value="outros">Outros</DropdownOption>
                        </DropdownSection>
                      </IsolatedSelect>
                    </>
                  )}

                  <IsolatedSelect
                    label="Licença"
                    placeholder="Selecione uma licença"
                    id="dataset-license"
                    onChangeRef={selectedLicenseRef}
                  >
                    {licenseOptions}
                  </IsolatedSelect>
                </div>

                {selectedProducer && selectedProducer !== "user" && (
                  <>
                    <h2 className="admin-page__section-title">
                      Pontos de contato
                    </h2>

                    <div className="admin-page__fields-group">
                      <span className="text-primary-900 text-base font-medium leading-7">
                        Escolha um ponto de contato.
                      </span>

                      {draftContacts.map((draft) =>
                        draft.saved ? (
                          <div
                            key={draft.id}
                            className="border border-neutral-300 rounded"
                          >
                            <div
                              className="flex items-center justify-between
                                px-4 py-3 border-b border-neutral-200"
                            >
                              <span className="text-primary-900 text-sm">
                                {draft.name}
                              </span>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDraftContacts((prev) =>
                                      prev.filter((d) => d.id !== draft.id),
                                    )
                                  }
                                  className="text-neutral-500 hover:text-neutral-700"
                                  aria-label="Remover contato"
                                >
                                  <Icon
                                    name="agora-line-trash"
                                    className="w-4 h-4"
                                  />
                                </button>
                              </div>
                            </div>
                            <div className="px-4 py-3 flex flex-col gap-1">
                              {draft.email && (
                                <span className="text-neutral-700 text-sm">
                                  E-mail de contato : {draft.email}
                                </span>
                              )}
                              {draft.link && (
                                <span className="text-neutral-700 text-sm">
                                  URL de contato: {draft.link}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div key={draft.id}>
                            <div
                              className="text-primary-900 text-base
                                font-medium leading-7"
                              style={{ paddingBottom: "16px" }}
                            >
                              Escolha um ponto de contato.
                            </div>
                            <div style={{ paddingBottom: "24px" }}>
                              <InputText
                                label="Nome *"
                                placeholder="Por exemplo, o nome do serviço."
                                id={`contact-name-${draft.id}`}
                                value={draft.name}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                  updateDraft(
                                    draft.id,
                                    "name",
                                    e.target.value,
                                  )
                                }
                                hasError={!!draft.errors.name}
                                hasFeedback={!!draft.errors.name}
                                feedbackState="danger"
                                errorFeedbackText="Campo obrigatório"
                              />
                            </div>
                            <div
                              className="grid grid-cols-2 gap-[18px]"
                              style={{ paddingBottom: "24px" }}
                            >
                              <InputText
                                label="E-mail"
                                placeholder="contact@organisation.org"
                                id={`contact-email-${draft.id}`}
                                value={draft.email}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                  updateDraft(
                                    draft.id,
                                    "email",
                                    e.target.value,
                                  )
                                }
                                hasError={!!draft.errors.email}
                                hasFeedback={!!draft.errors.email}
                                feedbackState="danger"
                                errorFeedbackText="Preencha o e-mail ou a reutilização"
                              />
                              <InputText
                                label="Reutilização"
                                placeholder="https://..."
                                id={`contact-link-${draft.id}`}
                                value={draft.link}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                  updateDraft(
                                    draft.id,
                                    "link",
                                    e.target.value,
                                  )
                                }
                                hasError={!!draft.errors.link}
                                hasFeedback={!!draft.errors.link}
                                feedbackState="danger"
                                errorFeedbackText="Preencha o e-mail ou a reutilização"
                              />
                            </div>
                            <div style={{ paddingBottom: "24px" }}>
                              <Button
                                appearance="outline"
                                variant="primary"
                                hasIcon
                                leadingIcon="agora-line-check-circle"
                                leadingIconHover="agora-solid-check-circle"
                                onClick={() =>
                                  handleSaveContactDraft(draft.id)
                                }
                              >
                                Guardar contato
                              </Button>
                            </div>
                          </div>
                        ),
                      )}

                      <div style={{ marginTop: "-16px" }}>
                        <Button
                          appearance="outline"
                          variant="primary"
                          hasIcon
                          leadingIcon="agora-line-plus-circle"
                          leadingIconHover="agora-solid-plus-circle"
                          onClick={() => {
                            draftIdRef.current += 1;
                            setDraftContacts((prev) => [
                              ...prev,
                              {
                                id: draftIdRef.current,
                                name: "",
                                email: "",
                                link: "",
                                saved: false,
                                errors: {},
                              },
                            ]);
                          }}
                        >
                          Novo contato
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                <h2 className="admin-page__section-title">Tempo</h2>

                <div className="admin-page__fields-group">
                  <IsolatedSelect
                    label="Frequência de atualização *"
                    placeholder="Procure uma frequência..."
                    id="dataset-frequency"
                    onChangeRef={selectedFrequencyRef}
                    hasError={!!formErrors.datasetFrequency}
                    errorFeedbackText="Campo obrigatório"
                  >
                    {frequencyOptions}
                  </IsolatedSelect>

                  <div className="grid grid-cols-2 gap-[18px]">
                    <InputDate
                      label="Cobertura temporal (Data de início)"
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTemporalStart(e.target.value)}
                    />
                    <InputDate
                      label="Data de fim"
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTemporalEnd(e.target.value)}
                    />
                  </div>
                </div>

                <h2 className="admin-page__section-title">Espaço</h2>

                <div className="admin-page__fields-group">
                  <IsolatedSelect
                    label="Cobertura espacial"
                    placeholder="Procurando cobertura espacial..."
                    id="dataset-spatial-coverage"
                    searchable
                    searchInputPlaceholder="Escreva para pesquisar..."
                    searchNoResultsText="Nenhum resultado encontrado"
                    onChangeRef={dummyRef}
                  >
                    <DropdownSection name="spatial-coverage">
                      <DropdownOption value="national">Nacional</DropdownOption>
                      <DropdownOption value="regional">Regional</DropdownOption>
                      <DropdownOption value="local">Local</DropdownOption>
                    </DropdownSection>
                  </IsolatedSelect>

                  <IsolatedSelect
                    label="Granularidade espacial"
                    placeholder="Procurando granularidade..."
                    id="dataset-spatial-granularity"
                    searchable
                    searchInputPlaceholder="Escreva para pesquisar..."
                    searchNoResultsText="Nenhum resultado encontrado"
                    onChangeRef={dummyRef}
                  >
                    <DropdownSection name="spatial-granularity">
                      <DropdownOption value="country">País</DropdownOption>
                      <DropdownOption value="district">Distrito</DropdownOption>
                      <DropdownOption value="municipality">Município</DropdownOption>
                      <DropdownOption value="parish">Freguesia</DropdownOption>
                    </DropdownSection>
                  </IsolatedSelect>
                </div>

                <div className="admin-page__actions flex justify-between gap-[18px]">
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
                    onClick={handleStep2Next}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "A criar..." : "Seguinte"}
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* Step 3: Adicionar ficheiros */}
          {currentStep === 3 && (
            <>
              <StatusCard
                type="info"
                description={
                  <>
                    <strong>O que é um ficheiro?</strong>
                    <br />
                    Um conjunto de dados pode conter vários tipos de ficheiros
                    (atualizações, histórico, documentação, código-fonte, API, links, etc.).
                  </>
                }
              />

              <div className="admin-page__form">
                <FileUploadModal
                  uploadedFiles={uploadedFiles}
                  resourceUrl={resourceUrl}
                  hasError={showFileError}
                  onFilesChange={(files) => {
                    setUploadedFiles(files);
                    if (files.length > 0) setShowFileError(false);
                  }}
                  onUrlChange={(url) => {
                    setResourceUrl(url);
                    if (url.trim().startsWith("https://")) setShowFileError(false);
                  }}
                />

                <div className="admin-page__actions">
                  <Button
                    appearance="outline"
                    variant="neutral"
                    hasIcon
                    leadingIcon="agora-line-arrow-left-circle"
                    leadingIconHover="agora-solid-arrow-left-circle"
                    onClick={onPreviousStep}
                    disabled={isSubmitting}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="primary"
                    hasIcon
                    trailingIcon="agora-line-arrow-right-circle"
                    trailingIconHover="agora-solid-arrow-right-circle"
                    onClick={handleStep3Next}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "A carregar..." : "Seguinte"}
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Step 4: Finalizar a publicação */}
          {currentStep === 4 && (
            <>
              <StatusCard
                type="success"
                description={
                  <>
                    <strong>O seu conjunto de dados foi criado!</strong>
                    <br />
                    Agora pode publicar ou guardar como rascunho.
                  </>
                }
              />

              {(() => {
                const qualityScore = createdDataset?.quality?.score != null
                  ? Math.round(createdDataset.quality.score * 100)
                  : 0;
                const formatMetric = (value: number | undefined) => {
                  if (!value) return "0";
                  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(".", ",") + " M";
                  if (value >= 1_000) return (value / 1_000).toFixed(0) + " mil";
                  return String(value);
                };
                const timeAgo = createdDataset?.last_modified
                  ? formatDistanceToNow(new Date(createdDataset.last_modified), { locale: pt })
                      .replace("aproximadamente ", "")
                      .replace("quase ", "")
                      .replace("menos de ", "")
                      .replace("cerca de ", "")
                  : "agora";
                const href = createdDataset
                  ? `/pages/datasets/${createdDataset.slug}`
                  : `/pages/datasets/preview?title=${encodeURIComponent(datasetTitle)}&description=${encodeURIComponent(datasetDescription)}`;
                return (
                  <Link
                    href={href}
                    className="card-general-listing rounded-[4px] overflow-hidden flex flex-col"
                  >
                    <CardGeneral
                      variant="neutral-100"
                      image={{
                        src: createdDataset?.organization?.logo || "/images/placeholders/organization.png",
                        alt: createdDataset?.organization?.name || "Organização",
                        height: "56px",
                        className: "bg-primary-100 !object-contain !h-[56px]",
                      }}
                      subtitleText={
                        (
                          <div className="flex flex-col">
                            <span style={{ fontSize: "16px" }} className="text-neutral-900">{timeAgo}</span>
                            <span style={{ fontSize: "16px", fontWeight: 300 }} className="text-neutral-900 mt-4">
                              {createdDataset?.organization?.name || "Sem Organização"}
                            </span>
                          </div>
                        ) as unknown as string
                      }
                      titleText={createdDataset?.title || datasetTitle || "Sem título"}
                      descriptionText={
                        (
                          <div className="flex flex-col grow">
                            <p className="text-m-regular text-neutral-800 line-clamp-3 mb-16">
                              {createdDataset?.description || datasetDescription || "Sem descrição"}
                            </p>
                            <div className={`mt-auto ${qualityScore <= 45 ? "quality-progress-warning" : qualityScore > 50 ? "quality-progress-success" : ""}`}>
                              <ProgressBar
                                value={qualityScore}
                                max={100}
                                hideLabel={true}
                                hidePercentageValue={true}
                              />
                              <span className="text-[14px] text-neutral-900 mt-4 block">
                                {qualityScore}% Qualidade dos metadados
                              </span>
                              <div className="flex items-center flex-wrap gap-8 text-xs mt-12 text-neutral-700">
                                <div className="flex items-center gap-8" title="Visualizações">
                                  <Icon
                                    name={createdDataset?.metrics?.views ? "agora-solid-eye" : "agora-line-eye"}
                                    dimensions="xs"
                                    className="fill-neutral-700"
                                    aria-hidden="true"
                                  />
                                  <span>{formatMetric(createdDataset?.metrics?.views)}</span>
                                </div>
                                <div className="flex items-center gap-8" title="Downloads">
                                  <Icon
                                    name={createdDataset?.metrics?.resources_downloads ? "agora-solid-download" : "agora-line-download"}
                                    dimensions="xs"
                                    className="fill-neutral-700"
                                    aria-hidden="true"
                                  />
                                  <span>{formatMetric(createdDataset?.metrics?.resources_downloads)}</span>
                                </div>
                                <div className="flex items-center gap-8" title="Reutilizações">
                                  <img src="/Icons/bar_chart.svg" className="w-16 h-16" alt="" aria-hidden="true" />
                                  <span>{createdDataset?.metrics?.reuses || 0}</span>
                                </div>
                                <div className="flex items-center gap-8" title="Favoritos">
                                  <Icon
                                    name={createdDataset?.metrics?.followers ? "agora-solid-star" : "agora-line-star"}
                                    dimensions="xs"
                                    className="fill-neutral-700"
                                    aria-hidden="true"
                                  />
                                  <span>{formatMetric(createdDataset?.metrics?.followers)}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-8 text-primary-600 mt-16">
                                <Icon
                                  name="agora-line-arrow-right-circle"
                                  className="w-32 h-32"
                                  aria-hidden="true"
                                />
                              </div>
                            </div>
                          </div>
                        ) as unknown as string
                      }
                      isBlockedLink={true}
                      anchor={{ href }}
                    />
                  </Link>
                );
              })()}

              <Button
                appearance="link"
                variant="primary"
                hasIcon
                trailingIcon="agora-line-external-link"
                trailingIconHover="agora-solid-external-link"
              >
                Dê-nos o seu feedback sobre o processo de publicação.
              </Button>

              <div className="admin-page__actions flex justify-end gap-[18px]">
                <Button
                  appearance="outline"
                  variant="neutral"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                >
                  Salvar rascunho
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePublish}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "A publicar..." : "Publique o conjunto de dados"}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Right: Auxiliar sidebar */}
        {currentStep !== 4 && (
          <aside className="admin-page__auxiliar">
            <div className="admin-page__auxiliar-inner">
              <div className="admin-page__auxiliar-header">
                <Icon
                  name="agora-line-question-mark"
                  className="w-[24px] h-[24px]"
                />
                <h2 className="admin-page__auxiliar-title">Auxiliar</h2>
              </div>
              <AuxiliarList items={auxiliarItems} />
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
