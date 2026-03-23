"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
  InputText,
  InputTextArea,
  DropdownSection,
  DropdownOption,
  Icon,
  StatusCard,
  ButtonUploader,
} from "@ama-pt/agora-design-system";
import {
  fetchCommunityResource,
  updateCommunityResource,
  deleteCommunityResource,
  uploadCommunityResourceFile,
  fetchResourceTypes,
} from "@/services/api";
import type { CommunityResource, ResourceType } from "@/types/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import PublishDropdown from "@/components/admin/PublishDropdown";
import IsolatedSelect from "@/components/admin/IsolatedSelect";

export default function CommunityResourceEditClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { displayName } = useCurrentUser();
  const resourceId = searchParams.get("id") || "";

  const [resource, setResource] = useState<CommunityResource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [schemaUrl, setSchemaUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const selectedTypeRef = useRef("");
  const selectedSchemaRef = useRef("");

  useEffect(() => {
    if (!resourceId) return;
    async function loadData() {
      setIsLoading(true);
      try {
        const [res, types] = await Promise.all([
          fetchCommunityResource(resourceId),
          fetchResourceTypes(),
        ]);
        setResource(res);
        setTitle(res.title);
        setDescription(res.description || "");
        setResourceTypes(types);
      } catch (error) {
        console.error("Error loading community resource:", error);
        setApiError("Erro ao carregar recurso comunitário.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [resourceId]);

  const clearError = (key: string) => {
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSave = async () => {
    const errors: Record<string, boolean> = {};
    if (!title.trim()) errors.title = true;
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setApiError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const updated = await updateCommunityResource(resourceId, {
        title: title.trim(),
        description: description.trim() || undefined,
      });

      if (file) {
        await uploadCommunityResourceFile(resourceId, file);
      }

      setResource(updated);
      setSuccessMessage("Recurso comunitário atualizado com sucesso.");
    } catch (err: unknown) {
      const error = err as { status?: number; data?: Record<string, unknown> };
      if (error?.status === 401) {
        setApiError("Sessão expirada. Faça login novamente.");
      } else {
        setApiError("Erro ao atualizar recurso comunitário.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCommunityResource(resourceId);
      router.push("/pages/admin/me/community-resources");
    } catch {
      setApiError("Erro ao eliminar recurso comunitário.");
    }
  };

  const typeOptions = useMemo(
    () => (
      <DropdownSection name="types">
        {resourceTypes.map((t) => (
          <DropdownOption key={t.id} value={t.id}>
            {t.label}
          </DropdownOption>
        ))}
      </DropdownSection>
    ),
    [resourceTypes],
  );

  const schemaOptions = useMemo(
    () => (
      <DropdownSection name="schemas">
        <DropdownOption value="">Nenhum</DropdownOption>
      </DropdownSection>
    ),
    [],
  );

  if (isLoading) {
    return (
      <div className="admin-page">
        <p className="text-neutral-600">A carregar...</p>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="admin-page">
        <StatusCard type="danger" description="Recurso comunitário não encontrado." />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: displayName || "...", url: "#" },
            {
              label: "Recursos comunitários",
              url: "/pages/admin/me/community-resources",
            },
            { label: "Editar", url: "#" },
          ]}
        />
      </div>

      <div className="admin-page__header">
        <h1 className="admin-page__title">Metadados do ficheiro</h1>
        <PublishDropdown />
      </div>

      <div className="admin-page__body">
        <div className="admin-page__form-area">
          {successMessage && (
            <div className="mb-[16px]">
              <StatusCard type="success" description={successMessage} />
            </div>
          )}

          {apiError && (
            <div className="mb-[16px]">
              <StatusCard type="danger" description={apiError} />
            </div>
          )}

          <form className="admin-page__form">
            <p className="text-neutral-900 text-base leading-7">
              Os campos marcados com um asterisco ( * ) são obrigatórios.
            </p>

            {/* ARQUIVO */}
            <h2 className="admin-page__section-title">Ficheiro</h2>

            <div className="admin-page__fields-group">
              <ButtonUploader
                label="Substitua o ficheiro"
                inputLabel="Arraste e solte ficheiros"
                removeFileButtonLabel="Remover ficheiro"
                replaceFileButtonLabel="Substituir ficheiro"
                extensionsInstructions="Tamanho máximo: 420 MB."
                maxSize={440401920}
                maxCount={1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const files = e.target.files;
                  setFile(files && files.length > 0 ? files[0] : null);
                }}
              />
            </div>

            {/* DESCRIÇÃO */}
            <h2 className="admin-page__section-title">Descrição</h2>

            <div className="admin-page__fields-group">
              <InputText
                label="Título *"
                placeholder="Insira o título aqui"
                id="resource-title"
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

              <IsolatedSelect
                label="Tipo *"
                placeholder="Ficheiros principais"
                id="resource-type"
                onChangeRef={selectedTypeRef}
              >
                {typeOptions}
              </IsolatedSelect>

              <InputTextArea
                label="Descrição"
                placeholder="Insira a descrição aqui"
                id="resource-description"
                rows={10}
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(e.target.value)
                }
              />
            </div>

            {/* ESQUEMA DE DADOS */}
            <h2 className="admin-page__section-title">Esquema de dados</h2>

            <div className="admin-page__fields-group">
              <IsolatedSelect
                label="Plano"
                placeholder="Procure um esquema referenciado em schema.data.gouv.fr..."
                id="resource-schema"
                onChangeRef={selectedSchemaRef}
              >
                {schemaOptions}
              </IsolatedSelect>

              <div className="admin-page__divider-or">
                <span className="admin-page__divider-or-text">ou</span>
              </div>

              <InputText
                label="Adicione um link para o diagrama"
                placeholder="https://..."
                id="resource-schema-url"
                value={schemaUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSchemaUrl(e.target.value)
                }
              />
            </div>

            {/* Actions: Para validar + Cancelar */}
            <div className="admin-page__actions flex gap-[18px]">
              <Button
                variant="primary"
                appearance="outline"
                onClick={() => router.push("/pages/admin/me/community-resources")}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? "A guardar..." : "Para validar"}
              </Button>
            </div>

            {/* Excluir o recurso */}
            <div className="dataset-edit-danger-actions">
              <StatusCard
                type="danger"
                description={
                  <>
                    <strong>Excluir o recurso</strong>
                    <br />
                    Atenção, esta ação não pode ser cancelada.
                    <br />
                    <Button
                      appearance="link"
                      variant="primary"
                      hasIcon
                      trailingIcon="agora-line-arrow-right-circle"
                      trailingIconHover="agora-solid-arrow-right-circle"
                      onClick={handleDelete}
                      disabled={isSubmitting}
                    >
                      Exclua o recurso comunitário
                    </Button>
                  </>
                }
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
