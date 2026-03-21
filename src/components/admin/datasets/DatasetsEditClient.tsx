"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
  Icon,
  InputText,
  InputTextArea,
  InputSelect,
  InputDate,
  DropdownSection,
  DropdownOption,
  StatusCard,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Pill,
  RadioButton,
  ButtonUploader,
  CardNoResults,
  Tabs,
  Tab,
  TabHeader,
  TabBody,
} from "@ama-pt/agora-design-system";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  fetchDataset,
  updateDataset,
  deleteDataset,
  uploadResource,
  deleteResource,
  fetchLicenses,
  fetchFrequencies,
  fetchActivity,
} from "@/services/api";
import { Dataset, License, Frequency, Activity, Resource } from "@/types/api";
import AuxiliarList from "@/components/admin/AuxiliarList";

export default function DatasetsEditClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const datasetId = searchParams.get("id") || "";
  const slug = searchParams.get("slug") || datasetId;

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [acronym, setAcronym] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [selectedLicense, setSelectedLicense] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [temporalStart, setTemporalStart] = useState("");
  const [temporalEnd, setTemporalEnd] = useState("");
  const [accessType, setAccessType] = useState("open");

  // API state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  // Dropdown data
  const [licenses, setLicenses] = useState<License[]>([]);
  const [frequencies, setFrequencies] = useState<Frequency[]>([]);

  // Activity data
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesLoaded, setActivitiesLoaded] = useState(false);
  const [latestActivity, setLatestActivity] = useState<Activity | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [ds, licensesData, frequenciesData] = await Promise.all([
          fetchDataset(slug),
          fetchLicenses(),
          fetchFrequencies(),
        ]);
        setDataset(ds);
        setTitle(ds.title);
        setAcronym(ds.acronym || "");
        setDescription(ds.description);
        setShortDescription(ds.description_short || "");
        setSelectedLicense(ds.license || "");
        setSelectedFrequency(ds.frequency || "");
        if (ds.temporal_coverage) {
          setTemporalStart(ds.temporal_coverage.start || "");
          setTemporalEnd(ds.temporal_coverage.end || "");
        }
        setLicenses(licensesData);
        setFrequencies(frequenciesData);

        fetchActivity(ds.id, 1, 1)
          .then((res) => {
            if (res.data.length > 0) setLatestActivity(res.data[0]);
          })
          .catch((err) => console.error("Error loading latest activity:", err));
      } catch (error) {
        console.error("Error loading dataset:", error);
        setApiError("Erro ao carregar o conjunto de dados.");
      } finally {
        setIsLoading(false);
      }
    }
    if (slug) loadData();
  }, [slug]);

  const loadActivities = () => {
    if (activitiesLoaded || !dataset) return;
    setActivitiesLoading(true);
    fetchActivity(dataset.id)
      .then((res) => {
        setActivities(res.data);
        setActivitiesLoaded(true);
      })
      .catch((err) => console.error("Error loading activities:", err))
      .finally(() => setActivitiesLoading(false));
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

  const handleSaveMetadata = async () => {
    if (!dataset) return;
    const errors: Record<string, boolean> = {};
    if (!title.trim()) errors.title = true;
    if (!description.trim()) errors.description = true;
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setApiError(null);
    setApiSuccess(null);
    setIsSubmitting(true);

    try {
      const updated = await updateDataset(dataset.id, {
        title: title.trim(),
        description: description.trim(),
        description_short: shortDescription.trim() || undefined,
        acronym: acronym.trim() || undefined,
        license: selectedLicense || undefined,
        frequency: selectedFrequency || undefined,
        temporal_coverage: temporalStart
          ? { start: temporalStart, ...(temporalEnd ? { end: temporalEnd } : {}) }
          : undefined,
      });
      setDataset(updated);
      setApiSuccess("Conjunto de dados atualizado com sucesso.");
    } catch (error: unknown) {
      const err = error as { status?: number; data?: Record<string, unknown> };
      if (err.data && typeof err.data === "object") {
        const messages = Object.entries(err.data)
          .map(([key, val]) => `${key}: ${val}`)
          .join(", ");
        setApiError(messages);
      } else {
        setApiError("Erro ao atualizar o conjunto de dados.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDataset = async () => {
    if (!dataset) return;
    if (!confirm("Tem certeza que deseja eliminar este conjunto de dados?")) return;
    setIsSubmitting(true);
    try {
      await deleteDataset(dataset.id);
      router.push("/pages/admin/me/datasets");
    } catch (error) {
      console.error("Error deleting dataset:", error);
      setApiError("Erro ao eliminar o conjunto de dados.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files;
    if (!files || files.length === 0 || !dataset) return;
    setIsSubmitting(true);
    setApiError(null);
    try {
      for (const file of Array.from(files)) {
        await uploadResource(dataset.id, file);
      }
      const updated = await fetchDataset(slug);
      setDataset(updated);
      setApiSuccess("Ficheiro(s) carregado(s) com sucesso.");
    } catch (error) {
      console.error("Error uploading resource:", error);
      setApiError("Erro ao carregar ficheiro(s).");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResource = async (resource: Resource) => {
    if (!dataset) return;
    if (!confirm(`Tem certeza que deseja eliminar "${resource.title}"?`)) return;
    setIsSubmitting(true);
    try {
      await deleteResource(dataset.id, resource.id);
      const updated = await fetchDataset(slug);
      setDataset(updated);
    } catch (error) {
      console.error("Error deleting resource:", error);
      setApiError("Erro ao eliminar o ficheiro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="datasets-admin-page">
        <p className="text-neutral-600">A carregar...</p>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="datasets-admin-page">
        <StatusCard type="danger" description="Conjunto de dados não encontrado." />
        <Button
          variant="primary"
          onClick={() => router.push("/pages/admin/me/datasets")}
        >
          Voltar
        </Button>
      </div>
    );
  }

  const qualityCriteria: (keyof NonNullable<Dataset["quality"]>)[] = [
    "dataset_description_quality",
    "has_resources",
    "license",
    "has_open_format",
    "all_resources_available",
    "resources_documentation",
    "spatial",
    "temporal_coverage",
    "update_frequency",
  ];

  const qualityScore = (() => {
    const q = dataset.quality;
    if (!q) return 0;
    if (q.score > 0) return Math.round(q.score * 100);
    const met = qualityCriteria.filter((key) => q[key] === true).length;
    return Math.round((met / qualityCriteria.length) * 100);
  })();

  const metadataCount = (() => {
    const q = dataset.quality;
    if (!q) return 0;
    return qualityCriteria.filter((key) => q[key] === true).length;
  })();

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Conjuntos de dados", url: "/pages/admin/me/datasets" },
            { label: dataset.title, url: "#" },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">{dataset.title}</h1>
        <Button
          variant="primary"
          appearance="outline"
          onClick={() => window.open(`/pages/datasets/${dataset.slug}`, "_blank")}
        >
          <span className="dataset-edit-info__btn-content">
            <Icon name="agora-line-eye" className="w-[16px] h-[16px]" />
            Ver página pública do conjunto de dados
          </span>
        </Button>
      </div>

      {apiError && <StatusCard type="danger" description={apiError} />}
      {apiSuccess && <StatusCard type="success" description={apiSuccess} />}

      <div className="dataset-edit-info">
        <div className="dataset-edit-info__badges">
          <Pill variant={dataset.private ? "warning" : "success"}>
            {dataset.private ? "RASCUNHO" : "PÚBLICO"}
          </Pill>
          {dataset.featured && <Pill variant="informative">DESTAQUE</Pill>}
          <span className="dataset-edit-info__stat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dataset-edit-info__stat-icon">
              <path d="M4 22.9091V15.2727C4 14.6702 4.47969 14.1818 5.07143 14.1818C5.66316 14.1818 6.14286 14.6702 6.14286 15.2727V22.9091C6.14286 23.5116 5.66316 24 5.07143 24C4.47969 24 4 23.5116 4 22.9091ZM10.4286 22.9091V1.09091C10.4286 0.488417 10.9083 0 11.5 0C12.0917 0 12.5714 0.488417 12.5714 1.09091V22.9091C12.5714 23.5116 12.0917 24 11.5 24C10.9083 24 10.4286 23.5116 10.4286 22.9091ZM16.8571 22.9091V9.81818C16.8571 9.21569 17.3368 8.72727 17.9286 8.72727C18.5203 8.72727 19 9.21569 19 9.81818V22.9091C19 23.5116 18.5203 24 17.9286 24C17.3368 24 16.8571 23.5116 16.8571 22.9091Z" fill="#64718B" />
            </svg>
            {`${(dataset.metrics?.views ?? 0) + (dataset.metrics?.resources_downloads ?? 0) + (dataset.metrics?.reuses ?? 0) + (dataset.metrics?.followers ?? 0)} estatísticas`}
          </span>
          <span className="dataset-edit-info__stat">
            <Icon name="agora-line-document" className="dataset-edit-info__stat-icon" />
            {`${metadataCount} metadados`}
          </span>
          <span className="dataset-edit-info__stat">
            <Icon name="agora-line-star" className="dataset-edit-info__stat-icon" />
            {qualityScore > 0 ? (qualityScore / 10).toFixed(1).replace(".", ",") : "0"}
          </span>
        </div>

        <p className="dataset-edit-info__activity">
          <Icon name="agora-line-clock" className="dataset-edit-info__clock-icon" />
          {latestActivity ? (
            <>
              {" Atividade mais recente: "}
              <span className="text-neutral-900">
                {latestActivity.actor.first_name} {latestActivity.actor.last_name}
              </span>
              {" — "}
              {latestActivity.label}
              {" — "}
              <span className="text-neutral-900">
                {format(new Date(latestActivity.created_at), "d 'de' MMMM 'de' yyyy", {
                  locale: pt,
                })}
              </span>
            </>
          ) : (
            <>
              {" Atividade mais recente: "}
              {dataset.owner && (
                <>
                  <span className="text-neutral-900">
                    {dataset.owner.first_name} {dataset.owner.last_name}
                  </span>
                  {" "}
                </>
              )}
              {" — editou o conjunto de dados — "}
              {" "}
              <span className="text-neutral-900">
                {format(new Date(dataset.last_modified), "d 'de' MMMM 'de' yyyy", {
                  locale: pt,
                })}
              </span>
            </>
          )}
        </p>
      </div>

      <Tabs
        onTabActivation={(index: number) => {
          setApiError(null);
          setApiSuccess(null);
        }}
      >
        {/* Metadata Tab */}
        <Tab>
          <TabHeader>Metadados</TabHeader>
          <TabBody>
            <div className="datasets-admin-page__body">
              <div className="datasets-admin-page__form-area">
                {dataset.private && (
                  <div className="dataset-edit-visibility-banner">
                    <StatusCard
                      type="warning"
                      description={
                        <>
                          <strong>Modifique a visibilidade do conjunto de dados.</strong>
                          <br />
                          Este conjunto de dados é atualmente <strong>privado</strong>.
                          {" Somente você ou membros da sua organização podem visualizá-lo e contribuir para ele."}
                        </>
                      }
                    />
                    <div>
                      <Button
                        variant="primary"
                        appearance="outline"
                        onClick={async () => {
                          try {
                            const updated = await updateDataset(dataset.id, { private: false });
                            setDataset(updated);
                            setApiSuccess("Conjunto de dados publicado com sucesso.");
                          } catch {
                            setApiError("Erro ao publicar o conjunto de dados.");
                          }
                        }}
                        disabled={isSubmitting}
                      >
                        Publique o conjunto de dados
                      </Button>
                    </div>
                  </div>
                )}

                <form
                  className="datasets-admin-page__form"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <p className="text-neutral-900 text-base leading-7 pt-32">
                    Os campos marcados com um asterisco ( * ) são obrigatórios.
                  </p>

                  <h2 className="datasets-admin-page__section-title">Descrição</h2>
                  <div className="datasets-admin-page__fields-group">
                    <InputText
                      label="Título*"
                      placeholder="Insira o título aqui"
                      id="edit-title"
                      value={title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setTitle(e.target.value);
                        if (e.target.value.trim()) clearError("title");
                      }}
                      hasError={!!formErrors.title}
                      hasFeedback={!!formErrors.title}
                      feedbackState="danger"
                      errorFeedbackText="Campo obrigatório"
                    />
                    <InputText
                      label="Sigla"
                      placeholder="Insira a sigla aqui"
                      id="edit-acronym"
                      value={acronym}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAcronym(e.target.value)}
                    />
                    <InputTextArea
                      label="Descrição*"
                      placeholder="Insira a descrição aqui"
                      id="edit-description"
                      rows={6}
                      maxLength={246}
                      showCharCounter={true}
                      value={description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setDescription(e.target.value);
                        if (e.target.value.trim()) clearError("description");
                      }}
                      hasError={formErrors.description ? true : undefined}
                      hasFeedback={formErrors.description ? true : undefined}
                      feedbackState="danger"
                      feedbackText="Campo obrigatório"
                      errorFeedbackText="Campo obrigatório"
                    />
                    <InputTextArea
                      label="Descrição resumida"
                      placeholder="Insira a descrição aqui"
                      id="edit-short-description"
                      rows={3}
                      value={shortDescription}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setShortDescription(e.target.value)
                      }
                    />
                    <div className="flex items-center justify-between">
                      <Button appearance="outline" variant="primary" hasIcon leadingIcon="agora-line-edit" leadingIconHover="agora-solid-edit">
                        Sugira uma breve descrição.
                      </Button>
                      <a
                        href="https://dados.gov.pt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 text-sm underline inline-flex items-center gap-[8px] hover:text-primary-800"
                      >
                        O que achou desta sugestão? <Icon name="agora-line-external-link" className="w-4 h-4" />
                      </a>
                    </div>

                    <InputSelect
                      label="Palavras-chave"
                      placeholder="Pesquise por uma palavra-chave..."
                      id="edit-keywords"
                      type="checkbox"
                      searchable
                      searchInputPlaceholder="Escreva para pesquisar..."
                      searchNoResultsText="Nenhum resultado encontrado"
                    >
                      <DropdownSection name="keywords">
                        {(dataset.tags || []).map((tag) => (
                          <DropdownOption key={tag} value={tag}>
                            {tag}
                          </DropdownOption>
                        ))}
                      </DropdownSection>
                    </InputSelect>
                    <div className="flex items-center justify-between">
                      <Button
                        appearance="outline"
                        variant="primary"
                        hasIcon
                        leadingIcon="agora-line-edit"
                        leadingIconHover="agora-solid-edit"
                      >
                        Sugira palavras-chave
                      </Button>
                      <a
                        href="https://dados.gov.pt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 text-sm underline inline-flex items-center gap-[8px] hover:text-primary-800"
                      >
                        O que achou desta sugestão? <Icon name="agora-line-external-link" className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <h2 className="datasets-admin-page__section-title">Acesso</h2>
                  <div className="datasets-admin-page__fields-group">
                    <div className="flex flex-col gap-[8px]">
                      <span className="text-primary-900 text-base font-medium leading-7">
                        Tipo de acesso
                      </span>
                      <div className="flex flex-col gap-4">
                        <RadioButton
                          label="Aberto"
                          id="edit-access-open"
                          name="edit-access-type"
                          checked={accessType === "open"}
                          onChange={() => setAccessType("open")}
                        />
                        <RadioButton
                          label="Restrito"
                          id="edit-access-restricted"
                          name="edit-access-type"
                          checked={accessType === "restricted"}
                          onChange={() => setAccessType("restricted")}
                        />
                      </div>
                    </div>

                    {accessType === "restricted" && (
                      <>
                        <div className="grid grid-cols-3 gap-8 mt-4 items-end">
                          <InputSelect
                            label="Comunidade e Administração"
                            placeholder=""
                            id="edit-restriction-community"
                          >
                            <DropdownSection name="community">
                              <DropdownOption value="sim">Sim</DropdownOption>
                              <DropdownOption value="nao">Não</DropdownOption>
                              <DropdownOption value="condicional">Condicional</DropdownOption>
                            </DropdownSection>
                          </InputSelect>
                          <InputSelect
                            label="Empresa e Associação"
                            placeholder=""
                            id="edit-restriction-enterprise"
                          >
                            <DropdownSection name="enterprise">
                              <DropdownOption value="sim">Sim</DropdownOption>
                              <DropdownOption value="nao">Não</DropdownOption>
                              <DropdownOption value="condicional">Condicional</DropdownOption>
                            </DropdownSection>
                          </InputSelect>
                          <InputSelect
                            label="Privado"
                            placeholder=""
                            id="edit-restriction-private"
                          >
                            <DropdownSection name="private">
                              <DropdownOption value="sim">Sim</DropdownOption>
                              <DropdownOption value="nao">Não</DropdownOption>
                              <DropdownOption value="condicional">Condicional</DropdownOption>
                            </DropdownSection>
                          </InputSelect>
                        </div>
                        <InputSelect
                          label="Motivo da restrição"
                          placeholder=""
                          id="edit-restriction-reason"
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
                        </InputSelect>
                      </>
                    )}

                    <InputSelect
                      label="Licença"
                      placeholder="Selecione uma licença"
                      id="edit-license"
                      defaultValue={selectedLicense}
                      onChange={(options) => {
                        if (options.length > 0) setSelectedLicense(options[0].value as string);
                      }}
                    >
                      <DropdownSection name="licenses">
                        {licenses.map((license) => (
                          <DropdownOption key={license.id} value={license.id}>
                            {license.title}
                          </DropdownOption>
                        ))}
                      </DropdownSection>
                    </InputSelect>
                  </div>

                  <h2 className="datasets-admin-page__section-title">Tempo</h2>
                  <div className="datasets-admin-page__fields-group">
                    <InputSelect
                      label="Frequência de atualização"
                      placeholder="Selecione uma frequência"
                      id="edit-frequency"
                      defaultValue={selectedFrequency}
                      onChange={(options) => {
                        if (options.length > 0) setSelectedFrequency(options[0].value as string);
                      }}
                    >
                      <DropdownSection name="frequencies">
                        {frequencies.map((freq) => (
                          <DropdownOption key={freq.id} value={freq.id}>
                            {freq.label}
                          </DropdownOption>
                        ))}
                      </DropdownSection>
                    </InputSelect>

                    <div className="flex gap-[18px]">
                      <InputDate
                        label="Cobertura temporal (Data de início)"
                        id="edit-date-start"
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setTemporalStart(e.target.value)
                        }
                      />
                      <InputDate
                        label="Data de fim"
                        id="edit-date-end"
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setTemporalEnd(e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <h2 className="datasets-admin-page__section-title">Espaço</h2>
                  <div className="datasets-admin-page__fields-group">
                    <InputSelect
                      label="Cobertura espacial"
                      placeholder="Pesquisar por cobertura espacial..."
                      id="edit-spatial-coverage"
                      searchable
                      searchInputPlaceholder="Pesquisar por cobertura espacial..."
                      searchNoResultsText="Nenhum resultado encontrado"
                    >
                      <DropdownSection name="spatial-coverage">
                        <DropdownOption value="">—</DropdownOption>
                      </DropdownSection>
                    </InputSelect>
                    <InputSelect
                      label="Granularidade espacial"
                      placeholder="Selecione uma granularidade..."
                      id="edit-spatial-granularity"
                      searchable
                      searchInputPlaceholder="Pesquisar..."
                      searchNoResultsText="Nenhum resultado encontrado"
                    >
                      <DropdownSection name="spatial-granularity">
                        <DropdownOption value="">—</DropdownOption>
                      </DropdownSection>
                    </InputSelect>
                  </div>

                  <div className="datasets-admin-page__actions flex justify-end mt-[24px]">
                    <Button
                      variant="primary"
                      onClick={handleSaveMetadata}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "A guardar..." : "Guardar alterações"}
                    </Button>
                  </div>

                  <div className="dataset-edit-danger-actions">
                    <StatusCard
                      type="info"
                      description={
                        <>
                          Atenção, esta ação não pode ser corrigida.
                          <br />
                          <Button
                            appearance="link"
                            variant="primary"
                            hasIcon
                            trailingIcon="agora-line-arrow-right-circle"
                            trailingIconHover="agora-solid-arrow-right-circle"
                          >
                            Transferir o conjunto de dados
                          </Button>
                        </>
                      }
                    />
                    <StatusCard
                      type="warning"
                      description={
                        <>
                          Um conjunto de dados arquivado não está mais indexado, mas permanece acessível aos usuários por meio de um link direto.
                          <br />
                          <Button
                            appearance="link"
                            variant="primary"
                            hasIcon
                            trailingIcon="agora-line-arrow-right-circle"
                            trailingIconHover="agora-solid-arrow-right-circle"
                          >
                            Arquivar o conjunto de dados
                          </Button>
                        </>
                      }
                    />
                    <StatusCard
                      type="danger"
                      description={
                        <>
                          Atenção, esta ação não pode ser corrigida.
                          <br />
                          <Button
                            appearance="link"
                            variant="primary"
                            hasIcon
                            trailingIcon="agora-line-arrow-right-circle"
                            trailingIconHover="agora-solid-arrow-right-circle"
                            onClick={handleDeleteDataset}
                            disabled={isSubmitting}
                          >
                            Exclua o conjunto de dados
                          </Button>
                        </>
                      }
                    />
                  </div>
                </form>
              </div>

              <aside className="datasets-admin-page__auxiliar">
                <div className="datasets-admin-page__auxiliar-inner">
                  <div className="datasets-admin-page__auxiliar-header">
                    <Icon
                      name="agora-line-question-mark"
                      className="w-[24px] h-[24px]"
                    />
                    <h2 className="datasets-admin-page__auxiliar-title">Auxiliar</h2>
                  </div>
                  <AuxiliarList
                    items={[
                      {
                        title: "Nomeando seu conjunto de dados",
                        content: (
                          <>
                            <p>O título do seu conjunto de dados deve ser o mais preciso e específico possível.</p>
                            <p>Deve também corresponder ao vocabulário utilizado pelos utilizadores que, na maioria das vezes, procuram dados através de um motor de pesquisa.</p>
                          </>
                        ),
                        hasError: !!formErrors.title,
                      },
                      {
                        title: "Adicione uma sigla ao conjunto de dados.",
                        content: "Tem a opção de adicionar uma sigla ao seu conjunto de dados. As letras que compõem essa sigla não precisam ser separadas por pontos.",
                      },
                      {
                        title: "Escreva uma boa descrição",
                        content: (
                          <>
                            <p>A descrição do seu conjunto de dados permite que os utilizadores obtenham informações sobre o conteúdo e a estrutura dos recursos publicados.</p>
                            <ul className="list-disc pl-5 mt-2 flex flex-col gap-2">
                              <li>A lista de ficheiros disponibilizados;</li>
                              <li>Descrição do formato do ficheiro;</li>
                              <li>A frequência de atualização.</li>
                            </ul>
                          </>
                        ),
                        hasError: !!formErrors.description,
                      },
                      {
                        title: "Escreva uma breve descrição.",
                        content: "A descrição resumida apresenta seu conjunto de dados em uma ou duas frases. Isso ajuda os utilizadores a entenderem rapidamente o conteúdo e melhora sua visibilidade nos resultados de pesquisa.",
                      },
                      {
                        title: "Selecione uma licença",
                        content: "As licenças definem as regras para a reutilização. Ao escolher uma licença de reutilização, garante que o conjunto de dados publicado será reutilizado de acordo com os termos de uso que definiu.",
                      },
                      {
                        title: "Escolha a frequência de atualização.",
                        content: "A frequência de atualização refere-se à frequência com que planeja atualizar os dados publicados. Essa frequência de atualização é apenas indicativa.",
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
                    ]}
                  />
                </div>
              </aside>
            </div>
          </TabBody>
        </Tab>

        {/* Resources Tab */}
        <Tab>
          <TabHeader>Ficheiros ({dataset.resources.length})</TabHeader>
          <TabBody>
            <div className="mt-[24px]">
              <div className="flex justify-between items-center mb-[16px]">
                <h2 className="font-medium text-neutral-900 text-base">
                  {dataset.resources.length} {dataset.resources.length === 1 ? "FICHEIRO" : "FICHEIROS"}
                </h2>
                <div className="flex flex-col gap-[16px]">
                  <Button appearance="outline" variant="primary">
                    Reordene os ficheiros
                  </Button>
                  <ButtonUploader
                    label="Adicionar ficheiros"
                    inputLabel="Selecione ou arraste o ficheiro"
                    selectedFilesLabel="ficheiros selecionados"
                    removeFileButtonLabel="Remover"
                    replaceFileButtonLabel="Substituir"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              {dataset.resources.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>Nome do ficheiro</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell>Tipo</TableHeaderCell>
                      <TableHeaderCell>Formato</TableHeaderCell>
                      <TableHeaderCell>Criado em</TableHeaderCell>
                      <TableHeaderCell>Atualizado em</TableHeaderCell>
                      <TableHeaderCell>Ação</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataset.resources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell headerLabel="Nome do ficheiro">
                          {resource.title}
                        </TableCell>
                        <TableCell headerLabel="Status">
                          <Pill variant="success">DISPONÍVEL</Pill>
                        </TableCell>
                        <TableCell headerLabel="Tipo">
                          {resource.type === "main" ? "Ficheiros principais" : resource.type || "-"}
                        </TableCell>
                        <TableCell headerLabel="Formato">
                          {resource.format || "-"}
                        </TableCell>
                        <TableCell headerLabel="Criado em">
                          {format(new Date(resource.created_at), "d 'de' MMMM 'de' yyyy", { locale: pt })}
                        </TableCell>
                        <TableCell headerLabel="Atualizado em">
                          {resource.last_modified
                            ? format(new Date(resource.last_modified), "d 'de' MMMM 'de' yyyy", { locale: pt })
                            : format(new Date(resource.created_at), "d 'de' MMMM 'de' yyyy", { locale: pt })}
                        </TableCell>
                        <TableCell headerLabel="Ação">
                          <a href={`/pages/admin/me/datasets/edit?id=${dataset.id}`}>
                            <Icon name="agora-line-edit" className="w-[20px] h-[20px]" />
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabBody>
        </Tab>

        {/* Discussions Tab */}
        <Tab>
          <TabHeader>Discussões (0)</TabHeader>
          <TabBody>
            <div className="mt-[24px]">
              <h2 className="font-medium text-neutral-900 text-base mb-[16px]">
                0 DISCUSSÕES
              </h2>
              <CardNoResults
                position="center"
                icon={
                  <Icon name="agora-line-chat" className="w-12 h-12 text-primary-500 icon-xl" />
                }
                title="Sem discussões"
                description="Ainda não existem discussões neste conjunto de dados."
                hasAnchor={false}
              />
            </div>
          </TabBody>
        </Tab>

      </Tabs>
    </div>
  );
}
