"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  Breadcrumb,
  Button,
  CardNoResults,
  Icon,
  InputText,
  InputTextArea,
  DragAndDropUploader,
} from "@ama-pt/agora-design-system";
import { fetchOrganization, updateOrganization, uploadOrgLogo } from "@/services/api";
import { Organization } from "@/types/api";
import { useActiveOrganization } from "@/hooks/useActiveOrganization";

export default function OrgProfileClient() {
  const { activeOrg, isLoading: isOrgLoading } = useActiveOrganization();

  const [org, setOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [acronym, setAcronym] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!activeOrg) {
      setIsLoading(false);
      return;
    }
    async function loadOrg() {
      setIsLoading(true);
      try {
        const data = await fetchOrganization(activeOrg!.id);
        if (data) {
          setOrg(data);
          setName(data.name);
          setAcronym(data.acronym || "");
          setDescription(data.description || "");
          setUrl(data.url || "");
        }
      } catch (error) {
        console.error("Error loading org profile:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrg();
  }, [activeOrg]);

  const handleSave = async () => {
    if (!org) return;
    setIsSaving(true);
    try {
      await updateOrganization(org.id, {
        name,
        acronym: acronym || undefined,
        description: description || undefined,
        url: url || undefined,
      });
    } catch (error) {
      console.error("Error updating org profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (files: File[]) => {
    if (!org || files.length === 0) return;
    try {
      await uploadOrgLogo(org.id, files[0]);
      const updated = await fetchOrganization(org.id);
      if (updated) setOrg(updated);
    } catch (error) {
      console.error("Error uploading org logo:", error);
    }
  };

  if (isOrgLoading || isLoading) return <p>A carregar...</p>;
  if (!activeOrg) {
    return (
      <div className="datasets-admin-page">
        <CardNoResults
          className="datasets-page__empty"
          position="center"
          icon={
            <Icon name="agora-line-buildings" className="datasets-page__empty-icon" />
          }
          description="Não pertence a nenhuma organização."
        />
      </div>
    );
  }

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Organização", url: "#" },
            { label: "Perfil", url: "/pages/admin/org/profile" },
          ]}
        />
      </div>

      <h1 className="datasets-admin-page__title mt-[64px] mb-[32px]">
        Perfil da organização
      </h1>

      {org && (
        <div className="profile-card">
          <Avatar
            avatarType={org.logo_thumbnail ? "image" : "initials"}
            srcPath={
              (org.logo_thumbnail ||
                org.name?.charAt(0).toUpperCase() ||
                "O") as unknown as undefined
            }
            alt={org.name}
            className="profile-card__avatar"
          />

          <div className="profile-card__body">
            <div className="profile-card__info">
              <p className="text-neutral-900 text-xl font-semibold leading-8">
                {org.name}
              </p>
              {org.acronym && (
                <p className="text-neutral-900 text-base font-light leading-7">
                  {org.acronym}
                </p>
              )}
              <p className="text-neutral-700 text-sm">
                {org.metrics.members} membros · {org.metrics.datasets} conjuntos de dados
                · {org.metrics.reuses} reutilizações
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="datasets-admin-page__form mt-[32px]">
        <h2 className="datasets-admin-page__section-title">EDITAR ORGANIZAÇÃO</h2>

        <div className="datasets-admin-page__fields-group">
          <InputText
            label="Nome *"
            placeholder="Nome da organização"
            id="org-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <InputText
            label="Sigla"
            placeholder="Sigla da organização"
            id="org-acronym"
            value={acronym}
            onChange={(e) => setAcronym(e.target.value)}
          />

          <InputTextArea
            label="Descrição"
            placeholder="Descrição da organização"
            id="org-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <InputText
            label="Website"
            placeholder="https://..."
            id="org-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <div>
            <span className="text-primary-900 text-base font-medium leading-7">
              Logotipo
            </span>
            <div className="mt-2">
              <DragAndDropUploader
                dragAndDropLabel="Selecione ou arraste os ficheiros"
                separatorLabel="ou"
                inputLabel="Selecionar ficheiro"
                removeFileButtonLabel="Remover ficheiro"
                replaceFileButtonLabel="Substituir ficheiro"
                extensionsInstructions="Tamanho máximo: 4 MB. Formatos aceitos: JPG, JPEG, PNG."
                accept=".jpg,.jpeg,.png"
                maxSize={4194304}
                maxCount={1}
                onChange={(e) => {
                  const files = e.target?.files;
                  if (files) handleLogoUpload(Array.from(files));
                }}
              />
            </div>
          </div>

          <div className="flex justify-end mt-[16px]">
            <Button variant="primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "A guardar..." : "Guardar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
