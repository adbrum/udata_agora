"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
  DropdownSection,
  DropdownOption,
  InputText,
  InputTextArea,
  InputSelect,
  ButtonUploader,
  RadioButton,
  Icon,
  StatusCard,
  Tabs,
  Tab,
  TabHeader,
  TabBody,
} from "@ama-pt/agora-design-system";
import { fetchPost, updatePost, suggestTags } from "@/services/api";
import type { Post, PostUpdatePayload, TagSuggestion } from "@/types/api";

export default function PostsEditClient() {
  const params = useParams();
  const router = useRouter();
  const postId = params.postId as string;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [articleType, setArticleType] = useState("news");
  const [contentType, setContentType] = useState("markdown");
  const [articleTitle, setArticleTitle] = useState("");
  const [articleHeader, setArticleHeader] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<TagSuggestion[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [postData, tagsData] = await Promise.all([
          fetchPost(postId),
          suggestTags("", 50),
        ]);

        if (postData) {
          setPost(postData);
          setArticleTitle(postData.name || "");
          setArticleHeader(postData.headline || "");
          setArticleContent(postData.content || "");
          setContentType(postData.body_type || "markdown");
          setArticleType(postData.kind || "news");
          setSelectedTags(postData.tags || []);
        }

        setTags(tagsData);
      } catch (error) {
        console.error("Error loading post:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [postId]);

  const handleSaveMetadata = async () => {
    if (!articleTitle.trim()) return;

    setIsSaving(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      const payload: PostUpdatePayload = {
        name: articleTitle.trim(),
        headline: articleHeader.trim(),
        body_type: contentType,
        kind: articleType,
        tags: selectedTags,
      };

      const result = await updatePost(postId, payload);
      if (result) {
        setPost(result);
        setApiSuccess("Metadados guardados com sucesso.");
      } else {
        setApiError("Erro ao guardar. Verifique a autenticação.");
      }
    } catch {
      setApiError("Erro ao guardar os metadados.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveContent = async () => {
    if (!articleContent.trim()) return;

    setIsSaving(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      const payload: PostUpdatePayload = {
        content: articleContent.trim(),
      };

      const result = await updatePost(postId, payload);
      if (result) {
        setPost(result);
        setApiSuccess("Conteúdo guardado com sucesso.");
      } else {
        setApiError("Erro ao guardar. Verifique a autenticação.");
      }
    } catch {
      setApiError("Erro ao guardar o conteúdo.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsSaving(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      const payload: PostUpdatePayload = {
        published: new Date().toISOString(),
      };

      const result = await updatePost(postId, payload);
      if (result) {
        setPost(result);
        setApiSuccess("Artigo publicado com sucesso.");
      } else {
        setApiError("Erro ao publicar. Verifique a autenticação.");
      }
    } catch {
      setApiError("Erro ao publicar o artigo.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-page">
        <p>A carregar...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="admin-page">
        <p>Artigo não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Bem-vindo", url: "/pages/admin" },
            { label: "Artigos", url: "/pages/admin/system/posts" },
            { label: post.name, url: "#" },
          ]}
        />
      </div>

      <div
        className="admin-page__header"
        style={{ flexDirection: "column", alignItems: "flex-start" }}
      >
        <div className="flex justify-end w-full">
          <Button
            variant="primary"
            appearance="outline"
            onClick={() =>
              window.open(`/pages/posts/${post.slug}`, "_blank")
            }
          >
            <span className="admin-edit-info__btn-content">
              <Icon name="agora-line-eye" className="w-[16px] h-[16px]" />
              Veja a página do artigo
            </span>
          </Button>
        </div>
        <h1 className="admin-page__title">{post.name}</h1>
      </div>

      {apiError && <StatusCard type="danger" description={apiError} />}
      {apiSuccess && <StatusCard type="success" description={apiSuccess} />}

      <Tabs
        className="mt-8"
        onTabActivation={() => {
          setApiError(null);
          setApiSuccess(null);
        }}
      >
        {/* Metadados Tab */}
        <Tab>
          <TabHeader>Metadados</TabHeader>
          <TabBody>
            <div className="admin-page__body">
              <div className="admin-page__form-area">
                <form className="admin-page__form mt-[24px]">
                  <p className="text-neutral-900 text-base leading-7">
                    Os campos marcados com um asterisco ( * ) são obrigatórios.
                  </p>

                  <h2 className="admin-page__section-title mt-8">Descrição</h2>

                  <div className="admin-page__fields-group">
                    <InputText
                      label="Título do artigo *"
                      placeholder="Insira o título aqui"
                      id="article-title"
                      value={articleTitle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setArticleTitle(e.target.value)
                      }
                    />

                    <InputTextArea
                      label="Cabeçalho *"
                      placeholder="Insira aqui"
                      id="article-header"
                      rows={3}
                      value={articleHeader}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setArticleHeader(e.target.value)
                      }
                    />

                    <div className="flex flex-col gap-[8px]">
                      <span className="text-primary-900 text-base font-medium leading-7">
                        Tipo de artigo
                      </span>
                      <div className="flex flex-row gap-4">
                        <RadioButton
                          label="Notícias"
                          id="article-type-news"
                          name="article-type"
                          checked={articleType === "news"}
                          onChange={() => setArticleType("news")}
                        />
                        <RadioButton
                          label="Página"
                          id="article-type-page"
                          name="article-type"
                          checked={articleType === "page"}
                          onChange={() => setArticleType("page")}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-[8px]">
                      <span className="text-primary-900 text-base font-medium leading-7">
                        Tipo de conteúdo
                      </span>
                      <div className="flex flex-row gap-4">
                        <RadioButton
                          label="HTML"
                          id="content-html"
                          name="content-type"
                          checked={contentType === "html"}
                          onChange={() => setContentType("html")}
                        />
                        <RadioButton
                          label="Markdown"
                          id="content-markdown"
                          name="content-type"
                          checked={contentType === "markdown"}
                          onChange={() => setContentType("markdown")}
                        />
                      </div>
                    </div>

                    <InputSelect
                      label="Palavras-chave"
                      placeholder="Pesquise por uma palavra-chave..."
                      id="article-keywords"
                      type="checkbox"
                      searchable
                      searchInputPlaceholder="Escreva para pesquisar..."
                      searchNoResultsText="Nenhum resultado encontrado"
                      onChange={(options) => {
                        setSelectedTags(
                          options.map((o) => o.value as string)
                        );
                      }}
                    >
                      <DropdownSection name="keywords">
                        {tags.map((tag) => (
                          <DropdownOption key={tag.text} value={tag.text}>
                            {tag.text}
                          </DropdownOption>
                        ))}
                      </DropdownSection>
                    </InputSelect>

                    <div>
                      <span className="text-primary-900 text-base font-medium leading-7">
                        Cobertura *
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
                        />
                      </div>
                    </div>
                  </div>

                  <div className="admin-page__actions">
                    <Button
                      variant="primary"
                      hasIcon
                      leadingIcon="agora-line-check-circle"
                      leadingIconHover="agora-solid-check-circle"
                      onClick={handleSaveMetadata}
                      disabled={isSaving}
                    >
                      {isSaving ? "A guardar..." : "Guardar"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {!post.published && (
              <div className="mt-8 p-6 bg-danger-50 border border-danger-200 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-primary-900 font-bold">
                    &apos;Publique o artigo&apos;
                  </p>
                  <p className="text-warning-700 text-sm">
                    Atenção: o artigo ficará visível para todos assim que for
                    publicado.
                  </p>
                </div>
                <Button
                  variant="danger"
                  appearance="outline"
                  onClick={handlePublish}
                  disabled={isSaving}
                >
                  Publicar
                </Button>
              </div>
            )}
          </TabBody>
        </Tab>

        {/* Conteúdo Tab */}
        <Tab>
          <TabHeader>Conteúdo</TabHeader>
          <TabBody>
            <div className="admin-page__body">
              <div className="admin-page__form-area">
                <form className="admin-page__form mt-[24px]">
                  <div className="admin-page__fields-group">
                    <InputTextArea
                      label="Conteúdo *"
                      placeholder="Insira aqui"
                      id="article-content"
                      rows={12}
                      value={articleContent}
                      onChange={(
                        e: React.ChangeEvent<HTMLTextAreaElement>
                      ) => setArticleContent(e.target.value)}
                    />
                  </div>

                  <div className="admin-page__actions">
                    <Button
                      variant="primary"
                      hasIcon
                      leadingIcon="agora-line-check-circle"
                      leadingIconHover="agora-solid-check-circle"
                      onClick={handleSaveContent}
                      disabled={isSaving}
                    >
                      {isSaving ? "A guardar..." : "Guardar"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </TabBody>
        </Tab>
      </Tabs>
    </div>
  );
}
