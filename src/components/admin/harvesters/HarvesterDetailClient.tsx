"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
  Icon,
  StatusCard,
  Tabs,
  Tab,
  TabHeader,
  TabBody,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Pill,
  InputText,
  InputTextArea,
  DropdownSection,
  DropdownOption,
  Switch,
} from "@ama-pt/agora-design-system";
import PublishDropdown from "@/components/admin/PublishDropdown";
import AuxiliarList from "@/components/admin/AuxiliarList";
import IsolatedSelect from "@/components/admin/IsolatedSelect";
import { fetchHarvester, fetchHarvestJobs } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import type { HarvestSource, HarvestJob } from "@/types/api";

interface HarvesterDetailClientProps {
  slug: string;
}

const VALIDATION_LABELS: Record<string, { label: string; variant: "warning" | "success" | "danger" }> = {
  pending: { label: "VALIDAÇÃO PENDENTE", variant: "warning" },
  accepted: { label: "VALIDADO", variant: "success" },
  refused: { label: "RECUSADO", variant: "danger" },
};

export default function HarvesterDetailClient({ slug }: HarvesterDetailClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [source, setSource] = useState<HarvestSource | null>(null);
  const [jobs, setJobs] = useState<HarvestJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Config form state
  const [harvesterName, setHarvesterName] = useState("");
  const [harvesterDescription, setHarvesterDescription] = useState("");
  const [harvesterUrl, setHarvesterUrl] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [isAutoArchive, setIsAutoArchive] = useState(true);
  const [filters, setFilters] = useState<{ mode: string; type: string; value: string }[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

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

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchHarvester(slug);
        setSource(data);
        if (data) {
          setHarvesterName(data.name);
          setHarvesterDescription(data.description || "");
          setHarvesterUrl(data.url);
          setIsEnabled(data.active);
          setIsAutoArchive(data.autoarchive);
          selectedTypeRef.current = data.backend;
          const jobsRes = await fetchHarvestJobs(data.id);
          setJobs(jobsRes.data || []);
        }
      } catch (error) {
        console.error("Error loading harvester:", error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [slug]);

  const clearError = (field: string) => {
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

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
        "Escolha o formato dos metadados (por exemplo, DCAT, CKAN, etc.). Esse formato permite que o harvester saiba como ler e interpretar os seus metadados, para que possam ser transcritos corretamente em dados.gov.",
    },
  ];

  if (isLoading) {
    return (
      <div className="admin-page">
        <p className="text-neutral-700">A carregar...</p>
      </div>
    );
  }

  if (!source) {
    return (
      <div className="admin-page">
        <StatusCard type="danger" description="Harvester não encontrado." />
      </div>
    );
  }

  const validationState = source.validation?.state || "pending";
  const validationInfo = VALIDATION_LABELS[validationState] || VALIDATION_LABELS.pending;

  return (
    <div className="admin-page">
      <div className="admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Sistema", url: "/pages/admin/system/harvesters" },
            { label: source.name, url: "#" },
          ]}
        />
      </div>

      <div className="admin-page__header">
        <h1 className="admin-page__title">{source.name}</h1>
        <PublishDropdown />
      </div>

      {/* Metadata info */}
      <div className="flex flex-col gap-8 text-sm text-neutral-800 mb-[24px]">
        <div className="flex items-center gap-8">
          <Icon name="agora-line-info-mark" className="w-[16px] h-[16px]" />
          <span>
            <strong>Implementação:</strong> {source.backend}
          </span>
        </div>
        <div className="flex items-center gap-8">
          <Icon name="agora-line-globe" className="w-[16px] h-[16px]" />
          <span>
            <strong>URL:</strong>{" "}
            <code className="text-xs">{source.url}</code>
          </span>
        </div>
        <div className="flex items-center gap-8">
          <Icon name="agora-line-calendar" className="w-[16px] h-[16px]" />
          <span>
            <strong>Planeamento:</strong> {source.schedule || "Não aplicável"}
          </span>
        </div>
        <div className="flex items-center gap-8">
          <Icon name="agora-line-check-circle" className="w-[16px] h-[16px]" />
          <span>
            <strong>Estado :</strong>{" "}
            <Pill variant={validationInfo.variant}>{validationInfo.label}</Pill>
          </span>
        </div>
      </div>

      {/* Validation pending banner */}
      {validationState === "pending" && (
        <div className="bg-neutral-100 rounded p-[24px] flex flex-col gap-8 mb-[24px]">
          <p className="text-sm font-bold text-neutral-900">
            O seu harvester foi criado e está a aguardar validação da equipa de administração da plataforma.
          </p>
          <p className="text-sm text-neutral-700">
            Informe-nos através do formulário de contacto abaixo se deseja que validemos o seu harvester. Será notificado da aprovação (ou rejeição).
          </p>
          <a href="#" className="flex items-center gap-8 text-sm text-primary-600">
            Validação da solicitação
            <Icon name="agora-line-arrow-right-circle" className="w-[20px] h-[20px]" />
          </a>
        </div>
      )}

      {/* Tabs */}
      <Tabs>
        <Tab>
          <TabHeader>Empregos</TabHeader>
          <TabBody>
            {jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-[64px]">
                <Icon name="agora-line-settings" className="w-[80px] h-[80px] text-primary-300 mb-[24px]" />
                <p className="text-neutral-700 text-lg mb-[16px]">
                  Sem emprego no momento.
                </p>
                <Button variant="primary" appearance="outline">Aceda às configurações.</Button>
              </div>
            ) : (
              <Table
                paginationProps={{
                  itemsPerPageLabel: "Linhas por página",
                  itemsPerPage: 10,
                  totalItems: jobs.length,
                  availablePageSizes: [5, 10, 20],
                  currentPage: 1,
                  buttonDropdownAriaLabel: "Selecionar linhas por página",
                  dropdownListAriaLabel: "Opções de linhas por página",
                  prevButtonAriaLabel: "Página anterior",
                  nextButtonAriaLabel: "Próxima página",
                }}
              >
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>ID</TableHeaderCell>
                    <TableHeaderCell>Estado</TableHeaderCell>
                    <TableHeaderCell>Início</TableHeaderCell>
                    <TableHeaderCell>Fim</TableHeaderCell>
                    <TableHeaderCell>Items</TableHeaderCell>
                    <TableHeaderCell>Erros</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell headerLabel="ID">
                        <span className="text-xs">{job.id}</span>
                      </TableCell>
                      <TableCell headerLabel="Estado">
                        <Pill
                          variant={
                            job.status === "done"
                              ? "success"
                              : job.status === "failed" || job.status === "done-errors"
                                ? "danger"
                                : "informative"
                          }
                        >
                          {job.status}
                        </Pill>
                      </TableCell>
                      <TableCell headerLabel="Início">
                        {job.started
                          ? new Date(job.started).toLocaleString("pt-PT")
                          : "—"}
                      </TableCell>
                      <TableCell headerLabel="Fim">
                        {job.ended
                          ? new Date(job.ended).toLocaleString("pt-PT")
                          : "—"}
                      </TableCell>
                      <TableCell headerLabel="Items">
                        {job.items?.length || 0}
                      </TableCell>
                      <TableCell headerLabel="Erros">
                        {job.errors?.length || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabBody>
        </Tab>

        <Tab>
          <TabHeader>Configuração</TabHeader>
          <TabBody>
            <div className="admin-page__body">
              <div className="admin-page__form-area">
                <form className="admin-page__form">
                  <p className="text-neutral-900 text-base leading-7 pt-32">
                    Os campos marcados com um asterisco ( <span className="text-red-600">*</span> ) são obrigatórios.
                  </p>

                  <h2 className="admin-page__section-title">Descrição</h2>

                  <div className="admin-page__fields-group">
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
                      value={harvesterDescription}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setHarvesterDescription(e.target.value)
                      }
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

                  <h2 className="admin-page__section-title">Implementação</h2>

                  <div className="admin-page__fields-group">
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
                        <div
                          key={index}
                          className={`mt-[8px] pb-[16px] mb-[8px] ${index < filters.length - 1 ? "border-b border-neutral-200" : ""}`}
                        >
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

                  <div className="admin-page__actions flex justify-end gap-[16px]">
                    <Button appearance="outline" variant="primary">
                      Pré-visualização
                    </Button>
                    <Button variant="primary">Guardar</Button>
                  </div>
                </form>

                {/* Danger zone */}
                <div className="dataset-edit-danger-actions">
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
                        >
                          Exclua o harvester
                        </Button>
                      </>
                    }
                  />
                </div>
              </div>

              {/* Auxiliar sidebar */}
              <aside className="admin-page__auxiliar">
                <div className="admin-page__auxiliar-inner">
                  <div className="admin-page__auxiliar-header">
                    <Icon name="agora-line-question-mark" className="w-[24px] h-[24px]" />
                    <h2 className="admin-page__auxiliar-title">Auxiliar</h2>
                  </div>
                  <AuxiliarList items={auxiliarItems} />
                </div>
              </aside>
            </div>
          </TabBody>
        </Tab>
      </Tabs>
    </div>
  );
}
