"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import {
  Breadcrumb,
  Button,
  InputText,
  InputTextArea,
  DropdownSection,
  DropdownOption,
  Icon,
  StatusCard,
} from "@ama-pt/agora-design-system";
import {
  fetchCommunityResource,
  updateCommunityResource,
  deleteCommunityResource,
  fetchResourceTypes,
} from "@/services/api";
import type { CommunityResource, ResourceType } from "@/types/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import IsolatedSelect from "@/components/admin/IsolatedSelect";
import AuxiliarList from "@/components/admin/AuxiliarList";

export default function CommunityResourceEditClient() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const { displayName } = useCurrentUser();
  const resourceId = (params?.resourceId as string) || searchParams.get("resource_id") || searchParams.get("id") || "";

  const [resource, setResource] = useState<CommunityResource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  // Form state
  const [resourceUrl, setResourceUrl] = useState("");
  const [checksumType, setChecksumType] = useState("");
  const [checksumValue, setChecksumValue] = useState("");
  const [showChecksum, setShowChecksum] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [format, setFormat] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [schemaUrl, setSchemaUrl] = useState("");
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
        setResourceUrl(res.url || "");
        setTitle(res.title);
        setDescription(res.description || "");
        setFormat(res.format || "");
        setMimeType(res.mime || "");
        if (res.checksum) {
          setChecksumType(res.checksum.type || "");
          setChecksumValue(res.checksum.value || "");
          setShowChecksum(true);
        }
        setResourceTypes(types);
      } catch (error) {
        console.error("Error loading community resource:", error);
        setApiError("Erro ao carregar recurso comunitario.");
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
        url: resourceUrl.trim() || undefined,
        format: format.trim() || undefined,
      });

      setResource(updated);
      setSuccessMessage("Recurso comunitario atualizado com sucesso.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const error = err as { status?: number; data?: Record<string, unknown> };
      if (error?.status === 401) {
        setApiError("Sessao expirada. Faca login novamente.");
      } else {
        setApiError("Erro ao atualizar recurso comunitario.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCommunityResource(resourceId);
      router.push("/pages/admin/system/community-resources");
    } catch {
      setApiError("Erro ao eliminar recurso comunitario.");
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

  const auxiliarItems = [
    {
      title: "Escolha o link correto",
      content:
        "E recomendavel criar um link para o proprio arquivo em vez de uma pagina da web para permitir que o {site} o analise.",
    },
    {
      title: "Soma de verificacao",
      content:
        "O checksum permite ao usuario verificar se os dados baixados nao foram corrompidos ou alterados.",
    },
    {
      title: "De um nome ao link",
      content: (
        <>
          Recomenda-se escolher um titulo que informe claramente qualquer usuario sobre o conteudo
          do arquivo. Algumas praticas a serem evitadas:
          <ul className="list-disc pl-16 mt-8">
            <li>atribuir um titulo muito generico (por exemplo, &quot;list.csv&quot;);</li>
            <li>Dar um titulo muito longo dificultaria a manipulacao do arquivo;</li>
            <li>
              fornecer um titulo que contenha acentos ou caracteres especiais (problemas de
              interoperabilidade de arquivos);
            </li>
            <li>
              Dar um titulo que seja demasiado tecnico e derivado de nomenclaturas da industria.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Publique os tipos de arquivos corretos.",
      content: (
        <>
          Voce pode escolher entre os seguintes tipos:
          <ul className="list-disc pl-16 mt-8">
            <li>Arquivos principais</li>
            <li>Documentacao</li>
            <li>Atualizar</li>
            <li>API</li>
            <li>Codigo-fonte</li>
            <li>Outro</li>
          </ul>
        </>
      ),
    },
    {
      title: "Adicionar documentacao",
      content: (
        <>
          A descricao de um arquivo facilita a reutilizacao de dados. Ela inclui, entre outras
          coisas:
          <ul className="list-disc pl-16 mt-8">
            <li>uma descricao geral do conjunto de dados;</li>
            <li>uma descricao do metodo de producao de dados;</li>
            <li>uma descricao do modelo de dados;</li>
            <li>uma descricao do esquema de dados;</li>
            <li>uma descricao dos metadados;</li>
            <li>Uma descricao das principais mudancas.</li>
          </ul>
        </>
      ),
    },
    {
      title: "Escolher o formato certo",
      content: (
        <>
          Os formatos devem ser:
          <ul className="list-disc pl-16 mt-8">
            <li>
              Aberto: um formato aberto nao adiciona especificacoes tecnicas que restrinjam o uso
              dos dados (por exemplo, o uso de software pago);
            </li>
            <li>
              facilmente reutilizavel: um formato facilmente reutilizavel implica que qualquer
              pessoa ou servidor pode reutilizar facilmente o conjunto de dados;
            </li>
            <li>
              Utilizavel em um sistema de processamento automatizado: um sistema de processamento
              automatizado permite operacoes automaticas relacionadas ao processamento de dados (por
              exemplo, um arquivo CSV e facilmente utilizavel por um sistema automatizado, ao
              contrario de um arquivo PDF).
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Escolha um tipo MIME",
      content:
        "Especifique o tipo MIME correspondente ao formato do recurso remoto (por exemplo, application/pdf, text/csv). Se necessario, utilize uma ferramenta online para deteta-lo.",
    },
    {
      title: "Selecione um esquema",
      content:
        "E possivel identificar um esquema de dados existente visitando o site schema.data.gouv.fr, que contem uma lista de esquemas de dados existentes.esquema.dados.gouv.fr",
    },
  ];

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
        <StatusCard type="danger" description="Recurso comunitario nao encontrado." />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administracao", url: "/pages/admin" },
            { label: "Sistema", url: "#" },
            {
              label: "Recursos comunitarios",
              url: "/pages/admin/system/community-resources",
            },
            { label: "Editar", url: "#" },
          ]}
        />
      </div>

      <div className="admin-page__header">
        <h1 className="admin-page__title">Metadados do arquivo</h1>
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
              Os campos marcados com um asterisco ( * ) sao obrigatorios.
            </p>

            {/* PENHORA */}
            <h2 className="admin-page__section-title">REUTILIZAÇÃO</h2>

            <div className="admin-page__fields-group">
              <InputText
                label="Link exato para o ficheiro *"
                placeholder="https://..."
                id="resource-url"
                value={resourceUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setResourceUrl(e.target.value);
                }}
              />
            </div>

            {/* SOMA DE VERIFICACAO */}
            <div className="flex flex-col items-start gap-[12px]">
              <h2 className="admin-page__section-title mb-0">SOMA DE VERIFICAÇÃO</h2>
            {showChecksum ? (
              <Button
                variant="danger"
                appearance="outline"
                hasIcon
                leadingIcon="agora-line-trash"
                leadingIconHover="agora-solid-trash"
                onClick={() => {
                  setShowChecksum(false);
                  setChecksumType("");
                  setChecksumValue("");
                }}
              >
                Eliminar
              </Button>
            ) : (
              <Button
                variant="primary"
                appearance="outline"
                onClick={() => setShowChecksum(true)}
              >
                Adicionar
              </Button>
            )}
            </div>

            {showChecksum && (
              <div className="admin-page__fields-group">
                <IsolatedSelect
                  label="Tipo de soma de verificação"
                  placeholder="SHA1"
                  id="checksum-type"
                  onChangeRef={{ current: checksumType }}
                >
                  <DropdownSection name="checksum-types">
                    <DropdownOption value="sha1">SHA1</DropdownOption>
                    <DropdownOption value="sha256">SHA256</DropdownOption>
                    <DropdownOption value="md5">MD5</DropdownOption>
                    <DropdownOption value="crc">CRC</DropdownOption>
                  </DropdownSection>
                </IsolatedSelect>

                <InputText
                  label="Valor de checksum"
                  placeholder=""
                  id="checksum-value"
                  value={checksumValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setChecksumValue(e.target.value)
                  }
                  readOnly
                />
              </div>
            )}

            {/* DESCRICAO */}
            <h2 className="admin-page__section-title">DESCRIÇÃO</h2>

            <div className="admin-page__fields-group">
              <InputText
                label="Título *"
                placeholder="Insira o titulo aqui"
                id="resource-title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setTitle(e.target.value);
                  if (e.target.value.trim()) clearError("title");
                }}
                hasError={!!formErrors.title}
                hasFeedback={!!formErrors.title}
                feedbackState="danger"
                errorFeedbackText="Campo obrigatorio"
              />

              <IsolatedSelect
                label="Tipo *"
                placeholder="Arquivos principais"
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

              <IsolatedSelect
                label="Formato *"
                placeholder="Selecione o formato"
                id="resource-format"
                onChangeRef={{ current: format }}
              >
                <DropdownSection name="formats">
                  {["csv", "json", "xml", "pdf", "xls", "xlsx", "ods", "doc", "docx", "zip", "gz", "tar", "shp", "geojson", "kml", "rdf", "ttl", "txt", "html"].map((f) => (
                    <DropdownOption key={f} value={f}>
                      {f}
                    </DropdownOption>
                  ))}
                </DropdownSection>
              </IsolatedSelect>

              <InputText
                label="Tipo mime"
                placeholder="application/pdf"
                id="resource-mime"
                value={mimeType}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setMimeType(e.target.value)
                }
              />
            </div>

            {/* ESQUEMA DE DADOS */}
            <h2 className="admin-page__section-title">ESQUEMA DE DADOS</h2>

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
                label="Adicione um link para o diagrama."
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
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? "A guardar..." : "Para validar"}
              </Button>
              <Button
                variant="primary"
                appearance="outline"
                onClick={() => router.push("/pages/admin/system/community-resources")}
              >
                Cancelar
              </Button>
            </div>

            {/* Excluir o recurso */}
            <div className="dataset-edit-danger-actions">
              <StatusCard
                type="danger"
                description={
                  <>
                    <strong>Atenção, esta ação não pode ser corrigida.</strong>
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
                      Elimine o recurso comunitário
                    </Button>
                  </>
                }
              />
            </div>

            {/* Anterior */}
            <div className="flex justify-end mt-[24px]">
              <Button
                variant="primary"
                appearance="outline"
                hasIcon
                leadingIcon="agora-line-arrow-left-circle"
                leadingIconHover="agora-solid-arrow-left-circle"
                onClick={() => router.push("/pages/admin/system/community-resources")}
              >
                Anterior
              </Button>
            </div>
          </form>
        </div>

        {/* Right: Auxiliar sidebar */}
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
    </div>
  );
}
