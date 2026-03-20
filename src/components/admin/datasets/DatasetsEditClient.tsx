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
  ButtonUploader,
  Tabs,
  Tab,
  TabHeader,
  TabBody,
} from "@ama-pt/agora-design-system";
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

export default function DatasetsEditClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get("slug") || "";

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
        <div className="flex gap-[8px] items-center">
          <Pill variant={dataset.private ? "warning" : "success"}>
            {dataset.private ? "Rascunho" : "Público"}
          </Pill>
          <a href={`/pages/datasets/${dataset.slug}`} target="_blank" rel="noreferrer">
            <Icon name="agora-line-eye" className="w-[20px] h-[20px]" />
          </a>
        </div>
      </div>

      {apiError && <StatusCard type="danger" description={apiError} />}
      {apiSuccess && <StatusCard type="success" description={apiSuccess} />}

      <Tabs
        onTabActivation={(index: number) => {
          setApiError(null);
          setApiSuccess(null);
          if (index === 3) loadActivities();
        }}
      >
        {/* Metadata Tab */}
        <Tab>
          <TabHeader>Metadados</TabHeader>
          <TabBody>
            <form
              className="datasets-admin-page__form mt-[24px]"
              onSubmit={(e) => e.preventDefault()}
            >
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
                    label="Cobertura temporal (Início)"
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

              <div className="datasets-admin-page__actions flex justify-between mt-[24px]">
                <Button
                  appearance="outline"
                  variant="danger"
                  onClick={handleDeleteDataset}
                  disabled={isSubmitting}
                >
                  Eliminar conjunto de dados
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveMetadata}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "A guardar..." : "Guardar alterações"}
                </Button>
              </div>
            </form>
          </TabBody>
        </Tab>

        {/* Resources Tab */}
        <Tab>
          <TabHeader>Ficheiros</TabHeader>
          <TabBody>
            <div className="mt-[24px]">
              <div className="flex justify-between items-center mb-[16px]">
                <h2 className="text-lg font-bold text-primary-900">
                  Ficheiros ({dataset.resources.length})
                </h2>
                <ButtonUploader
                  label="Ficheiros"
                  inputLabel="Selecione ou arraste o ficheiro"
                  selectedFilesLabel="ficheiros selecionados"
                  removeFileButtonLabel="Remover"
                  replaceFileButtonLabel="Substituir"
                  onChange={handleFileUpload}
                />
              </div>

              {dataset.resources.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>Título</TableHeaderCell>
                      <TableHeaderCell>Formato</TableHeaderCell>
                      <TableHeaderCell>Tamanho</TableHeaderCell>
                      <TableHeaderCell>Criado em</TableHeaderCell>
                      <TableHeaderCell>Ações</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataset.resources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell headerLabel="Título">
                          <a
                            href={resource.url}
                            className="text-primary-600 underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {resource.title}
                          </a>
                        </TableCell>
                        <TableCell headerLabel="Formato">
                          <Pill variant="informative">{resource.format || "-"}</Pill>
                        </TableCell>
                        <TableCell headerLabel="Tamanho">
                          {formatFileSize(resource.filesize)}
                        </TableCell>
                        <TableCell headerLabel="Criado em">
                          {formatDate(resource.created_at)}
                        </TableCell>
                        <TableCell headerLabel="Ações">
                          <button
                            onClick={() => handleDeleteResource(resource)}
                            className="text-danger-600 hover:text-danger-800"
                            disabled={isSubmitting}
                          >
                            <Icon name="agora-line-trash" className="w-[20px] h-[20px]" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-neutral-600">Nenhum ficheiro adicionado.</p>
              )}
            </div>
          </TabBody>
        </Tab>

        {/* Discussions Tab */}
        <Tab>
          <TabHeader>Discussões</TabHeader>
          <TabBody>
            <div className="mt-[24px]">
              <p className="text-neutral-600">
                As discussões deste conjunto de dados serão exibidas aqui.
              </p>
            </div>
          </TabBody>
        </Tab>

        {/* Activities Tab */}
        <Tab>
          <TabHeader>Atividades</TabHeader>
          <TabBody>
            <div className="mt-[24px]">
              {activitiesLoading ? (
                <p className="text-neutral-600">A carregar atividades...</p>
              ) : activities.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>Ação</TableHeaderCell>
                      <TableHeaderCell>Utilizador</TableHeaderCell>
                      <TableHeaderCell>Data</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity, idx) => (
                      <TableRow key={idx}>
                        <TableCell headerLabel="Ação">{activity.label}</TableCell>
                        <TableCell headerLabel="Utilizador">
                          {activity.actor.first_name} {activity.actor.last_name}
                        </TableCell>
                        <TableCell headerLabel="Data">
                          {formatDate(activity.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-neutral-600">Nenhuma atividade registada.</p>
              )}
            </div>
          </TabBody>
        </Tab>
      </Tabs>
    </div>
  );
}
