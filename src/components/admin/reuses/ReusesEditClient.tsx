"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
  Icon,
  InputText,
  InputTextArea,
  InputSelect,
  DropdownSection,
  DropdownOption,
  StatusCard,
  Pill,
  CardNoResults,
  ButtonUploader,
  Tabs,
  Tab,
  TabHeader,
  TabBody,
} from "@ama-pt/agora-design-system";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  fetchReuse,
  updateReuse,
  deleteReuse,
  fetchReuseTypes,
  fetchReuseTopics,
} from "@/services/api";
import { Reuse, ReuseType, ReuseTopic } from "@/types/api";
import AuxiliarList from "@/components/admin/AuxiliarList";

export default function ReusesEditClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get("slug") || "";

  const [reuse, setReuse] = useState<Reuse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  // API state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  // Dropdown data
  const [reuseTypes, setReuseTypes] = useState<ReuseType[]>([]);
  const [reuseTopics, setReuseTopics] = useState<ReuseTopic[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [r, types, topics] = await Promise.all([
          fetchReuse(slug),
          fetchReuseTypes(),
          fetchReuseTopics(),
        ]);
        setReuse(r);
        setTitle(r.title);
        setUrl(r.url);
        setDescription(r.description);
        setSelectedType(r.type || "");
        setSelectedTopic(r.topic || "");
        setReuseTypes(types);
        setReuseTopics(topics);
      } catch (error) {
        console.error("Error loading reuse:", error);
        setApiError("Erro ao carregar a reutilização.");
      } finally {
        setIsLoading(false);
      }
    }
    if (slug) loadData();
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

  const handleSaveMetadata = async () => {
    if (!reuse) return;
    const errors: Record<string, boolean> = {};
    if (!title.trim()) errors.title = true;
    if (!url.trim()) errors.url = true;
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
      const updated = await updateReuse(reuse.id, {
        title: title.trim(),
        url: url.trim(),
        description: description.trim(),
        type: selectedType || undefined,
        topic: selectedTopic || undefined,
      });
      setReuse(updated);
      setApiSuccess("Reutilização atualizada com sucesso.");
    } catch (error: unknown) {
      const err = error as { status?: number; data?: Record<string, unknown> };
      if (err.data && typeof err.data === "object") {
        const messages = Object.entries(err.data)
          .map(([key, val]) => `${key}: ${val}`)
          .join(", ");
        setApiError(messages);
      } else {
        setApiError("Erro ao atualizar a reutilização.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReuse = async () => {
    if (!reuse) return;
    if (!confirm("Tem certeza que deseja eliminar esta reutilização?")) return;
    setIsSubmitting(true);
    try {
      await deleteReuse(reuse.id);
      router.push("/pages/admin/me/reuses");
    } catch (error) {
      console.error("Error deleting reuse:", error);
      setApiError("Erro ao eliminar a reutilização.");
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

  if (!reuse) {
    return (
      <div className="datasets-admin-page">
        <StatusCard type="danger" description="Reutilização não encontrada." />
        <Button
          variant="primary"
          onClick={() => router.push("/pages/admin/me/reuses")}
        >
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Reutilizações", url: "/pages/admin/me/reuses" },
            { label: reuse.title, url: "#" },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">{reuse.title}</h1>
        <Button
          variant="primary"
          appearance="outline"
          onClick={() => window.open(`/pages/reuses/${reuse.slug}`, "_blank")}
        >
          <span className="dataset-edit-info__btn-content">
            <Icon name="agora-line-eye" className="w-[16px] h-[16px]" />
            Ver página pública da reutilização
          </span>
        </Button>
      </div>

      {apiError && <StatusCard type="danger" description={apiError} />}
      {apiSuccess && <StatusCard type="success" description={apiSuccess} />}

      <div className="dataset-edit-info">
        <div className="dataset-edit-info__badges">
          <Pill variant={reuse.private ? "warning" : "success"}>
            {reuse.private ? "RASCUNHO" : "PÚBLICO"}
          </Pill>
          {reuse.featured && <Pill variant="informative">DESTAQUE</Pill>}
          <span className="dataset-edit-info__stat">
            <Icon name="agora-line-eye" className="dataset-edit-info__stat-icon" />
            {`${reuse.metrics?.views || 0} visualizações`}
          </span>
          <span className="dataset-edit-info__stat">
            <Icon name="agora-line-star" className="dataset-edit-info__stat-icon" />
            {`${reuse.metrics?.followers || 0} favoritos`}
          </span>
        </div>

        <p className="dataset-edit-info__activity">
          <Icon name="agora-line-clock" className="dataset-edit-info__clock-icon" />
          {" Atividade mais recente: "}
          {reuse.owner && (
            <>
              <Link
                href={`/pages/users/${reuse.owner.slug}`}
                className="text-primary-600 underline"
              >
                {reuse.owner.first_name} {reuse.owner.last_name}
              </Link>
              {" "}
            </>
          )}
          {" — editou a reutilização — "}
          <span className="text-neutral-900">
            {format(new Date(reuse.last_modified), "d 'de' MMMM 'de' yyyy", {
              locale: pt,
            })}
          </span>
        </p>
      </div>

      <Tabs
        onTabActivation={() => {
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
                <div className="dataset-edit-visibility-banner">
                  <StatusCard
                    type="info"
                    description={
                      <>
                        Modificar a visibilidade da reutilização
                        <br />
                        <span className="text-primary-600">
                          {reuse.private ? "rascunho" : "público"}
                        </span>
                      </>
                    }
                  />
                  <div>
                    <Button
                      variant="primary"
                      appearance="outline"
                      onClick={async () => {
                        try {
                          const updated = await updateReuse(reuse.id, {
                            private: !reuse.private,
                          });
                          setReuse(updated);
                          setApiSuccess(
                            updated.private
                              ? "Reutilização guardada como rascunho."
                              : "Reutilização publicada com sucesso."
                          );
                        } catch {
                          setApiError("Erro ao alterar a visibilidade.");
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      {reuse.private ? "Publicar reutilização" : "Salvar como rascunho"}
                    </Button>
                  </div>
                </div>

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
                      label="Nome da reutilização *"
                      placeholder="Insira o nome aqui"
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
                      label="URL *"
                      placeholder="Insira o URL aqui (ex: https://...)"
                      id="edit-url"
                      value={url}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setUrl(e.target.value);
                        if (e.target.value.trim()) clearError("url");
                      }}
                      hasError={!!formErrors.url}
                      hasFeedback={!!formErrors.url}
                      feedbackState="danger"
                      errorFeedbackText="Campo obrigatório"
                    />
                    <InputSelect
                      label="Tipo *"
                      placeholder="Procure por um tipo..."
                      id="edit-type"
                      searchable
                      searchInputPlaceholder="Escreva para pesquisar..."
                      searchNoResultsText="Nenhum resultado encontrado"
                      defaultValue={selectedType}
                      onChange={(options) => {
                        if (options.length > 0) setSelectedType(options[0].value as string);
                      }}
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
                      label="Tema"
                      placeholder="Pesquise um tópico..."
                      id="edit-topic"
                      searchable
                      searchInputPlaceholder="Escreva para pesquisar..."
                      searchNoResultsText="Nenhum resultado encontrado"
                      defaultValue={selectedTopic}
                      onChange={(options) => {
                        if (options.length > 0) setSelectedTopic(options[0].value as string);
                      }}
                    >
                      <DropdownSection name="topics">
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
                        {(reuse.tags || []).map((tag) => (
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
                          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                            const files = e.target.files;
                            if (!files || files.length === 0 || !reuse) return;
                            setIsSubmitting(true);
                            try {
                              const { uploadReuseImage } = await import("@/services/api");
                              const updated = await uploadReuseImage(reuse.id, files[0]);
                              setReuse(updated);
                              setApiSuccess("Imagem de capa atualizada com sucesso.");
                            } catch {
                              setApiError("Erro ao carregar imagem de capa.");
                            } finally {
                              setIsSubmitting(false);
                            }
                          }}
                        />
                      </div>
                    </div>
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
                          <strong>Transfira esta reutilização.</strong>
                          <br />
                          Atenção, esta ação não pode ser cancelada.
                          <br />
                          <Button
                            appearance="link"
                            variant="primary"
                            hasIcon
                            trailingIcon="agora-line-arrow-right-circle"
                            trailingIconHover="agora-solid-arrow-right-circle"
                          >
                            Transferir
                          </Button>
                        </>
                      }
                    />
                    <StatusCard
                      type="warning"
                      description={
                        <>
                          <strong>Reutilização de arquivos</strong>
                          <br />
                          Um arquivo reutilizado não é mais indexado, mas permanece acessível aos usuários por meio de um link direto.
                          <br />
                          <Button
                            appearance="link"
                            variant="primary"
                            hasIcon
                            trailingIcon="agora-line-arrow-right-circle"
                            trailingIconHover="agora-solid-arrow-right-circle"
                          >
                            Arquivar
                          </Button>
                        </>
                      }
                    />
                    <StatusCard
                      type="danger"
                      description={
                        <>
                          <strong>Remova esta reutilização.</strong>
                          <br />
                          Atenção, esta ação não pode ser cancelada.
                          <br />
                          <Button
                            appearance="link"
                            variant="primary"
                            hasIcon
                            trailingIcon="agora-line-arrow-right-circle"
                            trailingIconHover="agora-solid-arrow-right-circle"
                            onClick={handleDeleteReuse}
                            disabled={isSubmitting}
                          >
                            Eliminar
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
                        title: "Dê um nome à sua reutilização.",
                        content:
                          'Prefira um título que permita entender como os dados são usados, em vez do nome do site ou aplicativo ("Mecanismo de Busca de Acordos Comerciais" em vez de "Acordos-Comerciais.fr", por exemplo).',
                        hasError: !!formErrors.title,
                      },
                      {
                        title: "Qual link preencher?",
                        content:
                          "Insira o link para a página onde o conteúdo reutilizado está visível. Dê preferência ao link para o próprio conteúdo reutilizado, e não para a página inicial.",
                        hasError: !!formErrors.url,
                      },
                      {
                        title: "Escolha um tipo",
                        content:
                          "Indique o tipo em que deve ser classificada a reutilização (API, aplicação, artigo de imprensa, visualização, etc.).",
                      },
                      {
                        title: "Escreva uma boa descrição",
                        content:
                          "A descrição da sua reutilização permite que os utilizadores compreendam o conteúdo e o objetivo do projeto.",
                        hasError: !!formErrors.description,
                      },
                    ]}
                  />
                </div>
              </aside>
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
                description="Ainda não existem discussões nesta reutilização."
                hasAnchor={false}
              />
            </div>
          </TabBody>
        </Tab>
      </Tabs>
    </div>
  );
}
